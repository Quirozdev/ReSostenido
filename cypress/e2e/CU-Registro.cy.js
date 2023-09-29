describe('Pagina de registro', () => {
  before(() => {
    cy.visit('localhost:3000')
  })
  
  it('Realizar registro', () =>{
    //Menu de navegación  
    cy.get('.navbar-toggler-icon').click()
    //Click en registrar
    cy.get('.position-absolute > :nth-child(2) > .nav-link > .d-flex').click()
    //Rellenar formulario
    cy.get('#nombre').type('Adrian', { force: true })
    cy.get('#apellidos').type('Vargas', { force: true })
    cy.get('#email').type('adrianvargasuson@gmail.com', { force: true })
    cy.get('#numero_telefono').type('6623511195', { force: true })
    cy.get('#contrasenia').type('TacosDeGansito', { force: true })
    cy.get('#confirmar_contrasenia').type('TacosDeGansito', { force: true })
    cy.get('#register').click()
  })
})