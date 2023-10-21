class CitasService {
  constructor(database) {
    this.database = database;
  }

  async verificarDisponibilidadCita(fecha, hora, fechaYHoraActual = null) {
    try {
      const result = await this.database.execute(
        'SELECT validar_disponibilidad_fecha_cita(?, ?, ?)',
        [fecha, hora, fechaYHoraActual]
      );
      const { disponibilidad, mensaje } = Object.values(result[0][0])[0];
      return { disponibilidad, mensaje };
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = CitasService;
