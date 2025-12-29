import { LoginPage } from '../page-objects/LoginPage';
import { BooksPage } from '../page-objects/BooksPage';
import { UserPage } from '../page-objects/UserPage';

describe('UI - Book Purchases', () => {
  const loginPage = new LoginPage();
  const booksPage = new BooksPage();
  const userPage = new UserPage();

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  it('CT-FE-018 - Purchase a Book', () => {
    loginPage.navigate().login('admin@biblioteca.com', '123456');
    booksPage.ensureBookExists({
      title: 'Livro de Compra ' + Date.now(),
      author: 'Cypress',
      pages: '200',
      description: 'Garantindo estoque',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/pt/7/72/The_Hobbit_Cover.JPG',
      stock: '50',
      price: '39.90'
    });
    userPage.logout();

    loginPage.navigate().login('aluna@teste.com', '123456');
    cy.visit('/compras.html');
    
    cy.get('#lista-livros-compra .book-card').first().within(() => {
      cy.get('button').invoke('attr', 'onclick').then((attr) => {
        const bookId = attr.match(/\d+/)[0];
        cy.wrap(bookId).as('purchasedBookId');
      });
      const alertStub = cy.stub().as('purchaseAlert');
      cy.on('window:alert', alertStub);
      cy.get('button').contains('Comprar').click();
      cy.get('@purchaseAlert').should('have.been.calledWith', 'Compra registrada com sucesso! Aguarde aprovação.');
    });

    cy.visit('/minhas-compras.html'); 
    booksPage.verifyPurchaseInList();
  });

  it('CT-FE-019 - Approve a Purchase (Admin)', () => {
    loginPage.navigate().login('aluna@teste.com', '123456');
    cy.visit('/compras.html');
    
    cy.get('#lista-livros-compra .book-card').first().within(() => {
        cy.get('button').invoke('attr', 'onclick').then((attr) => {
            const bookId = attr.match(/\d+/)[0];
            cy.wrap(bookId).as('targetBookId');
        });
        cy.get('button').contains('Comprar').click();
    });
    userPage.logout();

    loginPage.navigate().login('admin@biblioteca.com', '123456');
    cy.get('@targetBookId').then((id) => {
        booksPage.approveSpecificPurchase(id);
    });
  });
});