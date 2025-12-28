/**
 * RegistrationPage - Page Object for registration functionality
 */
export class RegistrationPage {
  // 1. SELECTORS (Getters)
  get nameInput() { return cy.get('#nome'); }
  get emailInput() { return cy.get('#email'); }
  get passwordInput() { return cy.get('#senha'); }
  get confirmPasswordInput() { return cy.get('#confirmarSenha'); }
  get registerButton() { return cy.get('#form-registro button[type="submit"]'); }

  // 2. NAVIGATION
  visit() {
    cy.visit('/registro.html');
    return this;
  }

  // 3. INDIVIDUAL ACTIONS
  enterName(name) {
    if (name) this.nameInput.clear().type(name);
    return this;
  }

  enterEmail(email) {
    if (email) this.emailInput.clear().type(email);
    return this;
  }

  enterPassword(password) {
    if (password) this.passwordInput.clear().type(password);
    return this;
  }

  enterConfirmPassword(password) {
    if (password) this.confirmPasswordInput.clear().type(password);
    return this;
  }

  submit() {
    this.registerButton.click();
    return this;
  }

  // 4. COMBINED FLOW
  registerUser({ name, email, password, confirmPassword }) {
    this.enterName(name);
    this.enterEmail(email);
    this.enterPassword(password);
    this.enterConfirmPassword(confirmPassword || password);
    this.submit();
    return this;
  }

  // 5. ASSERTIONS
  verifySuccessAlert(message = 'sucesso') {
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains(message);
    });
    return this;
  }

  verifyRedirectToLogin() {
    cy.url().should('include', '/login.html');
    return this;
  }

  verifyFormCleared() {
    this.nameInput.should('have.value', '');
    this.emailInput.should('have.value', '');
    this.passwordInput.should('have.value', '');
    this.confirmPasswordInput.should('have.value', '');
    return this;
  }

  verifyValidationError(errorMessage) {

    cy.on('window:alert', (txt) => {
      expect(txt.toLowerCase()).to.contains(errorMessage.toLowerCase());
    });

    return this;
  }
}