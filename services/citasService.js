const moment = require('moment');

const ESTADOS_CITA = {
  PROXIMA: 1,
  EN_PROGRESO: 2,
  TERMINADA: 3,
  CANCELADA: 4,
};

class CitasService {
  constructor(database) {
    this.database = database;
  }

  async getCitaPagadaDetailsById(id) {
    const [citas, campos] = await this.database.execute(
      'SELECT citas.fecha, hora, citas.descripcion AS nota_cliente, incluye_cuerdas, costo_total, id_usuario, servicios.nombre_instrumento, servicios.grupo, servicios.descripcion AS descripcion_servicio, servicios.url_imagen, estados_citas.id AS id_estado, estados_citas.estado, pagos_anticipos.total AS anticipo_total FROM citas INNER JOIN pagos_anticipos ON citas.id_pago_anticipo = pagos_anticipos.id INNER JOIN servicios ON citas.id_servicio = servicios.id INNER JOIN estados_citas ON citas.id_estado = estados_citas.id WHERE citas.id = ? AND citas.anticipo_pagado = true',
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
      if (cita.estado === 'Terminada') {
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
}

module.exports = CitasService;
