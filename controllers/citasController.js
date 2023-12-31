const { default: fetch } = require('node-fetch');
const db = require('../db/db');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const moment = require('moment');
const { getUserById } = require('../services/userService');
const CitasService = require('../services/citasService');
const { getActiveServiceById } = require('../services/serviciosService');

const PaypalService = require('../services/paypalService');
const { getBaseUrl } = require('../consts');

const PaypalInstance = new PaypalService();
const CitasServiceInstance = new CitasService(db, PaypalInstance, emailService);

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

async function getDetallesCita(req, res, next) {
  const idCita = req.params.id_cita;
  try {
    const { status, error } =
      await CitasServiceInstance.validarExistenciaYAutoridadCita(
        idCita,
        req.session.usuario.id_usuario,
        req.session.usuario.es_admin
      );

    if (error) {
      return res.status(status).json({ error });
    }

    const detallesCita = await CitasServiceInstance.getCitaPagadaDetailsById(
      idCita,
      req.session.usuario.es_admin
    );

    // para el usuario normal
    if (!req.session.usuario.es_admin) {
      const datosParaUsuario = {
        informacion_cita: detallesCita.informacion_cita,
        comportamiento_cita: {
          es_cancelable: detallesCita.comportamiento_cita.es_cancelable,
        },
      };

      console.log(datosParaUsuario);
      return res.render('detalles-cita-usuario.html', datosParaUsuario);
    }

    // para el admin
    const datosParaAdmin = {
      informacion_cita: detallesCita.informacion_cita,
      informacion_cliente: detallesCita.informacion_cliente,
      informacion_instrumento: detallesCita.informacion_instrumento,
      comportamiento_cita: detallesCita.comportamiento_cita,
    };

    console.log(datosParaAdmin);
    return res.render('detalles-cita-admin.html', datosParaAdmin);
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
        name: `Anticipo para el servicio ${servicio.grupo} - ${servicio.nombre_instrumento}`,
        description: servicio.descripcion,
        quantity: 1,
        unit_amount: {
          value: servicio.precio_anticipo_cita,
          currency_code: 'MXN',
        },
      },
    ];

    let costo_total = Number(servicio.precio);

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

      costo_total = costo_total + Number(servicio.precio_cuerdas);
    }

    const total = items.reduce((acc, curr) => {
      return acc + Number(curr.unit_amount.value);
    }, 0);

    const idCita = await CitasServiceInstance.crearCitaNoPagada({
      fecha,
      hora,
      descripcion: descripcion,
      incluye_cuerdas:
        Boolean(incluye_cuerdas) && servicio.precio_cuerdas ? true : false,
      costo_total: costo_total,
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

    const data = await response.json();

    console.log(data);

    const idOrden = data.purchase_units[0].payments.captures[0].id;

    const totalAnticipo = Number(
      data.purchase_units[0].payments.captures[0].amount.value
    );

    await CitasServiceInstance.pagarAnticipoCita(
      idCita,
      idOrden,
      totalAnticipo
    );

    const usuario = await getUserById(req.session.usuario.id_usuario);

    const baseUrl = getBaseUrl();

    let dineroPorPagar = Number(cita.costo_total) - totalAnticipo;

    await emailService.sendEmail(
      usuario.email,
      `Tu cita fue agendada exitosamente ${usuario.nombre} ${usuario.apellidos}`,
      `
      <p>Tu numero de cita es <strong>${idCita}</strong></p>
      <p><strong>El servicio que seleccionaste:</strong> ${
        cita.descripcion_servicio
      } - ${cita.nombre_instrumento}</p>
      <p><strong>El costo total:</strong> $${cita.costo_total} MXN</p>
      <p>Realizaste un pago por: <p>
      <p>Anticipo: <strong>$${cita.precio_anticipo_cita} MXN</strong></p>
      ${
        cita.incluye_cuerdas
          ? `<p>Cuerdas: $${cita.precio_cuerdas} MXN</p>`
          : ''
      }
      <p>Por lo que te hace falta por pagar <strong style="border: 1px solid green; font-size: 22px">$${dineroPorPagar} MXN</strong></p>
      <p><strong>Fecha:</strong> ${moment(cita.fecha).format('DD-MM-YYYY')}</p>
      <p><strong>Hora:</strong> ${moment(cita.hora, 'h:mm').format('LT')}</p>
      <p><strong>Consulta todas tus citas en:</strong> </p>
      <a href="${baseUrl}/citas">Citas</a>
      `
    );

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

async function editarDetallesCita(req, res, next) {
  const result = validationResult(req);

  // errores de validacion
  if (!result.isEmpty()) {
    const errores = result.array();

    const primerError = errores[0];

    return res.status(400).json({
      error: primerError.msg,
    });
  }

  const idCita = req.params.id_cita;

  try {
    const { status: statusValidacion, error: errorValidacion } =
      await CitasServiceInstance.validarExistenciaYAutoridadCita(
        idCita,
        req.session.usuario.id_usuario,
        req.session.usuario.es_admin
      );

    if (errorValidacion) {
      return res.status(statusValidacion).json({ error: errorValidacion });
    }

    const { status, error, mensaje } =
      await CitasServiceInstance.actualizarDetallesCita(idCita, {
        nuevoEstadoCitaId: req.body.nuevo_estado_cita, // puede ser 1, 2 o 3, todos menos el de cancelacion
        notasAdmin: req.body.notas_admin,
        marca: req.body.marca,
        modelo: req.body.modelo,
        numeroSerie: req.body.numero_serie,
      });

    if (error) {
      return res.status(status).json({ error });
    }

    return res.status(status).json({ mensaje });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Algo salio mal' });
  }
}

async function cancelarCita(req, res, next) {
  const idCita = req.params.id_cita;
  try {
    const { status: statusValidacion, error: errorValidacion } =
      await CitasServiceInstance.validarExistenciaYAutoridadCita(
        idCita,
        req.session.usuario.id_usuario,
        req.session.usuario.es_admin
      );

    if (errorValidacion) {
      return res.status(statusValidacion).json({ error: errorValidacion });
    }

    const {
      status: statusCancelacion,
      error: errorCancelacion,
      mensaje,
    } = await CitasServiceInstance.cancelarCita(
      idCita,
      req.session.usuario.es_admin
    );

    if (errorCancelacion) {
      return res.status(statusCancelacion).json({ error: errorCancelacion });
    }

    return res.status(statusCancelacion).json({ mensaje });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Algo salio mal' });
  }
}

module.exports = {
  citasGet,
  getDetallesCita,
  agendarCitaGet,
  checarDisponibilidadParaNuevaCita,
  crearOrdenPago,
  procesarPago,
  editarDetallesCita,
  cancelarCita,
};
