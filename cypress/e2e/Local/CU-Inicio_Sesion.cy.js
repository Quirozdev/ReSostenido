describe('Pagina de inicio de sesion', () => {
    before(() => {
      cy.visit('localhost:3000')
    })
    
    it('Encontrar el boton de menu', () =>{
      //Click en el menu de navegación
      cy.get('.navbar-toggler-icon').should('be.visible').click()  
      //Click en iniciar sesión
      cy.get('.position-absolute > :nth-child(1) > .nav-link > .d-flex').should('be.visible').click()
      //Rellenar formulario
      cy.get('#email').should('be.visible').type('adrianvargasuson@gmail.com', { force: true })
      cy.get('#contrasenia').should('be.visible').type('TacosDeGansito', { force: true })
      cy.get('#login').should('be.visible').click()
    })
  })