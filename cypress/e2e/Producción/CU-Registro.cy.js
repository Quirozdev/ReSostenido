describe('Pagina de registro', () => {
  before(() => {
    // Deshabilitar la detección de errores no atrapados
    Cypress.on('uncaught:exception', (err, runnable) => {
      // evita que Cypress falle por errores no atrapados
      return false;
    });

    // Visitar la página
    cy.visit('https://resostenidoclone-production-13cb.up.railway.app/');
  });
  
  it('Realizar registro', () => {
    // Click en registrar
    cy.get('#registerNavItem > .nav-link').should('be.visible').click()

    // Cargar datos de registro desde el archivo de fixture 'registro.json'
    cy.fixture('datos_cliente.json').then((data) => {
      cy.get('#nombre').should('be.visible').type(data.nombre, { force: true });
      cy.get('#apellidos').should('be.visible').type(data.apellido, { force: true });
      cy.get('#email').should('be.visible').type(data.email, { force: true });
      cy.get('#numero_telefono').should('be.visible').type(data.celular, { force: true });
      cy.get('#contrasenia').should('be.visible').type(data.contrasena, { force: true });
      cy.get('#confirmar_contrasenia').should('be.visible').type(data.contrasena, { force: true });
    });

    cy.get('#register').should('be.visible').click()
  })
})