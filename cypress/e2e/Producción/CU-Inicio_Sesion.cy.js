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
    cy.fixture('datos_cliente.json').then((data) => {
      cy.get('#email').should('be.visible').type(data.email, { force: true });
      cy.get('#contrasenia').should('be.visible').type(data.contrasena, { force: true });
    });

    cy.get('#login').should('be.visible').click();

    //Ver mensaje de bienvenida
    cy.get('.header-title').should('be.visible');

    //Sección de citas para el cliente
    cy.get(':nth-child(1) > .single-feature').should('be.visible');

    //Sección de servicios disponibles
    cy.get(':nth-child(2) > .single-feature').should('be.visible');

    //Sección de foro
    cy.get(':nth-child(3) > .single-feature').should('be.visible');
  })
  })