const db = require('../db/db');
const path = require('path');
const multer = require('multer');
const mapErrorValidationResultToObject = require('../utils/validationErrorsMapper');
const { validationResult } = require('express-validator');
const querystring = require('querystring');
const e = require('express');


const agruparServicios = (servicios) => {
  const groupedServices= servicios.reduce((groups, instrument) => {
    const group = instrument.grupo;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(instrument);
    return groups;
  }, {})
  return groupedServices;
}


async function administrarServiciosGet(req, res) {
  const services = await db.execute('SELECT id, grupo, nombre_instrumento, precio, descripcion, url_imagen, activo FROM servicios ');
  
  const {activeServices, inactiveServices} = services[0].reduce((groups, instrument) => {
    if (instrument.activo === 1) {
      groups.activeServices.push(instrument);
    } else {
      groups.inactiveServices.push(instrument);
    }
    return groups;


  },{inactiveServices: [], activeServices: []});
  
  //const groupedInactiveServices = agruparServicios(inactiveServices);
  //const groupedActiveServices = agruparServicios(activeServices);
  

  //Datos que seran enviados si al intentar agregar un servicio surge algun error cuando es redireccionado desde otro metodo
  const query = querystring.parse(req.query);
  
  res.render('administrar_servicios.html', { serviciosActivos: activeServices, serviciosInactivos:inactiveServices, query: req.query });
}

async function serviciosGet(req, res) {
  const services = await db.execute('SELECT id, grupo, nombre_instrumento, precio, descripcion, url_imagen FROM servicios where activo = 1');
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
    const errores_con_prefijo = {};

    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errores_con_prefijo[`error_${key}`] = errors[key];
      }
    }
    const query_errors = querystring.stringify(errores_con_prefijo);

    const query_datos = querystring.stringify(nuevoServicio);
    
    return res.redirect('/administrar_servicios?' + query_errors + "&" + query_datos);
  }
  const consulta = await db.execute('INSERT INTO servicios (grupo, nombre_instrumento, precio, descripcion, url_imagen) VALUES (?, ?, ?, ?, ?)', [nuevoServicio.grupo, nuevoServicio.nombre_instrumento, nuevoServicio.precio, nuevoServicio.descripcion, nuevoServicio.url_imagen]);


  res.redirect('/administrar_servicios');
}

async function editarServicioPost(req, res) {
  const result = validationResult(req);

  const servicioActualizado = {
    id: req.body.id,
    grupo: req.body.grupo,
    nombre_instrumento: req.body.nombre_instrumento,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    url_imagen: req.body.url_imagen
  }

  if (!result.isEmpty()) {
    const errors = mapErrorValidationResultToObject(result);
    const errores_con_prefijo = {};

    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errores_con_prefijo[`upd_error_${key}`] = errors[key];
      }
    }

    errores_con_prefijo['id_servicio_devuelto'] = servicioActualizado.id;
    const query_errors = querystring.stringify(errores_con_prefijo);
    const query_datos = querystring.stringify(servicioActualizado);
    
    return res.redirect('/administrar_servicios?' + query_errors + "&" + query_datos);
  }
  console.log("Contenido de la imagen: "+servicioActualizado.url_imagen);
  if(servicioActualizado.url_imagen === "undefined" || servicioActualizado.url_imagen === undefined || servicioActualizado.url_imagen === null || servicioActualizado.url_imagen === "") {
    const consulta = await db.execute('UPDATE servicios SET grupo = ?, nombre_instrumento = ?, precio = ?, descripcion = ? WHERE id = ?', [servicioActualizado.grupo, servicioActualizado.nombre_instrumento, servicioActualizado.precio, servicioActualizado.descripcion, req.body.id]);

  }else{
    const consulta = await db.execute('UPDATE servicios SET grupo = ?, nombre_instrumento = ?, precio = ?, descripcion = ?, url_imagen = ? WHERE id = ?', [servicioActualizado.grupo, servicioActualizado.nombre_instrumento, servicioActualizado.precio, servicioActualizado.descripcion, servicioActualizado.url_imagen, req.body.id]);
 
  }


  res.redirect('/administrar_servicios');
}

async function deshabilitarServicioPost(req, res) {
  const servicio = req.body.id;
  const consulta = await db.execute('UPDATE servicios SET activo = 0 WHERE id = ?', [servicio]);
  //console.log(consulta);
  res.redirect('/administrar_servicios');
}

async function habilitarServicioPost(req, res) {
  const servicio = req.body.id;
  const consulta = await db.execute('UPDATE servicios SET activo = 1 WHERE id = ?', [servicio]);
  //console.log(consulta);
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


module.exports = { 
  habilitarServicioPost,
  administrarServiciosGet, 
  serviciosGet, 
  agregarServicioPost, 
  imageUpload, 
  deshabilitarServicioPost,
  editarServicioPost };

