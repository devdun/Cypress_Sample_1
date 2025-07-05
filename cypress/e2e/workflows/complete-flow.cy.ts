/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'

describe('End-to-End Shopping Flow', () => {
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
  })
  
  before(() => {
    // Load test data once before all tests
    cy.fixture('users').then((data) => {
      testData = data
    })
  })

  describe('Complete Shopping Journey', () => {
    it('should complete full shopping flow from login to order completion', () => {
      // Step 1: Login
      loginPage.visit()
      loginPage.validateLoginPageIsDisplayed()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      // Step 2: Browse products
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
      
      // Step 3: Add multiple items to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
      
      productsPage.addItemToCart('sauce-labs-bike-light')
      productsPage.validateCartItemCount(2)
      
      productsPage.addItemToCart('sauce-labs-bolt-t-shirt')
      productsPage.validateCartItemCount(3)
      
      // Step 4: Navigate to cart
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      cartPage.validateCartHasItems()
      
      // Step 5: Verify cart contents
      cartPage.validateCartItemExists('Sauce Labs Backpack')
      cartPage.validateCartItemExists('Sauce Labs Bike Light')
      cartPage.validateCartItemExists('Sauce Labs Bolt T-Shirt')
      
      // Step 6: Proceed to checkout
      cartPage.clickCheckout()
      checkoutPage.validateCheckoutStepOneIsDisplayed()
      
      // Step 7: Fill checkout information
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      
      // Step 8: Review order
      checkoutPage.validateCheckoutStepTwoIsDisplayed()
      checkoutPage.validateOrderSummary()
      checkoutPage.validateCartItemInSummary('Sauce Labs Backpack')
      checkoutPage.validateCartItemInSummary('Sauce Labs Bike Light')
      checkoutPage.validateCartItemInSummary('Sauce Labs Bolt T-Shirt')
      
      // Step 9: Complete order
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
      checkoutPage.validateOrderCompletionMessage()
      checkoutPage.validatePonyExpressImage()
      
      // Step 10: Return to products
      checkoutPage.clickBackHome()
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateCartItemCount(0)
    })

    it('should handle cart modifications during shopping flow', () => {
      // Login
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      // Add items to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.addItemToCart('sauce-labs-bike-light')
      productsPage.addItemToCart('sauce-labs-bolt-t-shirt')
      productsPage.validateCartItemCount(3)
      
      // Go to cart and remove an item
      productsPage.clickShoppingCart()
      cartPage.validateCartHasItems()
      cartPage.removeItemFromCart('sauce-labs-bike-light')
      cartPage.validateCartItemCount(2)
      
      // Continue shopping
      cartPage.clickContinueShopping()
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateCartItemCount(2)
      
      // Add another item
      productsPage.addItemToCart('sauce-labs-fleece-jacket')
      productsPage.validateCartItemCount(3)
      
      // Complete checkout
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
    })

    it('should handle checkout cancellation and resume', () => {
      // Login and add items
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
      
      // Cancel checkout at information step
      checkoutPage.validateCheckoutStepOneIsDisplayed()
      checkoutPage.clickCancel()
      cartPage.validateCartPageIsDisplayed()
      cartPage.validateCartHasItems()
      
      // Resume checkout
      cartPage.clickCheckout()
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      
      // Cancel at overview step
      checkoutPage.validateCheckoutStepTwoIsDisplayed()
      checkoutPage.clickCancelStep2()
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateCartItemCount(1)
      
      // Complete checkout
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
    })
  })

  describe('Shopping Flow with Different Users', () => {
    it('should complete shopping flow with problem user', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.problem_user.username, testData.validUsers.problem_user.password)
      
      productsPage.validateProductsPageIsDisplayed()
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      
      cartPage.validateCartPageIsDisplayed()
      cartPage.clickCheckout()
      
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
    })

    it('should handle performance glitch user shopping flow', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.performance_glitch_user.username, testData.validUsers.performance_glitch_user.password)
      
      // Operations might be slower
      productsPage.validateProductsPageIsDisplayed()
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      
      cartPage.validateCartPageIsDisplayed()
      cartPage.clickCheckout()
      
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
    })
  })

  describe('Error Handling in Shopping Flow', () => {
    it('should handle empty checkout information', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
      
      // Try to continue with empty information
      checkoutPage.validateCheckoutStepOneIsDisplayed()
      checkoutPage.clickContinue()
      checkoutPage.validateErrorMessageIsDisplayed()
      checkoutPage.validateErrorMessage('First Name is required')
      
      // Fill partial information
      checkoutPage.enterFirstName(testData.checkout.customer_info.firstName)
      checkoutPage.clickContinue()
      checkoutPage.validateErrorMessage('Last Name is required')
      
      // Complete information
      checkoutPage.enterLastName(testData.checkout.customer_info.lastName)
      checkoutPage.enterZipCode(testData.checkout.customer_info.zipCode)
      checkoutPage.clickContinue()
      checkoutPage.validateCheckoutStepTwoIsDisplayed()
    })
  })

  describe('Cross-Browser Shopping Flow', () => {
    it('should work across different viewport sizes', () => {
      // Mobile viewport
      cy.setViewportSize('mobile')
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
      checkoutPage.fillCheckoutInformation(
        testData.checkout.customer_info.firstName,
        testData.checkout.customer_info.lastName,
        testData.checkout.customer_info.zipCode
      )
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
      
      // Tablet viewport
      cy.setViewportSize('tablet')
      checkoutPage.clickBackHome()
      productsPage.validateProductsPageIsDisplayed()
      
      // Desktop viewport
      cy.setViewportSize('desktop')
      productsPage.addItemToCart('sauce-labs-bike-light')
      productsPage.validateCartItemCount(1)
    })
  })
}) 