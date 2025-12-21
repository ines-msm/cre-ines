import { APIClient } from '../clients/APIClient.js';
import { Purchase } from '../objects/APIObjects.js';

/**
 * Purchase Service
 * Handles book purchase operations
 */
export class PurchaseService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Create a new purchase
   * @param {object} purchaseData - Purchase data { usuarioId, livroId, quantidade }
   * @returns {Promise<{purchase: Purchase, response: Response}>}
   */
  async createPurchase(purchaseData) {
    const response = await this.apiClient.post('/compras', purchaseData);
    const responseBody = await response.json();
    
    return {
      response,
      purchase: responseBody ? Purchase.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Get pending purchases
   * @returns {Promise<{purchases: Purchase[], response: Response}>}
   */
  async getPendingPurchases() {
    const response = await this.apiClient.get('/compras?status=PENDENTE');
    const purchasesData = await response.json();
    
    const purchases = Array.isArray(purchasesData)
      ? purchasesData.map(data => Purchase.fromResponse(data))
      : [];
    
    return { response, purchases };
  }

  /**
   * Update purchase status
   * @param {number} purchaseId - Purchase ID
   * @param {string} status - New status (APROVADA, CANCELADA)
   * @returns {Promise<{purchase: Purchase, response: Response}>}
   */
  async updatePurchaseStatus(purchaseId, status) {
    const response = await this.apiClient.put(`/compras/${purchaseId}/status`, {
      status
    });
    const responseBody = await response.json();
    
    return {
      response,
      purchase: responseBody ? Purchase.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Get user's purchases
   * @param {number} userId - User ID
   * @returns {Promise<{purchases: Purchase[], response: Response}>}
   */
  async getUserPurchases(userId) {
    const response = await this.apiClient.get(`/compras/me?usuarioId=${userId}`);
    const purchasesData = await response.json();
    
    const purchases = Array.isArray(purchasesData)
      ? purchasesData.map(data => Purchase.fromResponse(data))
      : [];
    
    return { response, purchases };
  }

  /**
   * Get all purchases
   * @returns {Promise<{purchases: Purchase[], response: Response}>}
   */
  async getAllPurchases() {
    const response = await this.apiClient.get('/compras');
    const purchasesData = await response.json();
    
    const purchases = Array.isArray(purchasesData)
      ? purchasesData.map(data => Purchase.fromResponse(data))
      : [];
    
    return { response, purchases };
  }
}
