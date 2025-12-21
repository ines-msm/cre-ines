import { test, expect } from '@playwright/test';
import { AuthService } from './services/AuthService.js';
import { BookService } from './services/BookService.js';
import { FavoriteService } from './services/FavoriteService.js';
import { LeaseService } from './services/LeaseService.js';
import { PurchaseService } from './services/PurchaseService.js';
import { UserService } from './services/UserService.js';
import { StatisticsService } from './services/StatisticsService.js';

// Test suite for the Biblioteca Pro Max API
test.describe('Authentication Tests', () => {

  test('CT-API-001 - Successfully Register a New Student User', async ({ request }) => {
    const authService = new AuthService(request);
    
    const newUser = {
      nome: "Maria Silva",
      email: `maria.silva.${Date.now()}@teste.com`,
      senha: "password123",
      tipo: 1
    };

    const result = await authService.register(newUser);

    expect(result.response.status()).toBe(201);
    expect(result.message).toBe('Usuário criado com sucesso');
    expect(result.user).toBeDefined();
    expect(result.user.id).toBeDefined();
    expect(result.user.nome).toBe(newUser.nome);
    expect(result.user.email).toBe(newUser.email);
    expect(Number.isInteger(result.user.id)).toBe(true);
    expect(result.user.id).toBeGreaterThan(0);
    expect(result.user.tipo).toBe(1); // 1 = Aluno
  });

  test('CT-API-002 - Duplicate Email Validation', async ({ request }) => {
    const authService = new AuthService(request);
    
    const duplicateUser = {
      nome: 'João Santos',
      email: 'admin@biblioteca.com', // Precondition: Already exists
      senha: 'senha456'
    };

    const result = await authService.register(duplicateUser);

    expect(result.response.status()).toBe(400);
    expect(result.message).toBe('Email já cadastrado');
  });

  test('CT-API-003 - Login With Valid Credentials (Admin)', async ({ request }) => {
    const authService = new AuthService(request);
    const startTime = Date.now(); // measure performance

    const result = await authService.login('admin@biblioteca.com', '123456');
    const responseTime = Date.now() - startTime;

    expect(result.response.status()).toBe(200);
    expect(result.message).toBe('Login realizado com sucesso');
    expect(responseTime).toBeLessThan(2000);
    expect(result.user).toBeDefined();
    expect(result.user.id).toBeGreaterThan(0);
    expect(result.user.tipo).toBe(3); // 3 = Admin
    expect(result.user.isAdmin()).toBe(true);
  });

  test('CT-API-004 - Login With Invalid Credentials', async ({ request }) => {
    const authService = new AuthService(request);
    
    const result = await authService.login('admin@biblioteca.com', 'wrongpassword');

    expect(result.response.status()).toBe(401);
    expect(result.message).toBe('Email ou senha incorretos');
    expect(result.user).toBeNull();
  });
});

test.describe('Book Management Tests', () => {
  test('CT-API-005 - Retrieve List of Books', async ({ request }) => {
    const bookService = new BookService(request);
    
    const result = await bookService.getAllBooks();
    
    expect(result.response.status()).toBe(200);
    expect(result.books).toBeInstanceOf(Array);
    expect(result.books.length).toBeGreaterThan(0);

    result.books.forEach((book) => {
      expect(book.id).toBeDefined();
      expect(book.nome).toBeDefined();
      expect(book.autor).toBeDefined();
      expect(book.paginas).toBeDefined();
      expect(book.descricao).toBeDefined();
      expect(book.imagemUrl).toBeDefined();
      expect(book.dataCadastro).toBeDefined();
      expect(book.estoque).toBeDefined();
      expect(book.preco).toBeDefined();
    });

    // Check if dataCadastro is in ISO 8601 format
    expect(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/.test(result.books[0].dataCadastro)).toBe(true);
  });

  test('CT-API-006 - Retrieve Available Books', async ({ request }) => {
    const bookService = new BookService(request);
    
    const result = await bookService.getAvailableBooks();
    
    expect(result.response.status()).toBe(200);
    expect(result.books).toBeInstanceOf(Array);

    result.books.forEach((book) => {
      expect(book.estoque).toBeGreaterThan(0);
      expect(book.isAvailable()).toBe(true);
    });
  });

  test('CT-API-007 - Retrieve Book by ID', async ({ request }) => {
    const bookService = new BookService(request);
    
    let availableResult = await bookService.getAvailableBooks();
    expect(availableResult.response.status()).toBe(200);
    
    let bookId;
    if (availableResult.books.length === 0) {
      const newBook = BookService.createDefaultBook({ estoque: 5 });
      const createResult = await bookService.createBook(newBook);
      bookId = createResult.book.id;
    } else {
      bookId = availableResult.books[0].id;
    }

    const result = await bookService.getBookById(bookId);
    
    expect(result.response.status()).toBe(200);
    expect(result.book).toBeDefined();
    expect(result.book.nome).toBeDefined();
    expect(result.book.autor).toBeDefined();
    expect(result.book.paginas).toBeDefined();
  });

  test('CT-API-008 - Retrieve Non-Existent Book by ID', async ({ request }) => {
    const bookService = new BookService(request);
    
    const nonExistentBookId = 9999;
    const result = await bookService.getBookById(nonExistentBookId);
    
    expect(result.response.status()).toBe(404);
    // Book will be an empty object (not null) when API returns 404
    expect(result.book.id).toBeUndefined();
  });

  test('CT-API-009 - Add New Book', async ({ request }) => {
    const bookService = new BookService(request);
    
    const newBook = BookService.createDefaultBook();
    const result = await bookService.createBook(newBook);

    expect(result.response.status()).toBe(201);
    expect(result.book).toBeDefined();
    expect(result.book.id).toBeGreaterThan(0);
    expect(result.book.nome).toBe('Código Limpo');
    expect(result.book.autor).toBe('Robert C. Martin');
    expect(result.book.paginas).toBe(425);
    expect(result.book.descricao).toBe('Manual de boas práticas');
    expect(result.book.estoque).toBe(10);
    expect(result.book.preco).toBe(59.9);
  });

  test('CT-API-010 - Add New Book with Missing Fields', async ({ request }) => {
    const bookService = new BookService(request);
    
    const incompleteBook = {
      nome: '',
      autor: '',
      paginas: null,
    };

    const result = await bookService.createBook(incompleteBook);
    
    expect(result.response.status()).toBe(400);
    expect(result.message).toBe('Nome, autor e páginas são obrigatórios');
  });

  test('CT-API-011 - Update Existing Book', async ({ request }) => {
    const bookService = new BookService(request);
    
    const availableResult = await bookService.getAvailableBooks();
    expect(availableResult.books.length).toBeGreaterThan(0);
    const bookId = availableResult.books[0].id;

    const updatedData = {
      nome: 'Clean Code - Edição Atualizada',
      autor: 'Robert C. Martin',
      paginas: 464,
      descricao: 'Guia completo atualizado',
      imagemUrl: 'https://exemplo.com/nova-imagem.jpg',
      estoque: 7,
      preco: 79.9
    };

    const result = await bookService.updateBook(bookId, updatedData);
    
    expect(result.response.status()).toBe(200);
    expect(result.book.id).toBe(bookId);
    expect(result.book.nome).toBe('Clean Code - Edição Atualizada');
    expect(result.book.autor).toBe('Robert C. Martin');
    expect(result.book.paginas).toBe(464);
    expect(result.book.estoque).toBe(7);
    expect(result.book.preco).toBe(79.9);
  });

  test('CT-API-012 - Delete Book', async ({ request }) => {
    const bookService = new BookService(request);
    
    const availableResult = await bookService.getAvailableBooks();
    expect(availableResult.books.length).toBeGreaterThan(0);
    const bookId = availableResult.books[0].id;

    const deleteResult = await bookService.deleteBook(bookId);
    
    expect(deleteResult.response.status()).toBe(200);
    expect(deleteResult.message).toBe('Livro removido');

    const getResult = await bookService.getBookById(bookId);
    expect(getResult.response.status()).toBe(404);
  });
});
test.describe('Library Statistics', () => {
  test('CT-API-013 - Retrieve Library Statistics', async ({ request }) => {
    const statisticsService = new StatisticsService(request);
    
    const result = await statisticsService.getLibraryStatistics();
    
    expect(result.response.status()).toBe(200);
    expect(result.statistics).toBeDefined();
    expect(result.statistics.totalLivros).toBeDefined();
    expect(result.statistics.totalPaginas).toBeDefined();
    expect(result.statistics.totalUsuarios).toBeDefined();
    expect(result.statistics.usuariosPorTipo).toBeDefined();
    expect(result.statistics.livrosDisponiveis).toBeDefined();
    expect(result.statistics.arrendamentosPendentes).toBeDefined();
    expect(result.statistics.comprasPendentes).toBeDefined();

    expect(Number.isInteger(result.statistics.totalLivros)).toBe(true);
    expect(result.statistics.totalLivros).toBeGreaterThanOrEqual(0);

    expect(result.statistics.areUserCountsValid()).toBe(true);
  });
});

test.describe('Favorites', () => {
  test('CT-API-014 - Add Book to Favorites', async ({ request }) => {
    const bookService = new BookService(request);
    const favoriteService = new FavoriteService(request);
    
    let booksResult = await bookService.getAvailableBooks();
    let bookId;
    
    if (booksResult.books.length === 0) {
      const newBook = BookService.createDefaultBook({ estoque: 5 });
      const createResult = await bookService.createBook(newBook);
      bookId = createResult.book.id;
    } else {
      bookId = booksResult.books[0].id;
    }

    const result = await favoriteService.addToFavorites(bookId, 1);
    
    expect(result.response.status()).toBe(201);
    expect(result.message).toBe('Livro adicionado aos favoritos');
  });

  test('CT-API-015 - Add Duplicate Book To Favorites', async ({ request }) => {
    const favoriteService = new FavoriteService(request);
    
    const result = await favoriteService.addToFavorites(1, 1);
    
    expect(result.response.status()).toBe(400);
    expect(result.message).toBe('Já está nos favoritos');
  });

  test('CT-API-016 - List User Favorites', async ({ request }) => {
    const favoriteService = new FavoriteService(request);
    
    const result = await favoriteService.getUserFavorites(1);
    
    expect(result.response.status()).toBe(200);
    expect(result.favorites).toBeInstanceOf(Array);
  });

  test('CT-API-017 - Remove Book from Favorites', async ({ request }) => {
    const bookService = new BookService(request);
    const favoriteService = new FavoriteService(request);
    
    const newBook = BookService.createDefaultBook();
    const bookResult = await bookService.createBook(newBook);
    const bookId = bookResult.book.id;

    await favoriteService.addToFavorites(bookId, 1);

    const deleteResult = await favoriteService.removeFromFavorites(bookId, 1);
    
    expect(deleteResult.response.status()).toBe(200);
    expect(deleteResult.message).toBe('Livro removido dos favoritos');
  });
});

test.describe('Book Lease', () => {
  test('CT-API-018 - Lease a Book', async ({ request }) => {
    const bookService = new BookService(request);
    const leaseService = new LeaseService(request);
    
    const booksResult = await bookService.getAvailableBooks();
    expect(booksResult.books.length).toBeGreaterThan(0);
    const bookId = booksResult.books[0].id;

    const result = await leaseService.createLease({
      livroId: bookId,
      usuarioId: 1,
      dataInicio: new Date().toISOString(),
      dataFim: new Date().toISOString()
    });

    expect(result.response.status()).toBe(201);
    expect(result.lease).toBeDefined();
    expect(result.lease.id).toBeDefined();
    expect(result.lease.usuarioId).toBe(1);
    expect(result.lease.livroId).toBe(bookId);
    expect(result.lease.dataInicio).toBeDefined();
    expect(result.lease.dataFim).toBeDefined();
    expect(result.lease.status).toBe('PENDENTE');
    expect(result.lease.isPending()).toBe(true);
  });

  test('CT-API-019 - Lease a Book No Stock', async ({ request }) => {
    const bookService = new BookService(request);
    const leaseService = new LeaseService(request);
    
    const booksResult = await bookService.getAvailableBooks();
    expect(booksResult.books.length).toBeGreaterThan(0);
    const bookId = booksResult.books[0].id;
    
    await bookService.updateBook(bookId, { estoque: 0 });

    const result = await leaseService.createLease({
      livroId: bookId,
      usuarioId: 1,
      dataInicio: new Date().toISOString(),
      dataFim: new Date().toISOString()
    });

    expect(result.response.status()).toBe(400);
  });

  test('CT-API-020 - Update Leasing Status to "Approved"', async ({ request }) => {
    const leaseService = new LeaseService(request);
    
    const leasesResult = await leaseService.getPendingLeases();
    expect(leasesResult.leases.length).toBeGreaterThan(0);
    const leaseId = leasesResult.leases[0].id;

    const result = await leaseService.updateLeaseStatus(leaseId, 'APROVADO');
    
    expect(result.response.status()).toBe(200);
    expect(result.lease.id).toBe(leaseId);
    expect(result.lease.status).toBe('APROVADO');
    expect(result.lease.isApproved()).toBe(true);
  });

  test('CT-API-021 - Update Leasing Status with Invalid Value', async ({ request }) => {
    const leaseService = new LeaseService(request);
    
    const leasesResult = await leaseService.getPendingLeases();
    expect(leasesResult.leases.length).toBeGreaterThan(0);
    const leaseId = leasesResult.leases[0].id;

    const result = await leaseService.updateLeaseStatus(leaseId, 'INVALIDO');
    
    expect(result.response.status()).toBe(400);
    expect(result.message).toBe('Status inválido');
  });

  test('CT-API-022 - List User Leases', async ({ request }) => {
    const leaseService = new LeaseService(request);
    
    const result = await leaseService.getUserLeases(1);
    
    expect(result.response.status()).toBe(200);
    expect(result.leases).toBeInstanceOf(Array);
    result.leases.forEach(lease => {
      expect(lease.usuarioId).toBe(1);
    });
  });
});

test.describe('Book Purchase', () => {
  test('CT-API-023 - Purchase a Book', async ({ request }) => {
    const bookService = new BookService(request);
    const purchaseService = new PurchaseService(request);
    
    let booksResult = await bookService.getAvailableBooks();
    let bookId, bookPrice;
    
    if (booksResult.books.length === 0) {
      const newBook = BookService.createDefaultBook({ estoque: 5, preco: 29.99 });
      const createResult = await bookService.createBook(newBook);
      bookId = createResult.book.id;
      bookPrice = createResult.book.preco;
    } else {
      bookId = booksResult.books[0].id;
      bookPrice = booksResult.books[0].preco;
    }
    
    await bookService.updateBook(bookId, { estoque: 1 });

    const result = await purchaseService.createPurchase({
      usuarioId: 1,
      livroId: bookId,
      quantidade: 1
    });

    expect(result.response.status()).toBe(201);
    expect(result.purchase).toBeDefined();
    expect(result.purchase.id).toBeDefined();
    expect(result.purchase.usuarioId).toBe(1);
    expect(result.purchase.livroId).toBe(bookId);
    expect(result.purchase.quantidade).toBe(1);
    expect(result.purchase.total).toBe(bookPrice);
    expect(result.purchase.status).toBe('PENDENTE');
    expect(result.purchase.isPending()).toBe(true);
  });

  test('CT-API-024 - Purchase a Book Exceeding Stock', async ({ request }) => {
    const bookService = new BookService(request);
    const purchaseService = new PurchaseService(request);
    
    let booksResult = await bookService.getAvailableBooks();
    let bookId;
    
    if (booksResult.books.length === 0) {
      const newBook = BookService.createDefaultBook({ estoque: 5 });
      const createResult = await bookService.createBook(newBook);
      bookId = createResult.book.id;
    } else {
      bookId = booksResult.books[0].id;
    }
    
    await bookService.updateBook(bookId, { estoque: 2 });

    const result = await purchaseService.createPurchase({
      usuarioId: 1,
      livroId: bookId,
      quantidade: 5
    });

    expect(result.response.status()).toBe(400);
    expect(result.message).toBe('Estoque insuficiente');
  });

  test('CT-API-025 - Update Purchase Status to "APROVADA"', async ({ request }) => {
    const bookService = new BookService(request);
    const purchaseService = new PurchaseService(request);
    
    let booksResult = await bookService.getAvailableBooks();
    let bookId;
    
    if (booksResult.books.length === 0) {
      const newBook = BookService.createDefaultBook({ estoque: 5 });
      const createResult = await bookService.createBook(newBook);
      bookId = createResult.book.id;
    } else {
      bookId = booksResult.books[0].id;
    }
    
    await bookService.updateBook(bookId, { estoque: 1 });

    const createResult = await purchaseService.createPurchase({
      usuarioId: 1,
      livroId: bookId,
      quantidade: 1
    });

    expect(createResult.response.status()).toBe(201);
    const purchaseId = createResult.purchase.id;

    const updateResult = await purchaseService.updatePurchaseStatus(purchaseId, 'APROVADA');
    
    expect(updateResult.response.status()).toBe(200);
    expect(updateResult.purchase.id).toBe(purchaseId);
    expect(updateResult.purchase.status).toBe('APROVADA');
    expect(updateResult.purchase.isApproved()).toBe(true);
  });

  test('CT-API-026 - Cancel Purchase', async ({ request }) => {
    const bookService = new BookService(request);
    const purchaseService = new PurchaseService(request);
    
    let booksResult = await bookService.getAvailableBooks();
    let bookId;
    
    if (booksResult.books.length === 0) {
      const newBook = BookService.createDefaultBook({ estoque: 5 });
      const createResult = await bookService.createBook(newBook);
      bookId = createResult.book.id;
    } else {
      bookId = booksResult.books[0].id;
    }
    
    await bookService.updateBook(bookId, { estoque: 1 });

    const createResult = await purchaseService.createPurchase({
      usuarioId: 1,
      livroId: bookId,
      quantidade: 1
    });

    expect(createResult.response.status()).toBe(201);
    const purchaseId = createResult.purchase.id;

    const cancelResult = await purchaseService.updatePurchaseStatus(purchaseId, 'CANCELADA');
    
    expect(cancelResult.response.status()).toBe(200);
    expect(cancelResult.purchase.id).toBe(purchaseId);
    expect(cancelResult.purchase.status).toBe('CANCELADA');
    expect(cancelResult.purchase.isCancelled()).toBe(true);
  });

  test('CT-API-027 - List User Purchases', async ({ request }) => {
    const purchaseService = new PurchaseService(request);
    
    const result = await purchaseService.getUserPurchases(1);
    
    expect(result.response.status()).toBe(200);
    expect(result.purchases).toBeInstanceOf(Array);
    result.purchases.forEach(purchase => {
      expect(purchase.usuarioId).toBe(1);
    });
  });

  test('CT-API-028 - List All Purchases', async ({ request }) => {
    const purchaseService = new PurchaseService(request);
    
    const result = await purchaseService.getAllPurchases();
    
    expect(result.response.status()).toBe(200);
    expect(result.purchases).toBeInstanceOf(Array);
  });
});

test.describe('User Management Tests', () => {
  test('CT-API-029 - Retrieve List of Users', async ({ request }) => {
    const userService = new UserService(request);
    
    const result = await userService.getAllUsers();
    
    expect(result.response.status()).toBe(200);
    expect(result.users).toBeInstanceOf(Array);
    expect(result.users.length).toBeGreaterThan(0);
    
    result.users.forEach((user) => {
      expect(user.id).toBeDefined();
      expect(user.nome).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.tipo).toBeDefined();
    });
  });

  test('CT-API-030 - Update User', async ({ request }) => {
    const userService = new UserService(request);
    const userId = 2;
    
    const result = await userService.updateUser(userId, {
      nome: 'João Funcionário Atualizado',
      email: 'func.atualizado@biblio.com',
      tipo: 2
    });

    expect(result.response.status()).toBe(200);
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(userId);
    expect(result.user.nome).toBe('João Funcionário Atualizado');
    expect(result.user.email).toBe('func.atualizado@biblio.com');
    expect(result.user.tipo).toBe(2);
  });

  test('CT-API-031 - Delete User', async ({ request }) => {
    const authService = new AuthService(request);
    const userService = new UserService(request);
    
    const newUser = {
      nome: 'Usuário a Deletar',
      email: `deletar.${Date.now()}@teste.com`,
      senha: 'temp123',
      tipo: 1
    };

    const registerResult = await authService.register(newUser);
    expect(registerResult.response.status()).toBe(201);
    const userIdToDelete = registerResult.user.id;

    const deleteResult = await userService.deleteUser(userIdToDelete);
    expect(deleteResult.response.status()).toBe(200);
    expect(deleteResult.message).toBe('Usuário deletado com sucesso');
  });

  test('CT-API-032 - Exclude Admin User Error', async ({ request }) => {
    const userService = new UserService(request);
    
    const result = await userService.deleteUser(1);
    
    expect(result.response.status()).toBe(403);
    expect(result.message).toBe('Admin principal não pode ser deletado');
  });
});