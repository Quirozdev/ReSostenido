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
    const datasetName = "Ganancias" 
    
    
  res.render('estadisticas_prueba.html', { gananciasPorAnio: gananciasPorAnio, tituloGrafica: tituloGrafica, datasetName: datasetName } );
}


module.exports = {
  getGananciasTotales,
};