## 📘 Overview

This repository contains the final automation project developed for the **Rumos Expert Certification (CRE) – Test Automation Engineer**, based on the Library System (CRE version).

The project demonstrates a comprehensive testing strategy covering:
* **API Test Automation (REST):** Validating endpoints, business rules, and integration.
* **Web UI Test Automation:** E2E scenarios including user roles (Student, Staff, Admin) and error handling.
* **Clean Architecture:** Focus on the Page Object Model (POM), Service Layer patterns, and reusability.

## 📌 Stack used

### API Tests
- **Framework:** Playwright
- **Language:** JavaScript/Node.js
- **Reporting:** Playwright HTML Reporter

### UI Tests
- **Framework:** Cypress
- **Language:** JavaScript/Node.js
- **Reporting:** Mochawesome

## 📦 Getting Started

### Prerequisites
- Node.js (>= 18)
- npm

### Installation & Setup

1. **Clone the repository:**
```bash  
git clone https://github.com/ines-msm/cre-ines.git
cd cre-ines
```
2. **Install all dependencies:**
```bash 
npm install
```
3. **Start the local server:**
```bash 
npm start
```

* Web App: http://localhost:3000/login.html
* Swagger UI: http://localhost:3000/api-docs

## 🚀 Running Tests

**API Tests (Playwright)**

```bash
# Run tests 
npm run test:api
# View report
npm run report:api
```

**UI Tests (Cypress)**
```bash
# Open Cypress Test Runner
npx cypress open
# Run tests in headless mode
npm run test:ui:run
# View report
npm run report:ui
```

## 📁 Project Structure

```bash
CRE-INES/
├── api-tests/                # API Testing Suite (Playwright)
│   ├── reports/              # Execution reports
│   └── tests/
│       ├── clients/          # API Client configurations
│       ├── objects/          # Data objects and payloads
│       ├── services/         # Business logic layer (Auth, Book, etc.)
│       └── api.spec.js       # Main test execution
├── cypress/                  # UI Testing Suite (Cypress)
│   ├── e2e/                  # End-to-End test specifications
│   ├── fixtures/             # Static mock data
│   ├── page-objects/         # Page Object Model (POM) classes
│   ├── services/             # UI helper services (Storage, Nav)
│   └── support/              # Global config and custom commands
├── cypress.config.cjs        # Cypress configuration
├── playwright.config.js      # Playwright configuration
├── package.json              # Scripts and dependencies
└── README.md                 # Project documentation
```

## ⚙️ Test Data & Configuration

The project is configured to run against the local environment by default. It uses a combination of dynamic test data and static fixtures located in cypress/fixtures. No external database setup is required as the server handles data in-memory/locally.

## 📎 Reference

This project is part of the Rumos Expert Certification (CRE).

Original reference repository:
https://github.com/brunonf15/biblioteca-pro-max.git

## 🤖 AI Support

AI-assisted tools (GitHub Copilot, ChatGPT) were used during development for code optimization, concept clarification, and documentation enhancement. All final implementations were reviewed and verified by the author.