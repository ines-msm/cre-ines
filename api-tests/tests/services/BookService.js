import { APIClient } from '../clients/APIClient.js';
import { Book } from '../objects/APIObjects.js';

/**
 * Book Service
 * Handles all book-related operations (CRUD, availability, etc.)
 */
export class BookService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Retrieve all books
   * @returns {Promise<{books: Book[], response: Response}>}
   */
  async getAllBooks() {
    const response = await this.apiClient.get('/livros');
    const booksData = await response.json();
    
    const books = Array.isArray(booksData) 
      ? booksData.map(data => Book.fromResponse(data))
      : [];
    
    return { response, books };
  }

  /**
   * Retrieve only available books
   * @returns {Promise<{books: Book[], response: Response}>}
   */
  async getAvailableBooks() {
    const response = await this.apiClient.get('/livros/disponiveis');
    const booksData = await response.json();
    
    const books = Array.isArray(booksData)
      ? booksData.map(data => Book.fromResponse(data))
      : [];
    
    return { response, books };
  }

  /**
   * Retrieve a specific book by ID
   * @param {number} bookId - Book ID
   * @returns {Promise<{book: Book, response: Response}>}
   */
  async getBookById(bookId) {
    const response = await this.apiClient.get(`/livros/${bookId}`);
    const bookData = await response.json();
    
    return {
      response,
      book: bookData ? Book.fromResponse(bookData) : null
    };
  }

  /**
   * Create a new book
   * @param {object} bookData - Book data { nome, autor, paginas, descricao, imagemUrl, estoque, preco }
   * @returns {Promise<{book: Book, response: Response}>}
   */
  async createBook(bookData) {
    const response = await this.apiClient.post('/livros', bookData);
    const responseBody = await response.json();
    
    return {
      response,
      book: responseBody ? Book.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Update an existing book
   * @param {number} bookId - Book ID
   * @param {object} bookData - Updated book data
   * @returns {Promise<{book: Book, response: Response}>}
   */
  async updateBook(bookId, bookData) {
    const response = await this.apiClient.put(`/livros/${bookId}`, bookData);
    const responseBody = await response.json();
    
    return {
      response,
      book: responseBody ? Book.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Delete a book
   * @param {number} bookId - Book ID
   * @returns {Promise<{response: Response}>}
   */
  async deleteBook(bookId) {
    const response = await this.apiClient.delete(`/livros/${bookId}`);
    const responseBody = await response.json();
    
    return {
      response,
      message: responseBody.mensagem
    };
  }

  /**
   * Create a new book with default values
   * @param {object} overrides - Optional field overrides
   * @returns {object}
   */
  static createDefaultBook(overrides = {}) {
    return {
      nome: 'Código Limpo',
      autor: 'Robert C. Martin',
      paginas: 425,
      descricao: 'Manual de boas práticas',
      imagemUrl: 'https://exemplo.com/imagem.jpg',
      estoque: 10,
      preco: 59.9,
      ...overrides
    };
  }
}
