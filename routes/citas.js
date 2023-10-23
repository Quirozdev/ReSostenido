const express = require('express');
const router = express.Router();

const citasController = require('../controllers/citasController');
const { isAuth } = require('../middlewares/session');
const {
  validateAgendarCita,
} = require('../middlewares/validations/agendarCitaValidation');

router.get('/agendar-cita/estado-pago', isAuth, citasController.procesarPago);

router.get(
  '/agendar-cita/:id_servicio',
  isAuth,
  citasController.agendarCitaGet
);

router.post(
  '/checar-disponibilidad-fecha',
  isAuth,
  citasController.checarDisponibilidadParaNuevaCita
);

router.post(
  '/agendar-cita',
  isAuth,
  validateAgendarCita,
  citasController.crearOrdenPago
);

module.exports = router;
