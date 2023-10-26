const db = require('../db/db');
const mapErrorValidationResultToObject = require('../utils/validationErrorsMapper');
const { validationResult } = require('express-validator');
const { hacerSolicitudDePregunta, contestarPregunta, rechazarPregunta, eliminarPregunta, obtenerPreguntasPublicadas } = require('../services/foroService');
const querystring = require('querystring');

async function foroGet(req, res) {
  const preguntas = await obtenerPreguntasPublicadas();
  
  
  if (req.session && req.session.usuario && req.session.usuario.es_admin){
    return res.render('foro.html', { preguntas: preguntas, es_admin: true, query: req.query });

  }else{
    return res.render('foro.html', { preguntas: preguntas, query: req.query });
  }

}



async function hacerPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = mapErrorValidationResultToObject(result);
      const errores_con_prefijo = {};

      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errores_con_prefijo[`error_${key}`] = errors[key];
        }
      }
      const query_errores = querystring.stringify(errores_con_prefijo);
      return res.redirect('/foro?'+query_errores);
    }

    const pregunta = req.body.pregunta;
    
    hacerSolicitudDePregunta(pregunta, req.session.usuario.id_usuario)
    return res.redirect('/foro?mensaje_confirmacion=La pregunta ha sido enviada y sera respondida en breve')
  }

async function solicitudesPreguntasGet(req, res) {  
    const preguntas = await db.execute('SELECT id, pregunta FROM preguntas WHERE estado = "pendiente" ORDER BY fecha_pregunta DESC');
    console.log(preguntas)
    console.log(preguntas[0]);
    res.render('solicitudes_preguntas.html', { preguntas: preguntas[0], query: req.query });
}

async function responderPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = mapErrorValidationResultToObject(result);
      const errores_con_prefijo = {};

      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errores_con_prefijo[`error_${key}`] = errors[key];
        }
      }
      const query_errores = querystring.stringify(errores_con_prefijo);

      return res.redirect('/solicitudes_preguntas?'+query_errores+'&error_id_pregunta='+req.body.id_pregunta);
    }

    contestarPregunta(req.body.id_pregunta, req.body.respuesta, req.session.usuario.id_usuario)
    return res.redirect('/solicitudes_preguntas?mensaje_confirmacion=La pregunta ha sido respondida y publicada en el foro')
}

async function eliminarPreguntaPost(req, res) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errores = mapErrorValidationResultToObject(result);

      return res.redirect('/foro?mensaje_confirmacion=La pregunta no ha podido ser eliminada');
    }
    eliminarPregunta(req.body.id_pregunta);
    return res.redirect('/foro?mensaje_confirmacion=La pregunta ha sido eliminada');

}

async function rechazarSolicitudPreguntaPost(req, res) {
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
      return res.redirect('/solicitudes_preguntas?error_rechazo=La pregunta no ha podido ser rechazada');
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






