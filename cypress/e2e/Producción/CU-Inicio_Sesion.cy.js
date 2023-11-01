describe('Pagina de inicio de sesion', () => {
  before(() => {
    cy.visit('https://resostenidoclone-production.up.railway.app/')
  })

  it('Encontrar el boton de menu', () => {
    // Click en iniciar sesión
    cy.get('#loginNavItem > .nav-link').should('be.visible').click()

    // Cargar datos de inicio de sesión desde el archivo de fixture 'registro.json'
    cy.fixture('datos_cliente.json').then((data) => {
      cy.get('#email').should('be.visible').type(data.email, { force: true });
      cy.get('#contrasenia').should('be.visible').type(data.contrasena, { force: true });
    });

    cy.get('#login').should('be.visible').click()
  })
})
