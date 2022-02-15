/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginAsAdmin(): Chainable;
    loginAsUser(): Chainable;
  }
}
