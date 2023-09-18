const { body } = require('express-validator');

const db = require('../../db/db');

function createEmailChain() {
  return body('email', 'Correo inválido')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El correo no puede estar vacío')
    .isEmail()
    .withMessage('El correo no tiene el formato correcto')
    .isLength({ max: 255 })
    .withMessage('El correo debe tener 255 caracteres o menos');
}

function createPasswordChain() {
  return body('contrasenia', 'Contraseña inválida')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 8, max: 60 })
    .withMessage('La contraseña debe tener entre 8 y 60 caracteres');
}

const validateRegistration = [
  createEmailChain().custom(async (email) => {
    const [usuarios, campos] = await db.execute(
      'SELECT `email` FROM `usuarios` WHERE `email` = ?',
      [email]
    );

    const usuario = usuarios[0];
    if (usuario) {
      throw new Error('Ese correo ya ha sido registrado por otro usuario');
    }
  }),
  body('nombre', 'Nombre inválido')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 55 })
    .withMessage('El nombre debe tener 55 caracteres o menos'),
  body('apellidos', 'Apellidos inválidos')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Los apellidos no pueden estar vacíos')
    .isLength({ max: 110 })
    .withMessage('Los apellidos deben tener 110 caracteres o menos'),
  body('numero_telefono', 'Número de teléfono inválido')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El número de teléfono no puede estar vacío')
    .isLength({ max: 15 })
    .withMessage('El número de teléfono debe tener 15 caracteres o menos')
    .isMobilePhone('es-MX')
    .withMessage(
      'El número de teléfono debe ser mexicano, con su formato correspondiente'
    ),
  createPasswordChain(),
  body('confirmar_contrasenia')
    .trim()
    .custom((contraseniaConfirmada, { req }) => {
      return contraseniaConfirmada === req.body.contrasenia;
    })
    .withMessage('Las contraseñas no coinciden'),
];

const validateLogin = [createEmailChain(), createPasswordChain()];

module.exports = { validateRegistration, validateLogin };
