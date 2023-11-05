const db = require('../db/db');

const tokensConfig = require('../configs/tokensVerificacionConf');
const { generateRandomToken, hash } = require('./encryptionService');

async function createRecoveryTokenForUser(email) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [usuarios, campos] = await connection.execute(
      'SELECT `id`, `nombre`, `apellidos`, `email` FROM `usuarios` WHERE `email` = ? ',
      [email]
    );

    // en la validacion ya se valido que haya un usuario con ese email y que este verificado
    const usuario = usuarios[0];

    const token = generateRandomToken(tokensConfig.tamanioToken);

    await connection.execute(
      'INSERT INTO `tokens_recuperacion_contrasenia` (`token`, `id_usuario`) VALUES (?, ?)',
      [token, usuario.id]
    );

    await connection.commit();

    return {
      error: null,
      usuario: usuario,
      token: token,
    };
  } catch (err) {
    await connection.rollback();
    return {
      error: {
        general: 'Algo salió mal :(, vuelvelo a intentar más tarde',
        error: err,
      },
    };
  }
}

async function changePassword(token, nuevaContrasenia) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [tokens, campos] = await connection.execute(
      'SELECT `token`, `id_usuario` FROM `tokens_recuperacion_contrasenia` WHERE `token` = ? ',
      [token]
    );

    const tokenBd = tokens[0];

    if (!tokenBd) {
      throw new Error(
        'El token proporcionado no fue encontrado, por favor, vuelve a enviar otro a tu correo'
      );
    }

    const contraseniaEncriptada = await hash(nuevaContrasenia);

    await connection.execute(
      'UPDATE `usuarios` SET `contrasenia` = ? WHERE `id` = ?',
      [contraseniaEncriptada, tokenBd.id_usuario]
    );

    // borrar token de la bd
    // borra todos los tokens de recuperacion de contrasenia asociados a ese usuario, por si este habia solicitado mas de uno
    await connection.execute(
      'DELETE FROM `tokens_recuperacion_contrasenia` WHERE `id_usuario` = ?',
      [tokenBd.id_usuario]
    );

    await connection.commit();

    return {
      error: null,
    };
  } catch (e) {
    await connection.rollback();
    return {
      error: {
        general: e.message,
      },
    };
  }
}

module.exports = { createRecoveryTokenForUser, changePassword };
