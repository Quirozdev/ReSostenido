describe('Pagina principal', () => {
  before(() => {
    cy.visit('https://resostenidoclone-production.up.railway.app/')
  })

  it('Encontrar link FAQ footer', () => {
    //Encontrar link en el Footer
    cy.get('.mb-3 > [href="/FAQ"]').should('be.visible').click()
    //Click en link a FAQ en el menu
    cy.get('#faqNavItem > .nav-link').should('be.visible').click()
    //Verificar contenido del sitio
    cy.get('#titleFAQ').should('contain.text', 'Preguntas frecuentes  (FAQ)')
  })
})