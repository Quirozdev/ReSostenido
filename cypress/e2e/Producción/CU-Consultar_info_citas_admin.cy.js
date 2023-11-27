describe('Consultar_info_citas-admin', () => {
    before(() => {
        // Deshabilitar la detección de errores no atrapados
        Cypress.on('uncaught:exception', (err, runnable) => {
          // evita que Cypress falle por errores no atrapados
          return false;
        });
    
        // Visitar la página
        cy.visit('https://resostenidoclone-production-13cb.up.railway.app/login');
      });
  
    it('Encontrar el boton de menu', () => {
      // Click en iniciar sesión
      cy.get('#loginNavItem > .nav-link').should('be.visible').click()
      
      // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
      cy.fixture('datos_admin.json').then((datos) => {
        cy.get('#email').should('be.visible').type(datos.email, { force: true });
        cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
      });
      
      //Iniciar sesión
      cy.get('#login').should('be.visible').click()

      // Ir al apartado de citas
      cy.get('#citasNavItem > .nav-link').should('be.visible').click()

      // ver detalles de la cita
      cy.get('#btnverCita').click({force:true});
    })
  })