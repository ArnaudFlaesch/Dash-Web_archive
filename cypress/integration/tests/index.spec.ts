/// <reference types="cypress" />

context('Dash tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Create a Widget and add it to the dashboard', () => {
    cy.title().should('equals', 'Dash');
    cy.get('#openAddWidgetModal').click();
    cy.get('.card-title').should('have.length', 4);
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#RSS').click();
    cy.wait('@addWidget').then((xhr) => {
      cy.get('.widget').should('have.length', 1);
    });
  });
});
