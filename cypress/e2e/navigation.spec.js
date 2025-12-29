import { LoginPage } from '../page-objects/LoginPage';
import { NavigationService } from '../services/NavigationService';

describe('UI - Route Protection and Navigation', () => {
  const loginPage = new LoginPage();
  const navigationService = new NavigationService();

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes("reading 'tipo'")) return false;
    });
  });

  it('CT-FE-005 - Access protected page without login', () => {
    cy.clearLocalStorage();
    navigationService.navigateTo('/dashboard.html');
    navigationService.verifyCurrentPage('/login.html');
  });

  it('CT-FE-006 - Validate menu items for Student', () => {
    loginPage
      .navigate()
      .login('aluna@teste.com', '123456')
      .verifyLoginSuccess();

    cy.wait(2000);

    const menuItems = [
      { label: 'Dashboard', path: '/dashboard.html' },
      { label: 'Livros', path: '/livros.html' },
      { label: 'Favoritos', path: '/favoritos.html' },
      { label: 'Meus Arrendamentos', path: '/arrendamentos.html' },
      { label: 'Compras', path: '/compras.html' },
      { label: 'Minhas Compras', path: '/minhas-compras.html' }
    ];

    menuItems.forEach((item) => {
      navigationService.clickMenuItem(item.label).verifyCurrentPage(item.path);
    });
  });

  it('CT-FE-007 - Validate menu items for Admin', () => {
    loginPage
      .navigate()
      .login('admin@biblioteca.com', '123456')
      .verifyLoginSuccess();
    cy.wait(2000);

    const menuItems = [
      { label: 'Dashboard', path: '/dashboard.html' },
      { label: 'Livros', path: '/livros.html' },
      { label: 'Favoritos', path: '/favoritos.html' },
      { label: 'Meus Arrendamentos', path: '/arrendamentos.html' },
      { label: 'Aprovações', path: '/aprovacoes.html' },
      { label: 'Compras Admin', path: '/compras-admin.html' },
      { label: 'Usuários (Admin)', path: '/admin-usuarios.html' }
    ];

    menuItems.forEach((item) => {
      navigationService.clickMenuItem(item.label).verifyCurrentPage(item.path);
    });
  });
});

describe('UI - Dashboard Statistics', () => {
  const loginPage = new LoginPage();
  const navigationService = new NavigationService();

  it('CT-FE-008 - Verify dashboard statistics for Admin', () => {
    loginPage.navigate().login('admin@biblioteca.com', '123456').verifyLoginSuccess();

    cy.get('.stat-card', { timeout: 10000 }).should('have.length.at.least', 3);

    const statistics = [
      { label: 'Total de Livros' },
      { label: 'Total de Usuários' },
      { label: 'Livros Disponíveis' },
      { label: 'Alunos' },
      { label: 'Funcionários' },
      { label: 'Administradores' }
    ];

    statistics.forEach((stat) => {
      cy.contains('.stat-card', stat.label)
        .find('.number')
        .should('be.visible')
        .and('not.be.empty');
    });

    cy.get('#livros-recentes .book-card')
      .should('have.length.at.most', 5)
      .and('be.visible');
  });

  it('CT-FE-009 - Verify dashboard statistics for Student', () => {
    loginPage
      .navigate()
      .login('aluna@teste.com', '123456')
      .verifyLoginSuccess();

    navigationService.verifyCurrentPage('/dashboard.html');

    cy.contains('.stat-card', 'Total de Livros').should('be.visible');
    cy.contains('.stat-card', 'Livros Disponíveis').should('be.visible');
    cy.contains('.stat-card', 'Alunos Cadastrados').should('be.visible');
    cy.contains('.stat-card', 'Total de Usuários').should('not.exist');
    cy.contains('h2', 'Livros Disponíveis').should('be.visible');

    cy.get('#livros-recentes')
      .should('be.visible')
      .and('not.be.empty');
    cy.get('#livros-recentes .book-card')
      .should('have.length.at.least', 1)
      .and('be.visible');
  });
});