const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/db');

function registerGet(req, res) {}

async function registerPost(req, res, next) {
  const result = validationResult(req);
  const {
    email,
    nombre,
    apellido_paterno,
    apellido_materno,
    numero_telefono,
    contrasenia,
  } = req.body;

  if (!result.isEmpty()) {
    const user = {
      email,
      nombre,
      apellido_paterno,
      apellido_materno,
      numero_telefono,
      contrasenia,
    };
    return res.send({ errors: result.array(), user: user });
  }

  try {
    const contrasenia_encriptada = await bcrypt.hash(contrasenia, 10);

    await db.execute(
      'INSERT INTO `usuarios` (`email`, `nombre`, `apellido_paterno`, `apellido_materno`, `numero_telefono`, `contrasenia`) VALUES (?, ?, ?, ?, ?, ?)',
      [
        email,
        nombre,
        apellido_paterno,
        apellido_materno,
        numero_telefono,
        contrasenia_encriptada,
      ]
    );
    res.status(201).send('Usuario creado exitosamente');
  } catch (err) {
    next(err);
  }
}

function loginGet(req, res) {}

async function loginPost(req, res) {
  const { email, contrasenia } = req.body;
  const [usuarios, campos] = await db.execute(
    'SELECT `nombre`, `apellido_paterno`, `apellido_materno`, `es_admin`, `contrasenia` FROM `usuarios` WHERE `email` = ?',
    [email]
  );
  const usuario = usuarios[0];

  // no hay un usuario con ese email
  if (!usuario) {
    return res.send('El email o contraseña son incorrectos');
  }

  const esContraseniaCorrecta = await bcrypt.compare(
    contrasenia,
    usuario.contrasenia
  );

  if (!esContraseniaCorrecta) {
    return res.send('El email o contraseña son incorrectos');
  }

  // si se encontro al usuario y la contrasenia es correcta,
  // se crea la sesion automaticamente en la bd, haciendole
  // un cambio a req.session y guardando datos del usuario en la
  // sesion que podrian usarse en los templates

  req.session.usuario = {
    nombre: usuario.nombre,
    apellido_paterno: usuario.apellido_paterno,
    apellido_materno: usuario.apellido_materno,
    es_admin: usuario.es_admin,
  };
  res.send('Login exitoso');
}

module.exports = {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
};
