const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');

router.get('/', (req, res) => {
  if (req.session.usuario) {
    res.send('en /test/{id_usuario} hay una prueba');
  } else {
    res.send('No estas loggeado');
  }
});

router.get('/test/:id', testController.homePage);

module.exports = router;
