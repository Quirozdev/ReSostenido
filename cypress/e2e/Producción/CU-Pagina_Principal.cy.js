describe('Pagina principal', () => {
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
    cy.get('.d-inline-block').should('be.visible');

    //Titulo del sitio
    cy.get('.header-title').should('be.visible');

    //Sección de servicios
    cy.get('.title').should('be.visible');
    //Boton de agendar cita
    cy.get('.main-btn').should('be.visible');

    //Sección preguntas
    cy.get('.col-xl-6 > .section-title > .fw-bold').should('be.visible');
    

  });
});
