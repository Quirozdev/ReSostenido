const { body } = require('express-validator');

const validateEditarCitaData = [
  body('nuevo_estado_cita', 'Id de estado de cita invalido')
    .optional({
      values: 'falsy',
    })
    .isNumeric()
    .withMessage(
      'La id del estado de cita debe ser numerica y no puede estar vacia'
    )
    .isIn([1, 2, 3]) // los 3 estados exceptuando al estado de cancelacion
    .withMessage(
      'La id del estado de cita solo puede tomar valores entre 1 y 3'
    ),
  body('notas_admin', 'Notas para el cliente invalidas')
    .optional({
      values: 'falsy',
    })
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage(
      'Las notas para el cliente deben tener 255 caracteres o menos'
    ),
  body('marca', 'Marca del instrumento invalida')
    .optional({
      values: 'falsy',
    })
    .trim()
    .escape()
    .isLength({ max: 110 })
    .withMessage(
      'La marca para el instrumento debe tener 110 caracteres o menos'
    ),
  body('modelo', 'Modelo del instrumento invalido')
    .optional({
      values: 'falsy',
    })
    .trim()
    .escape()
    .isLength({ max: 110 })
    .withMessage(
      'El modelo para el instrumento debe tener 110 caracteres o menos'
    ),
  body('numero_serie', 'Numero de serie invalido')
    .optional({
      values: 'falsy',
    })
    .trim()
    .escape()
    .isLength({ max: 110 })
    .withMessage(
      'El numero de serie para el instrumento debe tener 110 caracteres o menos'
    ),
];

module.exports = { validateEditarCitaData };
