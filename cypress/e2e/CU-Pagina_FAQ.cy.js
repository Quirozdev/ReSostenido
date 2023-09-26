describe('Pagina principal', () => {
  it('Ingresar al sitio', () => {
    cy.visit('localhost:3000')
  })

  it('Encontrar link FAQ footer', () => {
    cy.get('.mb-3 > [href="/FAQ"]').should('be.visible')
  })


  it('Dar click en el link FAQ footer', () => {
    cy.get('.mb-3 > [href="/FAQ"]').click()
  })


  it('Encontrar link FAQ menu', () => {
    // Aqui va pasos para entrar a FAQ por el menu
    cy.get('.navbar-toggler-icon').click()
    
  })

  it('Dar click en el link FAQ menu', () => {
    // Aqui va pasos para entrar a FAQ por el menu
    cy.get(':nth-child(3) > .nav-link > .d-flex').click()
    
  })

  it('Leer titulo FAQ ', () => {
    cy.get('.container-sm > .mt-5').should('contain.text', 'Preguntas frecuentes  (FAQ)')
  })

})