## 📘 Overview

This repository contains the final automation project developed for the Rumos Expert Certification (CRE) – Test Automation Engineer, based on the Library System (CRE version).

The project demonstrates API test automation (REST) and web UI test automation, including integration scenarios, business rule validation, user roles (Student, Staff, Admin), and error handling. The solution is structured with a focus on clean architecture, reusability, and readability, and includes clear documentation and execution reports with test evidence.

## 📌 Stack used

### API Tests
- Playwright
- TypeScript
- Node.js

### UI Tests
- Cypress
- JavaScript
- Node.js

## 📦 Installing dependencies

### Prerequisites
- Node.js (>= 18)
- npm

### API Tests
```bash
# Install dependencies
npm install
# Run tests 
npm run test:api
# View report:
npm run report:api
```

### UI Tests
```bash
# Install dependencies
npm install
npx cypress install
npm install --save-dev cypress-mochawesome-reporter
# Run tests
npm run test:ui:run
# View report
npm run report:ui
```

## 📁 Project Structure

```bash
CRE-INES/
├── api-tests/                # API Testing Suite (Playwright/Node.js)
│   ├── reports/              # HTML execution reports for API tests
│   └── tests/
│       ├── clients/          # API Client configurations (base axios/fetch setup)
│       │   └── APIClient.js
│       ├── objects/          # Data objects and payloads
│       │   └── APIObjects.js
│       ├── services/         # Business logic layer for API endpoints
│       │   ├── AuthService.js
│       │   ├── BookService.js
│       │   └── ... (Favorite, Lease, Purchase, etc.)
│       └── api.spec.js       # Main API test execution file
├── cypress/                  # UI Testing Suite (Cypress)
│   ├── e2e/                  # End-to-End test specifications (.spec.js)
│   │   ├── admin.spec.js
│   │   ├── books.spec.js
│   │   └── login.spec.js
│   ├── fixtures/             # Static data (mock JSON files)
│   │   └── example.json
│   ├── page-objects/         # Page Object Model (POM) classes
│   │   ├── LoginPage.js
│   │   ├── BooksPage.js
│   │   └── ...
│   ├── reports/              # UI test execution reports
│   ├── screenshots/          # Automatically captured on test failure
│   ├── services/             # Specialized UI helper services (Storage, Nav)
│   └── support/              # Global configuration and custom commands
│       ├── commands.js
│       └── e2e.js
├── node_modules/             # Project dependencies
├── cypress.config.cjs        # Cypress configuration file
├── playwright.config.js      # Playwright configuration file
├── package.json              # Scripts and project dependencies
└── README.md                 # Project documentation
```

## ⚙️ Test data configuration

No additional configuration is required.
The tests use mock data / public endpoints.

## 📎 Reference

This project is based on the Library System provided by the course instructor as part of the Rumos Expert Certification (CRE).

Original reference repository:
https://github.com/brunonf15/biblioteca-pro-max.git

## 🤖 AI Support

During the development of the automation tests for this project, AI-assisted tools (e.g., GitHub Copilot, ChatGPT, Google Gemini) were occasionally used to support code suggestions, clarify concepts, and improve documentation. All test implementations and related decisions were authored and reviewed by the candidate.