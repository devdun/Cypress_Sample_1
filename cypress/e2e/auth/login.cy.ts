/**
 * @fileoverview Login functionality tests for SauceDemo
 * @author Devdun
 * @created 2025
 * @description Comprehensive login tests covering successful scenarios, validation errors, and browser compatibility
 */

/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'

describe('Login Functionality', () => {
  let loginPage: LoginPage
  let productsPage: ProductsPage
  let testData: any

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    
    // Visit login page
    loginPage.visit()
  })
  
  before(() => {
    // Load test data once before all tests
    cy.fixture('users').then((data) => {
      testData = data
    })
  })

  describe('Successful Login Scenarios', () => {
    it('should login successfully with valid standard user credentials', () => {
      loginPage.validateLoginPageIsDisplayed()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
    })

    it('should login successfully with performance glitch user', () => {
      loginPage.login(testData.validUsers.performance_glitch_user.username, testData.validUsers.performance_glitch_user.password)
      
      // Verify successful login (might be slower due to performance glitch)
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
    })

    it('should login successfully with problem user', () => {
      loginPage.login(testData.validUsers.problem_user.username, testData.validUsers.problem_user.password)
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
    })

    it('should login successfully with error user', () => {
      loginPage.login(testData.validUsers.error_user.username, testData.validUsers.error_user.password)
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
    })

    it('should login successfully with visual user', () => {
      loginPage.login(testData.validUsers.visual_user.username, testData.validUsers.visual_user.password)
      
      // Verify successful login
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateProductsAreDisplayed()
    })
  })

  describe('Failed Login Scenarios', () => {
    it('should show error message for locked out user', () => {
      loginPage.login(testData.validUsers.locked_out_user.username, testData.validUsers.locked_out_user.password)
      
      // Verify error message
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Sorry, this user has been locked out')
    })

    it('should show error message for invalid credentials', () => {
      loginPage.login(testData.invalidUsers.invalid_user.username, testData.invalidUsers.invalid_user.password)
      
      // Verify error message
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Username and password do not match any user in this service')
    })

    it('should show error message for empty username', () => {
      loginPage.login('', testData.validUsers.standard_user.password)
      
      // Verify error message
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Username is required')
    })

    it('should show error message for empty password', () => {
      loginPage.login(testData.validUsers.standard_user.username, '')
      
      // Verify error message
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Password is required')
    })

    it('should show error message for empty credentials', () => {
      loginPage.login('', '')
      
      // Verify error message
      loginPage.validateErrorMessageIsDisplayed()
      loginPage.validateErrorMessage('Username is required')
    })

    it('should close error message when clicking X button', () => {
      loginPage.login(testData.invalidUsers.invalid_user.username, testData.invalidUsers.invalid_user.password)
      
      // Verify error message is displayed
      loginPage.validateErrorMessageIsDisplayed()
      
      // Close error message
      loginPage.closeErrorMessage()
      
      // Verify error message is hidden
      loginPage.getErrorMessage().should('not.exist')
    })
  })

  describe('Login Page Validations', () => {
    it('should display all required elements on login page', () => {
      loginPage.validateLoginPageIsDisplayed()
      loginPage.validateLoginCredentialsAreDisplayed()
      loginPage.validatePageTitle()
      loginPage.validatePageURL()
    })

    it('should have correct page title', () => {
      loginPage.validatePageTitle()
    })

    it('should have correct page URL', () => {
      loginPage.validatePageURL()
    })
  })

  describe('Browser Compatibility Tests', () => {
    it('should work properly in different viewport sizes', () => {
      // Test mobile viewport
      cy.setViewportSize('mobile')
      loginPage.validateLoginPageIsDisplayed()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
      
      // Test tablet viewport
      cy.setViewportSize('tablet')
      loginPage.visit()
      loginPage.validateLoginPageIsDisplayed()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
      
      // Test desktop viewport
      cy.setViewportSize('desktop')
      loginPage.visit()
      loginPage.validateLoginPageIsDisplayed()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
    })
  })
}) 