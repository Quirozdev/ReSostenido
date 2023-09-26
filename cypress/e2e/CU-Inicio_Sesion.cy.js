describe('Pagina de inicio de sesion', () => {
    it('Ingresar al sitio', () => {
      cy.visit('localhost:3000')
    })
    
    it('Encontrar el boton de menu', () =>{
        cy.get('.navbar-toggler-icon').click()  
    })
  
    it('Click en el boton de inicio de sesion', () => {
        cy.get('.position-absolute > :nth-child(1) > .nav-link > .d-flex').click()
    });
  
    it('Rellenar formulario', () => {
        cy.get('#email').type('adrianvargasuson@gmail.com', { force: true })
        cy.get('#contrasenia').type('TacosDeGansito', { force: true })
        cy.get('#login').click()
      });

    //it('Registrar cita', () => {
    //    cy.get('a > .btn').click()
    //});
  })