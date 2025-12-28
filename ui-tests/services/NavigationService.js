export class NavigationService {
  navigateTo(path) {
    cy.visit(path, { failOnStatusCode: false });
    return this;
  }

  verifyCurrentPage(path) {
    // Adding a slight timeout to allow for redirects to finish
    cy.url().should('include', path);
    return this;
  }

  /**
   * Clicks a menu item reliably
   */
  clickMenuItem(label) {
    // Ensures the menu exists and find the specific text
    cy.get('#nav-menu', { timeout: 10000 })
      .should('be.visible')
      .contains(label)
      .click({ force: true }); // force: true helps if the menu is partially covered
    return this;
  }
}