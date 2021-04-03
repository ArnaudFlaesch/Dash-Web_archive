/// <reference types="cypress" />

describe('Dash tests', () => {
  before(() => {
    cy.visit('/');
  });

  it('Create a Widget and add it to the dashboard', () => {
    cy.title().should('equals', 'Dash');
    cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
    cy.get('#openAddWidgetModal').click();
    cy.get('.card-title').should('have.length', 4);
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#RSS').click();
    cy.wait('@addWidget').then((xhr) => {
      cy.get('#closeAddWidgetModal')
        .click()
        .get('.widget')
        .should('have.length', 1);
    });
  });

  it('Should edit RSS widget and add a feed URL', () => {
    cy.get('.editButton')
      .click()
      .get('.btn-success')
      .should('be.disabled')
      .get('input')
      .type('https://www.lefigaro.fr/rss/figaro_actualites.xml')
      .get('.btn-success')
      .click();
    cy.intercept('GET', '/proxy').as('refreshWidget');
    cy.get('.refreshButton').click();
    cy.wait('@refreshWidget').then((xhr) => {
      cy.get('.rssTitle').should(
        'have.text',
        'Le Figaro - Actualité en direct et informations en continu'
      );
    });
  });

  it('Should delete previously added widget', () => {
    cy.get('.deleteButton')
      .click()
      .get('h4')
      .should('have.text', 'Êtes-vous sûr de vouloir supprimer ce widget ?')
      .get('.btn-danger')
      .click()
      .get('.widget')
      .should('have.length', 0);
  });
});
