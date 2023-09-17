const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const {
  validateRegistration,
  validateLogin,
} = require('../middlewares/validations/userValidation');

router.get('/register', authController.registerGet);

router.post('/register', validateRegistration, authController.registerPost);

router.get('/verify/:token', authController.verifyAccountPost);

router.get('/login', authController.loginGet);

router.post('/login', validateLogin, authController.loginPost);

router.get('/forgot-password', authController.forgotPasswordGet);

router.post('/forgot-password', authController.forgotPasswordPost);

router.get('/change-password', authController.changePasswordGet);

router.post('/change-password', authController.changePasswordPost);

module.exports = router;
