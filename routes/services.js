const express = require('express');
const router = express.Router();


router.get('/administrar_servicios', 
    (req, res) => {
        res.render('administrar_servicios.html');
    });

module.exports = router;
