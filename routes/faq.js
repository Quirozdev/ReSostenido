const express = require('express');
const router = express.Router();


router.get('/FAQ', (req, res) => {
  res.render('FAQ.html')
});


module.exports = router;