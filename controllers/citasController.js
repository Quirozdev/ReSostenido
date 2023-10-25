const db = require('../db/db');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const moment = require('moment');
const { getUserById } = require('../services/userService');
const CitasService = require('../services/citasService');
const { getActiveServiceById } = require('../services/serviciosService');

const PaypalController = require('../controllers/paypalController');

const CitasServiceInstance = new CitasService(db);
const PaypalInstance = new PaypalController();

async function citasGet(req, res, next) {
  const usuario_loggeado = req.session.usuario;
  try {
    const [citasPendientes, citasTerminadas] =
      await CitasServiceInstance.getCitasFilteredByState(
        usuario_loggeado.es_admin ? null : usuario_loggeado.id_usuario
      );

    return res.render(
      usuario_loggeado.es_admin ? 'citas_admin.html' : 'citas_cliente.html',
      {
        citasPendientes,
        citasTerminadas,
      }
    );
  } catch (error) {
    next(error);
  }
}

async function agendarCitaGet(req, res, next) {
  const id_servicio = req.params.id_servicio;

  try {
    const servicio = await getActiveServiceById(id_servicio);

    if (!servicio) {
      return res.status(404).render('error.html');
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
  console.log('amog ussad asdasfsafvaxcv ascv as');

  if (!tokenOrden) {
    return res.status(404).render('error.html');
  }

  const pagoCancelado = req.query.pago_cancelado;

  if (pagoCancelado) {
    return res.render('estado-pago-cita.html', {
      estado: 'CANCELADO',
      mensaje: 'La cita fue cancelada, no se te realizó ningún cobro.',
    });
  }

  try {
    const idCita = req.query.id_cita;

    if (!idCita) {
      return res.status(404).render('error.html');
    }

    const cita =
      await CitasServiceInstance.getCitaNoPagadaAndCorrespondingServiceById(
        idCita
      );

    if (!cita) {
      return res.status(404).render('error.html');
    }

    // hay que checar si mientras el usuario pagaba para su cita, otro usuario le gano ese horario y pago primero
    const { disponibilidad, mensaje } =
      await CitasServiceInstance.verificarDisponibilidadCita(
        cita.fecha,
        cita.hora
      );

    if (!disponibilidad) {
      return res.render('estado-pago-cita.html', {
        estado: 'FALLIDO',
        mensaje: `Mientras pagabas, ocurrió lo siguiente: ${mensaje}. No se te realizó ningún cobro, por favor, intenta con otra fecha y/o hora.`,
      });
    }

    // si todo salio bien

    const tokenAcceso = await PaypalInstance.generateAccessToken();

    const url = `${PaypalInstance.paypal.url}/v2/checkout/orders/${tokenOrden}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAcceso}`,
      },
    });

    await CitasServiceInstance.actualizarCitaAEstadoPagada(idCita);

    // const idCita = data.purchase_units[0].payments.captures[0].custom_id;

    const usuario = await getUserById(req.session.usuario.id_usuario);

    const hostname = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.HOST_NAME;

    await emailService.sendEmail(
      usuario.email,
      `Tu cita fue agendada exitosamente ${usuario.nombre} ${usuario.apellidos}`,
      `
      <p>Tu numero de cita es <strong>${idCita}</strong></p>
      <p><strong>El servicio que seleccionaste:</strong> ${
        cita.descripcion_servicio
      } - ${cita.nombre_instrumento}</p>
      <p><strong>El costo total:</strong> $${cita.precio_anticipo_total} MXN</p>
      <p><strong>Fecha:</strong> ${moment(cita.fecha).format('DD-MM-YYYY')}</p>
      <p><strong>Hora:</strong> ${moment(cita.hora, 'h:mm').format('LT')}</p>
      <p><strong>Consulta todas tus citas en:</strong> </p>
      <a href=${hostname}/citas}>Citas</a>
      `
    );

    const data = await response.json();

    console.log(data);

    return res.render('estado-pago-cita.html', {
      estado: 'EXITOSO',
      mensaje: `Reservación de cita exitosa!`,
      detalles_cita: {
        servicio: `${cita.descripcion_servicio} - ${cita.nombre_instrumento}`,
        fecha: moment(cita.fecha).format('DD-MM-YYYY'),
        hora: moment(cita.hora, 'h:mm').format('LT'),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  citasGet,
  agendarCitaGet,
  checarDisponibilidadParaNuevaCita,
  crearOrdenPago,
  procesarPago,
};
