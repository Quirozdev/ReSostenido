const db = require('../db/db');


async function obtenerGananciasTotales() {
  const [result, campos] = await db.execute(
      "SELECT fecha, costo_total FROM citas WHERE pagada = 1"
  );
  return result;
}

module.exports = {
  obtenerGananciasTotales,
};