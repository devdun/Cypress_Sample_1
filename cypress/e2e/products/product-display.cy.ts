/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'

describe('Product Display Tests', () => {
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

  it('should display all products on the inventory page', () => {
    productsPage.validateProductsAreDisplayed()
    productsPage.validateSortDropdownExists()
  })

  it('should display product details correctly', () => {
    productsPage.validateProductExists('Sauce Labs Backpack')
    productsPage.validateProductExists('Sauce Labs Bike Light')
    productsPage.validateProductExists('Sauce Labs Bolt T-Shirt')
    productsPage.validateProductExists('Sauce Labs Fleece Jacket')
    productsPage.validateProductExists('Sauce Labs Onesie')
    productsPage.validateProductExists('Test.allTheThings() T-Shirt (Red)')
  })

  it('should show add to cart buttons for all products', () => {
    productsPage.validateAddToCartButtonExists('sauce-labs-backpack')
    productsPage.validateAddToCartButtonExists('sauce-labs-bike-light')
    productsPage.validateAddToCartButtonExists('sauce-labs-bolt-t-shirt')
    productsPage.validateAddToCartButtonExists('sauce-labs-fleece-jacket')
    productsPage.validateAddToCartButtonExists('sauce-labs-onesie')
    productsPage.validateAddToCartButtonExists('test.allthethings()-t-shirt-(red)')
  })

  it('should navigate to product details page', () => {
    productsPage.getProductByName('Sauce Labs Backpack').click()
    
    // Verify product details page
    cy.url().should('include', '/inventory-item.html')
    cy.contains('Sauce Labs Backpack').should('be.visible')
    cy.get('[data-test="back-to-products"]').should('be.visible')
  })

  it('should navigate back to products from product details', () => {
    productsPage.getProductByName('Sauce Labs Backpack').click()
    cy.get('[data-test="back-to-products"]').click()
    
    productsPage.validateProductsPageIsDisplayed()
  })
}) 