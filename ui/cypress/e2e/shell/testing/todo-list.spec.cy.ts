import { getCyTest } from "../../../support/selectors";

describe('todo list', function () {
    beforeEach(() => {
        cy.fixture('/config').then((_config) => {
            const config = _config;

            const url = `${config.host}:${config.port}/testing/users`;

            // navigation
            cy.visit(url);
        }).as('config');
    });

    it('should show the user list', function () {
        cy.get(getCyTest('user-list')).should('exist');

    });

    it('should should have a create button', function () {
        cy.get(getCyTest('user-list-create')).should('exist');
    });

    it('should should open a create dialog on clicking the create button', function () {
        cy.get(getCyTest('user-list-create')).click().then(() => {

        });

        cy.get('[data-cy=create-dialog').should('be.visible');

    });
})