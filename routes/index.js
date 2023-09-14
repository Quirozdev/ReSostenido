const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');

router.get('/', (req, res) => {
  res.send('en /test/{id_usuario} hay una prueba');
});

router.get('/test/:id', testController.homePage);

module.exports = router;
