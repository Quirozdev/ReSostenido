describe('Pagina principal', () => {
  it('Ingresar al sitio', () => {
    cy.visit('localhost:3000')
  })

  it('Encontrar logo', () => {
    cy.get('.d-inline-block').should('be.visible')
  })

  it('Encontrar sección Sobre Nosotros', () => {
    //Encontrar titulo
    cy.get(':nth-child(1) > .text-container > :nth-child(1)').should('contain.text', 'Nosotros')
    
    //Encontrar contenido
    //cy.get(cy.get(':nth-child(1) > .text-container > :nth-child(2)')).should('be.visible')
    
    //Encontrar información de contacto
    //cy.get('.container')
  })
})