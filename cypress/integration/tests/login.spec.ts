/// <reference types="cypress" />

import { Interception } from 'cypress/types/net-stubbing';

describe('Login tests', () => {
  before(() => {
    window.localStorage.setItem('user', null);
    cy.visit('/');
  });

  beforeEach(() => {
    cy.intercept('POST', '/auth/login').as('login');
  });

  it('Should fail to login', () => {
    cy.get('#loginButton')
      .should('be.disabled')
      .get('#inputUsername')
      .type('test')
      .get('#inputPassword')
      .type('test')
      .get('#loginButton')
      .should('be.enabled')
      .click()
      .wait('@login')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(401);
      });
  });

  it('Should login', () => {
    cy.get('#inputUsername')
      .clear()
      .type('admintest')
      .get('#inputPassword')
      .clear()
      .type('adminpassword')
      .get('#loginButton')
      .should('be.enabled')
      .click()
      .wait('@login')
      .then((request: Interception) => {
        expect(request.response.statusCode).to.equal(200);
        cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'))
          .get('.tab')
          .should('have.length', 1);
      });
  });
});
