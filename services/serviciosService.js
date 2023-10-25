const db = require('../db/db');

async function getActiveServiceById(id) {
  const [servicios, campos] = await db.execute(
    'SELECT * FROM servicios WHERE id = ? AND activo = 1',
    [id]
  );

  const servicio = servicios[0];
  return servicio;
}

module.exports = {
  getActiveServiceById,
};
