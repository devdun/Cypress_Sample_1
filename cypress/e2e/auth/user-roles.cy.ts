/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'

describe('User Roles and Special Behaviors', () => {
  let loginPage: LoginPage
  let productsPage: ProductsPage
  let cartPage: CartPage
  let testData: any

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    cartPage = new CartPage()
    
    // Load test data
    cy.fixture('users').then((data) => {
      testData = data
    })
  })

  describe('Problem User Tests', () => {
    it('should handle problem user image issues', () => {
      // Login with problem user
      loginPage.visit()
      loginPage.login(testData.validUsers.problem_user.username, testData.validUsers.problem_user.password)
      
      // Verify products page is displayed despite potential image issues
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
      
      // Verify that add to cart functionality still works
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
    })

    it('should handle broken images for problem user', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.problem_user.username, testData.validUsers.problem_user.password)
      
      // Check that product images might be broken but products are still displayed
      productsPage.validateProductsPageIsDisplayed()
      cy.get('[data-test="inventory-item-sauce-labs-backpack-img"]').should('be.visible')
      
      // Navigation should still work
      productsPage.getProductByName('Sauce Labs Backpack').click()
      cy.url().should('include', '/inventory-item.html')
    })
  })

  describe('Error User Tests', () => {
    it('should handle error user cart issues', () => {
      // Login with error user
      loginPage.visit()
      loginPage.login(testData.validUsers.error_user.username, testData.validUsers.error_user.password)
      
      // Try to add item to cart - might have issues
      productsPage.validateProductsPageIsDisplayed()
      productsPage.addItemToCart('sauce-labs-backpack')
      
      // Navigate to cart to see if there are errors
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      
      // Error user might have issues with cart operations
      // but the page should still be accessible
    })

    it('should handle sorting issues with error user', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.error_user.username, testData.validUsers.error_user.password)
      
      productsPage.validateProductsPageIsDisplayed()
      
      // Try sorting - error user might have issues
      productsPage.sortProducts('za')
      
      // Page should still be functional
      productsPage.validateProductsAreDisplayed()
    })
  })

  describe('Performance Glitch User Tests', () => {
    it('should handle performance glitch user', () => {
      // Login with performance glitch user
      loginPage.visit()
      loginPage.login(testData.validUsers.performance_glitch_user.username, testData.validUsers.performance_glitch_user.password)
      
      // Operations might be slower but should still work
      productsPage.validateProductsPageIsDisplayed()
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
      
      // Navigate to cart
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      cartPage.validateCartItemExists('Sauce Labs Backpack')
    })

    it('should handle slow loading with performance glitch user', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.performance_glitch_user.username, testData.validUsers.performance_glitch_user.password)
      
      // Wait for page to load (might be slow)
      cy.get('[data-test="inventory-container"]', { timeout: 10000 }).should('be.visible')
      
      // Test basic functionality
      productsPage.validateProductsAreDisplayed()
      productsPage.sortProducts('lohi')
      productsPage.validateProductsSortedByPrice('asc')
    })
  })

  describe('Visual User Tests', () => {
    it('should handle visual user navigation', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.visual_user.username, testData.validUsers.visual_user.password)
      
      // Visual user should have access to all features
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
      
      // Test cart functionality
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
      
      // Test navigation
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
    })
  })

  describe('User Session Management', () => {
    it('should maintain user session across page navigation', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      // Navigate through different pages
      productsPage.validateProductsPageIsDisplayed()
      productsPage.addItemToCart('sauce-labs-backpack')
      
      cartPage.visit()
      cartPage.validateCartPageIsDisplayed()
      
      // Navigate back to products
      cartPage.clickContinueShopping()
      productsPage.validateProductsPageIsDisplayed()
      
      // User should still be logged in
      productsPage.validateCartItemCount(1)
    })

    it('should handle user logout properly', () => {
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      productsPage.validateProductsPageIsDisplayed()
      productsPage.logout()
      
      // Should redirect to login page
      loginPage.validateLoginPageIsDisplayed()
    })
  })
}) 