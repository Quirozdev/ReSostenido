const db = require('../db/db');

async function administrarServiciosGet(req, res) {
    const services = await db.execute('SELECT grupo, nombre_instrumento, precio FROM servicios');
    const groupedServices = services[0].reduce((groups, instrument) => {
        const group = instrument.grupo;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(instrument);
        return groups;
      }, {});


    grups = Object.keys(groupedServices); 
    console.log(grups);
    res.render('administrar_servicios.html', { servicios: groupedServices, grupos: grups});
}

async function serviciosGet(req, res) {
  const services = await db.execute('SELECT id, grupo, nombre_instrumento, precio FROM servicios');
    const groupedServices = services[0].reduce((groups, instrument) => {
        const group = instrument.grupo;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(instrument);
        return groups;
      }, {});


    grups = Object.keys(groupedServices); 
    res.render('servicios.html', { servicios: groupedServices, grupos: grups});
}

module.exports = { administrarServiciosGet, serviciosGet };

