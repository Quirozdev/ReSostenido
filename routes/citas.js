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

module.exports = router;
