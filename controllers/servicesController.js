const db = require('../db/db');
const path = require('path');
const multer = require('multer');
const mapErrorValidationResultToObject = require('../utils/validationErrorsMapper');
const { validationResult } = require('express-validator');
const querystring = require('querystring');

async function administrarServiciosGet(req, res) {
  const services = await db.execute('SELECT id, grupo, nombre_instrumento, precio, descripcion, url_imagen FROM servicios');
  const groupedServices = services[0].reduce((groups, instrument) => {
    const group = instrument.grupo;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(instrument);
    return groups;
  }, {});


  grups = Object.keys(groupedServices);
  //Datos que seran enviados si al intentar agregar un servicio surge algun error
  const query = querystring.parse(req.query);
  console.log("Errores que llega a plantilla:");
  console.log(req.query);
  console.log(query);
  res.render('administrar_servicios.html', { servicios: groupedServices, grupos: grups, query: req.query });
}

async function serviciosGet(req, res) {
  const services = await db.execute('SELECT id, grupo, nombre_instrumento, precio, descripcion, url_imagen FROM servicios');
  const groupedServices = services[0].reduce((groups, instrument) => {
    const group = instrument.grupo;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(instrument);
    return groups;
  }, {});


  grups = Object.keys(groupedServices);
  res.render('servicios.html', { servicios: groupedServices, grupos: grups });
}

async function agregarServicioPost(req, res) {
  const result = validationResult(req);

  const nuevoServicio = {
    grupo: req.body.grupo,
    nombre_instrumento: req.body.nombre_instrumento,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    url_imagen: req.body.url_imagen
  }

  if (!result.isEmpty()) {
    const errors = mapErrorValidationResultToObject(result);
    const query_errors = querystring.stringify(errors);
    const query_datos = querystring.stringify(nuevoServicio);
    console.log("Errores que se mandan a la plantilla:");
    console.log(errors);
    console.log(query_datos)
    console.log(query_errors)
    return res.redirect('/administrar_servicios?' + query_errors + "&" + query_datos);
  }
  const consulta = await db.execute('INSERT INTO servicios (grupo, nombre_instrumento, precio, descripcion, url_imagen) VALUES (?, ?, ?, ?, ?)', [nuevoServicio.grupo, nuevoServicio.nombre_instrumento, nuevoServicio.precio, nuevoServicio.descripcion, nuevoServicio.url_imagen]);


  res.redirect('/administrar_servicios');
}



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/servicios/');
  }, // Directorio donde se guardarán las imágenes
  filename: function (req, file, cb) {
    // Genera un nombre de archivo único basado en el ID del servicio

    const nombreImagen = file.originalname;
    req.body.url_imagen = nombreImagen;
    cb(null, nombreImagen);
  },
});
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    // El archivo es una imagen
    cb(null, true);
  } else {
    // El archivo no es una imagen, rechazarlo
    cb(new Error('El archivo no es una imagen.'), false);
  }
}

const imageUpload = multer({ storage: storage, fileFilter: fileFilter });


module.exports = { administrarServiciosGet, serviciosGet, agregarServicioPost, imageUpload };

