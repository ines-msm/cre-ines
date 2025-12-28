/**
 * LocalStorageService - Service for managing browser localStorage in tests
 * Encapsulates localStorage operations
 */
export class LocalStorageService {
  constructor(cy) {
    this.cy = cy;
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {Promise<string>}
   */
  getItem(key) {
    return this.cy.window().its('localStorage').invoke('getItem', key);
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {string} value - Storage value
   */
  setItem(key, value) {
    this.cy.window().then((win) => {
      win.localStorage.setItem(key, value);
    });
    return this;
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    this.cy.window().then((win) => {
      win.localStorage.removeItem(key);
    });
    return this;
  }

  /**
   * Clear all localStorage
   */
  clear() {
    this.cy.window().then((win) => {
      win.localStorage.clear();
    });
    return this;
  }

  /**
   * Verify user data exists in localStorage
   */
  verifyUserExists() {
    this.getItem('usuario').should('not.be.null');
    return this;
  }

  /**
   * Get user object from localStorage
   * @returns {Promise<object>}
   */
  getUser() {
    return this.cy.window().then((win) => {
      const user = win.localStorage.getItem('usuario');
      return user ? JSON.parse(user) : null;
    });
  }
}
