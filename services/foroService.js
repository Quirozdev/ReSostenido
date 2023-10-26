const db = require('../db/db');

async function hacerSolicitudDePregunta(pregunta, id_usuario_pregunta){
    const [result, campos] = await db.execute(
        'INSERT INTO preguntas (pregunta, estado, id_usuario_pregunta) VALUES (?, ?, ?)',
        [pregunta, "pendiente", id_usuario_pregunta]
      );
    return result;
}

async function contestarPregunta(id_pregunta, respuesta, id_usuario_respuesta){
  

// Define la zona horaria de Hermosillo


    const [result, campos] = await db.execute(
        'UPDATE preguntas SET respuesta = ?, estado = "respondida", id_usuario_respuesta = ?, fecha_respuesta = CURRENT_TIMESTAMP WHERE id = ?',
        [respuesta, id_usuario_respuesta,  id_pregunta]
      );
    return result;
}

async function rechazarPregunta(id_pregunta){
    const [result, campos] = await db.execute(
        'DELETE FROM preguntas WHERE id = ?',
        [id_pregunta]
      );
    return result;
}

async function eliminarPregunta(id_pregunta){
    const [result, campos] = await db.execute(
        'DELETE FROM preguntas WHERE id = ?',
        [id_pregunta]
      );
    return result;
}

async function obtenerPreguntasPublicadas() {
  const [result, campos] = await db.execute(
      "SELECT  A.id AS id, A.pregunta AS pregunta, A.respuesta AS respuesta, A.fecha_pregunta AS fecha_pregunta, A.fecha_respuesta AS fecha_respuesta, B.nombre AS nombre, B.apellidos AS apellidos FROM preguntas A, usuarios B WHERE A.id_usuario_pregunta = B.id  AND A.estado = 'respondida'  ORDER BY fecha_pregunta, fecha_respuesta DESC;"
  );

  // Formatear la fecha en cada resultado del conjunto de resultados
  const formattedResult = result.map(row => {
      const fechaPregunta = new Date(row.fecha_pregunta);
      const fechaRespuesta = new Date(row.fecha_respuesta);
      const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
      };
      const formattedFechaPregunta = fechaPregunta.toLocaleString('es-ES', options);
      const formattedFechaRespuesta = fechaRespuesta.toLocaleString('es-ES', options);
      return {
          id: row.id,
          pregunta: row.pregunta,
          respuesta: row.respuesta,
          fecha_pregunta: formattedFechaPregunta,
          fecha_respuesta: formattedFechaRespuesta,
          nombre: row.nombre,
          apellidos: row.apellidos,
      };
  });

  console.log(formattedResult);
  console.log(campos);
  return formattedResult;
}


module.exports = {
    hacerSolicitudDePregunta,
    contestarPregunta,
    rechazarPregunta,
    eliminarPregunta,
    obtenerPreguntasPublicadas
}