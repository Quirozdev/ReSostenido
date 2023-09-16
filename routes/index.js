const express = require('express');
const router = express.Router();

const testController = require('../controllers/testController');

router.get('/', (req, res) => {
  res.sendfile('./views/index.html')
});

router.get('/test/:id', testController.homePage);

module.exports = router;
