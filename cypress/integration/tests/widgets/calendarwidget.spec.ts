/// <reference types="cypress" />

describe('Calendar Widget tests', () => {
  const icalFrenchHolidays =
    'https://calendar.google.com/calendar/ical/fr.french%23holiday%40group.v.calendar.google.com/public/basic.ics';
  const icalUsaHolidays =
    'https://calendar.google.com/calendar/ical/fr.usa%23holiday%40group.v.calendar.google.com/public/basic.ics';

  before(() => {
    cy.loginAsAdmin()
      .visit('/')
      .waitUntil(() => cy.get('.tab.selectedItem').should('be.visible'));
  });

  it('Should create a Calendar Widget and add it to the dashboard', () => {
    cy.get('#openAddWidgetModal').click();
    cy.intercept('POST', '/widget/addWidget').as('addWidget');
    cy.get('#CALENDAR').click();
    cy.wait('@addWidget').then(() => {
      cy.get('#closeAddWidgetModal').click().get('.widget').should('have.length', 1);
    });
  });

  it('Should edit Calendar widget and add an Ical feed', () => {
    cy.intercept('GET', `/proxy/?url=${icalFrenchHolidays}`).as('getFrenchCalendarData');

    cy.intercept('GET', `/proxy/?url=${icalUsaHolidays}`).as('getUSCalendarData');

    cy.clock(new Date(2021, 6, 1, 0, 0, 0).getTime())
      .get('#addCalendarUrl')
      .click()
      .get('input')
      .type(`${icalFrenchHolidays}`)
      .get('#validateCalendarUrls')
      .click();

    cy.wait('@getFrenchCalendarData').then(() => {
      cy.get('.rbc-toolbar-label')
        .should('have.text', 'juillet 2021')
        .get('.refreshButton')
        .click()
        .wait('@getFrenchCalendarData')
        .then(() => {
          cy.contains('La fête nationale')
            .get('.editButton')
            .click()
            .get('#addCalendarUrl')
            .click()
            .get('input')
            .eq(1)
            .type(`${icalUsaHolidays}`)
            .get('#validateCalendarUrls')
            .click();
          cy.wait(['@getFrenchCalendarData', '@getUSCalendarData']).then(() => {
            cy.contains('Independence Day')
              .get('.editButton')
              .click()
              .get('.removeCalendarUrl')
              .eq(1)
              .click()
              .get('#validateCalendarUrls')
              .click()
              .wait('@getFrenchCalendarData')
              .then(() =>
                cy
                  .get('.rbc-event')
                  .should('have.length', 1)
                  .clock()
                  .then((clock) => {
                    clock.restore();
                  })
              );
          });
        });
    });
  });

  it('Should delete previously added widget', () => {
    cy.intercept('DELETE', '/widget/deleteWidget/*').as('deleteWidget');
    cy.get('.deleteButton')
      .click()
      .get('h4')
      .should('have.text', 'Êtes-vous sûr de vouloir supprimer ce widget ?')
      .get('.validateDeletionButton')
      .click()
      .wait('@deleteWidget')
      .then(() => {
        cy.get('.widget').should('have.length', 0);
      });
  });
});
