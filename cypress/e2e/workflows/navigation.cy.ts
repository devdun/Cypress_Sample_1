/// <reference types="cypress" />

import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'

describe('Navigation and Menu Tests', () => {
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
      
      // Login before each test
      loginPage.visit()
      loginPage.login(testData.validUsers.standard_user.username, testData.validUsers.standard_user.password)
      productsPage.validateProductsPageIsDisplayed()
    })
  })

  describe('Main Navigation Tests', () => {
    it('should navigate from products to cart and back', () => {
      // Add item to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
      
      // Navigate to cart
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      
      // Navigate back to products
      cartPage.clickContinueShopping()
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateCartItemCount(1)
    })

    it('should navigate through complete shopping flow', () => {
      // Add item to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      
      // Navigate to cart
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      
      // Navigate to checkout
      cartPage.clickCheckout()
      checkoutPage.validateCheckoutStepOneIsDisplayed()
      
      // Complete checkout step one
      checkoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      checkoutPage.validateCheckoutStepTwoIsDisplayed()
      
      // Complete checkout
      checkoutPage.clickFinish()
      checkoutPage.validateCheckoutCompleteIsDisplayed()
      
      // Navigate back to products
      checkoutPage.clickBackHome()
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should handle direct URL navigation', () => {
      // Navigate directly to cart
      cy.visit('/cart.html')
      cartPage.validateCartPageIsDisplayed()
      
      // Navigate directly to checkout (should redirect if cart is empty)
      cy.visit('/checkout-step-one.html')
      checkoutPage.validateCheckoutStepOneIsDisplayed()
      
      // Navigate back to products
      cy.visit('/inventory.html')
      productsPage.validateProductsPageIsDisplayed()
    })
  })

  describe('Menu Navigation Tests', () => {
    it('should open and close hamburger menu', () => {
      // Open menu
      productsPage.openMenu()
      cy.get('.bm-menu').should('be.visible')
      
      // Verify menu items are visible
      cy.get('[data-test="inventory-sidebar-link"]').should('be.visible')
      cy.get('[data-test="about-sidebar-link"]').should('be.visible')
      cy.get('[data-test="logout-sidebar-link"]').should('be.visible')
      cy.get('[data-test="reset-sidebar-link"]').should('be.visible')
      
      // Close menu
      cy.get('#react-burger-cross-btn').click()
      cy.get('.bm-menu').should('not.be.visible')
    })

    it('should navigate to All Items from menu', () => {
      // Navigate to cart first
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      
      // Open menu and navigate to All Items
      productsPage.openMenu()
      cy.get('[data-test="inventory-sidebar-link"]').click()
      
      // Verify navigation to products page
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should logout from menu', () => {
      // Open menu and logout
      productsPage.openMenu()
      cy.get('[data-test="logout-sidebar-link"]').click()
      
      // Verify logout
      loginPage.validateLoginPageIsDisplayed()
    })

    it('should reset app state from menu', () => {
      // Add items to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.addItemToCart('sauce-labs-bike-light')
      productsPage.validateCartItemCount(2)
      
      // Open menu and reset
      productsPage.openMenu()
      cy.get('[data-test="reset-sidebar-link"]').click()
      
      // Verify cart is reset
      productsPage.validateCartItemCount(0)
    })

    it('should handle About link from menu', () => {
      // Open menu and click About
      productsPage.openMenu()
      cy.get('[data-test="about-sidebar-link"]').click()
      
      // Verify external link opens (in new tab)
      cy.origin('https://saucelabs.com', () => {
        cy.url().should('include', 'saucelabs.com')
      })
    })
  })

  describe('Product Detail Navigation Tests', () => {
    it('should navigate to product detail and back', () => {
      // Navigate to product detail
      productsPage.getProductByName('Sauce Labs Backpack').click()
      
      // Verify product details page
      cy.url().should('include', '/inventory-item.html')
      cy.contains('Sauce Labs Backpack').should('be.visible')
      cy.get('[data-test="back-to-products"]').should('be.visible')
      
      // Navigate back to products
      cy.get('[data-test="back-to-products"]').click()
      productsPage.validateProductsPageIsDisplayed()
    })

    it('should add to cart from product detail page', () => {
      // Navigate to product detail
      productsPage.getProductByName('Sauce Labs Backpack').click()
      
      // Add to cart from detail page
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('[data-test="shopping-cart-badge"]').should('contain.text', '1')
      
      // Navigate back and verify cart count
      cy.get('[data-test="back-to-products"]').click()
      productsPage.validateCartItemCount(1)
    })

    it('should navigate to cart from product detail page', () => {
      // Navigate to product detail and add to cart
      productsPage.getProductByName('Sauce Labs Backpack').click()
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      
      // Navigate to cart from detail page
      cy.get('[data-test="shopping-cart-link"]').click()
      
      // Verify cart page and item
      cartPage.validateCartPageIsDisplayed()
      cartPage.validateCartItemExists('Sauce Labs Backpack')
    })
  })

  describe('Breadcrumb and URL Navigation Tests', () => {
    it('should handle browser back button navigation', () => {
      // Navigate to cart
      productsPage.clickShoppingCart()
      cartPage.validateCartPageIsDisplayed()
      
      // Use browser back button
      cy.go('back')
      productsPage.validateProductsPageIsDisplayed()
      
      // Use browser forward button
      cy.go('forward')
      cartPage.validateCartPageIsDisplayed()
    })

    it('should maintain state during navigation', () => {
      // Add item to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
      
      // Navigate to product detail
      productsPage.getProductByName('Sauce Labs Bike Light').click()
      
      // Cart count should be maintained
      cy.get('[data-test="shopping-cart-badge"]').should('contain.text', '1')
      
      // Navigate back to products
      cy.get('[data-test="back-to-products"]').click()
      productsPage.validateCartItemCount(1)
    })

    it('should handle page refresh', () => {
      // Add item to cart
      productsPage.addItemToCart('sauce-labs-backpack')
      productsPage.validateCartItemCount(1)
      
      // Refresh page
      cy.reload()
      
      // Verify user is still logged in and cart is maintained
      productsPage.validateProductsPageIsDisplayed()
      productsPage.validateCartItemCount(1)
    })
  })
}) 