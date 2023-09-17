const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

const {
  validateRegistration,
  validateLogin,
} = require('../middlewares/validations/userValidation');

const {
  validateTokenEmail,
} = require('../middlewares/validations/tokenEmailValidations');

router.get('/register', authController.registerGet);

router.post('/register', validateRegistration, authController.registerPost);

router.get('/verify/:token', authController.verifyAccountGet);

router.get(
  '/resend-verification-token',
  authController.resendVerificationTokenGet
);

router.post(
  '/resend-verification-token',
  validateTokenEmail,
  authController.resendVerificationTokenPost
);

router.get('/login', authController.loginGet);

router.post('/login', validateLogin, authController.loginPost);

router.get('/forgot-password', authController.forgotPasswordGet);

router.post('/forgot-password', authController.forgotPasswordPost);

router.get('/change-password', authController.changePasswordGet);

router.post('/change-password', authController.changePasswordPost);

module.exports = router;
