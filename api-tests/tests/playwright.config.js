const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    // Base URL for all `request` calls and `page.goto` when using relative paths
    baseURL: 'http://localhost:3000',
    // Send JSON by default for API requests
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  },
  reporter: [['html', { outputFolder: '../reports/api-report', open: 'never' }]],

});
