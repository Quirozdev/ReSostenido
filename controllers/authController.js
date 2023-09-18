const querystring = require('node:querystring');
const { validationResult } = require('express-validator');

const {
  registerUserWithVerificationToken,
  verifyAccount,
  loginUser,
} = require('../services/userService');
const {
  createVerificationTokenForUser,
} = require('../services/verificationTokenService');
const emailService = require('../services/emailService');
const mapErrorValidationResultToObject = require('../utils/validationErrorsMapper');

function registerGet(req, res) {
  res.render('register.html');
}

async function registerPost(req, res, next) {
  const result = validationResult(req);

  const usuario = {
    email: req.body.email,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    numero_telefono: req.body.numero_telefono,
    contrasenia: req.body.contrasenia,
    confirmar_contrasenia: req.body.confirmar_contrasenia,
  };

  if (!result.isEmpty()) {
    const errores = mapErrorValidationResultToObject(result);

    return res.render('register.html', {
      errores: errores,
      datos_ingresados: usuario,
    });
  }

  try {
    const token = await registerUserWithVerificationToken(usuario);

    // Railway provee la variable de entorno RAILWAY_PUBLIC_DOMAIN en teoria
    // https://docs.railway.app/develop/variables
    const hostname = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.HOST_NAME;

    await emailService.sendEmail(
      usuario.email,
      `Confirma tu cuenta ${usuario.nombre} ${usuario.apellidos}`,
      `<a href=${hostname}/verify/${token}>Confirmar cuenta</a>`
    );

    // para que a la ruta de login le llegue este query param indicandole que proviene de un registro exitoso
    const query = querystring.stringify({
      successfulRegister: true,
    });

    res.redirect('/login?' + query);
  } catch (err) {
    return res.render('register.html', {
      errores: {
        general: 'Algo salió mal :(, vuelve a intentarlo más tarde',
      },
      datos_ingresados: usuario,
    });
  }
}

async function verifyAccountGet(req, res, next) {
  const { token } = req.params;
  const { err, msg } = await verifyAccount(token);

  res.render('verify-account.html', {
    error: err,
    mensaje: msg,
  });
}

function resendVerificationTokenGet(req, res) {
  res.render('resend-verification-token.html');
}

async function resendVerificationTokenPost(req, res) {
  const result = validationResult(req);
  const { email } = req.body;

  if (!result.isEmpty()) {
    const errores = mapErrorValidationResultToObject(result);

    return res.status(400).json({
      error: 'Error de validación',
      mensaje: errores.email,
    });
  }

  const { error, mensaje, status, usuario, token } =
    await createVerificationTokenForUser(email);

  const hostname = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.HOST_NAME;

  await emailService.sendEmail(
    email,
    `Reenvío de token - Confirma tu cuenta ${usuario.nombre} ${usuario.apellidos}`,
    `<a href=${hostname}/verify/${token}>Confirmar cuenta</a>`
  );

  res.status(status).json({ error, mensaje });
}

function loginGet(req, res) {
  // esta variable solo va a tener un valor de true cuando el registro haya sido exitoso
  // y haya redirrecionado al login
  const { successfulRegister } = req.query;
  res.render('login.html', { registroExitoso: successfulRegister });
}

async function loginPost(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errores = mapErrorValidationResultToObject(result);

    return res.render('login.html', {
      errores: errores,
      datos_ingresados: {
        email: req.body.email,
        contrasenia: req.body.contrasenia,
      },
    });
  }

  const { error, usuario } = await loginUser(
    req.body.email,
    req.body.contrasenia
  );

  if (error) {
    return res.render('login.html', {
      errores: error,
      datos_ingresados: {
        email: req.body.email,
        contrasenia: req.body.contrasenia,
      },
    });
  }

  // si se encontro al usuario, la contrasenia es correcta y esta verificado,
  // se crea la sesion automaticamente en la bd, haciendole
  // un cambio a req.session y guardando datos del usuario en la
  // sesion que podrian usarse en los templates

  req.session.usuario = {
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    es_admin: usuario.es_admin,
  };

  res.redirect('/');
}

function logOut(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/login');
  });
}

function forgotPasswordGet(req, res) {
  res.render('forgot-password.html');
}

function forgotPasswordPost(req, res) {}

function changePasswordGet(req, res) {
  res.render('change-password.html');
}

function changePasswordPost(req, res) {}

module.exports = {
  registerGet,
  registerPost,
  verifyAccountGet,
  resendVerificationTokenGet,
  resendVerificationTokenPost,
  loginGet,
  loginPost,
  logOut,
  forgotPasswordGet,
  forgotPasswordPost,
  changePasswordGet,
  changePasswordPost,
};
