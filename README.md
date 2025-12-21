# QA Automation Final Project

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
Install deps (if needed):
npm install
Run tests with temp config:
npx playwright test --config=playwright.local.config.js
View report:
npx playwright show-report ..\reports\api-report
```
---

No additional configuration is required.
The tests use mock data / public endpoints.