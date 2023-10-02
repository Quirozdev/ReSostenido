describe('Pagina de registro', () => {
  before(() => {
    cy.visit('https://resostenido-production.up.railway.app/')
  })
  
  it('Realizar registro', () => {
    // Menu de navegación  
    cy.get('.navbar-toggler-icon').should('be.visible').click()
    // Click en registrar
    cy.get('.position-absolute > :nth-child(2) > .nav-link > .d-flex').should('be.visible').click()

    // Cargar datos de registro desde el archivo de fixture 'registro.json'
    cy.fixture('registro.json').then((registro) => {
      cy.get('#nombre').should('be.visible').type(registro.nombre, { force: true });
      cy.get('#apellidos').should('be.visible').type(registro.apellido, { force: true });
      cy.get('#email').should('be.visible').type(registro.email, { force: true });
      cy.get('#numero_telefono').should('be.visible').type(registro.celular, { force: true });
      cy.get('#contrasenia').should('be.visible').type(registro.contrasena, { force: true });
      cy.get('#confirmar_contrasenia').should('be.visible').type(registro.contrasena, { force: true });
    });

    cy.get('#register').should('be.visible').click()
  })
})
