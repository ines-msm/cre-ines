import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './api-tests/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  /* Tentativas em caso de falha */
  retries: process.env.CI ? 2 : 0,
  
  /* Report HTML guardado na pasta de reports */
  reporter: [['html', { outputFolder: 'reports/api-report', open: 'never' }]],
  
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },

    /* Gravar traces apenas em caso de falha */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      use: { 
      },
    },
  ],
});