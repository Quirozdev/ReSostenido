describe('Pagina de registro', () => {
  it('Ingresar al sitio', () => {
    cy.visit('localhost:3000')
  })
  
  it('Encontrar el boton de menu', () =>{
      cy.get('.navbar-toggler-icon').click()  
  })

  it('Click en el boton de registrarse', () => {
      cy.get('.position-absolute > :nth-child(2) > .nav-link > .d-flex').click()
  });

  it('Rellenar formulario', () => {
    cy.get('#nombre').type('Adrian', { force: true })
    cy.get('#apellidos').type('Vargas', { force: true })
    cy.get('#email').type('adrianvargasuson@gmail.com', { force: true })
    cy.get('#numero_telefono').type('6623511195', { force: true })
    cy.get('#contrasenia').type('TacosDeGansito', { force: true })
    cy.get('#confirmar_contrasenia').type('TacosDeGansito', { force: true })
    cy.get('#register').click()
  });
})