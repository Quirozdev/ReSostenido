const express = require('express');
const router = express.Router();

const citasController = require('../controllers/citasController');

router.get('/agendar-cita/:idServicio', citasController.agendarCitaGet);

router.post(
  '/checar-disponibilidad-fecha',
  citasController.checarDisponibilidadParaNuevaCita
);

router.post('/agendar-cita', citasController.crearOrdenPago);

router.get('/procesar-pago', citasController.procesarPago);

router.get('/cancelar-pago', citasController.cancelarPago);

module.exports = router;
