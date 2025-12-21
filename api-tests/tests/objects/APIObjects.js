/**
 * User Model/DTO
 * Represents a user in the system
 */
export class User {
  constructor(data = {}) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.tipo = data.tipo; // 1 = Aluno, 2 = Funcionário, 3 = Admin
    this.dataCadastro = data.dataCadastro;
  }

  /**
   * Create a User instance from API response
   * @param {object} data - Raw API response data
   * @returns {User}
   */
  static fromResponse(data) {
    return new User(data);
  }

  /**
   * Get user type label
   * @returns {string}
   */
  getTypeName() {
    const types = { 1: 'Aluno', 2: 'Funcionário', 3: 'Admin' };
    return types[this.tipo] || 'Desconhecido';
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.tipo === 3;
  }
}

/**
 * Book Model/DTO
 * Represents a book in the library
 */
export class Book {
  constructor(data = {}) {
    this.id = data.id;
    this.nome = data.nome;
    this.autor = data.autor;
    this.paginas = data.paginas;
    this.descricao = data.descricao;
    this.imagemUrl = data.imagemUrl;
    this.estoque = data.estoque;
    this.preco = data.preco;
    this.dataCadastro = data.dataCadastro;
    this.disponivel = data.disponivel;
  }

  /**
   * Create a Book instance from API response
   * @param {object} data - Raw API response data
   * @returns {Book}
   */
  static fromResponse(data) {
    return new Book(data);
  }

  /**
   * Check if book is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.estoque > 0;
  }

  /**
   * Get availability status
   * @returns {string}
   */
  getAvailabilityStatus() {
    return this.estoque > 0 ? `${this.estoque} disponível(is)` : 'Fora de estoque';
  }
}

/**
 * Lease Model/DTO
 * Represents a book lease/rental
 */
export class Lease {
  constructor(data = {}) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.livroId = data.livroId;
    this.dataInicio = data.dataInicio;
    this.dataFim = data.dataFim;
    this.status = data.status; // PENDENTE, APROVADO, REJEITADO, DEVOLVIDO
    this.criadoEm = data.criadoEm;
  }

  /**
   * Create a Lease instance from API response
   * @param {object} data - Raw API response data
   * @returns {Lease}
   */
  static fromResponse(data) {
    return new Lease(data);
  }

  /**
   * Check if lease is pending approval
   * @returns {boolean}
   */
  isPending() {
    return this.status === 'PENDENTE';
  }

  /**
   * Check if lease is approved
   * @returns {boolean}
   */
  isApproved() {
    return this.status === 'APROVADO';
  }
}

/**
 * Purchase Model/DTO
 * Represents a book purchase
 */
export class Purchase {
  constructor(data = {}) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.livroId = data.livroId;
    this.quantidade = data.quantidade;
    this.total = data.total;
    this.status = data.status; // PENDENTE, APROVADA, CANCELADA
    this.criadoEm = data.criadoEm;
  }

  /**
   * Create a Purchase instance from API response
   * @param {object} data - Raw API response data
   * @returns {Purchase}
   */
  static fromResponse(data) {
    return new Purchase(data);
  }

  /**
   * Check if purchase is pending approval
   * @returns {boolean}
   */
  isPending() {
    return this.status === 'PENDENTE';
  }

  /**
   * Check if purchase is approved
   * @returns {boolean}
   */
  isApproved() {
    return this.status === 'APROVADA';
  }

  /**
   * Check if purchase is cancelled
   * @returns {boolean}
   */
  isCancelled() {
    return this.status === 'CANCELADA';
  }
}

/**
 * LibraryStatistics Model/DTO
 * Represents statistics about the library
 */
export class LibraryStatistics {
  constructor(data = {}) {
    this.totalLivros = data.totalLivros;
    this.totalPaginas = data.totalPaginas;
    this.totalUsuarios = data.totalUsuarios;
    this.usuariosPorTipo = data.usuariosPorTipo || {};
    this.livrosDisponiveis = data.livrosDisponiveis;
    this.arrendamentosPendentes = data.arrendamentosPendentes;
    this.comprasPendentes = data.comprasPendentes;
  }

  /**
   * Create a LibraryStatistics instance from API response
   * @param {object} data - Raw API response data
   * @returns {LibraryStatistics}
   */
  static fromResponse(data) {
    return new LibraryStatistics(data);
  }

  /**
   * Verify that user counts match total
   * @returns {boolean}
   */
  areUserCountsValid() {
    const calculated =
      (this.usuariosPorTipo.alunos || 0) +
      (this.usuariosPorTipo.funcionarios || 0) +
      (this.usuariosPorTipo.admins || 0);
    return this.totalUsuarios === calculated;
  }
}

/**
 * Favorite Model/DTO
 * Represents a user's favorite book
 */
export class Favorite {
  constructor(data = {}) {
    this.id = data.id;
    this.usuarioId = data.usuarioId;
    this.livroId = data.livroId;
    this.criadoEm = data.criadoEm;
  }

  /**
   * Create a Favorite instance from API response
   * @param {object} data - Raw API response data
   * @returns {Favorite}
   */
  static fromResponse(data) {
    return new Favorite(data);
  }
}
