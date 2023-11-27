describe('Ingresar datos-admin', () => {
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
      cy.get(':nth-child(2) > .table-responsive > .col-lg-8 > #tabla_servicios > tbody > :nth-child(1) > #CPboton > a > #btnverCita').click();

      //Cambiar estado de la cita
      cy.get('#seleccionador-estado').should('be.visible').select('En progreso');

      //Ingresar datos
      cy.get('#marca').should('be.visible').type('marca');
      cy.get('#modelo').should('be.visible').type('modelo');
      cy.get('#numero_serie').should('be.visible').type('123456789');
      cy.get('#notas_admin').should('be.visible').type('pruebas notas');

      //Boton de actualizar datos
      cy.get('.col-sm-8 > [style="justify-content: center;"] > .me-2 > .btn').should('be.visible');

    })
    })