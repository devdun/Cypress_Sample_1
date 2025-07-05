import { ProductsPageSelectors } from './selectors/ProductsPageSelectors'

export class ProductsPage {
  // Methods
  visit(): void {
    cy.visit('/inventory.html')
  }

  addItemToCart(itemName: string): void {
    cy.get(ProductsPageSelectors.addToCartButton(itemName)).click()
  }

  removeItemFromCart(itemName: string): void {
    cy.get(ProductsPageSelectors.removeButton(itemName)).click()
  }

  clickShoppingCart(): void {
    cy.get(ProductsPageSelectors.shoppingCartLink).click()
  }

  sortProducts(sortOption: string): void {
    cy.get(ProductsPageSelectors.sortDropdown).select(sortOption)
  }

  openMenu(): void {
    cy.get(ProductsPageSelectors.menuButton).click()
  }

  logout(): void {
    this.openMenu()
    cy.get(ProductsPageSelectors.logoutLink).click()
  }

  getProductByName(productName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(ProductsPageSelectors.productNames, productName)
  }

  getProductPrice(productName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(ProductsPageSelectors.productNames, productName)
      .parent()
      .find(ProductsPageSelectors.productPrices)
  }

  getCartItemCount(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(ProductsPageSelectors.shoppingCartBadge)
  }

  // Validations
  validateProductsPageIsDisplayed(): void {
    cy.get(ProductsPageSelectors.productsContainer).should('be.visible')
    cy.get(ProductsPageSelectors.productsList).should('be.visible')
    cy.get(ProductsPageSelectors.appLogo).should('contain.text', 'Swag Labs')
  }

  validateProductsAreDisplayed(): void {
    cy.get(ProductsPageSelectors.productItems).should('have.length.greaterThan', 0)
  }

  validateProductExists(productName: string): void {
    cy.contains(ProductsPageSelectors.productNames, productName).should('be.visible')
  }

  validateCartItemCount(expectedCount: number): void {
    if (expectedCount > 0) {
      cy.get(ProductsPageSelectors.shoppingCartBadge).should('contain.text', expectedCount.toString())
    } else {
      cy.get(ProductsPageSelectors.shoppingCartBadge).should('not.exist')
    }
  }

  validateAddToCartButtonExists(itemName: string): void {
    cy.get(ProductsPageSelectors.addToCartButton(itemName)).should('be.visible')
  }

  validateRemoveButtonExists(itemName: string): void {
    cy.get(ProductsPageSelectors.removeButton(itemName)).should('be.visible')
  }

  validateSortDropdownExists(): void {
    cy.get(ProductsPageSelectors.sortDropdown).should('be.visible')
  }

  validateProductsSortedByName(order: 'asc' | 'desc' = 'asc'): void {
    cy.get(ProductsPageSelectors.productNames).then(($products) => {
      const productNames = Array.from($products, (el) => el.innerText)
      const sortedNames = [...productNames].sort()
      if (order === 'desc') {
        sortedNames.reverse()
      }
      expect(productNames).to.deep.equal(sortedNames)
    })
  }

  validateProductsSortedByPrice(order: 'asc' | 'desc' = 'asc'): void {
    cy.get(ProductsPageSelectors.productPrices).then(($prices) => {
      const prices = Array.from($prices, (el) => parseFloat(el.innerText.replace('$', '')))
      const sortedPrices = [...prices].sort((a, b) => order === 'asc' ? a - b : b - a)
      expect(prices).to.deep.equal(sortedPrices)
    })
  }
} 