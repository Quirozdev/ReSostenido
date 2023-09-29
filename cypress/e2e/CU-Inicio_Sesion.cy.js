describe('Pagina de inicio de sesion', () => {
    before(() => {
      cy.visit('localhost:3000')
    })
    
    it('Encontrar el boton de menu', () =>{
      //Click en el menu de navegación
      cy.get('.navbar-toggler-icon').click()  
      //Click en iniciar sesión
      cy.get('.position-absolute > :nth-child(1) > .nav-link > .d-flex').click()
      //Rellenar formulario
      cy.get('#email').type('adrianvargasuson@gmail.com', { force: true })
      cy.get('#contrasenia').type('TacosDeGansito', { force: true })
      cy.get('#login').click()
    })
  })