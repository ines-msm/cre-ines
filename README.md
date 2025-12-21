## Overview

This repository contains the final automation project developed for the Rumos Expert Certification (CRE) – Test Automation Engineer, based on the Library System (CRE Version)

The project demonstrates API test automation (REST) and web UI test automation, including integration scenarios, business rule validation, user roles (Student, Staff, Admin), and error handling. The solution is structured with a focus on clean architecture, reusability, and readability, and includes clear documentation and execution reports with test evidence.

Original reference repository:
https://github.com/brunonf15/biblioteca-pro-max.git

## 📌 Stack used

### API Tests
- Playwright
- TypeScript
- Node.js

### UI Tests
- Cypress
- JavaScript
- Node.js

---

## 📦 Installing dependencies

### Prerequisites
- Node.js (>= 18)
- npm

### API Tests
```bash
cd api-tests/tests
# Install dependencies
npm install
# Run tests with temp config:
npx playwright test --config=playwright.local.config.js
# View report:
npx playwright show-report ..\reports\api-report
```
---

No additional configuration is required.
The tests use mock data / public endpoints.