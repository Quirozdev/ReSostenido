const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { isAdmin } = require('../middlewares/session');

router.get(
  '/administrar_servicios', isAdmin,
  servicesController.administrarServiciosGet
);

router.get('/servicios',servicesController.serviciosGet);

module.exports = router;
