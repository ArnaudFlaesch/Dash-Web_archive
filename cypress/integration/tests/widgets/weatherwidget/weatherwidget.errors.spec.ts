/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Weather Widget error tests', () => {
  before(() => {
    cy.loginAsAdmin()
      .visit('/')
      .title()
      .should('equals', 'Dash')
      .waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should fail to create a Weather Widget', () => {
    cy.intercept('POST', '/widget/addWidget', { statusCode: 500 })
      .as('addWidgetError')
      .get('#openAddWidgetModal')
      .click()
      .get('#WEATHER')
      .click()
      .wait('@addWidgetError')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(500);
        cy.get('#closeAddWidgetModal')
          .click()
          .get('.widget')
          .should('have.length', 0)
          .get('#errorSnackbar')
          .should('have.text', "Erreur lors de l'ajout d'un widget.");
      });
  });
});
