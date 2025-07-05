// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom login command
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.get('[data-test="username"]').type(username)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
})

// Custom command to add item to cart
Cypress.Commands.add('addToCart', (itemName: string) => {
  cy.get(`[data-test="add-to-cart-${itemName}"]`).click()
})

// Custom command to navigate to cart
Cypress.Commands.add('goToCart', () => {
  cy.get('[data-test="shopping-cart-link"]').click()
})

// Custom command to complete checkout process
Cypress.Commands.add('completeCheckout', (firstName: string, lastName: string, zipCode: string) => {
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type(firstName)
  cy.get('[data-test="lastName"]').type(lastName)
  cy.get('[data-test="postalCode"]').type(zipCode)
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="finish"]').click()
})

// Custom command to set viewport size
Cypress.Commands.add('setViewportSize', (size: 'mobile' | 'tablet' | 'desktop') => {
  const sizes = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1280, 720]
  }
  
  const [width, height] = sizes[size]
  cy.viewport(width, height)
})

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('#logout_sidebar_link').click()
})

// Type definitions for custom commands
declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable
    addToCart(itemName: string): Chainable
    goToCart(): Chainable
    completeCheckout(firstName: string, lastName: string, zipCode: string): Chainable
    setViewportSize(size: 'mobile' | 'tablet' | 'desktop'): Chainable
    logout(): Chainable
  }
} 