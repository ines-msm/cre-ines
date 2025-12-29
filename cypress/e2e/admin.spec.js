import { LoginPage } from '../page-objects/LoginPage';
import { NavigationService } from '../services/NavigationService';
import { UserPage } from '../page-objects/UserPage';

describe('UI - User Administration', () => {
  const loginPage = new LoginPage();
  const navigationService = new NavigationService();
  const userPage = new UserPage();

  beforeEach(() => {
    cy.on('uncaught:exception', () => false); 
  });

  context('Security & Access Control', () => {
    it('CT-FE-020 - Access User Screen (Admin) and Block Non-Admin', () => {
      // Login as Admin
      loginPage.navigate().login('admin@biblioteca.com', '123456').verifyLoginSuccess();
      cy.contains('a', 'Usuários').click(); 
      userPage.verifyAdminAreaVisible(); 

      // Logout and Login as Aluna (Non-Admin)
      cy.contains('button', 'Sair').click(); 
      loginPage.login('aluna@teste.com', '123456').verifyLoginSuccess();
      
      // Attempt direct access to protected URL
      cy.visit('/admin-usuarios.html', { failOnStatusCode: false });
      cy.get('body').contains(/Somente administradores podem acessar esta página./).should('be.visible');
    });
  });

  context('Admin - User Management', () => {
    beforeEach(() => {
      loginPage.navigate().login('admin@biblioteca.com', '123456').verifyLoginSuccess();
      navigationService.navigateTo('/admin-usuarios.html');
    });

    it('CT-FE-021 - Create New User (Admin)', () => {
      const uniqueId = Date.now();
      const newUser = {
        name: `Novo Func ${uniqueId}`,
        email: `novo.func.${uniqueId}@teste.com`,
        password: 'password123',
        role: 'Funcionário' 
      };

      userPage
        .createNewUser(newUser)
        .verifyUserInList(newUser.email);
    });

    it('CT-FE-022 - Edit User (Admin)', () => {
      const uniqueId = Date.now();
      const tempEmail = `edit.${uniqueId}@teste.com`;
      const updatedName = `Name Edited ${uniqueId}`;

      // Create a user to be edited
      userPage.createNewUser({
        name: 'Edit User',
        email: tempEmail,
        password: '123',
        role: 'Funcionário'
      });

      // Edit the user just created
      userPage.editUserByEmail(tempEmail, updatedName);
      
      // Validate the name change
      userPage.verifyUserInList(updatedName);
    });

    it('CT-FE-023 - Delete User (Admin)', () => {
      const uniqueId = Date.now();
      const deleteEmail = `delete.${uniqueId}@teste.com`;

      // Create a user to be deleted
      userPage.createNewUser({
        name: 'Delete User',
        email: deleteEmail,
        password: '123',
        role: 'Funcionário'
      });

      // Confirm the user exists
      userPage.verifyUserInList(deleteEmail);

      // Delete the user
      userPage.deleteUserByEmail(deleteEmail);

      // Validate the user no longer exists
      userPage.verifyUserNotInList(deleteEmail);
      userPage.verifyUserInList('aluna@teste.com');
    });
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

    userPage.logout();

    cy.url().should('include', '/login.html');
    cy.window().its('localStorage.usuario').should('not.exist');
  });
});