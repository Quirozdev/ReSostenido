const db = require('../db/db');


async function obtenerGananciasTotales() {
  const [result, campos] = await db.execute(
      "SELECT fecha, costo_total FROM citas WHERE anticipo_pagado = 1"
  );
  return result;
}

async function obtenerGananciasTotalesEnAnio(anio) {
  const [result, campos] = await db.execute(
      "SELECT fecha, costo_total FROM citas WHERE anticipo_pagado = 1 AND YEAR(fecha) = ?",
       [anio]
  );
  return result;
}

async function obtenerUltimoAnioConGanancias() {
  const [result, campos] = await db.execute(
      "SELECT MAX(YEAR(fecha)) as anio FROM citas WHERE anticipo_pagado = 1"
  );
  return result[0].anio;
}

async function obtenerGananciasTotalesEnUltimoAnio(anio){
  
  let ultimoAnio = await obtenerUltimoAnioConGanancias();
  const [result, campos] = await db.execute(
    "SELECT fecha, costo_total FROM citas WHERE anticipo_pagado = 1 AND YEAR(fecha) = ?", [ultimoAnio]
  );
  return [result,ultimoAnio];
}

async function obtenerAniosConGanacias(){
  let [result, campos] = await db.execute(
    "SELECT DISTINCT YEAR(fecha) as anio FROM citas WHERE anticipo_pagado = 1"
  );
  
  return result;
}

async function obtenerGananciasTotalesDeServicio(id_servicio){
  const [result, campos] = await db.execute(
    "SELECT fecha, costo_total FROM citas WHERE anticipo_pagado = 1 AND id_servicio = ?", [id_servicio]
  );
  return result;

}

async function obtenerNombreDeInstrumento(id_servicio){
  const [result, campos] = await db.execute(
    "SELECT nombre_instrumento FROM servicios WHERE id = ?", [id_servicio]
  );
  return result;

}

async function obtenerNombresDeInstrumentos(){
  const [result, campos] = await db.execute(
    "SELECT id, nombre_instrumento FROM servicios"
  );
  return result;
}

async function obtenerIdDeServicioValido(){
  const [result, campos] = await db.execute(
    "SELECT id FROM servicios limit 1"
  );
  return result[0].id;

}

async function obtenerUltimoAnioConGananciasDeServicio(id_servicio){
  const [result, campos] = await db.execute(
    "SELECT MAX(YEAR(fecha)) as anio FROM citas WHERE anticipo_pagado = 1 and id_servicio = ?", [id_servicio]
  );
  if(result.length == 0){
    return null;
  }
  return result[0].anio;
}

async function obtenerGananciasTotalesDeServicioEnAnio(id_servicio, anio){
  const [result, campos] = await db.execute(
    "SELECT fecha, costo_total FROM citas WHERE anticipo_pagado = 1 AND id_servicio = ? AND YEAR(fecha) = ?", [id_servicio, anio]
  );
  return result;
}
async function obtenerAniosConGanaciasDeServicio(id_servicio){
  const [result, campos] = await db.execute(
    "SELECT DISTINCT YEAR(fecha) as anio FROM citas WHERE anticipo_pagado = 1 AND id_servicio = ?", [id_servicio]
  );
  
  return result;
}

async function obtenerCantidadDeServicio(id_servicio){
  const [result, campos] = await db.execute(
    "SELECT YEAR(fecha) as anio, count(id_servicio) as cantidad FROM citas WHERE anticipo_pagado = 1 AND id_servicio = ? GROUP BY anio", [id_servicio]
  );
  return result;

}

async function obtenerCantidadDeServicioEnAnio(id_servicio, anio){
  const [result, campos] = await db.execute(
    "SELECT MONTH(fecha) as mes, count(id_servicio) as cantidad FROM citas WHERE anticipo_pagado = 1 AND id_servicio = ? AND YEAR(fecha) = ? GROUP BY mes", [id_servicio, anio]
  );
  return result;

}


module.exports = {
  obtenerGananciasTotales,
  obtenerGananciasTotalesEnAnio,
  obtenerGananciasTotalesEnUltimoAnio,
  obtenerAniosConGanacias,
  obtenerGananciasTotalesDeServicio,
  obtenerNombresDeInstrumentos,
  obtenerIdDeServicioValido,
  obtenerUltimoAnioConGanancias,
  obtenerNombreDeInstrumento,
  obtenerUltimoAnioConGananciasDeServicio,
  obtenerGananciasTotalesDeServicioEnAnio,
  obtenerAniosConGanaciasDeServicio,
  obtenerCantidadDeServicio,
  obtenerCantidadDeServicioEnAnio
};