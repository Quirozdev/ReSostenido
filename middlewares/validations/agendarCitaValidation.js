const { body } = require('express-validator');

const validateAgendarCita = [
  body('id_servicio', 'Id de servicio invalida')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La id del servicio no puede estar vacia'),
  body('fecha', 'Fecha invalida')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La fecha no puede estar vacia')
    .isISO8601()
    .withMessage('La fecha debe de tener el formato YYYY-MM-DD'),
  body('hora', 'Hora invalida')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La hora no puede estar vacia')
    .customSanitizer((value) => {
      // para quitar los segundos
      return value.split(':', 2).join(':');
    })
    .isTime({
      hourFormat: 'hour24',
    }),
  body('descripcion', 'Descripción inválida')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('La descripción no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('La descripción debe tener 255 caracteres o menos'),
  body('incluye_cuerdas').customSanitizer((value) => {
    return value === 'true' ? true : false;
  }),
];

module.exports = { validateAgendarCita };
