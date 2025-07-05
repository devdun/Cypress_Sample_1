# E2E Test Organization

This directory contains end-to-end tests organized by functionality and user journey for better maintainability and scalability.

## Folder Structure

```
cypress/e2e/
├── auth/                    # Authentication and user management tests
│   ├── login.cy.ts         # Login functionality and validation
│   └── user-roles.cy.ts    # Special user behaviors (problem, error, performance users)
├── products/               # Product-related functionality tests
│   ├── product-display.cy.ts  # Product listing and detail view tests
│   └── product-sorting.cy.ts  # Product sorting and filtering tests
├── cart/                   # Shopping cart functionality tests
│   ├── add-to-cart.cy.ts   # Adding items to cart
│   └── cart-management.cy.ts  # Cart operations (remove, update, navigation)
├── checkout/               # Checkout process tests
│   └── checkout-flow.cy.ts # Complete checkout process and validation
├── workflows/              # Complete user journey tests
│   ├── complete-flow.cy.ts # End-to-end shopping workflows
│   └── navigation.cy.ts    # Navigation and menu interactions
└── mock-data/              # Mock data and API testing
    └── mock-examples.cy.ts # Mock data integration examples
```

## Test Categories

### Authentication Tests (`auth/`)
- **login.cy.ts**: Login functionality, validation, error handling
- **user-roles.cy.ts**: Special user behaviors:
  - Problem user (image issues)
  - Error user (cart/sorting issues)
  - Performance glitch user (slow operations)
  - Visual user (UI testing)

### Product Tests (`products/`)
- **product-display.cy.ts**: Product listing, details, navigation
- **product-sorting.cy.ts**: Sorting by name/price, maintaining sort state

### Cart Tests (`cart/`)
- **add-to-cart.cy.ts**: Adding items from various pages
- **cart-management.cy.ts**: Cart operations, state management

### Checkout Tests (`checkout/`)
- **checkout-flow.cy.ts**: Complete checkout process, validation, error handling

### Workflow Tests (`workflows/`)
- **complete-flow.cy.ts**: End-to-end user journeys
- **navigation.cy.ts**: Menu navigation, URL handling, browser controls

### Mock Data Tests (`mock-data/`)
- **mock-examples.cy.ts**: API mocking, network simulation, fixture integration

## Running Tests

### By Category
```bash
# Run all auth tests
npm run test:auth

# Run all product tests
npm run test:products

# Run all cart tests
npm run test:cart

# Run all checkout tests
npm run test:checkout

# Run all workflow tests
npm run test:workflows

# Run all mock data tests
npm run test:mock-data
```

### By Browser
```bash
# Run specific category in Chrome
npx cypress run --spec "cypress/e2e/auth/**/*.cy.ts" --browser chrome

# Run specific category in Firefox
npx cypress run --spec "cypress/e2e/products/**/*.cy.ts" --browser firefox
```

### Visual Testing
```bash
# Run with GUI for debugging
npx cypress open --e2e
```

## Test Organization Benefits

1. **Maintainability**: Related tests are grouped together
2. **Scalability**: Easy to add new test categories
3. **Parallel Execution**: Can run different categories in parallel
4. **Focused Testing**: Run only relevant tests for specific features
5. **Clear Ownership**: Teams can own specific test categories
6. **Debugging**: Easier to locate and fix failing tests

## Writing New Tests

When adding new tests:

1. **Identify the category**: Choose the most appropriate folder
2. **Follow naming conventions**: Use descriptive file names ending in `.cy.ts`
3. **Group related tests**: Use `describe()` blocks for logical grouping
4. **Use appropriate imports**: Import only needed page objects
5. **Add documentation**: Update this README when adding new categories

## Best Practices

1. **Single Responsibility**: Each test file should focus on one area
2. **Independent Tests**: Tests should not depend on each other
3. **Descriptive Names**: Use clear, descriptive test names
4. **Page Object Model**: Use page objects for element interactions
5. **Data-driven Testing**: Use fixtures for test data
6. **Error Handling**: Include negative test cases
7. **Cross-browser Testing**: Ensure tests work in multiple browsers

## Integration with CI/CD

This structure supports various CI/CD strategies:

- **Feature-based**: Run tests related to changed features
- **Parallel execution**: Run different categories in parallel
- **Smoke testing**: Run critical workflow tests first
- **Full regression**: Run all tests before releases 