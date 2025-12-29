/**
 * UserPage - Page Object for Administrative User Management
 */
export class UserPage {
    // 1. SELECTORS
    get userTable() { return cy.get('table'); }
    get adminContainer() { return cy.get('#area-admin-conteudo'); }
    get nameInput() { return cy.get('#nome'); }
    get emailInput() { return cy.get('#email'); }
    get passwordInput() { return cy.get('#senha'); }
    get roleSelect() { return cy.get('#tipo'); }
    get submitButton() { return cy.contains('button', 'Criar Usuário'); }

    // 2. ACTIONS & ASSERTIONS
    verifyPageLoads() {
        cy.url().should('match', /dashboard|admin-usuarios/);
        return this;
    }

    verifyAdminAreaVisible() {
        this.adminContainer.should('be.visible');
        cy.contains('Administração de Usuários').should('be.visible');
        return this;
    }

    logout() {
        cy.contains('button', 'Sair').should('be.visible').click();
        return this;
    }

    createNewUser(userData) {
        cy.removeAllListeners('window:alert');
        cy.on('window:alert', (txt) => {
            if (txt.includes('sucesso')) {
                expect(txt).to.equal('Usuário criado com sucesso!');
            }
        });

        this.nameInput.clear().type(userData.name);
        this.emailInput.clear().type(userData.email);
        this.passwordInput.clear().type(userData.password);

        this.roleSelect.select(userData.role);

        this.submitButton.click();
        return this;
    }

    /**
     * Edit User based on the email
     */
    editUserByEmail(email, newName) {
        this.userTable.find('input[data-campo="email"]').filter((i, el) => el.value === email)
            .parents('tr')
            .within(() => {
                cy.get('input[data-campo="nome"]').clear().type(newName);
                cy.get('button').contains('Salvar').click();
            });
        cy.reload();
        return this;
    }

    /**
     * Delete User based on the email
     */
    deleteUserByEmail(email) {
        cy.removeAllListeners('window:alert');
        cy.on('window:alert', (txt) => {
            if (txt.includes('excluído')) expect(txt).to.equal('Usuário excluído com sucesso!');
        });

        this.userTable.find('input[data-campo="email"]').filter((i, el) => el.value === email)
            .parents('tr')
            .within(() => {
                cy.get('button').contains('Excluir').click();
            });
        return this;
    }

    verifyUserInList(expectedValue) {
        this.userTable.find('input').should(($inputs) => {
            const values = Array.from($inputs).map(input => input.value);
            expect(values).to.include(expectedValue);
        });
        return this;
    }

    verifyUserNotInList(value) {
        this.userTable.find('input').should(($inputs) => {
            const values = Array.from($inputs).map(input => input.value);
            expect(values).to.not.include(value);
        });
        return this;
    }
}