const db = require('../db/db');
const mapErrorValidationResultToObject = require('../utils/validationErrorsMapper');
const { validationResult } = require('express-validator');
const { hacerSolicitudDePregunta, contestarPregunta, rechazarPregunta, eliminarPregunta } = require('../services/foroService');

async function foroGet(req, res) {
  const preguntas = await db.execute('SELECT id, pregunta, respuesta FROM preguntas WHERE estado = "respondida" ORDER BY fecha DESC');
  console.log(preguntas)
  console.log(preguntas[0]);
  if (req.session && req.session.usuario && req.session.usuario.es_admin){
    return res.render('foro.html', { preguntas: preguntas[0], es_admin: true, query: req.query });

  }else{
    return res.render('foro.html', { preguntas: preguntas[0], query: req.query });
  }

}



async function hacerPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errores = mapErrorValidationResultToObject(result);
      return res.render('foro.html', {
        errores: errores,
        
      });
    }

    const pregunta = req.body.pregunta;
    
    hacerSolicitudDePregunta(pregunta, req.session.usuario.id_usuario)
    return res.redirect('/foro?mensaje_confirmacion=La pregunta ha sido enviada y sera respondida en breve')
  }

async function solicitudesPreguntasGet(req, res) {  
    const preguntas = await db.execute('SELECT id, pregunta FROM preguntas WHERE estado = "pendiente" ORDER BY fecha DESC');
    console.log(preguntas)
    console.log(preguntas[0]);
    res.render('solicitudes_preguntas.html', { preguntas: preguntas[0], query: req.query });
}

async function responderPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errores = mapErrorValidationResultToObject(result);
      console.log("HORROROSO ERROR QUE NO SE PORQUE FGUNCIONA")
      return res.render('solicitudes_preguntas.html', {
        errores: errores,
        id_pregunta: req.body.id_pregunta,
      });
    }

    contestarPregunta(req.body.id_pregunta, req.body.respuesta, req.session.usuario.id_usuario)
    return res.redirect('/solicitudes_preguntas?mensaje_confirmacion=La pregunta ha sido respondida y publicada en el foro')
}

async function eliminarPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errores = mapErrorValidationResultToObject(result);
      return res.render('solicitudes_preguntas.html', {
        errores: errores,
        });
    }
    eliminarPregunta(req.body.id_pregunta);
    return res.redirect('/foro?mensaje_confirmacion=La pregunta ha sido eliminada');

}

async function rechazarSolicitudPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errores = mapErrorValidationResultToObject(result);
      return res.render('solicitudes_preguntas.html', {
        errores: errores,
      });
    }

    const id_pregunta = req.body.id_pregunta;

    rechazarPregunta(id_pregunta);

    return res.redirect('/solicitudes_preguntas?mensaje_confirmacion=La pregunta ha sido eliminada')
  
  } 

module.exports = {
    foroGet,
    hacerPreguntaPost,
    responderPreguntaPost,
    eliminarPreguntaPost,
    rechazarSolicitudPreguntaPost,
    solicitudesPreguntasGet
}






