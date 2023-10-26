const db = require('../db/db');
const sharp = require('sharp');
const path = require('path');

async function getActiveServiceById(id) {
  const [servicios, campos] = await db.execute(
    'SELECT * FROM servicios WHERE id = ? AND activo = 1',
    [id]
  );

  const servicio = servicios[0];
  return servicio;
}

async function guardarImagenEnDisco(imagen, nombreImagen){
  sharp(imagen)
      .webp({quality: 80})
      .resize(200, null, {fit: 'contain'})
      .toFile(path.join(__dirname, '../public/images/servicios/', nombreImagen), (err, info) => {
    if (err) {
      console.log(err);
      return false;
    }else{
      return true;
    }
  });


}


module.exports = {
  getActiveServiceById,
  guardarImagenEnDisco
};
