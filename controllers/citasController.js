const db = require('../db/db');
const CitasService = require('../services/citasService');

async function checarDisponibilidadParaNuevaCita(req, res, next) {
  const { fecha, hora } = req.body;
  try {
    const { disponibilidad, mensaje } = await new CitasService(
      db
    ).verificarDisponibilidadCita(fecha, hora);
    res.json({ disponibilidad, mensaje });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checarDisponibilidadParaNuevaCita,
};
