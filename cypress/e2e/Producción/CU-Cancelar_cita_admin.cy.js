describe('Cancelar cita Admin', () => {
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
  
      //Click en administración de citas
      cy.get(':nth-child(2) > .single-feature > .content > .btn').should('be.visible').click();

      //Click en una cita
      cy.get(':nth-child(2) > .table-responsive > .col-lg-8 > #tabla_servicios > tbody > :nth-child(1) > #CPboton > a > #btnverCita').click()

      //Click en eliminar cita
      cy.get('#cancelar-cita-form > .d-flex > .me-2 > .btn');

    })
    })