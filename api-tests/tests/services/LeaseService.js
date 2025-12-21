import { APIClient } from '../clients/APIClient.js';
import { Lease } from '../objects/APIObjects.js';

/**
 * Lease Service
 * Handles book lease/rental operations
 */
export class LeaseService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Create a new lease
   * @param {object} leaseData - Lease data { livroId, usuarioId, dataInicio, dataFim }
   * @returns {Promise<{lease: Lease, response: Response}>}
   */
  async createLease(leaseData) {
    const response = await this.apiClient.post('/arrendamentos', leaseData);
    const responseBody = await response.json();
    
    return {
      response,
      lease: responseBody ? Lease.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Get pending leases
   * @returns {Promise<{leases: Lease[], response: Response}>}
   */
  async getPendingLeases() {
    const response = await this.apiClient.get('/arrendamentos?status=PENDENTE');
    const leasesData = await response.json();
    
    const leases = Array.isArray(leasesData)
      ? leasesData.map(data => Lease.fromResponse(data))
      : [];
    
    return { response, leases };
  }

  /**
   * Update lease status
   * @param {number} leaseId - Lease ID
   * @param {string} status - New status (APROVADO, REJEITADO, DEVOLVIDO)
   * @returns {Promise<{lease: Lease, response: Response}>}
   */
  async updateLeaseStatus(leaseId, status) {
    const response = await this.apiClient.put(`/arrendamentos/${leaseId}/status`, {
      status
    });
    const responseBody = await response.json();
    
    return {
      response,
      lease: responseBody ? Lease.fromResponse(responseBody) : null,
      message: responseBody.mensagem
    };
  }

  /**
   * Get user's leases
   * @param {number} userId - User ID
   * @returns {Promise<{leases: Lease[], response: Response}>}
   */
  async getUserLeases(userId) {
    const response = await this.apiClient.get(`/arrendamentos/me?usuarioId=${userId}`);
    const leasesData = await response.json();
    
    const leases = Array.isArray(leasesData)
      ? leasesData.map(data => Lease.fromResponse(data))
      : [];
    
    return { response, leases };
  }
}
