# E-commerce Test Automation Framework

A comprehensive, production-grade test automation framework covering **UI end-to-end** and **REST API** testing for an e-commerce application. Built with WebdriverIO v9 + Cucumber BDD + TypeScript, following the Page Object Model pattern and integrated with a full CI/CD pipeline.

---

## Live Demo

| Resource | Link |
|---|---|
| GitHub Repository | https://github.com/phuocnguyen0996/wdio-ecommerce-automation |
| Allure Test Report | https://phuocnguyen0996.github.io/wdio-ecommerce-automation/ |

The live Allure report includes step-by-step execution details, failure screenshots, and video recordings for every test run.

---

## What This Framework Tests

### UI Tests — SauceDemo (saucedemo.com)

| Feature | Scenario | Tags |
|---|---|---|
| Login | Valid login with standard user | `@smoke @e2e` |
| Login | Invalid credentials shows error message | `@negative` |
| Login | Locked-out user is blocked with message | `@negative` |
| Login | Data-driven login via Scenario Outline | `@smoke` |
| Login | Performance glitch user still logs in | `@smoke` |
| Login | Parallel execution across multiple sessions | `@smoke` |
| Sort | Sort products by Name Z to A | `@smoke @sort` |
| Sort | Sort products by Price low to high (ascending) | `@sort` |
| Cart | Add 2 products — cart badge shows correct count | `@smoke @cart` |
| Cart | Remove product from cart — cart becomes empty | `@cart` |
| Cart | Continue shopping from cart — returns to inventory | `@cart` |
| E2E | Full checkout flow: login → add → checkout → confirm | `@e2e` |

### API Tests — DummyJSON (dummyjson.com)

| Scenario | Method | Endpoint | Tags |
|---|---|---|---|
| Get all products | GET | `/products` | `@smoke` |
| Get products with limit | GET | `/products?limit=5&skip=0` | `@api` |
| Get single product by ID | GET | `/products/1` | `@smoke` |
| Get non-existent product (404) | GET | `/products/99999` | `@negative` |
| Get all categories | GET | `/products/categories` | `@api` |
| Filter products by category | GET | `/products/category/smartphones` | `@api` |
| Create a new product | POST | `/products/add` | `@api` |
| Update an existing product | PUT | `/products/1` | `@api` |
| Delete a product | DELETE | `/products/1` | `@api` |
| Authenticate and get access token | POST | `/auth/login` | `@smoke` |

---

## Framework Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Test Entry Points                    │
│          Feature Files (Gherkin BDD Scenarios)          │
│    features/*.feature       features/api/*.feature      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Step Definitions                       │
│   login.steps.ts  │  inventory.steps.ts  │ api.steps.ts │
└────────────────────┬────────────────────────────────────┘
                     │
       ┌─────────────▼──────────────┐
       │                            │
┌──────▼──────┐             ┌───────▼──────┐
│  Page Layer │             │  API Client  │
│  BasePage   │             │  api-client  │
│  LoginPage  │             │  (axios)     │
│  Inventory  │             └──────────────┘
│  CartPage   │
│  Checkout   │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│                   Shared Utilities                      │
│    constants.ts (selectors)   │   .env (credentials)    │
└─────────────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│                 WDIO Configuration                      │
│   wdio.conf.ts (UI: Chrome + Firefox, maxInstances:10)  │
│   wdio.api.conf.ts (API: headless Chrome, no browser)   │
└─────────────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│               Reporting & CI/CD                         │
│   Allure Reporter + Screenshots + Video recordings      │
│   GitHub Actions → GitHub Pages (auto-publish)          │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [WebdriverIO](https://webdriver.io/) | v9 | Browser automation & test runner |
| [Cucumber](https://cucumber.io/) | v9 | BDD framework (Gherkin syntax) |
| TypeScript | strict mode | Type safety across all layers |
| [Allure Reporter](https://allurereport.org/) | v2 | Rich HTML test reporting |
| [wdio-video-reporter](https://github.com/presidenten/wdio-video-reporter) | v6 | Video recording of test sessions |
| [axios](https://axios-http.com/) | v1 | HTTP client for API testing |
| [dotenv](https://github.com/motdotla/dotenv) | v16 | Environment variable management |
| GitHub Actions | — | CI/CD pipeline |
| GitHub Pages | — | Live report hosting |

---

## Project Structure

```
wdio-ecommerce-automation/
├── features/
│   ├── api/
│   │   └── products.feature        # 10 API test scenarios
│   ├── pageobjects/
│   │   ├── base.page.ts            # Shared browser utilities (wait, click, setValue)
│   │   ├── login.page.ts           # Login page interactions
│   │   ├── inventory.page.ts       # Product listing, sorting, cart badge
│   │   ├── cart.page.ts            # Cart management (remove, continue shopping)
│   │   └── checkout.page.ts        # Checkout flow interactions
│   ├── step-definitions/
│   │   ├── login.steps.ts          # Login-related step implementations
│   │   ├── inventory.steps.ts      # Sort, cart, and navigation steps
│   │   └── api.steps.ts            # REST API step implementations
│   ├── cart.feature                # Cart management scenarios
│   ├── e2e.feature                 # End-to-end purchase flow
│   ├── login.feature               # Login positive/negative scenarios
│   ├── login-paralle.feature       # Parallel execution demonstration
│   └── sort.feature                # Product sort scenarios
├── utility/
│   ├── constants.ts                # All CSS selectors and URLs centralized
│   └── api-client.ts              # axios wrapper for API testing
├── .github/
│   └── workflows/                  # GitHub Actions CI/CD configuration
├── wdio.conf.ts                    # UI test config (Chrome + Firefox, parallel)
├── wdio.api.conf.ts               # API test config (headless, no browser)
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Chrome and Firefox installed locally (for UI tests)

### Install

```bash
npm install
```

### Environment variables (optional)

Copy `.env.example` to `.env` if you need to override defaults (base URLs, credentials).

---

## Running Tests

### Run all UI tests (Chrome + Firefox, with Allure report)

```bash
npm run test:ui
```

### Run all API tests (with Allure report)

```bash
npm run test:api
```

### Run UI + API together

```bash
npm run test:all
```

### Run smoke tests only (fast feedback)

```bash
npm run wdio:smoke
```

### Run API smoke tests only

```bash
npm run test:api:smoke
```

### Run a specific feature file

```bash
SPECT='./features/cart.feature' npm run wdio
```

### Run tests by tag expression

```bash
TAGS='@smoke and not @negative' npm run wdio
```

### View Allure report after a run

```bash
npm run allure:report
```

### Debug mode (verbose logging)

```bash
npm run wdio:debug
```

---

## CI/CD Pipeline

Every push to the repository triggers the GitHub Actions workflow:

1. **Install** — `npm ci` installs locked dependencies
2. **Test** — runs `@smoke` and `@e2e` tagged scenarios across Chrome (headless) and Firefox (headless) in parallel
3. **Report** — generates Allure HTML report from results
4. **Publish** — deploys report to GitHub Pages automatically

The live report at https://phuocnguyen0996.github.io/wdio-ecommerce-automation/ always reflects the latest CI run.

---

## Key Engineering Decisions

**Separate configs for UI and API tests**
`wdio.conf.ts` runs real browsers with video/screenshot reporters. `wdio.api.conf.ts` uses headless Chrome with a 30-second timeout and no video overhead — API calls don't need a visible browser.

**Page Object Model with BasePage inheritance**
All page classes extend `BasePage`, which centralizes `waitAndClick`, `waitAndSetValue`, and `isElementDisplayed`. Common wait logic lives in one place, not scattered across step definitions.

**All selectors in `constants.ts`**
No selector strings in step definitions or page methods. When the UI changes, only `constants.ts` needs updating — not every file that references an element.

**`data-test` attribute selectors**
Selectors like `[data-test="add-to-cart-sauce-labs-backpack"]` are stable against CSS refactors. They survive class renames, layout changes, and framework migrations.

**Feature file separation for browser isolation**
`sort.feature` and `cart.feature` are separate files so each runs in its own browser session. This prevents state from one scenario leaking into another via shared React/localStorage state — a real issue discovered and solved during development.

**Tag-based test filtering**
Tests carry meaningful tags (`@smoke`, `@e2e`, `@ui`, `@api`, `@negative`, `@cart`, `@sort`). CI runs only `@smoke` for fast feedback; full regression is available via `test:all`.

**Axios `validateStatus: () => true`**
The API client never throws on HTTP error codes (4xx, 5xx). This allows negative test scenarios to assert on 404/401 responses without try/catch wrapping every test step.

---

## Author

**Phuoc Nguyen** — Automation Test Engineer

- GitHub: https://github.com/phuocnguyen0996
- Email: quangphuoc170996@gmail.com
