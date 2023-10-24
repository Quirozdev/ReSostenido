const db = require('../db/db');

async function hacerSolicitudDePregunta(pregunta, id_usuario_pregunta){
    const [result, campos] = await db.execute(
        'INSERT INTO preguntas (pregunta, estado, id_usuario_pregunta) VALUES (?, ?, ?)',
        [pregunta, "pendiente", id_usuario_pregunta]
      );
    return result;
}

async function contestarPregunta(id_pregunta, respuesta, id_usuario_respuesta){
    const [result, campos] = await db.execute(
        'UPDATE preguntas SET respuesta = ?, estado = "respondida", id_usuario_respuesta = ? WHERE id = ?',
        [respuesta, id_usuario_respuesta, id_pregunta]
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

module.exports = {
    hacerSolicitudDePregunta,
    contestarPregunta,
    rechazarPregunta,
    eliminarPregunta
}