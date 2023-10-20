require('dotenv').config();
const db = require('../db/db');

async function testCitaValidacion() {
  try {
    const result = await db.query(
      "SELECT validar_disponibilidad_fecha_cita('2023-10-20', '17:54')"
    );
    console.log(Object.values(result[0][0])[0]);
  } catch (err) {
    console.error(err);
  } finally {
    (await db.getConnection()).destroy();
  }
}

testCitaValidacion();
