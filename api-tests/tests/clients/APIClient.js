/**
 * Base APIClient class for making HTTP requests
 * Encapsulates all API communication logic
 */
export class APIClient {
  constructor(request) {
    this.request = request;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<APIResponse>}
   */
  async get(endpoint) {
    return this.request.get(endpoint);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request payload
   * @returns {Promise<APIResponse>}
   */
  async post(endpoint, data) {
    return this.request.post(endpoint, { data });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request payload
   * @returns {Promise<APIResponse>}
   */
  async put(endpoint, data) {
    return this.request.put(endpoint, { data });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Optional request payload
   * @returns {Promise<APIResponse>}
   */
  async delete(endpoint, data = null) {
    if (data) {
      return this.request.delete(endpoint, { data });
    }
    return this.request.delete(endpoint);
  }
}
