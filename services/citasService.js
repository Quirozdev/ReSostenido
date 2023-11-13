const CustomError = require('../errors/CustomError');

const moment = require('moment');

const ESTADOS_CITA = {
  PROXIMA: 1,
  EN_PROGRESO: 2,
  TERMINADA: 3,
  CANCELADA: 4,
};

class CitasService {
  constructor(database, paypalInstance, emailService) {
    this.database = database;
    this.paypalInstance = paypalInstance;
    this.emailService = emailService;
  }

  async validarExistenciaYAutoridadCita(idCita, idUsuario, esAdmin = false) {
    const [citas, campos] = await this.database.execute(
      'SELECT id_usuario FROM citas WHERE citas.id = ?',
      [idCita]
    );

    const cita = citas[0];

    if (!cita) {
      return {
        status: 404,
        error: 'Cita no encontrada',
      };
    }

    if (!esAdmin && cita.id_usuario !== idUsuario) {
      return {
        status: 403,
        error:
          'No tienes permisos para acceder o modificar las citas de otros usuarios',
      };
    }

    return { status: 200, error: null };
  }

  async getCitaPagadaDetailsById(id) {
    const [citas, campos] = await this.database.execute(
      'SELECT citas.id AS id_cita, citas.fecha, hora, citas.descripcion AS nota_cliente, incluye_cuerdas, costo_total, id_usuario, servicios.nombre_instrumento, servicios.grupo, servicios.descripcion AS descripcion_servicio, servicios.url_imagen, estados_citas.id AS id_estado, estados_citas.estado, pagos_anticipos.total AS anticipo_total FROM citas INNER JOIN pagos_anticipos ON citas.id_pago_anticipo = pagos_anticipos.id INNER JOIN servicios ON citas.id_servicio = servicios.id INNER JOIN estados_citas ON citas.id_estado = estados_citas.id WHERE citas.id = ? AND citas.anticipo_pagado = true',
      [id]
    );

    return citas[0];
  }

  async getCitaNoPagadaAndCorrespondingServiceById(id) {
    const [citas, campos] = await this.database.execute(
      'SELECT citas.id, citas.costo_total, citas.incluye_cuerdas, citas.fecha, citas.hora, servicios.descripcion AS descripcion_servicio, servicios.nombre_instrumento, servicios.precio_anticipo_cita, servicios.precio_cuerdas FROM citas INNER JOIN servicios ON citas.id_servicio = servicios.id AND servicios.activo = true WHERE citas.id = ? AND citas.anticipo_pagado = false',
      [id]
    );

    return citas[0];
  }

  async getCitasFilteredByState(id_usuario = null) {
    let citas;

    const resultado = await this.database.execute('CALL obtenerCitas(?)', [
      id_usuario,
    ]);

    citas = resultado[0][0];

    const citasPendientes = [];
    const citasTerminadas = [];

    for (let i = 0; i < citas.length; i++) {
      const cita = citas[i];
      cita.fecha = moment(cita.fecha).format('DD-MM-YYYY');
      cita.hora = moment(cita.hora, 'h:mm').format('LT');
      if (
        cita.id_estado === ESTADOS_CITA.TERMINADA ||
        cita.id_estado === ESTADOS_CITA.CANCELADA
      ) {
        citasTerminadas.push(cita);
      } else {
        citasPendientes.push(cita);
      }
    }

    return [citasPendientes, citasTerminadas];
  }

  async verificarDisponibilidadCita(fecha, hora, fechaYHoraActual = null) {
    try {
      const result = await this.database.execute(
        'SELECT validar_disponibilidad_fecha_cita(?, ?, ?)',
        [fecha, hora, fechaYHoraActual]
      );
      const { disponibilidad, mensaje } = Object.values(result[0][0])[0];
      console.log('disponibilidad', disponibilidad);
      console.log('mensaje', mensaje);
      return { disponibilidad, mensaje };
    } catch (err) {
      console.error(err);
    }
  }

  async crearCitaNoPagada({
    fecha,
    hora,
    descripcion,
    incluye_cuerdas,
    costo_total,
    id_servicio,
    id_usuario,
  }) {
    const [resultadoInsert] = await this.database.execute(
      'INSERT INTO citas (fecha, hora, descripcion, incluye_cuerdas, costo_total, id_estado, id_servicio, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        fecha,
        hora,
        descripcion,
        incluye_cuerdas,
        costo_total,
        ESTADOS_CITA.PROXIMA,
        id_servicio,
        id_usuario,
      ]
    );
    const idCita = resultadoInsert.insertId;

    return idCita;
  }

  async pagarAnticipoCita(idCita, idOrden, totalAnticipo) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      const [resultadoInsert] = await connection.execute(
        'INSERT INTO pagos_anticipos (id_orden, total, fecha) VALUES (?, ?, CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "-07:00"))',
        [idOrden, totalAnticipo]
      );

      const idPagoAnticipo = resultadoInsert.insertId;

      await connection.execute(
        'UPDATE citas SET id_pago_anticipo = ? WHERE id = ?',
        [idPagoAnticipo, idCita]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new Error(error);
    }
  }

  async cambiarEstadoCita(idCita, nuevoEstadoId) {
    const connection = await this.database.getConnection();

    try {
      await connection.beginTransaction();

      const [citas, campos] = await connection.execute(
        'SELECT id, id_estado, id_usuario, fecha, hora FROM citas WHERE id = ?',
        [idCita]
      );

      const cita = citas[0];

      if (cita.id_estado === ESTADOS_CITA.TERMINADA) {
        throw new CustomError(
          'No es posible cambiar el estado de una cita ya terminada',
          400
        );
      }

      if (cita.id_estado === ESTADOS_CITA.CANCELADA) {
        throw new CustomError(
          'No es posible cambiar el estado de una cita cancelada',
          400
        );
      }

      if (cita.id_estado === nuevoEstadoId) {
        throw new CustomError('La cita ya se encuentra en ese estado', 400);
      }

      await connection.execute('UPDATE citas SET id_estado = ? WHERE id = ?', [
        nuevoEstadoId,
        idCita,
      ]);

      // mandar correo en caso de que se haya cambiado al estado de terminada
      if (nuevoEstadoId === ESTADOS_CITA.TERMINADA) {
        const [usuarios, campos] = await connection.execute(
          'SELECT email FROM usuarios WHERE id = ?',
          [cita.id_usuario]
        );

        const usuario = usuarios[0];

        await this.emailService.sendEmail(
          usuario.email,
          `Cancelaste tu cita con id: ${cita.id}`,
          `<p>Tu cita con fecha: ${moment(cita.fecha).format(
            'DD-MM-YYYY'
          )} y hora: ${moment(cita.hora, 'h:mm').format(
            'LT'
          )} fue cancelada exitosamente.</p>
          <p>Se te ha devuelto tu dinero.</p>
          `
        );
      }

      await connection.commit();

      return {
        status: 201,
        error: null,
        mensaje: 'Cambio de estado de cita exitoso',
      };
    } catch (error) {
      await connection.rollback();
      return {
        status: error.statusCode || 500,
        error: error.message,
      };
    }
  }

  async cancelarCita(idCita) {
    const connection = await this.database.getConnection();

    try {
      await connection.beginTransaction();

      const [citas, campos] = await connection.execute(
        'SELECT id_estado, id_pago_anticipo FROM citas WHERE id = ?',
        [idCita]
      );

      const cita = citas[0];

      if (cita.id_estado === ESTADOS_CITA.TERMINADA) {
        throw new CustomError(
          'No es posible cancelar una cita ya terminada',
          400
        );
      }

      if (cita.id_estado === ESTADOS_CITA.CANCELADA) {
        throw new CustomError('La cita ya se encuentra cancelada', 400);
      }

      const [pagos_anticipos, camposAnticipos] = await this.database.execute(
        'SELECT id_orden FROM pagos_anticipos WHERE id = ?',
        [cita.id_pago_anticipo]
      );

      const { id_orden } = pagos_anticipos[0];

      await this.database.execute(
        'UPDATE citas SET id_estado = ? WHERE id = ?',
        [ESTADOS_CITA.CANCELADA, idCita]
      );

      const { status, error } = await this.paypalInstance.cancelarPago(
        id_orden
      );

      if (error) {
        throw new CustomError(error, status);
      }

      await connection.commit();

      return {
        status: status,
        error: null,
        mensaje: 'Cita cancelada exitosamente',
      };
    } catch (error) {
      await connection.rollback();
      return {
        status: error.statusCode || 500,
        error: error.message,
      };
    }
  }
}

module.exports = CitasService;
