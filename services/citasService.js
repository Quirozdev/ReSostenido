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

  async getCitaPagadaDetailsById(id, esAdmin = false) {
    const resultado = await this.database.execute(
      'CALL obtenerDetallesCita(?)',
      [id]
    );

    const [detallesInstrumentos, ,] = await this.database.execute(
      'SELECT marca, modelo, numero_serie FROM detalles_instrumento_cita WHERE id_cita = ?',
      [id]
    );

    const detallesCitas = resultado[0][0];

    const detallesCita = detallesCitas[0];

    let detallesInstrumento = detallesInstrumentos[0];

    // si la cita aun no tiene detalles sobre el instrumento (no se han agregado)
    // se le asigna un objeto vacio
    if (!detallesInstrumento) {
      detallesInstrumento = {
        marca: '',
        modelo: '',
        numero_serie: '',
      };
    }

    detallesCita.fecha = moment(detallesCita.fecha).format('DD-MM-YYYY');
    detallesCita.hora = moment(detallesCita.hora, 'h:mm').format('LT');

    const es_posible_cambiar_estado =
      detallesCita.id_estado !== ESTADOS_CITA.TERMINADA &&
      detallesCita.id_estado !== ESTADOS_CITA.CANCELADA;

    // si es admin, siempre es cancelable, excepto si ya esta cancelada o terminada
    const es_cancelable = Boolean(
      (esAdmin || detallesCita.esta_dentro_del_plazo_cancelable) &&
        es_posible_cambiar_estado
    );

    return {
      informacion_cita: {
        id_cita: detallesCita.id_cita,
        fecha: detallesCita.fecha,
        hora: detallesCita.hora,
        id_estado: detallesCita.id_estado,
        estado: detallesCita.estado,
        nota_cliente: detallesCita.nota_cliente,
        notas_admin: detallesCita.notas_admin,
        incluye_cuerdas: detallesCita.incluye_cuerdas,
        anticipo_total: detallesCita.anticipo_total,
        costo_total: detallesCita.costo_total,
        nombre_instrumento: detallesCita.nombre_instrumento,
        grupo: detallesCita.grupo,
        descripcion_servicio: detallesCita.descripcion_servicio,
        url_imagen: detallesCita.url_imagen,
      },
      informacion_cliente: {
        id_usuario: detallesCita.id_usuario,
        nombre: detallesCita.nombre,
        apellidos: detallesCita.apellidos,
        email: detallesCita.email,
        numero_telefono: detallesCita.numero_telefono,
      },
      informacion_instrumento: {
        nombre_instrumento: detallesCita.nombre_instrumento,
        marca: detallesInstrumento.marca,
        modelo: detallesInstrumento.modelo,
        numero_serie: detallesInstrumento.numero_serie,
      },
      comportamiento_cita: {
        es_posible_cambiar_estado,
        es_cancelable,
      },
    };
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

  async actualizarDetallesCita(idCita, detallesCita) {
    const connection = await this.database.getConnection();
    try {
      await connection.beginTransaction();

      const [citas, campos] = await connection.execute(
        'SELECT id, id_estado, id_usuario, fecha, hora FROM citas WHERE id = ?',
        [idCita]
      );

      const cita = citas[0];

      if (
        detallesCita.nuevoEstadoCitaId &&
        cita.id_estado === ESTADOS_CITA.TERMINADA
      ) {
        throw new CustomError(
          'No es posible cambiar el estado de una cita ya terminada',
          400
        );
      }

      if (
        detallesCita.nuevoEstadoCitaId &&
        cita.id_estado === ESTADOS_CITA.CANCELADA
      ) {
        throw new CustomError(
          'No es posible cambiar el estado de una cita cancelada',
          400
        );
      }

      // si no se proporciono un nuevo id de estado (por ejemplo cuando el select esta deshabilitado)
      // se le asigna el id de estado actual
      if (
        detallesCita.nuevoEstadoCitaId === '' ||
        !detallesCita.nuevoEstadoCitaId
      ) {
        detallesCita.nuevoEstadoCitaId = cita.id_estado;
      }

      await connection.execute(
        'UPDATE citas SET id_estado = ?, notas_admin = ? WHERE id = ?',
        [detallesCita.nuevoEstadoCitaId, detallesCita.notasAdmin, idCita]
      );

      await connection.execute(
        'CALL agregarOActualizarDetallesInstrumentoCita(?, ?, ?, ?)',
        [
          idCita,
          detallesCita.marca,
          detallesCita.modelo,
          detallesCita.numeroSerie,
        ]
      );

      // mandar correo en caso de que se haya cambiado al estado de terminada

      if (detallesCita.nuevoEstadoCitaId === ESTADOS_CITA.TERMINADA) {
        const [usuarios, campos] = await connection.execute(
          'SELECT email FROM usuarios WHERE id = ?',
          [cita.id_usuario]
        );

        const usuario = usuarios[0];

        await this.emailService.sendEmail(
          usuario.email,
          `Tu cita con id: ${cita.id} fue terminada`,
          `<p>Tu cita con fecha: ${moment(cita.fecha).format(
            'DD-MM-YYYY'
          )} y hora: ${moment(cita.hora, 'h:mm').format(
            'LT'
          )} fue terminada exitosamente.</p>
          <p>Pasa por tu instrumento.</p>
          `
        );
      }

      await connection.commit();

      return {
        status: 201,
        error: null,
        mensaje: 'Detalles de la cita actualizados exitosamente',
      };
    } catch (error) {
      await connection.rollback();
      return {
        status: error.statusCode || 500,
        error: error.message,
      };
    }
  }

  async cancelarCita(idCita, esAdmin = false) {
    const connection = await this.database.getConnection();

    try {
      await connection.beginTransaction();

      const [citas, campos] = await connection.execute(
        'SELECT id, id_estado, id_pago_anticipo, id_usuario, fecha, hora FROM citas WHERE id = ?',
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

      // si no es admin, verificar que la cita se encuentre dentro del plazo cancelable para un usuario
      if (!esAdmin) {
        const [result, ,] = await connection.execute(
          'SELECT validar_plazo_cancelacion(?, ?)',
          [cita.fecha, cita.hora]
        );

        const esta_dentro_del_plazo_cancelable = Object.values(result[0])[0];

        if (!esta_dentro_del_plazo_cancelable) {
          throw new CustomError(
            'No es posible cancelar una cita fuera del plazo cancelable de 24 horas',
            400
          );
        }
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

      const [usuarios, usuarioCampos] = await connection.execute(
        'SELECT email FROM usuarios WHERE id = ?',
        [cita.id_usuario]
      );

      const usuario = usuarios[0];

      await this.emailService.sendEmail(
        usuario.email,
        `Tu cita con id: ${cita.id} fue cancelada.`,
        `<p>Tu cita con fecha: ${moment(cita.fecha).format(
          'DD-MM-YYYY'
        )} y hora: ${moment(cita.hora, 'h:mm').format(
          'LT'
        )} fue cancelada exitosamente.</p>
            <p>Se te ha devuelto tu dinero.</p>
            `
      );

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
