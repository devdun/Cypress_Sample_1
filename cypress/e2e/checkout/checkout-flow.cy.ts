/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'

describe('Checkout Flow Tests', () => {
  let loginPage: LoginPage
  let productsPage: ProductsPage
  let cartPage: CartPage
  let checkoutPage: CheckoutPage
  let testData: any

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    checkoutPage = new CheckoutPage()
    
    // Load test data and login
    cy.fixture('users').then((data) => {
      testData = data
      
      // Login and add item to cart
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
    })
  })

  it('should complete checkout with valid information', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Fill checkout information
    checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
    
    // Verify checkout step two
    checkoutPage.validateCheckoutStepTwoIsDisplayed()
    checkoutPage.validateOrderSummary()
    checkoutPage.clickFinish()
    
    // Verify checkout completion
    checkoutPage.validateCheckoutCompleteIsDisplayed()
    checkoutPage.validateOrderCompletionMessage()
  })

  it('should show validation errors for empty checkout information', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Try to continue without filling information
    checkoutPage.clickContinue()
    
    // Verify error message
    checkoutPage.validateErrorMessage('Error: First Name is required')
  })

  it('should show validation errors for missing last name', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Fill only first name
    checkoutPage.enterFirstName('John')
    checkoutPage.clickContinue()
    
    // Verify error message
    checkoutPage.validateErrorMessage('Error: Last Name is required')
  })

  it('should show validation errors for missing postal code', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Fill first and last name only
    checkoutPage.enterFirstName('John')
    checkoutPage.enterLastName('Doe')
    checkoutPage.clickContinue()
    
    // Verify error message
    checkoutPage.validateErrorMessage('Error: Postal Code is required')
  })

  it('should allow canceling checkout from step one', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Cancel checkout
    checkoutPage.clickCancel()
    
    // Verify return to cart
    cartPage.validateCartPageIsDisplayed()
  })

  it('should allow canceling checkout from step two', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Complete step one
    checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
    
    // Cancel from step two
    checkoutPage.validateCheckoutStepTwoIsDisplayed()
    checkoutPage.clickCancel()
    
    // Verify return to cart
    cartPage.validateCartPageIsDisplayed()
  })

  it('should display correct order summary', () => {
    checkoutPage.validateCheckoutStepOneIsDisplayed()
    
    // Complete step one
    checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
    
    // Verify order summary details
    checkoutPage.validateCheckoutStepTwoIsDisplayed()
    checkoutPage.validateOrderSummary()
    checkoutPage.validateTotalCalculation()
  })

  it('should complete checkout with multiple items', () => {
    // Go back to add more items
    checkoutPage.clickCancel()
    cartPage.clickContinueShopping()
    productsPage.addItemToCart('sauce-labs-bike-light')
    productsPage.addItemToCart('sauce-labs-bolt-t-shirt')
    
    // Go back to checkout
    productsPage.clickShoppingCart()
    cartPage.clickCheckout()
    
    // Complete checkout
    checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
    
    // Verify multiple items in summary
    checkoutPage.validateCheckoutStepTwoIsDisplayed()
    checkoutPage.validateOrderSummary()
    checkoutPage.clickFinish()
    
    // Verify completion
    checkoutPage.validateCheckoutCompleteIsDisplayed()
  })

  it('should return to shopping after completing checkout', () => {
    // Complete checkout
    checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
    checkoutPage.clickFinish()
    
    // Verify completion and return to shopping
    checkoutPage.validateCheckoutCompleteIsDisplayed()
    checkoutPage.clickBackHome()
    
    // Verify return to products page
    productsPage.validateProductsPageIsDisplayed()
    productsPage.validateCartItemCount(0) // Cart should be empty after checkout
  })
}) 