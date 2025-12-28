const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/ui-report',
    overwrite: true,
    html: true,
    json: false,
    embeddedScreenshots: true,
    inlineAssets: true,
    reportPageTitle: 'Relatório de Testes UI - Biblioteca',
  },

  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.spec.{js,ts}',
    experimentalRunAllSpecs: true,
    video: false, 
    screenshotOnRunFailure: true
  }
});