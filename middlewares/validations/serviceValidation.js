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
      .withMessage('El nombre debe tener 55 caracteres o menos')
      .custom(async (nombre_instrumento) => {
        const [servicios, campos] = await db.execute('SELECT `nombre_instrumento` FROM `servicios` WHERE `nombre_instrumento` = ?', [nombre_instrumento]);
        const servicio = servicios[0];
        if(servicio){
          throw new Error('Ya existe un servicio con ese nombre');
        }
      })
      ,
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
    body('url_imagen').custom((value, { req }) => {
        if (!req.file) {
          throw new Error('Debe de introducir alguna imagen');
        }
        return true;
      }),];
}

function updateServiceValidation() {
  
  return [
    body('id', 'Id inválido')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('El id no puede estar vacío')
      .isNumeric(),
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
      .withMessage('El nombre debe tener 55 caracteres o menos')
      .custom(async (nombre_instrumento, { req }) => {
        const [servicios, campos] = await db.execute('SELECT `nombre_instrumento`, `id` FROM `servicios` WHERE `nombre_instrumento` = ?', [nombre_instrumento]);
        const servicio = servicios[0];
        const id = req.body.id;
        if(servicio && servicio.id != id ){
          throw new Error('Ya existe un servicio con ese nombre');
        }
      })
      ,
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
      .withMessage('La descripción debe tener 255 caracteres o menos')
     
    
  ];
}

module.exports = { addServiceValidation, 
  updateServiceValidation };
