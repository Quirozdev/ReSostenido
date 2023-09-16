require('dotenv').config();

const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const { session } = require('./middlewares/session');

const indexRouter = require('./routes/testIndex');
const authRouter = require('./routes/authRoutes');

const app = express();

// view template
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session);

app.use(indexRouter);
app.use(authRouter);

// si no se encontro ningun recurso en alguna ruta
app.use((req, res) => {
  res.status(404).send('No se encontro esa pagina');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(500).send(err);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server listening at http://localhost:${PORT}`);
  }
});
