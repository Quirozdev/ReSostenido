const { validationResult } = require('express-validator');

const db = require('../db/db');
const {
  registerUserWithVerificationToken,
  verifyAccount,
} = require('../services/userService');
const {
  createVerificationTokenForUser,
} = require('../services/verificationTokenService');
const emailService = require('../services/emailService');
const { compare } = require('../services/encryptionService');
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

    res.status(201).send('Usuario creado exitosamente');
  } catch (err) {
    next(err);
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
  res.render('login.html');
}

async function loginPost(req, res) {
  const { email, contrasenia } = req.body;
  const [usuarios, campos] = await db.execute(
    'SELECT `nombre`, `apellidos`, `es_admin`, `contrasenia` FROM `usuarios` WHERE `email` = ?',
    [email]
  );
  const usuario = usuarios[0];

  // no hay un usuario con ese email
  if (!usuario) {
    return res.send('El email o contraseña son incorrectos');
  }

  const esContraseniaCorrecta = await compare(contrasenia, usuario.contrasenia);

  if (!esContraseniaCorrecta) {
    return res.send('El email o contraseña son incorrectos');
  }

  // si se encontro al usuario y la contrasenia es correcta,
  // se crea la sesion automaticamente en la bd, haciendole
  // un cambio a req.session y guardando datos del usuario en la
  // sesion que podrian usarse en los templates

  req.session.usuario = {
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    es_admin: usuario.es_admin,
  };
  res.send('Login exitoso');
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
  forgotPasswordGet,
  forgotPasswordPost,
  changePasswordGet,
  changePasswordPost,
};
