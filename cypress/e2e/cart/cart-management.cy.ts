/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'

describe('Cart Management Tests', () => {
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

  it('should display empty cart message when cart is empty', () => {
    cartPage.visit()
    cartPage.validateCartPageIsDisplayed()
    cartPage.validateCartIsEmpty()
  })

  it('should remove items from cart page', () => {
    // Add items to cart
    productsPage.addItemToCart('sauce-labs-backpack')
    productsPage.addItemToCart('sauce-labs-bike-light')
    productsPage.validateCartItemCount(2)
    
    // Navigate to cart
    cartPage.visit()
    cartPage.validateCartHasItems()
    
    // Remove one item
    cartPage.removeItemFromCart('Sauce Labs Backpack')
    cartPage.validateCartItemCount(1)
    
    // Remove second item
    cartPage.removeItemFromCart('Sauce Labs Bike Light')
    cartPage.validateCartItemCount(0)
    cartPage.validateCartIsEmpty()
  })

  it('should continue shopping from cart page', () => {
    // Add item and go to cart
    productsPage.addItemToCart('sauce-labs-backpack')
    cartPage.visit()
    cartPage.validateCartPageIsDisplayed()
    
    // Continue shopping
    cartPage.clickContinueShopping()
    productsPage.validateProductsPageIsDisplayed()
  })

  it('should proceed to checkout from cart', () => {
    // Add item and go to cart
    productsPage.addItemToCart('sauce-labs-backpack')
    cartPage.visit()
    cartPage.validateCartPageIsDisplayed()
    
    // Proceed to checkout
    cartPage.clickCheckout()
    cy.url().should('include', '/checkout-step-one.html')
  })

  it('should display correct item information in cart', () => {
    // Add specific item
    productsPage.addItemToCart('sauce-labs-backpack')
    cartPage.visit()
    
    // Verify item details
    cartPage.validateCartItemExists('Sauce Labs Backpack')
    cartPage.validateCartItemQuantity('Sauce Labs Backpack', 1)
    cartPage.validateRemoveButtonExists('Sauce Labs Backpack')
  })

  it('should maintain cart contents across page navigation', () => {
    // Add items to cart
    productsPage.addItemToCart('sauce-labs-backpack')
    productsPage.addItemToCart('sauce-labs-bike-light')
    productsPage.validateCartItemCount(2)
    
    // Navigate to cart and back
    cartPage.visit()
    cartPage.validateCartHasItems()
    cartPage.clickContinueShopping()
    
    // Verify cart count is maintained
    productsPage.validateCartItemCount(2)
    
    // Navigate back to cart
    cartPage.visit()
    cartPage.validateCartItemExists('Sauce Labs Backpack')
    cartPage.validateCartItemExists('Sauce Labs Bike Light')
  })

  it('should handle cart with maximum items', () => {
    const productIds = [
      'sauce-labs-backpack',
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt',
      'sauce-labs-fleece-jacket',
      'sauce-labs-onesie',
      'test.allthethings()-t-shirt-(red)'
    ]

    // Add all items
    productIds.forEach((productId) => {
      productsPage.addItemToCart(productId)
    })

    // Navigate to cart and verify all items
    cartPage.visit()
    cartPage.validateCartHasItems()
    cartPage.getAllCartItems().should('have.length', 6)
  })
}) 