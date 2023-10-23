const express = require('express');
const router = express.Router();

const citasController = require('../controllers/citasController');
const { isAuth } = require('../middlewares/session');
const {
  validateAgendarCita,
} = require('../middlewares/validations/agendarCitaValidation');

// historial de todas las citas
router.get('/', isAuth, citasController.citasGet);

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

// cita en especifico - falta implementar
// router.get('/:id', isAuth, citasController.citasGet);

module.exports = router;
