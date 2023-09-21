const { body } = require('express-validator');

const db = require('../../db/db');

function addServiceValidation() {
  return [
    body('grupo', 'Grupo inválido')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El grupo no puede estar vacío')
      .isLength({ max: 55 })
      .withMessage('El grupo debe tener 55 caracteres o menos'),
    body('nombre_instrumento', 'Nombre inválido')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío')
      .isLength({ max: 55 })
      .withMessage('El nombre debe tener 55 caracteres o menos'),
    body('precio', 'Precio inválido')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El precio no puede estar vacío')
      .isLength({ max: 55 })
      .withMessage('El precio debe tener 55 caracteres o menos'),
    body('descripcion', 'Descripción inválida')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('La descripción no puede estar vacía')
      .isLength({ max: 255 })
      .withMessage('La descripción debe tener 255 caracteres o menos'),
    body('url_imagen', 'Imagen inválida')
      .notEmpty()
      .withMessage('La imagen no puede estar vacía'),
  ];
}

module.exports = { addServiceValidation };
