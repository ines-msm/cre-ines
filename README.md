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

## ⚙️ Test data configuration

No additional configuration is required.
The tests use mock data / public endpoints.

## 📎 Reference

This project is based on the Library System provided by the course instructor as part of the Rumos Expert Certification (CRE).

Original reference repository:
https://github.com/brunonf15/biblioteca-pro-max.git

## 🤖 AI Support

During the development of the automation tests for this project, AI-assisted tools (e.g., GitHub Copilot, ChatGPT, Google Gemini) were occasionally used to support code suggestions, clarify concepts, and improve documentation. All test implementations and related decisions were authored and reviewed by the candidate.