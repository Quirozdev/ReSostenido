const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', (req, res) => {
  res.render('index.html');
});

router.get('/faq', indexController.faqPage);

module.exports = router;
