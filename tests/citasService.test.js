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
        const { disponibilidad, mensaje } =
          await servicioCitas.verificarDisponibilidadCita(
            '2023-10-20',
            '17:40',
            '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
          );
        expect(disponibilidad).toBe(true);
        expect(mensaje).toBeNull();

        const resultados = await servicioCitas.verificarDisponibilidadCita(
          '2023-10-25',
          '09:00',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
        expect(resultados.disponibilidad).toBe(true);
        expect(resultados.mensaje).toBeNull();
      });

      test('NO estan disponibles cuando el dia es un domingo', async () => {
        const { disponibilidad, mensaje } =
          await servicioCitas.verificarDisponibilidadCita(
            '2023-10-22', // domingo
            '14:00',
            '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
          );
        expect(disponibilidad).toBe(false);
        expect(mensaje).not.toBeNull();

        const resultados = await servicioCitas.verificarDisponibilidadCita(
          '2023-11-05', // domingo
          '15:00',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
        expect(resultados.disponibilidad).toBe(false);
        expect(resultados.mensaje).not.toBeNull();
      });

      test('NO estan disponibles cuando la hora esta fuera del intervalo 9:00 AM - 17:40 PM', async () => {
        const { disponibilidad, mensaje } =
          await servicioCitas.verificarDisponibilidadCita(
            '2023-10-23',
            '08:59',
            '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
          );
        expect(disponibilidad).toBe(false);
        expect(mensaje).not.toBeNull();

        const resultados = await servicioCitas.verificarDisponibilidadCita(
          '2023-10-26',
          '17:41',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
        expect(resultados.disponibilidad).toBe(false);
        expect(resultados.mensaje).not.toBeNull();
      });
    });
  });

  describe('cuando hay 8 citas registradas y pagadas para el dia 21-10-2023', () => {
    beforeAll(async () => {
      await Promise.all([
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '09:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '10:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '11:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '12:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '13:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '14:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '15:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '16:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
      ]);
    });

    test('no hay disponibilidad para una nueva cita', async () => {
      const { disponibilidad, mensaje } =
        await servicioCitas.verificarDisponibilidadCita(
          '2023-10-21',
          '13:00',
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
      expect(disponibilidad).toBe(false);
      expect(mensaje).not.toBeNull();
    });

    afterAll(async () => {
      await testDatabase.getConnection().execute('DELETE FROM citas');
    });
  });

  describe('cuando hay algunas citas registradas y pagadas para el dia 21-10-2023', () => {
    beforeEach(async () => {
      await Promise.all([
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '09:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '10:00', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '10:40', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '16:03', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '16:24', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
        testDatabase
          .getConnection()
          .execute(
            "INSERT INTO citas (fecha, hora, descripcion, precio_anticipo_total, pagada, id_servicio, id_usuario) VALUES ('2023-10-21', '17:20', 'test', 125.00, true, ?, ?)",
            [servicioId, usuarioId]
          ),
      ]);
    });

    afterEach(async () => {
      await testDatabase.getConnection().execute('DELETE FROM citas');
    });

    test('No permitir solapamientos entre citas, margen de 20 minutos', async () => {
      const { disponibilidad, mensaje } =
        await servicioCitas.verificarDisponibilidadCita(
          '2023-10-21',
          '09:00', // ya hay una cita con esta hora
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
      expect(disponibilidad).toBe(false);
      expect(mensaje).not.toBeNull();

      const resultados = await servicioCitas.verificarDisponibilidadCita(
        '2023-10-21',
        '10:21', // hay 2 citas, una a las 10:00 y otra a las 10:41, solapa a la de las 10:41
        '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
      );
      expect(resultados.disponibilidad).toBe(false);
      expect(resultados.mensaje).not.toBeNull();

      const resultadosSegundoTest =
        await servicioCitas.verificarDisponibilidadCita(
          '2023-10-21',
          '10:01', // solapa a la cita de las 10:00
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
      expect(resultadosSegundoTest.disponibilidad).toBe(false);
      expect(resultadosSegundoTest.mensaje).not.toBeNull();

      const resultadosTercerTest =
        await servicioCitas.verificarDisponibilidadCita(
          '2023-10-21',
          '16:23', // solapa a la cita de las 16:24
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
      expect(resultadosTercerTest.disponibilidad).toBe(false);
      expect(resultadosTercerTest.mensaje).not.toBeNull();
    });

    test('es posible agendar cuando no hay solapamientos', async () => {
      const resultados = await servicioCitas.verificarDisponibilidadCita(
        '2023-10-21',
        '10:20', // hay una registrada a las 10:00 y a las 10:40, por lo que si es posible a las 10:20
        '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
      );
      expect(resultados.disponibilidad).toBe(true);
      expect(resultados.mensaje).toBeNull();

      const resultadosSegundoTest =
        await servicioCitas.verificarDisponibilidadCita(
          '2023-10-21',
          '17:40', // todavia tiene chanza, es el limite
          '2023-10-20 13:00' // el dia actual es 20/10/2023 y son las 13:00 horas
        );
      console.log(resultadosSegundoTest);
      expect(resultadosSegundoTest.disponibilidad).toBe(true);
      expect(resultadosSegundoTest.mensaje).toBeNull();
    });
  });

  afterAll(async () => {
    await testDatabase.getConnection().execute('DELETE FROM citas');
    await testDatabase.getConnection().execute('DELETE FROM usuarios');
    await testDatabase.getConnection().execute('DELETE FROM servicios');
    await testDatabase.closeConnection();
  });
});
