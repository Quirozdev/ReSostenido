const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const serrvicesValidation = require('../middlewares/validations/serviceValidation');
const { isAdmin } = require('../middlewares/session');



router.get(
  '/administrar_servicios', 
  isAdmin,
  servicesController.administrarServiciosGet
);

const addServiceMiddleware = [servicesController.imageUpload.single('url_imagen')].concat(serrvicesValidation.addServiceValidation().concat(isAdmin));
router.post(
  '/agregar_servicio', 
  addServiceMiddleware,
  servicesController.agregarServicioPost
);

router.post(
  '/deshabilitar_servicio', 
  isAdmin ,
  servicesController.deshabilitarServicioPost
);

router.post(
  '/habilitar_servicio', 
  isAdmin, 
  servicesController.habilitarServicioPost
);

const updateServiceMiddleware = [servicesController.imageUpload.single('url_imagen')].concat(serrvicesValidation.updateServiceValidation().concat(isAdmin));
router.post(
  '/editar_servicio',
  updateServiceMiddleware,
  servicesController.editarServicioPost
);


router.get('/servicios',servicesController.serviciosGet);

module.exports = router;
