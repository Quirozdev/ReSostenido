const db = require('../db/db');
const CitasService = require('../services/citasService');

const PaypalController = require('../controllers/paypalController');

const PaypalInstance = new PaypalController();

async function checarDisponibilidadParaNuevaCita(req, res, next) {
  const { fecha, hora } = req.body;
  try {
    const { disponibilidad, mensaje } = await new CitasService(
      db
    ).verificarDisponibilidadCita(fecha, hora);
    res.json({ disponibilidad, mensaje });
  } catch (error) {
    next(error);
  }
}

async function crearOrdenPago(req, res, next) {
  try {
    const { link } = await PaypalInstance.crearLinkDePago();
    console.log(link);
    res.status(200).json({ link });
  } catch (error) {
    next(error);
  }
}

async function procesarPago(req, res, next) {
  const tokenOrden = req.query.token;

  try {
    const tokenAcceso = await PaypalInstance.generateAccessToken();

    const url = `${PaypalInstance.paypal.url}/v2/checkout/orders/${tokenOrden}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAcceso}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function cancelarPago(req, res) {
  res.send('pago cancelado');
}

module.exports = {
  checarDisponibilidadParaNuevaCita,
  crearOrdenPago,
  procesarPago,
  cancelarPago,
};
