const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  },
  reporter: [['html', { outputFolder: '../reports/api-report', open: 'never' }]],
});
