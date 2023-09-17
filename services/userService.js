const db = require('../db/db');
const tokensConfig = require('../configs/tokensVerificacionConf');
const { hash, generateRandomToken } = require('../services/encryptionService');

async function registerUserWithVerificationToken({
  email,
  nombre,
  apellidos,
  numero_telefono,
  contrasenia,
}) {
  const connection = await db.getConnection();

  try {
    const contrasenia_encriptada = await hash(contrasenia);

    await connection.beginTransaction();
    const [resultado] = await connection.execute(
      'INSERT INTO `usuarios` (`email`, `nombre`, `apellidos`, `numero_telefono`, `contrasenia`) VALUES (?, ?, ?, ?, ?)',
      [email, nombre, apellidos, numero_telefono, contrasenia_encriptada]
    );

    const token = generateRandomToken(tokensConfig.tamanioToken);

    await connection.execute(
      'INSERT INTO `tokens_verificacion` (`token`, `fecha_expiracion`, `id_usuario`) VALUES (?, ?, ?)',
      [
        token,
        new Date(Date.now() + tokensConfig.tiempoDeExpiracion),
        resultado.insertId,
      ]
    );

    await connection.commit();

    return token;
  } catch (err) {
    await connection.rollback();
    throw new Error(err);
  }
}

async function verifyAccount(token) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [tokens, campos] = await connection.execute(
      'SELECT `id_usuario`, `fecha_expiracion` FROM `tokens_verificacion` WHERE `token` = ?',
      [token]
    );

    const tokenBd = tokens[0];

    // si no se encontro ese token en la bd
    if (!tokenBd) {
      return {
        err: 'invalid_token',
        msg: 'El token de verificación de no se encontró, posiblemente ya expiró, solicita uno nuevo',
      };
    }

    const estaExpirado = new Date(tokenBd.fecha_expiracion) <= new Date();

    if (estaExpirado) {
      return {
        err: 'token_expired',
        msg: 'El token de verificación de registro ya expiró, por favor solicita nuevamente el link de verificación',
      };
    }

    // actualizar estado verificado del usuario en la bd
    await connection.execute(
      'UPDATE `usuarios` SET `verificado` = true WHERE `id` = ?',
      [tokenBd.id_usuario]
    );

    // borrar token de la bd
    await connection.execute(
      'DELETE FROM `tokens_verificacion` WHERE `id_usuario` = ?',
      [tokenBd.id_usuario]
    );

    await connection.commit();

    return { err: null, msg: 'Usuario verificado exitosamente' };
  } catch (err) {
    await connection.rollback();
    return { err: err, msg: 'Algo salio mal, vuelvelo a intentar' };
  }
}

module.exports = { registerUserWithVerificationToken, verifyAccount };
