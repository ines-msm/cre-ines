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
      loginPage.navigate().login('admin@biblioteca.com', '123456').verifyLoginSuccess();
      cy.contains('a', 'Usuários').click(); 
      userPage.verifyAdminAreaVisible(); 

      cy.contains('button', 'Sair').click(); 
      loginPage.login('usertestes@email.com', 'senha123').verifyLoginSuccess();
      
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
      const updatedName = `Edit Name ${Date.now()}`;
      
      // Targeting the second row (Index 1) to protect Admin Master
      userPage
        .editUser(updatedName, 1)
        .verifyUserInList(updatedName);
    });

    it('CT-FE-023 - Delete User (Admin)', () => {
      // Targeting the second row (Index 1) to protect Admin Master
      userPage.deleteUserAndVerify(1); 
    });
  });
});