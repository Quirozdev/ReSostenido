const { body } = require('express-validator');

const db = require('../../db/db');

const validateTokenEmail = [
  body('email', 'Correo inválido')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El correo no puede estar vacío')
    .isEmail()
    .withMessage('El correo no tiene el formato correcto')
    .isLength({ max: 255 })
    .withMessage('El correo debe tener 255 caracteres o menos')
    .custom(async (email) => {
      const [usuarios, campos] = await db.execute(
        'SELECT `email`, `verificado` FROM `usuarios` WHERE `email` = ?',
        [email]
      );

      const usuario = usuarios[0];
      if (!usuario) {
        throw new Error('No hay ningún usuario registrado con ese correo');
      }

      if (usuario.verificado) {
        throw new Error('Ese usuario ya se encuentra verificado');
      }
    }),
];

module.exports = { validateTokenEmail };
