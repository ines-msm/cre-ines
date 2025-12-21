import { APIClient } from '../clients/APIClient.js';
import { LibraryStatistics } from '../objects/APIObjects.js';

/**
 * Statistics Service
 * Handles library statistics and reporting
 */
export class StatisticsService {
  constructor(request) {
    this.apiClient = new APIClient(request);
  }

  /**
   * Get library statistics
   * @returns {Promise<{statistics: LibraryStatistics, response: Response}>}
   */
  async getLibraryStatistics() {
    const response = await this.apiClient.get('/estatisticas');
    const statsData = await response.json();
    
    return {
      response,
      statistics: statsData ? LibraryStatistics.fromResponse(statsData) : null
    };
  }
}
