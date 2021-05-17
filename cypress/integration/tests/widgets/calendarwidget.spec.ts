/// <reference types="cypress" />

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

describe('Calendar Widget tests', () => {
  before(() => {
    cy.visit('/');
    cy.waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Calendar Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
    cy.get('.card-title').should('have.length', 4);
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#CALENDAR').click();
    cy.wait('@addWidget').then(() => {
      cy.get('#closeAddWidgetModal')
        .click()
        .get('.widget')
        .should('have.length', 1);
    });
  });

  it('Should edit Calendar widget and add a Ical feed', () => {
    cy.get('.editButton')
      .click()
      .get('#addCalendarUrl')
      .click()
      .get('input')
      .type(
        'https://calendar.google.com/calendar/ical/arnaud.flaesch93%40gmail.com/private-1ab986857a788b7ead6db2a67f6f48b9/basic.ics'
      )
      .get('#validateCalendarUrls')
      .click();
    cy.intercept(
      'GET',
      '/proxy/?url=https://calendar.google.com/calendar/ical/arnaud.flaesch93%40gmail.com/private-1ab986857a788b7ead6db2a67f6f48b9/basic.ics'
    ).as('refreshWidget');
    cy.get('.refreshButton').click();
    cy.wait('@refreshWidget').then(() => {
      cy.get('.rbc-toolbar-label').should(
        'have.text',
        format(new Date(), 'MMM yyyy', { locale: fr })
      );
    });
  });

  it('Should delete previously added widget', () => {
    cy.intercept('DELETE', '/widget/deleteWidget/*').as('deleteWidget');
    cy.get('.deleteButton')
      .click()
      .get('h4')
      .should('have.text', 'Êtes-vous sûr de vouloir supprimer ce widget ?')
      .get('.btn-danger')
      .click();
    cy.wait('@deleteWidget').then(() => {
      cy.get('.widget').should('have.length', 0);
    });
  });
});
