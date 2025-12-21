import { APIClient } from '../clients/APIClient.js';
import { User } from '../objects/APIObjects.js';

/**
 * Authentication Service
 * Handles user registration and login operations
 */
export class AuthService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Register a new user
   * @param {object} userData - User data { nome, email, senha, tipo }
   * @returns {Promise<{user: User, response: Response}>}
   */
  async register(userData) {
    const response = await this.apiClient.post('/registro', userData);
    const responseBody = await response.json();
    
    return {
      response,
      user: responseBody.usuario ? User.fromResponse(responseBody.usuario) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} senha - User password
   * @returns {Promise<{user: User, response: Response}>}
   */
  async login(email, senha) {
    const response = await this.apiClient.post('/login', { email, senha });
    const responseBody = await response.json();
    
    return {
      response,
      user: responseBody.usuario ? User.fromResponse(responseBody.usuario) : null,
      message: responseBody.mensagem
    };
  }
}
