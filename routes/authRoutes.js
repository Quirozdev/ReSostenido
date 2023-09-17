const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const {
  validateRegistration,
  validateLogin,
} = require('../middlewares/validations/userValidation');

router.get('/register', authController.registerGet);

router.post('/register', validateRegistration, authController.registerPost);

router.get('/verify/:token', authController.verifyAccountGet);

router.get('/login', authController.loginGet);

router.post('/login', validateLogin, authController.loginPost);

module.exports = router;
