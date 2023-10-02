describe('Pagina principal', () => {
  before(() => {
    cy.visit('https://resostenido-production.up.railway.app/')
  })

  it('Encontrar link FAQ footer', () => {
    //Encontrar link en el Footer
    cy.get('.mb-3 > [href="/FAQ"]').should('be.visible').click()
    //Abrir menu de navegación
    cy.get('.navbar-toggler-icon').click()
    //Click en link a FAQ en el menu
    cy.get(':nth-child(3) > .nav-link > .d-flex').click()
    //Verificar contenido del sitio
    cy.get('.container-sm > .mt-5').should('contain.text', 'Preguntas frecuentes  (FAQ)')
  })
})