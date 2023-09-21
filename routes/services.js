const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const serrvicesValidation = require('../middlewares/validations/serviceValidation');
const { isAdmin } = require('../middlewares/session');

const addServiceMiddleware = [servicesController.imageUpload.single('url_imagen')].concat(serrvicesValidation.addServiceValidation()).concat(servicesController.agregarServicioPost);


router.get(
  '/administrar_servicios', isAdmin,
  servicesController.administrarServiciosGet
);
router.post(
  '/agregar_servicio', addServiceMiddleware,
  servicesController.agregarServicioPost
);

router.get('/servicios',servicesController.serviciosGet);

module.exports = router;
