import { APIClient } from '../clients/APIClient.js';
import { Favorite } from '../objects/APIObjects.js';

/**
 * Favorite Service
 * Handles user favorite book management
 */
export class FavoriteService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Add a book to user's favorites
   * @param {number} bookId - Book ID
   * @param {number} userId - User ID
   * @returns {Promise<{response: Response}>}
   */
  async addToFavorites(bookId, userId) {
    const response = await this.apiClient.post('/favoritos', {
      livroId: bookId,
      usuarioId: userId
    });
    const responseBody = await response.json();
    
    return {
      response,
      message: responseBody.mensagem
    };
  }

  /**
   * Get user's favorite books
   * @param {number} userId - User ID
   * @returns {Promise<{favorites: Favorite[], response: Response}>}
   */
  async getUserFavorites(userId) {
    const response = await this.apiClient.get(`/favoritos/${userId}`);
    const favoritesData = await response.json();
    
    const favorites = Array.isArray(favoritesData)
      ? favoritesData.map(data => Favorite.fromResponse(data))
      : [];
    
    return { response, favorites };
  }

  /**
   * Remove a book from user's favorites
   * @param {number} bookId - Book ID
   * @param {number} userId - User ID
   * @returns {Promise<{response: Response}>}
   */
  async removeFromFavorites(bookId, userId) {
    const response = await this.apiClient.delete('/favoritos', {
      livroId: bookId,
      usuarioId: userId
    });
    const responseBody = await response.json();
    
    return {
      response,
      message: responseBody.mensagem
    };
  }
}
