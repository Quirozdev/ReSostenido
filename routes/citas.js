const express = require('express');
const router = express.Router();

const citasController = require('../controllers/citasController');
const { isAuth } = require('../middlewares/session');
const {
  validateAgendarCita,
} = require('../middlewares/validations/agendarCitaValidation');
const {
  validateEditarCitaData,
} = require('../middlewares/validations/editarCitaValidation');

// historial de todas las citas
router.get('/', isAuth, citasController.citasGet);

router.get('/:id_cita', isAuth, citasController.getDetallesCita);

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

router.patch('/:id_cita/cancelar', isAuth, citasController.cancelarCita);

router.put(
  '/:id_cita',
  isAuth,
  validateEditarCitaData,
  citasController.editarDetallesCita
);

module.exports = router;
