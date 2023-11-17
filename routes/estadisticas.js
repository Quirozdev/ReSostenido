const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');
const { isAdmin } = require('../middlewares/session');


router.get('/estadisticas', isAdmin, (req, res) => {
  res.redirect('/estadisticas/ganancias_totales');
});

router.get('/estadisticas/ganancias_totales', isAdmin, estadisticasController.getGananciasTotales); 

module.exports = router;