/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Tab tests', () => {
  before(() => {
    cy.loginAsAdmin()
      .visit('/')
      .waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it.only('Should fail to get the list of tabs', () => {
    cy.intercept('GET', '/tab/', { fixture: 'tabs/getTabsError.json', statusCode: 500 }).as('getTabsError');
    cy.visit('/')
      .wait('@getTabsError')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(500);
        cy.get('.alertError').eq(0).should('have.text', 'Erreur interne du serveur.');
      });
  });

  it('Should create a new tab', () => {
    cy.get('#addNewTabButton').click().get('.tab').should('have.length', 2);
  });

  it('Should edit the created tab', () => {
    cy.intercept('POST', '/tab/updateTab').as('updateTab');
    cy.get('.tab')
      .eq(1)
      .should('have.text', 'Nouvel onglet')
      .dblclick()
      .get('input')
      .clear()
      .type('Flux RSS')
      .dblclick()
      .wait('@updateTab')
      .then(() => {
        cy.get('.tab.selectedItem')
          .should('have.text', 'Flux RSS')
          .get('.tab')
          .first()
          .click()
          .get('.tab.selectedItem')
          .should('have.text', 'Nouvel onglet')
          .get('.tab')
          .contains('Flux RSS')
          .click()
          .dblclick()
          .get('input')
          .clear()
          .type('Flux RSS Updated{Enter}')
          .wait('@updateTab')
          .then(() => {
            cy.get('.tab.selectedItem').should('have.text', 'Flux RSS Updated');
          });
      });
  });

  it('Should delete the created tab', () => {
    cy.intercept('DELETE', '/tab/deleteTab/*').as('deleteTab');
    cy.get('.tab')
      .contains('Flux RSS Updated')
      .dblclick()
      .get('.deleteTabButton')
      .click()
      .wait('@deleteTab')
      .then(() => {
        cy.get('.tab').should('have.length', 1);
      });
  });
});
