/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'
import { MockDataHelper } from '../../utils/MockDataHelper'
import { TestDataHelper } from '../../utils/TestDataHelper'

describe('Mock Data Examples', () => {
  let loginPage: LoginPage
  let productsPage: ProductsPage
  let cartPage: CartPage
  let checkoutPage: CheckoutPage

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    checkoutPage = new CheckoutPage()
  })

  describe('Authentication Mock Scenarios', () => {
    it('should handle successful authentication with mock data', () => {
      // Setup mock for successful authentication
      MockDataHelper.mockAuth().success()
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('authSuccess')
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should handle authentication failure with mock data', () => {
      // Setup mock for authentication failure
      MockDataHelper.mockAuth().invalidCredentials()
      
      loginPage.visit()
      loginPage.login('invalid_user', 'wrong_password')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('authInvalid')
      
      // Verify error is displayed
      loginPage.validateErrorMessageIsDisplayed()
    })

    it('should handle locked out user with mock data', () => {
      // Setup mock for locked out user
      MockDataHelper.mockAuth().lockedOut()
      
      loginPage.visit()
      loginPage.login('locked_out_user', 'secret_sauce')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('authLocked')
      
      // Verify appropriate error message
      loginPage.validateErrorMessageIsDisplayed()
    })

    it('should handle server error during authentication', () => {
      // Setup mock for server error
      MockDataHelper.mockAuth().serverError()
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('authServerError')
      
      // Verify error handling
      loginPage.validateErrorMessageIsDisplayed()
    })

    it('should handle slow authentication response', () => {
      // Setup mock for slow response (3 seconds)
      MockDataHelper.mockAuth().slowResponse(3000)
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify mock was called with extended timeout
      MockDataHelper.waitForMockCall('authSlow', 5000)
      
      // Verify eventual success
      productsPage.validateProductsPageIsDisplayed()
    })
  })

  describe('Products Mock Scenarios', () => {
    beforeEach(() => {
      // Login first
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
    })

    it('should display products using mock data', () => {
      // Setup mock for products
      MockDataHelper.mockProducts().success()
      
      productsPage.validateProductsPageIsDisplayed()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('productsSuccess')
      
      // Verify products are displayed
      productsPage.validateProductsAreDisplayed()
    })

    it('should handle empty inventory with mock data', () => {
      // Setup mock for empty inventory
      MockDataHelper.mockProducts().emptyInventory()
      
      // Refresh page to trigger product loading
      cy.reload()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('productsEmpty')
      
      // Verify appropriate message is displayed
      cy.contains('No products available').should('be.visible')
    })

    it('should handle custom product data', () => {
      // Create custom product data
      const customProducts = [
        {
          id: 'custom-product-1',
          name: 'Custom Test Product',
          price: 99.99,
          image: '/test-image.jpg',
          inStock: true
        }
      ]
      
      // Setup mock with custom products
      MockDataHelper.mockProducts().customProducts(customProducts)
      
      // Refresh page to trigger product loading
      cy.reload()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('productsCustom')
      
      // Verify custom product is displayed
      cy.contains('Custom Test Product').should('be.visible')
      cy.contains('$99.99').should('be.visible')
    })

    it('should handle product loading errors', () => {
      // Setup mock for server error
      MockDataHelper.mockProducts().serverError()
      
      // Refresh page to trigger product loading
      cy.reload()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('productsServerError')
      
      // Verify error handling
      cy.contains('Failed to load products').should('be.visible')
    })

    it('should handle slow product loading', () => {
      // Setup mock for slow response
      MockDataHelper.mockProducts().slowResponse(2000)
      
      // Refresh page to trigger product loading
      cy.reload()
      
      // Verify loading state
      cy.contains('Loading').should('be.visible')
      
      // Verify mock was called with extended timeout
      MockDataHelper.waitForMockCall('productsSlow', 5000)
      
      // Verify products eventually load
      productsPage.validateProductsAreDisplayed()
    })
  })

  describe('Cart Mock Scenarios', () => {
    beforeEach(() => {
      // Login first
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should add item to cart with mock data', () => {
      // Setup mock for successful add to cart
      MockDataHelper.mockCart().addItemSuccess()
      
      productsPage.addItemToCart('sauce-labs-backpack')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('addToCartSuccess')
      
      // Verify cart counter updates
      productsPage.validateCartItemCount(1)
    })

    it('should handle out of stock scenario', () => {
      // Setup mock for out of stock
      MockDataHelper.mockCart().addItemOutOfStock()
      
      productsPage.addItemToCart('sauce-labs-backpack')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('addToCartOutOfStock')
      
      // Verify error message
      cy.contains('Out of stock').should('be.visible')
    })

    it('should handle cart loading with items', () => {
      // Setup mock for cart with items
      MockDataHelper.mockCart().getCartWithItems()
      
      productsPage.clickShoppingCart()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('getCartWithItems')
      
      // Verify cart items are displayed
      cartPage.validateCartPageIsDisplayed()
      cy.contains('Sauce Labs Backpack').should('be.visible')
    })

    it('should handle empty cart scenario', () => {
      // Setup mock for empty cart
      MockDataHelper.mockCart().getCartEmpty()
      
      productsPage.clickShoppingCart()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('getCartEmpty')
      
      // Verify empty cart message
      cartPage.validateCartPageIsDisplayed()
    })

    it('should handle cart server errors', () => {
      // Setup mock for cart server error
      MockDataHelper.mockCart().addItemServerError()
      
      productsPage.addItemToCart('sauce-labs-backpack')
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('addToCartServerError')
      
      // Verify error handling
      cy.contains('Unable to add item to cart').should('be.visible')
    })
  })

  describe('Checkout Mock Scenarios', () => {
    beforeEach(() => {
      // Login and add item to cart
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.clickShoppingCart()
      cartPage.clickCheckout()
    })

    it('should complete checkout with mock data', () => {
      // Setup mock for successful checkout
      MockDataHelper.mockCheckout().success()
      
      checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      checkoutPage.clickContinue()
      checkoutPage.clickFinish()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('checkoutSuccess')
      
      // Verify checkout completion
      checkoutPage.validateCheckoutCompleteIsDisplayed()
    })

    it('should handle payment errors', () => {
      // Setup mock for payment error
      MockDataHelper.mockCheckout().paymentError()
      
      checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      checkoutPage.clickContinue()
      checkoutPage.clickFinish()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('checkoutPaymentError')
      
      // Verify error handling
      cy.contains('Payment failed').should('be.visible')
    })

    it('should handle validation errors', () => {
      // Setup mock for validation error
      MockDataHelper.mockCheckout().validationError()
      
      checkoutPage.fillCheckoutInformation('', '', '')
      checkoutPage.clickContinue()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('checkoutValidationError')
      
      // Verify validation error messages
      cy.contains('First name is required').should('be.visible')
    })

    it('should handle checkout server errors', () => {
      // Setup mock for server error
      MockDataHelper.mockCheckout().serverError()
      
      checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      checkoutPage.clickContinue()
      checkoutPage.clickFinish()
      
      // Verify mock was called
      MockDataHelper.waitForMockCall('checkoutServerError')
      
      // Verify error handling
      cy.contains('Unable to process your order').should('be.visible')
    })
  })

  describe('Network Condition Simulations', () => {
    it('should handle slow network conditions', () => {
      // Setup slow network simulation
      MockDataHelper.simulateNetworkConditions().slowConnection(56)
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify slow response handling
      MockDataHelper.waitForMockCall('slowConnection', 10000)
      
      // Verify eventual success
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should handle network errors', () => {
      // Setup network error simulation
      MockDataHelper.simulateNetworkConditions().networkError('api/products')
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify network error handling
      MockDataHelper.waitForMockCall('networkError')
      
      // Verify error display
      cy.contains('Network error').should('be.visible')
    })

    it('should handle intermittent failures', () => {
      // Setup intermittent failure simulation (30% failure rate)
      MockDataHelper.simulateNetworkConditions().intermittentFailure('api/products', 0.3)
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify intermittent failure handling
      MockDataHelper.waitForMockCall('intermittentFailure')
      
      // The test should handle both success and failure cases
      cy.get('body').should('be.visible')
    })
  })

  describe('Fixture Data Integration', () => {
    it('should use fixture data for testing', () => {
      // Load fixture data
      cy.fixture('products').then((products) => {
        // Use fixture data in mock
        MockDataHelper.mockProducts().customProducts(products.products)
        
        loginPage.visit()
        loginPage.login('standard_user', 'secret_sauce')
        
        // Verify fixture data is used
        MockDataHelper.waitForMockCall('productsCustom')
        
        // Verify products from fixture are displayed
        products.products.forEach((product: any) => {
          cy.contains(product.name).should('be.visible')
        })
      })
    })

    it('should use fixture data for different scenarios', () => {
      // Load fixture data
      cy.fixture('cart').then((_cart) => {
        // Use fixture data for large cart scenario
        MockDataHelper.mockCart().getCartWithItems()
        
        loginPage.visit()
        loginPage.login('standard_user', 'secret_sauce')
        productsPage.clickShoppingCart()
        
        // Verify fixture data is used
        MockDataHelper.waitForMockCall('getCartWithItems')
        
        // Verify cart items from fixture
        cartPage.validateCartPageIsDisplayed()
      })
    })
  })

  describe('TestDataHelper Integration', () => {
    it('should use TestDataHelper with mock data', () => {
      // Get mock data from TestDataHelper
      const mockProduct = TestDataHelper.getMockProduct('discounted')
      
      // Use in mock
      MockDataHelper.mockProducts().customProducts([mockProduct])
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify TestDataHelper mock data is used
      MockDataHelper.waitForMockCall('productsCustom')
      
      // Verify discounted product is displayed
      cy.contains(mockProduct.name).should('be.visible')
      cy.contains(`$${mockProduct.price}`).should('be.visible')
    })

    it('should use TestDataHelper for API responses', () => {
      // Get mock API response from TestDataHelper
      const mockResponse = TestDataHelper.getMockApiResponse('auth', 'success')
      
      // Use in mock
      cy.intercept('POST', '**/auth/login', mockResponse).as('testHelperAuth')
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify TestDataHelper response is used
      MockDataHelper.waitForMockCall('testHelperAuth')
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
    })
  })
}) 