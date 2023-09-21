const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const serrvicesValidation = require('../middlewares/validations/serviceValidation');
const { isAdmin } = require('../middlewares/session');




router.get(
  '/administrar_servicios', isAdmin,
  servicesController.administrarServiciosGet
);
router.post(
  '/agregar_servicio', servicesController.imageUpload.single('url_imagen'),//isAdmin,
  servicesController.agregarServicioPost
);
/*
router.post(
  '/administrar_servicios', //isAdmin,
  servicesController.administrarServiciosPost
);
*/
router.get('/servicios',servicesController.serviciosGet);

module.exports = router;
