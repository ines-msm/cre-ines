import { LoginPage } from '../page-objects/LoginPage';
import { BooksPage } from '../page-objects/BooksPage';
import { UserPage } from '../page-objects/UserPage';

describe('UI - Book Leasing Flow (Student and Admin)', () => {
  const loginPage = new LoginPage();
  const booksPage = new BooksPage();
  const userPage = new UserPage();

  beforeEach(() => {
    // Ignore minor application errors to keep tests stable
    cy.on('uncaught:exception', () => false);
  });

  /**
   * CT-FE-016: Student Flow
   * Logs in as User Teste, requests a lease, and verifies the PENDENTE status
   */
  it('CT-FE-016 - Request a Book Leasing (Student)', () => {
    const uniqueTitle = 'Student Lease ' + Date.now();

    // SETUP: Admin creates the book so it's available for the student
    loginPage.navigate().login('admin@biblioteca.com', '123456');
    booksPage.registerNewBook({
      title: uniqueTitle,
      author: 'Tester',
      pages: '150',
      description: 'Available for lease',
      imageUrl: 'https://via.placeholder.com/150',
      stock: '10',
      price: '5.00'
    });
    userPage.logout();

    // ACTION: Student logs in and requests the lease
    loginPage.navigate().login('aluna@teste.com', '123456');
    // Using leaseBook which visits /arrendamentos.html
    booksPage.leaseBook('2026-01-10', '2026-01-20', uniqueTitle);
    
    // VERIFY: Confirms the book appears in "Meus Arrendamentos" with Status: PENDENTE
    booksPage.verifyLeaseInList();
  });

  /**
   * CT-FE-017: Admin Flow
   * Logs in as Admin, goes to Aprovações, and approves the lease.
   */
  it('CT-FE-017 - Approve a Leasing (Admin)', () => {
    const leaseTitle = 'Admin Approval ' + Date.now();

    // SETUP: Create book and ensure a pending lease exists for the admin to approve
    loginPage.navigate().login('admin@biblioteca.com', '123456');
    booksPage.registerNewBook({
      title: leaseTitle,
      author: 'Warehouse',
      pages: '500',
      description: 'Guaranteed Stock',
      imageUrl: 'https://via.placeholder.com/150',
      stock: '100', 
      price: '15.00'
    });
    userPage.logout();

    // ACTION: Student creates the pending request
    loginPage.navigate().login('aluna@teste.com', '123456');
    booksPage.leaseBook('2026-02-01', '2026-02-15', leaseTitle);
    userPage.logout();

    // TEST: Admin logs in to approve the specific lease
    loginPage.navigate().login('admin@biblioteca.com', '123456');
    
    // approveLeasing handles the visit to /aprovacoes.html, 
    // clicking OK on confirms, and validating the specific alerts.
    booksPage.approveLeasing(leaseTitle);
  });
});