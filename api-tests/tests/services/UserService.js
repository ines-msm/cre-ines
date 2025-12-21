import { APIClient } from '../clients/APIClient.js';
import { User } from '../objects/APIObjects.js';

/**
 * User Service
 * Handles user management operations
 */
export class UserService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Get all users
   * @returns {Promise<{users: User[], response: Response}>}
   */
  async getAllUsers() {
    const response = await this.apiClient.get('/usuarios');
    const usersData = await response.json();
    
    const users = Array.isArray(usersData)
      ? usersData.map(data => User.fromResponse(data))
      : [];
    
    return { response, users };
  }

  /**
   * Update a user
   * @param {number} userId - User ID
   * @param {object} userData - Updated user data { nome, email, tipo }
   * @returns {Promise<{user: User, response: Response}>}
   */
  async updateUser(userId, userData) {
    const response = await this.apiClient.put(`/usuarios/${userId}`, userData);
    const responseBody = await response.json();
    
    return {
      response,
      user: responseBody ? User.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Delete a user
   * @param {number} userId - User ID
   * @returns {Promise<{response: Response}>}
   */
  async deleteUser(userId) {
    const response = await this.apiClient.delete(`/usuarios/${userId}`);
    const responseBody = await response.json();
    
    return {
      response,
      message: responseBody.mensagem
    };
  }
}
