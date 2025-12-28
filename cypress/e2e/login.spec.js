import { RegistrationPage } from '../page-objects/RegistrationPage';
import { LoginPage } from '../page-objects/LoginPage';
import { BooksPage } from '../page-objects/BooksPage';
import { UserPage } from '../page-objects/UserPage';

describe('UI - Registration and Login', () => {
  const registrationPage = new RegistrationPage();
  const loginPage = new LoginPage();
  const booksPage = new BooksPage();

  it('CT-FE-001 - Register a new user successfully (Student)', () => {
    const uniqueEmail = `carlos-${Date.now()}@teste.com`;

    registrationPage
      .visit()
      .registerUser({
        name: 'Carlos Oliveira',
        email: uniqueEmail,
        password: 'senha123'
      })
      .verifySuccessAlert()
      .verifyRedirectToLogin();

    registrationPage.visit().verifyFormCleared();
  });

  it('CT-FE-002 - Passwords Don\'t Match', () => {
    registrationPage
      .visit()
      .registerUser({
        name: 'Carlos Oliveira',
        email: 'carlos@teste.com',
        password: 'senha123',
        confirmPassword: 'senha456'
      })
      .verifyValidationError('As senhas não conferem');
      cy.url().should('include', '/registro.html');
  });

  it('CT-FE-003 - Login with valid credentials (Admin)', () => {
    loginPage
      .navigate()
      .login('admin@biblioteca.com', '123456')
      .verifyLoginSuccess();

    booksPage
      .verifyUsernameInHeader('Admin Master')
      .verifyLocalStorageUser();
    cy.url().should('include', '/dashboard.html');
  });

  it('CT-FE-004 - Login with invalid credentials', () => {
    loginPage
      .navigate()
      .login('admin@biblioteca.com', 'errada')
      .verifyLoginError('Email ou senha incorretos');

    cy.url().should('include', '/login.html');
  });
});

describe('UI - Logout Functionality', () => {
  const loginPage = new LoginPage();
  const userPage = new UserPage();
  it('CT-FE-024 - Logout from the application', () => {
    loginPage
      .navigate()
      .login('admin@biblioteca.com', '123456')
      .verifyLoginSuccess();

    userPage
      .verifyPageLoads()
      .logout();

    cy.url().should('include', '/login.html');
    cy.window().its('localStorage.usuario').should('not.exist');
  });
});