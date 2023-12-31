describe('Consultar citas - cliente', () => {
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
    cy.fixture('datos_cliente.json').then((datos) => {
      cy.get('#email').should('be.visible').type(datos.email, { force: true });
      cy.get('#contrasenia').should('be.visible').type(datos.contrasena, { force: true });
    });
    
    //Iniciar sesión
    cy.get('#login').should('be.visible').click()

    //Click en citas
    cy.get('#citasNavItem > .nav-link').should('be.visible').click()

    //Buscar cita para guitarra acustica:
    cy.fixture('datos_cliente.json').then((datos) => {
      //cy.get('#CPnombre').should('contain.text', datos.nombre_instrumento)
      //cy.get('#CPdescripcion_servicio').should('contain.text', datos.descripcion)
      //cy.get('#CPanticipo').should('contain.text', datos.anticipo)
    });
    
  })
})