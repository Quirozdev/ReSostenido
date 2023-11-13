async function crearEstadosCita(db) {
  Promise.all([
    db
      .getConnection()
      .execute("INSERT INTO estados_citas (id, estado) VALUES (1, 'Proxima')"),
    db
      .getConnection()
      .execute(
        "INSERT INTO estados_citas (id, estado) VALUES (2, 'En progreso')"
      ),
    db
      .getConnection()
      .execute(
        "INSERT INTO estados_citas (id, estado) VALUES (3, 'Terminada')"
      ),
    db
      .getConnection()
      .execute(
        "INSERT INTO estados_citas (id, estado) VALUES (4, 'Cancelada')"
      ),
  ]);
}

async function crearCita(db, cita) {
  const [resultadoInsert] = await db
    .getConnection()
    .execute(
      'INSERT INTO pagos_anticipos (id_orden, total, fecha) VALUES (?, ?, CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "-07:00"))',
      ['asdfqwefe', 128.34]
    );

  const idPagoAnticipo = resultadoInsert.insertId;

  await db
    .getConnection()
    .execute(
      `INSERT INTO citas (fecha, hora, descripcion, incluye_cuerdas, costo_total, id_pago_anticipo, id_estado, id_servicio, id_usuario) VALUES (?, ?, 'test', false, 125.00, ?, ${
        cita.cancelada ? 4 : 1
      }, ?, ?)`,
      [cita.fecha, cita.hora, idPagoAnticipo, cita.servicioId, cita.usuarioId]
    );
}

module.exports = {
  crearEstadosCita,
  crearCita,
};
