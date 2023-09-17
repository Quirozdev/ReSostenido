const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('../db/db');

const sessionStore = new MySQLStore(
  {
    clearExpired: true, // para que en la base de datos borre las sesiones que vayan expirando
    checkExpirationInterval: 300000, // cada 300 segundos / 6 minutos  va checando en la bd las sesiones expiradas para borrarlas
  },
  db
);

sessionStore
  .onReady()
  .then(() => {
    console.log('MySQLStore for sessions is ready');
  })
  .catch((err) => {
    console.error(err);
  });

// para que todos los templates puedan acceder a la variable 'usuario' dentro de ellos,
// esta variable tiene nombre, apellidos y si el usuario es_admin
const sendUserSessionDataToTemplates = (req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
};

// esta es solo para probar
const logUserSessionData = (req, res, next) => {
  console.log('Usuario loggeado:', res.locals.usuario);
  next();
};

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports = {
  isAuth,
  sendUserSessionDataToTemplates,
  logUserSessionData,
  session: session({
    cookie: {
      httpOnly: true,
      /* 8 horas, despues de ese lapso la sesion y la cookie expiran si no se interactua con el servidor */
      maxAge: 60 * 60 * 8 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true /* para que renueve el tiempo de expiracion cuando el cliente no esta inactivo (interactua con el servidor) */,
    store: sessionStore,
  }),
};
