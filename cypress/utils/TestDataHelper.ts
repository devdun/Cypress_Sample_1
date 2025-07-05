export class TestDataHelper {
  
  // User management utilities
  static getValidUser(userType: string = 'standard_user'): { username: string; password: string } {
    const users = {
      standard_user: { username: 'standard_user', password: 'secret_sauce' },
      locked_out_user: { username: 'locked_out_user', password: 'secret_sauce' },
      problem_user: { username: 'problem_user', password: 'secret_sauce' },
      performance_glitch_user: { username: 'performance_glitch_user', password: 'secret_sauce' },
      error_user: { username: 'error_user', password: 'secret_sauce' },
      visual_user: { username: 'visual_user', password: 'secret_sauce' }
    }
    
    return users[userType as keyof typeof users] || users.standard_user
  }

  static getInvalidUser(): { username: string; password: string } {
    return { username: 'invalid_user', password: 'wrong_password' }
  }

  // Product utilities
  static getProductIds(): string[] {
    return [
      'sauce-labs-backpack',
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt',
      'sauce-labs-fleece-jacket',
      'sauce-labs-onesie',
      'test.allthethings()-t-shirt-(red)'
    ]
  }

  static getProductNames(): string[] {
    return [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ]
  }

  static getRandomProduct(): string {
    const products = this.getProductIds()
    return products[Math.floor(Math.random() * products.length)]
  }

  // Checkout utilities
  static getCheckoutInfo(): { firstName: string; lastName: string; zipCode: string } {
    return {
      firstName: 'John',
      lastName: 'Doe',
      zipCode: '12345'
    }
  }

  static getRandomCheckoutInfo(): { firstName: string; lastName: string; zipCode: string } {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana']
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Miller']
    const zipCodes = ['12345', '67890', '11111', '22222', '33333', '44444']
    
    return {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      zipCode: zipCodes[Math.floor(Math.random() * zipCodes.length)]
    }
  }

  // Environment utilities
  static getBaseUrl(): string {
    return Cypress.env('baseUrl') || 'https://www.saucedemo.com'
  }

  static getBrowserName(): string {
    return Cypress.browser.name
  }

  static isHeadless(): boolean {
    return Cypress.browser.isHeadless
  }

  // Time utilities
  static getCurrentTimestamp(): string {
    return new Date().toISOString()
  }

  static getFormattedDate(): string {
    return new Date().toLocaleDateString()
  }

  // Screenshot utilities
  static takeScreenshot(testName: string): void {
    cy.screenshot(`${testName}-${this.getCurrentTimestamp()}`)
  }

  // Wait utilities
  static waitForPageLoad(): void {
    cy.get('body').should('be.visible')
    cy.wait(1000) // Additional wait for stability
  }

  static waitForElementToBeVisible(selector: string, timeout: number = 10000): void {
    cy.get(selector, { timeout }).should('be.visible')
  }

  // Validation utilities
  static validateUrl(expectedUrl: string): void {
    cy.url().should('include', expectedUrl)
  }

  static validatePageTitle(expectedTitle: string): void {
    cy.title().should('eq', expectedTitle)
  }

  // Error handling utilities
  static handleError(error: Error, testName: string): void {
    console.error(`Error in ${testName}:`, error)
    this.takeScreenshot(`error-${testName}`)
  }

  // Data generation utilities
  static generateRandomEmail(): string {
    return `test${Math.floor(Math.random() * 10000)}@example.com`
  }

  static generateRandomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  static generateRandomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Mock data utilities
  static getMockProduct(scenario: string = 'default'): any {
    const mockProducts = {
      default: {
        id: 'sauce-labs-backpack',
        name: 'Sauce Labs Backpack',
        price: 29.99,
        image: '/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
        inStock: true
      },
      outOfStock: {
        id: 'sauce-labs-backpack',
        name: 'Sauce Labs Backpack',
        price: 29.99,
        image: '/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
        inStock: false
      },
      discounted: {
        id: 'sauce-labs-backpack',
        name: 'Sauce Labs Backpack',
        price: 9.99,
        originalPrice: 29.99,
        discount: 67,
        image: '/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
        inStock: true
      }
    }
    
    return mockProducts[scenario as keyof typeof mockProducts] || mockProducts.default
  }

  static getMockCart(scenario: string = 'empty'): any {
    const mockCarts = {
      empty: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        total: 0
      },
      singleItem: {
        items: [
          {
            id: 'sauce-labs-backpack',
            name: 'Sauce Labs Backpack',
            price: 29.99,
            quantity: 1
          }
        ],
        itemCount: 1,
        subtotal: 29.99,
        tax: 2.40,
        total: 32.39
      },
      multipleItems: {
        items: [
          {
            id: 'sauce-labs-backpack',
            name: 'Sauce Labs Backpack',
            price: 29.99,
            quantity: 2
          },
          {
            id: 'sauce-labs-bike-light',
            name: 'Sauce Labs Bike Light',
            price: 9.99,
            quantity: 1
          }
        ],
        itemCount: 3,
        subtotal: 69.97,
        tax: 5.60,
        total: 75.57
      }
    }
    
    return mockCarts[scenario as keyof typeof mockCarts] || mockCarts.empty
  }

  static getMockApiResponse(endpoint: string, scenario: string = 'success'): any {
    const responses = {
      auth: {
        success: {
          statusCode: 200,
          body: {
            token: 'mock-jwt-token',
            user: { id: 'user123', username: 'standard_user' },
            sessionId: 'sess_123456789'
          }
        },
        invalidCredentials: {
          statusCode: 401,
          body: {
            error: 'Invalid credentials',
            message: 'Username and password do not match'
          }
        },
        serverError: {
          statusCode: 500,
          body: {
            error: 'Internal server error',
            message: 'Something went wrong on our end'
          }
        }
      },
      products: {
        success: {
          statusCode: 200,
          body: {
            products: [
              {
                id: 'sauce-labs-backpack',
                name: 'Sauce Labs Backpack',
                price: 29.99,
                inStock: true
              }
            ]
          }
        },
        emptyInventory: {
          statusCode: 200,
          body: {
            products: [],
            message: 'No products available'
          }
        },
        serverError: {
          statusCode: 500,
          body: {
            error: 'Failed to load products',
            message: 'Unable to retrieve product information'
          }
        }
      },
      cart: {
        success: {
          statusCode: 200,
          body: {
            message: 'Item added to cart',
            cart: this.getMockCart('singleItem')
          }
        },
        outOfStock: {
          statusCode: 409,
          body: {
            error: 'Out of stock',
            message: 'This item is currently out of stock'
          }
        },
        serverError: {
          statusCode: 500,
          body: {
            error: 'Failed to add item',
            message: 'Unable to add item to cart'
          }
        }
      }
    }
    
    const endpointResponses = responses[endpoint as keyof typeof responses]
    if (!endpointResponses) {
      throw new Error(`Unknown endpoint: ${endpoint}`)
    }
    
    return endpointResponses[scenario as keyof typeof endpointResponses] || endpointResponses.success
  }

  // Mock API utilities
  static setupMockAuth(scenario: string = 'success'): void {
    const response = this.getMockApiResponse('auth', scenario)
    cy.intercept('POST', '**/auth/login', response).as('mockLogin')
  }

  static setupMockProducts(scenario: string = 'success'): void {
    const response = this.getMockApiResponse('products', scenario)
    cy.intercept('GET', '**/api/products', response).as('mockProducts')
  }

  static setupMockCart(scenario: string = 'success'): void {
    const response = this.getMockApiResponse('cart', scenario)
    cy.intercept('POST', '**/api/cart/add', response).as('mockAddToCart')
    cy.intercept('GET', '**/api/cart', response).as('mockGetCart')
  }

  static setupSlowResponse(endpoint: string, delay: number = 3000): void {
    cy.intercept('GET', `**/${endpoint}`, (req) => {
      req.reply((res) => {
        setTimeout(() => {
          res.send({ statusCode: 200, body: { message: 'Slow response' } })
        }, delay)
      })
    }).as(`slow${endpoint}`)
  }

  static setupNetworkError(endpoint: string): void {
    cy.intercept('GET', `**/${endpoint}`, { forceNetworkError: true }).as(`networkError${endpoint}`)
  }

  static setupServerError(endpoint: string): void {
    cy.intercept('GET', `**/${endpoint}`, {
      statusCode: 500,
      body: {
        error: 'Internal server error',
        message: 'Something went wrong on our end'
      }
    }).as(`serverError${endpoint}`)
  }
} 