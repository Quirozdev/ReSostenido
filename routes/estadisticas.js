const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');
const { isAdmin } = require('../middlewares/session');


router.get('/', isAdmin, (req, res) => {
  res.redirect('/estadisticas/ganancias/por_anio');
});

//ganancias totales de todos los años
router.get('/ganancias/por_anio', isAdmin, estadisticasController.getGananciasTotales); 

//ganancias totales mensuales de un año
router.get('/ganancias/por_mes', isAdmin, estadisticasController.redireccionarAAnioValido); 
router.get('/ganancias/por_mes/:anio', isAdmin, estadisticasController.getGananciasTotalesEnAnio); 

//ganancias de servicio especifico anual de todos los años
router.get('/ganancias_de_servicio/por_anio', isAdmin, estadisticasController.redireccionarAServicioExistente);
router.get('/ganancias_de_servicio/por_anio/:id_servicio', isAdmin, estadisticasController.getGananciasTotalesDeServicio);

//ganancias de servicio especifico mensuales de un año
router.get('/ganancias_de_servicio/por_mes', isAdmin, estadisticasController.redireccionarAServicioExistente);
router.get('/ganancias_de_servicio/por_mes/:id_servicio', isAdmin, estadisticasController.redireccionarAAnioDeServicioValido);
router.get('/ganancias_de_servicio/por_mes/:id_servicio/:anio', isAdmin, estadisticasController.getGananciasTotalesDeServicioEnAnio);

//cantidad de servicio especifico por año
router.get('/cantidad_de_servicio/por_anio', isAdmin, estadisticasController.redireccionarAServicioExistente);
router.get('/cantidad_de_servicio/por_anio/:id_servicio', isAdmin, estadisticasController.getCantidadDeServicio);


//cantidad de servicio especifico por meses de un año
router.get('/cantidad_de_servicio/por_mes', isAdmin, estadisticasController.redireccionarAServicioExistente);
router.get('/cantidad_de_servicio/por_mes/:id_servicio', isAdmin, estadisticasController.redireccionarAAnioDeServicioValido);
router.get('/cantidad_de_servicio/por_mes/:id_servicio/:anio', isAdmin, estadisticasController.getCantidadDeServicioEnAnio);




module.exports = router;