const { body } = require('express-validator');

const validateAgendarCita = [
  body('idServicio', 'Id de servicio invalida')
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
    .isTime({
      hourFormat: 'hour24',
    }),
  body('motivo', 'Motivo inválido')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('El motivo no puede estar vacío')
    .isLength({ max: 255 })
    .withMessage('El motivo debe tener 255 caracteres o menos'),
];

module.exports = { validateAgendarCita };
