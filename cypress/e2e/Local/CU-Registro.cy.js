describe('Pagina de registro', () => {
  before(() => {
    cy.visit('localhost:3000')
  })
  
  it('Realizar registro', () =>{
    //Menu de navegación  
    cy.get('.navbar-toggler-icon').should('be.visible').click()
    //Click en registrar
    cy.get('.position-absolute > :nth-child(2) > .nav-link > .d-flex').should('be.visible').click()
    //Rellenar formulario
    cy.get('#nombre').should('be.visible').type('Adrian', { force: true })
    cy.get('#apellidos').should('be.visible').type('Vargas', { force: true })
    cy.get('#email').should('be.visible').type('adrianvargasuson@gmail.com', { force: true })
    cy.get('#numero_telefono').should('be.visible').type('6623511195', { force: true })
    cy.get('#contrasenia').should('be.visible').type('TacosDeGansito', { force: true })
    cy.get('#confirmar_contrasenia').should('be.visible').type('TacosDeGansito', { force: true })
    cy.get('#register').should('be.visible').click()
  })
})