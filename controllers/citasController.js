const db = require('../db/db');
const { validationResult } = require('express-validator');
const CitasService = require('../services/citasService');
const { getActiveServiceById } = require('../services/serviciosService');

const PaypalController = require('../controllers/paypalController');

const CitasServiceInstance = new CitasService(db);
const PaypalInstance = new PaypalController();

async function agendarCitaGet(req, res, next) {
  const id_servicio = req.params.id_servicio;

  try {
    const servicio = await getActiveServiceById(id_servicio);

    if (!servicio) {
      return res.status(404).render('agendar-cita.html', {
        error:
          'No se encontró ese servicio o ese servicio no se encuentra activo',
      });
    }

    res.render('agendar-cita.html', {
      servicio,
    });
  } catch (error) {
    next(error);
  }
}

async function checarDisponibilidadParaNuevaCita(req, res, next) {
  const { fecha, hora } = req.body;
  try {
    const { disponibilidad, mensaje } =
      await CitasServiceInstance.verificarDisponibilidadCita(fecha, hora);
    res.json({ disponibilidad, mensaje });
  } catch (error) {
    next(error);
  }
}

async function crearOrdenPago(req, res, next) {
  const result = validationResult(req);

  console.log(req.body);

  if (!result.isEmpty()) {
    const errores = result.array();

    const primerError = errores[0];

    return res.status(400).json({
      error: primerError.msg,
    });
  }

  const { id_servicio, incluye_cuerdas, descripcion, fecha, hora } = req.body;
  try {
    const servicio = await getActiveServiceById(id_servicio);

    if (!servicio) {
      return res.status(404).json({
        error:
          'No se encontró ese servicio o ese servicio no se encuentra activo',
      });
    }

    const { disponibilidad, mensaje } =
      await CitasServiceInstance.verificarDisponibilidadCita(fecha, hora);

    if (!disponibilidad) {
      return res.status(400).json({
        error: mensaje,
      });
    }

    const items = [
      {
        name: `Servicio ${servicio.grupo} - ${servicio.nombre_instrumento}`,
        description: servicio.descripcion,
        quantity: 1,
        unit_amount: {
          value: servicio.precio_anticipo_cita,
          currency_code: 'MXN',
        },
      },
    ];

    if (Boolean(incluye_cuerdas) && servicio.precio_cuerdas) {
      items.push({
        name: `Cuerdas para ${servicio.nombre_instrumento}`,
        description: 'Cuerdas',
        quantity: 1,
        unit_amount: {
          value: servicio.precio_cuerdas,
          currency_code: 'MXN',
        },
      });
    }

    const total = items.reduce((acc, curr) => {
      return acc + Number(curr.unit_amount.value);
    }, 0);

    const idCita = await CitasServiceInstance.crearCitaNoPagada({
      fecha,
      hora,
      descripcion: descripcion,
      incluye_cuerdas: incluye_cuerdas ? true : false,
      precio_anticipo_total: total,
      id_servicio: id_servicio,
      id_usuario: req.session.usuario.id_usuario,
    });

    const { link } = await PaypalInstance.crearLinkDePago(idCita, items, total);

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

    const idCita = data.purchase_units[0].payments.captures[0].custom_id;

    await CitasServiceInstance.actualizarCitaAEstadoPagada(idCita);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

function cancelarPago(req, res) {
  res.send('pago cancelado');
}

module.exports = {
  agendarCitaGet,
  checarDisponibilidadParaNuevaCita,
  crearOrdenPago,
  procesarPago,
  cancelarPago,
};
