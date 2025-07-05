/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'

describe('Add to Cart Tests', () => {
  let loginPage: LoginPage
  let productsPage: ProductsPage
  let cartPage: CartPage
  let testData: any

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    
    // Load test data and login
    cy.fixture('users').then((data) => {
      testData = data
      
      // Login before each test
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
    })
  })

  it('should add single item to cart', () => {
    productsPage.validateCartItemCount(0)
    productsPage.addItemToCart('sauce-labs-backpack')
    productsPage.validateCartItemCount(1)
    productsPage.validateRemoveButtonExists('sauce-labs-backpack')
  })

  it('should add multiple items to cart', () => {
    productsPage.validateCartItemCount(0)
    
    productsPage.addItemToCart('sauce-labs-backpack')
    productsPage.validateCartItemCount(1)
    
    productsPage.addItemToCart('sauce-labs-bike-light')
    productsPage.validateCartItemCount(2)
    
    productsPage.addItemToCart('sauce-labs-bolt-t-shirt')
    productsPage.validateCartItemCount(3)
  })

  it('should remove item from cart', () => {
    productsPage.addItemToCart('sauce-labs-backpack')
    productsPage.validateCartItemCount(1)
    
    productsPage.removeItemFromCart('sauce-labs-backpack')
    productsPage.validateCartItemCount(0)
    productsPage.validateAddToCartButtonExists('sauce-labs-backpack')
  })

  it('should navigate to cart page', () => {
    productsPage.addItemToCart('sauce-labs-backpack')
    productsPage.clickShoppingCart()
    
    cartPage.validateCartPageIsDisplayed()
    cartPage.validateCartItemExists('Sauce Labs Backpack')
  })

  it('should add item from product details page', () => {
    productsPage.getProductByName('Sauce Labs Backpack').click()
    
    // Add to cart from product details (try different possible selectors)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="add-to-cart-sauce-labs-backpack"]').length > 0) {
        cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      } else if ($body.find('[data-test="add-to-cart"]').length > 0) {
        cy.get('[data-test="add-to-cart"]').click()
      } else if ($body.find('.btn_primary.btn_inventory').length > 0) {
        cy.get('.btn_primary.btn_inventory').click()
      } else {
        cy.get('button:contains("Add to cart")').click()
      }
    })
    
    cy.get('[data-test="shopping-cart-badge"]').should('contain.text', '1')
    
    // Navigate back and verify cart count
    cy.get('[data-test="back-to-products"]').click()
    productsPage.validateCartItemCount(1)
  })

  it('should handle adding all items to cart', () => {
    const productIds = [
      'sauce-labs-backpack',
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt',
      'sauce-labs-fleece-jacket',
      'sauce-labs-onesie',
      'test.allthethings()-t-shirt-(red)'
    ]

    productIds.forEach((productId, index) => {
      productsPage.addItemToCart(productId)
      productsPage.validateCartItemCount(index + 1)
    })

    // Navigate to cart and verify all items
    productsPage.clickShoppingCart()
    cartPage.validateCartPageIsDisplayed()
    cartPage.validateCartHasItems()
  })
}) 