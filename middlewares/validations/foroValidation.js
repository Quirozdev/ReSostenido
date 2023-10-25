const { body } = require('express-validator');

function solicitudPreguntaValidation() {
  return [
    body('pregunta', 'Pregunta inválida')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('La pregunta no puede estar vacía')
      ,
  ];
}

function respuestaPreguntaValidation() {
  return [
    body('respuesta', 'Respuesta inválida')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('La respuesta no puede estar vacía'),
      body('id_pregunta', 'Id pregunta inválido')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El id de la pregunta no puede estar vacío, porfavor recargue la página')
  ];
}

function rechazarPreguntaValidation(){
    return [
        body('id_pregunta', 'Id pregunta inválido')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('El id de la pregunta no puede estar vacío, porfavor recargue la página')
    ];
}


function eliminarPreguntaValidation(){
    return [
        body('id_pregunta', 'Id pregunta inválido')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('El id de la pregunta no puede estar vacío, porfavor recargue la página')
    ];

}


module.exports = {
  solicitudPreguntaValidation,
    respuestaPreguntaValidation,
    rechazarPreguntaValidation,
    eliminarPreguntaValidation
}