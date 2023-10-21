require('dotenv').config();
const Database = require('../db/database');
const CitasService = require('../services/citasService');

describe('En la funcionalidad de citas', () => {
  let testDatabase = new Database({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    databaseName: process.env.TEST_MYSQLDATABASE,
  });

  let servicioCitas = new CitasService(testDatabase.getConnection());

  let usuarioId;
  let servicioId;

  describe('Al checar si una fecha y hora estan disponibles para una cita y el dia actual es 20/10/2023 y son las 13:00 horas', () => {
    beforeAll(async () => {
      await testDatabase.getConnection().execute('DELETE FROM citas');
      await testDatabase.getConnection().execute('DELETE FROM usuarios');
      await testDatabase.getConnection().execute('DELETE FROM servicios');

      const [resultadoUsuario, resultadoServicio] = await Promise.all([
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO usuarios (email, nombre, apellidos, numero_telefono, contrasenia, es_admin, verificado) VALUES ('si@gmail.com', 'asd', 'pasdo', '1234124', 'axf234', 0, 1)"
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO servicios (precio, grupo, nombre_instrumento, descripcion, url_imagen) VALUES (350.00, 'Guitarras', 'Guitarra acústica', 'Calibración', 'landingpage-1.jpg')"
          ),
      ]);
      usuarioId = resultadoUsuario[0].insertId;
      servicioId = resultadoServicio[0].insertId;
    });

    describe('cuando no hay citas registradas para ese dia', () => {
      beforeAll(async () => {
        await testDatabase.getConnection().execute('DELETE FROM citas');
      });

      test('Estan disponibles cuando la hora se encuentre en el horario valido, no sea un domingo y no haya 8 citas ese dia', async () => {
        const { disponible, mensaje } =
          await servicioCitas.verificarDisponibilidadCita(
            '2023-10-20',
            '14:00',
            '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
          );
        expect(disponible).toBe(true);
        expect(mensaje).toBeNull();

        const resultados = await servicioCitas.verificarDisponibilidadCita(
          '2023-10-25',
          '09:00',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
        expect(resultados.disponible).toBe(true);
        expect(resultados.mensaje).toBeNull();
      });

      test('NO estan disponibles cuando el dia es un domingo', async () => {
        const { disponible, mensaje } =
          await servicioCitas.verificarDisponibilidadCita(
            '2023-10-22', // domingo
            '14:00',
            '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
          );
        expect(disponible).toBe(false);
        expect(mensaje).not.toBeNull();

        const resultados = await servicioCitas.verificarDisponibilidadCita(
          '2023-11-05', // domingo
          '15:00',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
        expect(resultados.disponible).toBe(false);
        expect(resultados.mensaje).not.toBeNull();
      });

      test('NO estan disponibles cuando la hora esta fuera del horario de trabajo (09:00 AM - 18:00 PM) y no se puede agendar despues de las 17:00 PM', async () => {
        const { disponible, mensaje } =
          await servicioCitas.verificarDisponibilidadCita(
            '2023-10-23',
            '06:00',
            '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
          );
        expect(disponible).toBe(false);
        expect(mensaje).not.toBeNull();

        const resultados = await servicioCitas.verificarDisponibilidadCita(
          '2023-10-26',
          '18:00', // a las 6 de la tarde ya no deberia poder agendarse una cita
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
        expect(resultados.disponible).toBe(false);
        expect(resultados.mensaje).not.toBeNull();
      });
    });
  });

  describe('cuando hay 8 citas registradas para ese dia', () => {
    beforeAll(async () => {
      await Promise.all([
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '09:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '10:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '11:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '12:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '13:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '14:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '15:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, motivo, id_servicio, id_usuario) VALUES ('2023-10-21', '16:00', 'test', ?, ?)",
            [servicioId, usuarioId]
          ),
      ]);
    });

    test('no hay disponibilidad para una nueva cita', async () => {
      const { disponible, mensaje } =
        await servicioCitas.verificarDisponibilidadCita(
          '2023-10-21',
          '17:00',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
      expect(disponible).toBe(false);
      expect(mensaje).not.toBeNull();
    });
  });

  afterAll(async () => {
    await testDatabase.getConnection().execute('DELETE FROM citas');
    await testDatabase.closeConnection();
  });
});
