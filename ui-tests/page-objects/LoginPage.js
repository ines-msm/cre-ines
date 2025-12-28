/**
 * LoginPage - Page Object for login functionality
 */
export class LoginPage {
  get emailInput() { return cy.get('#email'); }
  get passwordInput() { return cy.get('#senha'); }
  get loginButton() { return cy.get('button[type="submit"]'); }

  navigate() {
    cy.visit('/login.html');
    return this;
  }

  login(email, password) {
    if (email) this.emailInput.clear().type(email);
    if (password) this.passwordInput.clear().type(password);
    this.loginButton.click();
    return this;
  }

  verifyLoginSuccess() {
    // 1. Handle the alert first
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Login realizado com sucesso!');
    });

    // 2. WAIT for the application to redirect itself. 
    // Do NOT use cy.visit() here as it clears storage state.
    cy.url({ timeout: 10000 }).should('include', '/dashboard.html');

    return this;
  }

  verifyLoginError(errorMessage) {
    cy.on('window:alert', (txt) => {
      expect(txt.toLowerCase()).to.contains(errorMessage.toLowerCase());
    });
    return this;
  }
}