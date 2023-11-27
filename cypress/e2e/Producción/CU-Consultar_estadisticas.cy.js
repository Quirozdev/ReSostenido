describe('Pagina de inicio de sesion', () => {
    before(() => {
      // Deshabilitar la detección de errores no atrapados
      Cypress.on('uncaught:exception', (err, runnable) => {
        // evita que Cypress falle por errores no atrapados
        return false;
      });
  
      // Visitar la página
      cy.visit('https://resostenidoclone-production-13cb.up.railway.app/');
    });
      
    it('Encontrar el boton de menu', () => {
      // Click en iniciar sesión
      cy.get('#loginNavItem > .nav-link').should('be.visible').click()
  
      // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
      cy.fixture('datos_admin.json').then((data) => {
        cy.get('#email').should('be.visible').type(data.email, { force: true });
        cy.get('#contrasenia').should('be.visible').type(data.contrasena, { force: true });
      });
  
      cy.get('#login').should('be.visible').click();
  
      //Click en estadisticas
      cy.get('#estadisticas').should('be.visible').click();

      //Ganancias totales
      cy.get('#graficasPrincipales').should('be.visible')
      cy.get('#filtroTiempo').should('be.visible').select('Meses');
      cy.get('#aniosDisponibles').should('be.visible')

      //Ganancias por instrumento
      cy.get('#graficasPrincipales').should('be.visible').select('Ganancias por instrumento');
      cy.get('#filtroTiempo').should('be.visible');
      cy.get('#aniosDisponibles').should('be.visible')
      cy.get('#instrumentos').should('be.visible')

      //Cantidad de servicios
      cy.get('#graficasPrincipales').should('be.visible').select('Cantidad de servicios');
      cy.get('#filtroTiempo').should('be.visible');
      cy.get('#aniosDisponibles').should('be.visible')
      cy.get('#instrumentos').should('be.visible')

    })
    })