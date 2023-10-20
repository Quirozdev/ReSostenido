const express = require('express');
const router = express.Router();

router.post('/checar-disponibilidad-fecha', async (req, res) => {
  const { fecha, hora } = req.body;
});
