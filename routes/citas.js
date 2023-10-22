const express = require('express');
const router = express.Router();

const citasController = require('../controllers/citasController');

router.get('/agendar-cita', (req, res) => {
  res.render('agendar-cita.html');
});

router.post(
  '/checar-disponibilidad-fecha',
  citasController.checarDisponibilidadParaNuevaCita
);

router.post('/agendar-cita', citasController.crearOrdenPago);

router.get('/procesar-pago', citasController.procesarPago);

router.get('/cancelar-pago', citasController.cancelarPago);

module.exports = router;
