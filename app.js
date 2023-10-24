require('dotenv').config();

const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const morgan = require('morgan');
const {
  session,
  sendUserSessionDataToTemplates,
  logUserSessionData,
} = require('./middlewares/session');

const testindexRouter = require('./routes/testIndex');
const authRouter = require('./routes/authRoutes');
const indexRouter = require('./routes/index');
const faqRouter = require('./routes/faq');
const servicesRouter = require('./routes/services');
const citasRouter = require('./routes/citas');
const foroRouter = require('./routes/foro');

const app = express();
app.use(morgan('dev'));
// view template
const env = nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'html');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);

app.use(sendUserSessionDataToTemplates);

app.use(logUserSessionData);

app.use(testindexRouter);
app.use(authRouter);
app.use(indexRouter);
app.use(faqRouter);
app.use(servicesRouter);
app.use('/citas', citasRouter);
app.use(foroRouter);

// si no se encontro ningun recurso en alguna ruta
app.use((req, res) => {
  res.status(404).render('error.html');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  console.log(err);
  res.status(500).send(err);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server listening at http://localhost:${PORT}`);
  }
});
