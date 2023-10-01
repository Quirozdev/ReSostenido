describe('Pagina de inicio de sesion', () => {
  before(() => {
    cy.visit('https://resostenido-production.up.railway.app/')
  })

  it('Encontrar el boton de menu', () => {
    // Click en el menu de navegación
    cy.get('.navbar-toggler-icon').should('be.visible').click()
    // Click en iniciar sesión
    cy.get('.position-absolute > :nth-child(1) > .nav-link > .d-flex').should('be.visible').click()

    // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
    cy.fixture('registro.json').then((registro) => {
      cy.get('#email').should('be.visible').type(registro.email, { force: true });
      cy.get('#contrasenia').should('be.visible').type(registro.contrasena, { force: true });
    });

    cy.get('#login').should('be.visible').click()
  })
})
