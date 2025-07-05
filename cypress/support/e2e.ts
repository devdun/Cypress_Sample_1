// Import commands.ts using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add Cypress global types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with username and password
       * @example cy.login('standard_user', 'secret_sauce')
       */
      login(username: string, password: string): Chainable<Element>
      
      /**
       * Custom command to add item to cart
       * @example cy.addToCart('sauce-labs-backpack')
       */
      addToCart(itemName: string): Chainable<Element>
      
      /**
       * Custom command to navigate to cart
       * @example cy.goToCart()
       */
      goToCart(): Chainable<Element>
      
      /**
       * Custom command to complete checkout process
       * @example cy.completeCheckout('John', 'Doe', '12345')
       */
      completeCheckout(firstName: string, lastName: string, zipCode: string): Chainable<Element>
      
      /**
       * Custom command to set viewport size
       * @example cy.setViewportSize('desktop')
       */
      setViewportSize(size: 'mobile' | 'tablet' | 'desktop'): Chainable<Element>
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<Element>
    }
  }
} 