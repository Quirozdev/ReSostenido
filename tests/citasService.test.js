require('dotenv').config();
const Database = require('../db/database');
const CitasService = require('../services/citasService');

MYSQLHOST = 'localhost';
MYSQLPORT = 3306;
MYSQLUSER = 'root';
MYSQLPASSWORD = '';
MYSQLDATABASE = 'resostenido';

describe('En la funcionalidad de citas', () => {
  let testDatabase = new Database({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    databaseName: process.env.MYSQLDATABASE,
  });

  let servicioCitas = new CitasService(testDatabase.getConnection());

  beforeAll(() => {});
  describe('Al checar si una fecha y hora estan disponibles para una cita y el dia actual es 20/10/2023 y son las 13:00 horas', () => {
    beforeEach(() => {});

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

      console.log(resultados);

      expect(resultados.disponible).toBe(false);
      expect(resultados.mensaje).not.toBeNull();
    });
  });

  afterAll(async () => {
    await testDatabase.closeConnection();
  });
});
