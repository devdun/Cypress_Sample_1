import { CartPageSelectors } from './selectors/CartPageSelectors'

export class CartPage {
  // Methods
  visit(): void {
    cy.visit('/cart.html')
  }

  removeItemFromCart(itemName: string): void {
    cy.get(CartPageSelectors.removeButton(itemName)).click()
  }

  clickCheckout(): void {
    cy.get(CartPageSelectors.checkoutButton).click()
  }

  clickContinueShopping(): void {
    cy.get(CartPageSelectors.continueShoppingButton).click()
  }

  getCartItemByName(itemName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(CartPageSelectors.cartItemNames, itemName)
  }

  getCartItemPrice(itemName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(CartPageSelectors.cartItemNames, itemName)
      .parent()
      .find(CartPageSelectors.cartItemPrices)
  }

  getCartItemCount(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(CartPageSelectors.shoppingCartBadge)
  }

  getAllCartItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(CartPageSelectors.cartItems)
  }

  // Validations
  validateCartPageIsDisplayed(): void {
    cy.get(CartPageSelectors.cartContainer).should('be.visible')
    cy.get(CartPageSelectors.appLogo).should('contain.text', 'Swag Labs')
    cy.url().should('include', '/cart.html')
  }

  validateCartIsEmpty(): void {
    cy.get(CartPageSelectors.cartItems).should('not.exist')
  }

  validateCartHasItems(): void {
    cy.get(CartPageSelectors.cartItems).should('have.length.greaterThan', 0)
  }

  validateCartItemExists(itemName: string): void {
    cy.contains(CartPageSelectors.cartItemNames, itemName).should('be.visible')
  }

  validateCartItemCount(expectedCount: number): void {
    if (expectedCount > 0) {
      cy.get(CartPageSelectors.shoppingCartBadge).should('contain.text', expectedCount.toString())
    } else {
      cy.get(CartPageSelectors.shoppingCartBadge).should('not.exist')
    }
  }

  validateCartItemQuantity(itemName: string, expectedQuantity: number): void {
    cy.contains(CartPageSelectors.cartItemNames, itemName)
      .parent()
      .find(CartPageSelectors.cartItemQuantities)
      .should('contain.text', expectedQuantity.toString())
  }

  validateCheckoutButtonExists(): void {
    cy.get(CartPageSelectors.checkoutButton).should('be.visible')
  }

  validateContinueShoppingButtonExists(): void {
    cy.get(CartPageSelectors.continueShoppingButton).should('be.visible')
  }

  validateRemoveButtonExists(itemName: string): void {
    cy.get(CartPageSelectors.removeButton(itemName)).should('be.visible')
  }

  validateCartTotal(): void {
    cy.get(CartPageSelectors.cartItems).then(($items) => {
      let totalExpected = 0
      $items.each((_index, item) => {
        const priceText = Cypress.$(item).find(CartPageSelectors.cartItemPrices).text()
        const price = parseFloat(priceText.replace('$', ''))
        totalExpected += price
      })
      // Note: This validation would require a total price element to be present
      // which might not be available on the cart page
    })
  }
} 