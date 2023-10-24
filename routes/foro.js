const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../middlewares/session');
const { solicitudPreguntaValidation, rechazarPreguntaValidation, respuestaPreguntaValidation, eliminarPreguntaValidation } = require('../middlewares/validations/foroValidation');
const foroController = require('../controllers/foroController');

router.get('/foro',  foroController.foroGet);


const hacerPreguntaMiddleware = solicitudPreguntaValidation().concat(isAuth);
router.post('/hacer_pregunta', hacerPreguntaMiddleware, foroController.hacerPreguntaPost);

router.get('/solicitudes_preguntas', isAdmin, foroController.solicitudesPreguntasGet);

const responderPreguntaMiddleware = respuestaPreguntaValidation().concat(isAdmin);
router.post('/responder_pregunta', responderPreguntaMiddleware, foroController.responderPreguntaPost);

const eliminarPreguntaMiddleware = eliminarPreguntaValidation().concat(isAdmin);
router.post('/eliminar_pregunta', eliminarPreguntaMiddleware, foroController.eliminarPreguntaPost);

const rechazarPreguntaMiddleware = rechazarPreguntaValidation().concat(isAdmin);
router.post('/rechazar_solicitud_pregunta', rechazarPreguntaMiddleware, foroController.rechazarSolicitudPreguntaPost);

module.exports = router;