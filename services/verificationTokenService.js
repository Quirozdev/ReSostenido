const db = require('../db/db');

const tokensConfig = require('../configs/tokensVerificacionConf');
const { generateRandomToken } = require('./encryptionService');

async function createVerificationTokenForUser(email) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [usuarios, campos] = await connection.execute(
      'SELECT `id`, `nombre`, `apellidos` FROM `usuarios` WHERE `email` = ? ',
      [email]
    );

    // en la validacion ya se valido que haya un usuario con ese email y que no este verificado aun
    const usuario = usuarios[0];

    const token = generateRandomToken(tokensConfig.tamanioToken);

    await connection.execute(
      'INSERT INTO `tokens_verificacion` (`token`, `fecha_expiracion`, `id_usuario`) VALUES (?, ?, ?)',
      [
        token,
        new Date(Date.now() + tokensConfig.tiempoDeExpiracion),
        usuario.id,
      ]
    );

    await connection.commit();

    return {
      error: null,
      status: 201,
      mensaje: 'Token creado exitosamente, por favor checa tu correo',
      usuario,
      token,
    };
  } catch (err) {
    await connection.rollback();
    console.log(err);
    return {
      error: err,
      status: 500,
      mensaje: 'Algo salió mal, por favor vuelvelo a intentar más tarde',
    };
  }
}

module.exports = {
  createVerificationTokenForUser,
};
