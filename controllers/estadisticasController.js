const servicesEstadisticas = require('../services/estadisticasService');


async function getGananciasTotales(req, res) {
    const todasLasCitas = await servicesEstadisticas.obtenerGananciasTotales();
    let gananciasPorAnio = {};
    todasLasCitas.forEach( (cita) => {
        const anio = cita.fecha.getFullYear();
        if (!gananciasPorAnio[anio]) {
            gananciasPorAnio[anio] = 0;
        }
        gananciasPorAnio[anio] += parseFloat(cita.costo_total);
    });
    
    console.log(gananciasPorAnio);
    const tituloGrafica = "Ganancias totales por año"
    const datasetName = "Ganancias en el año" 
    const filtroTiempo = "por_anio";
    const raizRuta = "ganancias";
  res.render('estadisticas_prueba.html', { 
    datosGrafica: gananciasPorAnio, 
    tituloGrafica: tituloGrafica,
    datasetName: datasetName,
    filtroTiempo:filtroTiempo,
    raizRuta:raizRuta
    } );
}


async function getGananciasTotalesEnAnio(req, res) {
  let anio = req.params.anio;
  let todasLasCitasDelAnio = await servicesEstadisticas.obtenerGananciasTotalesEnAnio(anio);
  if (todasLasCitasDelAnio.length == 0){
    [todasLasCitasDelAnio, anio] = await servicesEstadisticas.obtenerGananciasTotalesEnUltimoAnio();
  }
  let gananciasPorMes = {};
  todasLasCitasDelAnio.forEach( (cita) => {
    const fechaCita = new Date(cita.fecha);
    // Formatear la fecha para obtener la abreviación del mes en español
    const mes = fechaCita.toLocaleString('es-ES', { month: 'short' });

    if (!gananciasPorMes[mes]) {
        gananciasPorMes[mes] = 0;
    }
    gananciasPorMes[mes] += parseFloat(cita.costo_total);
    
    
  });
  const tituloGrafica = "Ganancias totales por mes en el año " + anio;
  const datasetName = "Ganancias en el mes"
  let anios = await servicesEstadisticas.obtenerAniosConGanacias();
  const filtroTiempo = "por_mes";  
  const raizRuta = "ganancias";
  res.render('estadisticas_prueba.html', { 
    datosGrafica: gananciasPorMes,
    tituloGrafica: tituloGrafica,
    datasetName: datasetName,
    aniosDisponibles:anios,
    anioSeleccionado:anio,
    filtroTiempo:filtroTiempo,
    raizRuta:raizRuta
   } );
}

async function getGananciasTotalesDeServicio(req, res){
  let id_servicio = req.params.id_servicio;
  let nombreInstrumento = await servicesEstadisticas.obtenerNombreDeInstrumento(id_servicio);
  if (nombreInstrumento.length == 0){
    return res.status(404).render('error.html')
  }
  nombreInstrumento = nombreInstrumento[0].nombre_instrumento;
  console.log(nombreInstrumento);
  let todasLasCitasDelServicio = await servicesEstadisticas.obtenerGananciasTotalesDeServicio(id_servicio);
  let gananciasPorAnio = {};
  todasLasCitasDelServicio.forEach( (cita) => {
    const anio = cita.fecha.getFullYear();
    if (!gananciasPorAnio[anio]) {
        gananciasPorAnio[anio] = 0;
    }
    gananciasPorAnio[anio] += parseFloat(cita.costo_total);
  });

  let tituloGrafica = "Ganancias totales por año de " + nombreInstrumento;
  if (todasLasCitasDelServicio.length == 0){
    tituloGrafica = "No hay datos de ganancias de " + nombreInstrumento;
  }
  const datasetName = "Ganancias en el año";
  const instrumentos = await servicesEstadisticas.obtenerNombresDeInstrumentos();
  const filtroTiempo = "por_anio";
  const raizRuta = "ganancias_de_servicio";
  res.render('estadisticas_prueba.html', { 
    datosGrafica: gananciasPorAnio,
     tituloGrafica: tituloGrafica,
     datasetName: datasetName,
     instrumentos:instrumentos,
     instrumentoSeleccionado:nombreInstrumento,
     filtroTiempo:filtroTiempo,
    raizRuta:raizRuta
    } );

}

async function getGananciasTotalesDeServicioEnAnio(req, res){
  let id_servicio = req.params.id_servicio;
  let anio = req.params.anio;
  let nombreInstrumento = await servicesEstadisticas.obtenerNombreDeInstrumento(id_servicio);
  if (nombreInstrumento.length == 0){
    return res.status(404).render('error.html')
  }
  nombreInstrumento = nombreInstrumento[0].nombre_instrumento;
  let todasLasCitasDelServicio = await servicesEstadisticas.obtenerGananciasTotalesDeServicioEnAnio(id_servicio, anio);
  let gananciasPorMes = {};
  todasLasCitasDelServicio.forEach( (cita) => {
    const fechaCita = new Date(cita.fecha);
    // Formatear la fecha para obtener la abreviación del mes en español
    const mes = fechaCita.toLocaleString('es-ES', { month: 'short' });

    if (!gananciasPorMes[mes]) {
        gananciasPorMes[mes] = 0;
    }
    gananciasPorMes[mes] += parseFloat(cita.costo_total);
    
    
  });
  let aniosDisponibles = await servicesEstadisticas.obtenerAniosConGanaciasDeServicio(id_servicio);
  let tituloGrafica = "Ganancias totales por mes en el año " + anio + " de " + nombreInstrumento;
  console.log("AÑOS CON GANANCIAS DE "+nombreInstrumento+": "+aniosDisponibles);
  if (aniosDisponibles.length == 0){
    tituloGrafica = "No hay datos de ganancias de " + nombreInstrumento + " en ningún año";
    aniosDisponibles = [{"anio":"No hay"}]
  }else if (todasLasCitasDelServicio.length == 0){
    tituloGrafica = "No hay datos de ganancias en el año " + anio + " de " + nombreInstrumento;
  } 
  const datasetName = "Ganancias en el mes";
  const instrumentos = await servicesEstadisticas.obtenerNombresDeInstrumentos();
  const filtroTiempo = "por_mes";
  const raizRuta = "ganancias_de_servicio";
  res.render('estadisticas_prueba.html', { 
    datosGrafica: gananciasPorMes,
    tituloGrafica: tituloGrafica,
    datasetName: datasetName,
    instrumentos:instrumentos,
    instrumentoSeleccionado:nombreInstrumento,
    anioSeleccionado:anio,
    filtroTiempo:filtroTiempo,
    aniosDisponibles:aniosDisponibles,
    raizRuta:raizRuta
  } );

}

async function getCantidadDeServicio(req, res){
  let id_servicio = req.params.id_servicio;
  let nombreInstrumento = await servicesEstadisticas.obtenerNombreDeInstrumento(id_servicio);
  if (nombreInstrumento.length == 0){
    return res.status(404).render('error.html')
  }
  nombreInstrumento = nombreInstrumento[0].nombre_instrumento;
  let cantidadDeServicios = await servicesEstadisticas.obtenerCantidadDeServicio(id_servicio);
  let objetoCantidadDeServicios = {};
  cantidadDeServicios.forEach( (cita) => {
    objetoCantidadDeServicios[cita.anio] = cita.cantidad; 

  });
  

  let tituloGrafica = "Cantidad de servicios por año de " + nombreInstrumento;
  if (cantidadDeServicios.length == 0){
    tituloGrafica = "Aun no se ha dado ningún servicio a" + nombreInstrumento;
  }
  const datasetName = "Cantidad de servicios en el año";
  const instrumentos = await servicesEstadisticas.obtenerNombresDeInstrumentos();
  const filtroTiempo = "por_anio";
  const raizRuta = "cantidad_de_servicio";
  res.render('estadisticas_prueba.html', { 
    datosGrafica: objetoCantidadDeServicios,
     tituloGrafica: tituloGrafica,
     datasetName: datasetName,
     instrumentos:instrumentos,
     instrumentoSeleccionado:nombreInstrumento,
     filtroTiempo:filtroTiempo,
    raizRuta:raizRuta
    } );


}

async function getCantidadDeServicioEnAnio(req, res){
  let id_servicio = req.params.id_servicio;
  let anio = req.params.anio;
  let nombreInstrumento = await servicesEstadisticas.obtenerNombreDeInstrumento(id_servicio);
  if (nombreInstrumento.length == 0){
    return res.status(404).render('error.html')
  }
  nombreInstrumento = nombreInstrumento[0].nombre_instrumento;
  let cantidadDeServicios = await servicesEstadisticas.obtenerCantidadDeServicioEnAnio(id_servicio, anio);
  let objetoCantidadDeServicios = {};
  
  cantidadDeServicios.forEach( (cita) => {
    //Para obtener la abreviación del mes en español
    let fechaCualquiera = new Date();
    fechaCualquiera.setMonth(cita.mes-1);
    const mes = fechaCualquiera.toLocaleString('es-ES', { month: 'short' });
    objetoCantidadDeServicios[mes] = cita.cantidad; 

  });
  let aniosDisponibles = await servicesEstadisticas.obtenerAniosConGanaciasDeServicio(id_servicio);
  let tituloGrafica = "Cantidad de servicios por mes en el año " + anio + " de " + nombreInstrumento;
  if (aniosDisponibles.length == 0){
    tituloGrafica = "No hay datos de servicios de " + nombreInstrumento + " en ningún año";
    aniosDisponibles = [{"anio":"No hay"}]
  }else if (cantidadDeServicios.length == 0){
    tituloGrafica = "No hay datos de servicios en el año " + anio + " de " + nombreInstrumento;
  } 
  const datasetName = "Cantidad de servicios en el mes";
  const instrumentos = await servicesEstadisticas.obtenerNombresDeInstrumentos();
  const filtroTiempo = "por_mes";
  const raizRuta = "cantidad_de_servicio";
  res.render('estadisticas_prueba.html', { 
    datosGrafica: objetoCantidadDeServicios,
    tituloGrafica: tituloGrafica,
    datasetName: datasetName,
    instrumentos:instrumentos,
    instrumentoSeleccionado:nombreInstrumento,
    anioSeleccionado:anio,
    filtroTiempo:filtroTiempo,
    aniosDisponibles:aniosDisponibles,
    raizRuta:raizRuta
  } );



}


async function redireccionarAServicioExistente(req, res){
  const id_servicio_existente = await servicesEstadisticas.obtenerIdDeServicioValido();
  const nuevaRuta = "/estadisticas" + req.path + "/" + id_servicio_existente;
  res.redirect(nuevaRuta);
}

async function redireccionarAAnioValido(req, res){
  const anio = await servicesEstadisticas.obtenerUltimoAnioConGanancias();
  res.redirect('/estadisticas/ganancias/por_mes/'+anio);
}
async function redireccionarAAnioDeServicioValido(req, res){
  const anio = await servicesEstadisticas.obtenerUltimoAnioConGananciasDeServicio(req.params.id_servicio);
  let nuevaRuta = "/estadisticas" + req.path + "/" + anio;
  if (anio == null){
    nuevaRuta = "/estadisticas" +  req.path + "/" + new Date().getFullYear();
  }
  
  res.redirect(nuevaRuta);
}

module.exports = {
  getGananciasTotales,
  getGananciasTotalesEnAnio,
  getGananciasTotalesDeServicio,
  getGananciasTotalesDeServicioEnAnio,
  getCantidadDeServicio,
  getCantidadDeServicioEnAnio,
  redireccionarAServicioExistente,
  redireccionarAAnioValido,
  redireccionarAAnioDeServicioValido,
 
};