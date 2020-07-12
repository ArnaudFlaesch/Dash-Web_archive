/// <reference types="cypress" />

context('Dash tests', () => {
    beforeEach(() => {
        cy.visit('/')
    });

    it('cy.window() - get the global window object', () => {
        cy.title().should('equals', 'Dash');
        cy.get('.widget').should('have.length', 0);
        cy.get('#openAddWidgetModal').click();
        cy.get('.card-title').should('have.length', 3);
        cy.get('#RSS').click();
        cy.get('.widget').should('have.length', 1);
    });
});