const express = require('express');
const router = express.Router();


router.get('/loginn', (req, res) => {
  res.render('loginn.html')
});


module.exports = router;