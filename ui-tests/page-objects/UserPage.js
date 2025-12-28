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

    /**
     * Logout from the application
     */
    logout() {
        cy.contains('button', 'Sair').should('be.visible').click();
        return this;
    }

    /**
     * Create New User
     */
    createNewUser(userData) {
        // Clear any previous listeners and set a fresh one for this action
        cy.removeAllListeners('window:alert');
        cy.on('window:alert', (txt) => {
            expect(txt).to.equal('Usuário criado com sucesso!');
        });

        this.nameInput.clear().type(userData.name);
        this.emailInput.clear().type(userData.email);
        this.passwordInput.clear().type(userData.password);
        this.roleSelect.select(userData.role);

        this.submitButton.click();
        return this;
    }
    /**
     * Edit User
     * Uses rowIndex to protect Admin Master (ID 1)
     */
    editUser(newName, rowIndex = 1) {
        this.userTable.find('tbody tr').eq(rowIndex).as('targetRow');
        cy.get('@targetRow').find('input[data-campo="nome"]').clear().type(newName);
        cy.get('@targetRow').find('button').contains('Salvar').click();
        cy.reload();
        return this;
    }

    /**
     * Delete User
     */
    deleteUserAndVerify(rowIndex = 1) {
        // Locate the target row and get the email before deleting
        this.userTable.find('tbody tr').eq(rowIndex).find('input[data-campo="email"]').invoke('val').then((emailToDelete) => {

            cy.removeAllListeners('window:alert');
            cy.on('window:alert', (txt) => {
                expect(txt).to.equal('Usuário excluído com sucesso!');
            });

            this.userTable.find('tbody tr').eq(rowIndex).find('button').contains('Excluir').click();

            // Verification
            this.verifyUserNotInList(emailToDelete);
        });

        return this;
    }

    /**
     * Array-based validation for inline inputs
     */
    verifyUserInList(expectedValue) {
        this.userTable.should(($table) => {
            const inputs = Array.from($table.find('input'));
            const values = inputs.map(input => input.value);
            expect(values).to.include(expectedValue);
        });
        return this;
    }
    verifyUserNotInList(value) {
        this.userTable.should(($table) => {
            const inputs = Array.from($table.find('input'));
            const values = inputs.map(input => input.value);
            expect(values).to.not.include(value);
        });
        return this;
    }
}