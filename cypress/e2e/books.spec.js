import { LoginPage } from '../page-objects/LoginPage';
import { NavigationService } from '../services/NavigationService';
import { BooksPage } from '../page-objects/BooksPage';

describe('UI - Books Page', () => {
  const loginPage = new LoginPage();
  const navigationService = new NavigationService();
  const booksPage = new BooksPage();

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  // --- ADMIN ACTIONS ---
  describe('Admin - Book Management', () => {
    beforeEach(() => {
      loginPage.navigate().login('admin@biblioteca.com', '123456').verifyLoginSuccess();
      navigationService.navigateTo('/livros.html');
    });

    it('CT-FE-010 - Book registration via UI', () => {
      const bookTitle = `O Hobbit ${Date.now()}`;
      booksPage
        .verifyPageLoads()
        .registerNewBook({
          title: bookTitle,
          author: 'J.R.R. Tolkien',
          pages: '310',
          description: 'texto.',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/pt/7/72/The_Hobbit_Cover.JPG',
          stock: '5',
          price: '39.90'
        });
      booksPage
        .verifyFormIsCleared()
        .verifyBookInList(bookTitle);
    });

    it('CT-FE-011 - Book Registration Missing Fields', () => {
      booksPage.verifyPageLoads().attemptBookRegistrationWithMissingFields();
    });
  });

  // --- STUDENT ACTIONS ---
  describe('Student - Book Interactions', () => {
    beforeEach(() => {
      loginPage.navigate().login('aluna@teste.com', '123456').verifyLoginSuccess();
      navigationService.navigateTo('/livros.html');
    });

    it('CT-FE-012 - View Book Details', () => {
      booksPage
        .verifyPageLoads()
        .viewFirstBookDetails()
        .verifyDetailsPageContent();
    });

    it('CT-FE-013 - Add Book to Favorites', () => {
      booksPage
        .verifyPageLoads()
        .viewFirstBookDetails()
        .addFirstBookToFavorites();
    });

    it('CT-FE-014 - Remove Book from Favorites', () => {
      booksPage
        .verifyPageLoads()
        .viewFirstBookDetails()
        .addFirstBookToFavorites()
        .removeFirstBookFromFavorites();
    });

    it('CT-FE-015 - List Favorites', () => {
      booksPage
        .verifyPageLoads()
        .listFavorites();
    });
  });
});