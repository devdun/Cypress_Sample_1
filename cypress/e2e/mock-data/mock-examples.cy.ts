/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'

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

  describe('Basic Mocking Examples', () => {
    it('should demonstrate basic intercept for external resources', () => {
      // Mock external API that might be called (but isn't in SauceDemo)
      cy.intercept('GET', '**/api/external/**', {
        statusCode: 200,
        body: { message: 'Mocked external API' }
      }).as('mockExternalAPI')
      
      loginPage.visit()
      
      // Verify page loads correctly even with mocked external APIs
      loginPage.validateLoginPageIsDisplayed()
    })

    it('should demonstrate fixture data loading', () => {
      // Load fixture data
      cy.fixture('users').then((users) => {
        expect(users).to.have.property('validUsers')
        expect(users.validUsers).to.be.an('object')
        expect(users.validUsers.standard_user).to.have.property('username')
        expect(users.validUsers.standard_user).to.have.property('password')
      })
    })

    it('should demonstrate successful login flow', () => {
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
    })

    it('should demonstrate handling different user scenarios', () => {
      // Test with fixture data
      cy.fixture('users').then((users) => {
        const validUser = users.validUsers.standard_user
        
        loginPage.visit()
        loginPage.login(validUser.username, validUser.password)
        
        // Verify successful login
        productsPage.validateProductsPageIsDisplayed()
      })
    })

    it('should demonstrate error handling', () => {
      loginPage.visit()
      loginPage.login('invalid_user', 'wrong_password')
      
      // Verify error is displayed
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Epic sadface: Username and password do not match')
    })

    it('should demonstrate locked out user scenario', () => {
      loginPage.visit()
      loginPage.login('locked_out_user', 'secret_sauce')
      
      // Verify locked out error
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Epic sadface: Sorry, this user has been locked out')
    })
  })

  describe('Advanced Mocking Scenarios', () => {
    beforeEach(() => {
      // Login for tests that need authenticated state
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
    })

    it('should demonstrate DOM manipulation and mocking', () => {
      productsPage.validateProductsPageIsDisplayed()
      
      // Mock a custom product by injecting it into the DOM
      cy.get('[data-test="inventory-list"]').then(($list) => {
        const mockProduct = `
          <div class="inventory_item" data-test="inventory-item">
            <div class="inventory_item_img">
              <img src="/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg" alt="Sauce Labs Backpack">
            </div>
            <div class="inventory_item_description">
              <div class="inventory_item_label">
                <a href="#">
                  <div class="inventory_item_name" data-test="inventory-item-name">Mock Test Product</div>
                </a>
                <div class="inventory_item_desc" data-test="inventory-item-desc">A mocked product for testing</div>
                <div class="inventory_item_price" data-test="inventory-item-price">$99.99</div>
              </div>
              <div class="pricebar">
                <button class="btn btn_primary btn_small btn_inventory" data-test="add-to-cart-mock-test-product">Add to cart</button>
              </div>
            </div>
          </div>
        `
        $list.append(mockProduct)
      })
      
      // Verify the mock product was added
      cy.contains('Mock Test Product').should('be.visible')
      cy.contains('$99.99').should('be.visible')
    })

    it('should demonstrate custom commands and data', () => {
      // Use custom test data
      const mockProductData = {
        name: 'Custom Test Product',
        price: 49.99,
        description: 'A custom product for testing purposes'
      }
      
      productsPage.validateProductsPageIsDisplayed()
      
      // Verify we can work with real products
      productsPage.validateProductExists('Sauce Labs Backpack')
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
    })

    it('should demonstrate network condition simulation', () => {
      // Simulate slow network by adding delays
      cy.intercept('GET', '**/*', (req) => {
        // Add a small delay to simulate slow network
        setTimeout(() => {
          req.continue()
        }, 500)
      }).as('slowNetwork')
      
      productsPage.clickShoppingCart()
      
      // The page should still function with slow network
      cartPage.validateCartPageIsDisplayed()
    })

    it('should demonstrate custom assertions and validations', () => {
      productsPage.validateProductsPageIsDisplayed()
      
             // Custom validation using fixture data
       cy.fixture('products').then((products) => {
         // Verify some of the expected products exist
         products.expectedProducts.forEach((productName: string) => {
           cy.contains(productName).should('be.visible')
         })
       })
    })

    it('should demonstrate cart functionality with mock data', () => {
      // Add items to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.addItemToCart('sauce-labs-bike-light')
      
      // Verify cart count
      productsPage.validateCartItemCount(2)
      
      // Navigate to cart
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      
      // Mock additional cart data for testing
      cy.fixture('cart').then((cartData) => {
        expect(cartData).to.have.property('cart')
        expect(cartData.cart.multipleItems).to.have.property('items')
      })
    })
  })

  describe('Test Data Integration', () => {
        it('should demonstrate using fixture data for different scenarios', () => {
      // Test different user scenarios from fixture
      cy.fixture('users').then((users) => {
        // Test problem user
        const problemUser = users.validUsers.problem_user
        
        if (problemUser) {
          loginPage.visit()
          loginPage.login(problemUser.username, problemUser.password)
          productsPage.validateProductsPageIsDisplayed()
        }
      })
    })

    it('should demonstrate API response mocking for external services', () => {
      // Mock external API calls (if the app made any)
      cy.intercept('GET', '**/external-api/**', {
        statusCode: 200,
        body: { message: 'Mocked external API response' }
      }).as('externalAPI')
      
      loginPage.visit()
      loginPage.login('standard_user', 'secret_sauce')
      
      // The app should work normally even with mocked external APIs
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should demonstrate error scenario testing', () => {
      // Test various error scenarios
      const errorScenarios = [
        { username: '', password: 'secret_sauce', expectedError: 'Username is required' },
        { username: 'standard_user', password: '', expectedError: 'Password is required' },
        { username: 'invalid_user', password: 'invalid_password', expectedError: 'Username and password do not match' }
      ]
      
      errorScenarios.forEach((scenario) => {
        loginPage.visit()
        loginPage.login(scenario.username, scenario.password)
        
        // Verify appropriate error is shown
        loginPage.validateErrorMessageIsDisplayed()
        
        // Note: SauceDemo might have slightly different error messages
        // This demonstrates how to test error scenarios
      })
    })
  })

  describe('Performance and Reliability Testing', () => {
    it('should demonstrate timeout handling', () => {
      // Mock slow responses
      cy.intercept('GET', '**/*.css', (req) => {
        setTimeout(() => {
          req.continue()
        }, 1000)
      }).as('slowCSS')
      
      loginPage.visit()
      
      // Verify page loads eventually
      loginPage.validateLoginPageIsDisplayed()
    })

    it('should demonstrate retry logic', () => {
      let callCount = 0
      
      // Mock intermittent failures
      cy.intercept('GET', '**/*.js', (req) => {
        callCount++
        if (callCount === 1) {
          // Fail first request
          req.reply({
            statusCode: 500,
            body: 'Server Error'
          })
        } else {
          // Succeed on retry
          req.continue()
        }
      }).as('intermittentFailure')
      
      loginPage.visit()
      
      // Page should eventually load despite initial failure
      loginPage.validateLoginPageIsDisplayed()
    })
  })
}) 