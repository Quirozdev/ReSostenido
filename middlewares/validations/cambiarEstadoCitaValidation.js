const { body } = require('express-validator');

const validateEstadoCita = [
  body('nuevo_estado_cita', 'Id de estado de cita invalido')
    .isNumeric()
    .withMessage(
      'La id del estado de cita debe ser numerica y no puede estar vacia'
    )
    .isIn([1, 2, 3]) // los 3 estados exceptuando al estado de cancelacion
    .withMessage(
      'La id del estado de cita solo puede tomar valores entre 1 y 3'
    ),
];

module.exports = { validateEstadoCita };
