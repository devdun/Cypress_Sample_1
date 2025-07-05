/// <reference types="cypress" />

export class MockDataHelper {
  
  // API endpoint patterns
  private static readonly ENDPOINTS = {
    AUTH: '**/auth/**',
    PRODUCTS: '**/api/products**',
    CART: '**/api/cart**',
    CHECKOUT: '**/api/checkout**',
    USER: '**/api/user**'
  }

  // Load fixture data
  static loadFixture(fixtureName: string): Cypress.Chainable<any> {
    return cy.fixture(fixtureName)
  }

  // Basic API mocking
  static mockApiCall(method: string, endpoint: string, response: any, alias?: string): void {
    const interceptOptions = {
      method: method.toUpperCase(),
      url: endpoint
    }

    if (alias) {
      cy.intercept(interceptOptions, response).as(alias)
    } else {
      cy.intercept(interceptOptions, response)
    }
  }

  // Authentication mocking
  static mockAuth(): {
    success: () => void
    invalidCredentials: () => void
    lockedOut: () => void
    serverError: () => void
    slowResponse: (delay?: number) => void
  } {
    return {
      success: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.AUTH, responses.auth.success).as('authSuccess')
        })
      },
      invalidCredentials: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.AUTH, responses.auth.invalidCredentials).as('authInvalid')
        })
      },
      lockedOut: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.AUTH, responses.auth.lockedOut).as('authLocked')
        })
      },
      serverError: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.AUTH, responses.auth.serverError).as('authServerError')
        })
      },
      slowResponse: (delay: number = 3000) => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.AUTH, (req) => {
            setTimeout(() => {
              req.reply(responses.auth.success)
            }, delay)
          }).as('authSlow')
        })
      }
    }
  }

  // Products mocking
  static mockProducts(): {
    success: () => void
    emptyInventory: () => void
    serverError: () => void
    customProducts: (products: any[]) => void
    slowResponse: (delay?: number) => void
  } {
    return {
      success: () => {
        cy.fixture('products').then((products) => {
          cy.intercept('GET', this.ENDPOINTS.PRODUCTS, {
            statusCode: 200,
            body: products
          }).as('productsSuccess')
        })
      },
      emptyInventory: () => {
        cy.fixture('products').then((products) => {
          cy.intercept('GET', this.ENDPOINTS.PRODUCTS, {
            statusCode: 200,
            body: products.mockScenarios.emptyInventory
          }).as('productsEmpty')
        })
      },
      serverError: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('GET', this.ENDPOINTS.PRODUCTS, responses.products.serverError).as('productsServerError')
        })
      },
      customProducts: (products: any[]) => {
        cy.intercept('GET', this.ENDPOINTS.PRODUCTS, {
          statusCode: 200,
          body: { products }
        }).as('productsCustom')
      },
      slowResponse: (delay: number = 3000) => {
        cy.fixture('products').then((products) => {
          cy.intercept('GET', this.ENDPOINTS.PRODUCTS, (req) => {
            setTimeout(() => {
              req.reply({
                statusCode: 200,
                body: products
              })
            }, delay)
          }).as('productsSlow')
        })
      }
    }
  }

  // Cart mocking
  static mockCart(): {
    addItemSuccess: () => void
    addItemOutOfStock: () => void
    addItemServerError: () => void
    getCartEmpty: () => void
    getCartWithItems: () => void
    removeItemSuccess: () => void
    slowResponse: (delay?: number) => void
  } {
    return {
      addItemSuccess: () => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('POST', '**/api/cart/add', {
            statusCode: 200,
            body: {
              message: 'Item added to cart',
              cart: cart.cart.singleItem
            }
          }).as('addToCartSuccess')
        })
      },
      addItemOutOfStock: () => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('POST', '**/api/cart/add', 
            cart.mockScenarios.outOfStock
          ).as('addToCartOutOfStock')
        })
      },
      addItemServerError: () => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('POST', '**/api/cart/add', 
            cart.mockScenarios.serverError
          ).as('addToCartServerError')
        })
      },
      getCartEmpty: () => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('GET', this.ENDPOINTS.CART, {
            statusCode: 200,
            body: cart.cart.empty
          }).as('getCartEmpty')
        })
      },
      getCartWithItems: () => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('GET', this.ENDPOINTS.CART, {
            statusCode: 200,
            body: cart.cart.multipleItems
          }).as('getCartWithItems')
        })
      },
      removeItemSuccess: () => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('DELETE', '**/api/cart/remove', {
            statusCode: 200,
            body: {
              message: 'Item removed from cart',
              cart: cart.cart.empty
            }
          }).as('removeFromCartSuccess')
        })
      },
      slowResponse: (delay: number = 3000) => {
        cy.fixture('cart').then((cart) => {
          cy.intercept('GET', this.ENDPOINTS.CART, (req) => {
            setTimeout(() => {
              req.reply({
                statusCode: 200,
                body: cart.cart.singleItem
              })
            }, delay)
          }).as('cartSlow')
        })
      }
    }
  }

  // Checkout mocking
  static mockCheckout(): {
    success: () => void
    paymentError: () => void
    validationError: () => void
    serverError: () => void
    slowResponse: (delay?: number) => void
  } {
    return {
      success: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.CHECKOUT, responses.checkout.success).as('checkoutSuccess')
        })
      },
      paymentError: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.CHECKOUT, responses.checkout.paymentError).as('checkoutPaymentError')
        })
      },
      validationError: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.CHECKOUT, responses.checkout.validationError).as('checkoutValidationError')
        })
      },
      serverError: () => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.CHECKOUT, responses.checkout.serverError).as('checkoutServerError')
        })
      },
      slowResponse: (delay: number = 3000) => {
        cy.fixture('api-responses').then((responses) => {
          cy.intercept('POST', this.ENDPOINTS.CHECKOUT, (req) => {
            setTimeout(() => {
              req.reply(responses.checkout.success)
            }, delay)
          }).as('checkoutSlow')
        })
      }
    }
  }

  // Network condition simulation
  static simulateNetworkConditions(): {
    slowConnection: (kbps?: number) => void
    networkError: (endpoint: string) => void
    intermittentFailure: (endpoint: string, failureRate?: number) => void
    timeout: (endpoint: string) => void
  } {
    return {
      slowConnection: (_kbps: number = 56) => {
        cy.intercept('**', (req) => {
          req.reply((res) => {
            // Simulate slow connection
            const delay = Math.random() * 2000 + 1000 // 1-3 seconds
            setTimeout(() => {
              res.send()
            }, delay)
          })
        }).as('slowConnection')
      },
      networkError: (endpoint: string) => {
        cy.intercept('**/' + endpoint, { forceNetworkError: true }).as('networkError')
      },
      intermittentFailure: (endpoint: string, failureRate: number = 0.3) => {
        cy.intercept('**/' + endpoint, (req) => {
          if (Math.random() < failureRate) {
            req.reply({
              statusCode: 503,
              body: { error: 'Service temporarily unavailable' }
            })
          } else {
            req.continue()
          }
        }).as('intermittentFailure')
      },
      timeout: (endpoint: string) => {
        cy.intercept('**/' + endpoint, (_req) => {
          // Don't reply - causes timeout
        }).as('timeout')
      }
    }
  }

  // Utility methods
  static waitForMockCall(alias: string, timeout: number = 10000): Cypress.Chainable<any> {
    return cy.wait(`@${alias}`, { timeout })
  }

  static verifyMockCall(alias: string, expectedCount: number = 1): void {
    cy.get(`@${alias}.all`).should('have.length', expectedCount)
  }

  static getMockCallData(alias: string): Cypress.Chainable<any> {
    return cy.get(`@${alias}`).then((interception: any) => {
      return interception.request.body
    })
  }

  // Setup common mock scenarios
  static setupCommonMocks(): void {
    // Setup basic successful responses for all endpoints
    this.mockAuth().success()
    this.mockProducts().success()
    this.mockCart().getCartEmpty()
    this.mockCheckout().success()
  }

  static setupErrorScenarios(): void {
    // Setup error responses for testing error handling
    this.mockAuth().serverError()
    this.mockProducts().serverError()
    this.mockCart().addItemServerError()
    this.mockCheckout().serverError()
  }

  static setupSlowResponseScenarios(delay: number = 3000): void {
    // Setup slow responses for performance testing
    this.mockAuth().slowResponse(delay)
    this.mockProducts().slowResponse(delay)
    this.mockCart().slowResponse(delay)
    this.mockCheckout().slowResponse(delay)
  }

  // Reset all mocks
  static resetMocks(): void {
    cy.intercept('**', { middleware: false })
  }
} 