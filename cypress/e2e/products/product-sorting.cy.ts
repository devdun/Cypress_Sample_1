/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'

describe('Product Sorting Tests', () => {
  let loginPage: LoginPage
  let productsPage: ProductsPage
  let testData: any

  beforeEach(() => {
    loginPage = new LoginPage()
    productsPage = new ProductsPage()
    
    // Load test data and login
    cy.fixture('users').then((data) => {
      testData = data
      
      // Login before each test
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
    })
  })

  it('should sort products by name A to Z', () => {
    productsPage.sortProducts('az')
    productsPage.validateProductsSortedByName('asc')
  })

  it('should sort products by name Z to A', () => {
    productsPage.sortProducts('za')
    productsPage.validateProductsSortedByName('desc')
  })

  it('should sort products by price low to high', () => {
    productsPage.sortProducts('lohi')
    productsPage.validateProductsSortedByPrice('asc')
  })

  it('should sort products by price high to low', () => {
    productsPage.sortProducts('hilo')
    productsPage.validateProductsSortedByPrice('desc')
  })

  it('should allow re-sorting after navigating back from product details', () => {
    // First, sort products by price high to low
    productsPage.sortProducts('hilo')
    productsPage.validateProductsSortedByPrice('desc')
    
    // Navigate to product details and back
    productsPage.getProductByName('Sauce Labs Fleece Jacket').click()
    cy.get('[data-test="back-to-products"]').click()
    
    // Verify we're back on products page
    productsPage.validateProductsPageIsDisplayed()
    
    // Re-sort products to verify sorting still works after navigation
    productsPage.sortProducts('hilo')
    productsPage.validateProductsSortedByPrice('desc')
    
    // Also verify we can sort in different order
    productsPage.sortProducts('lohi')
    productsPage.validateProductsSortedByPrice('asc')
  })
}) 