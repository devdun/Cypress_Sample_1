import { CheckoutPageSelectors } from './selectors/CheckoutPageSelectors'

export class CheckoutPage {
  // Methods - Step One
  visitCheckoutStepOne(): void {
    cy.visit('/checkout-step-one.html')
  }

  enterFirstName(firstName: string): void {
    cy.get(CheckoutPageSelectors.firstNameInput).clear().type(firstName)
  }

  enterLastName(lastName: string): void {
    cy.get(CheckoutPageSelectors.lastNameInput).clear().type(lastName)
  }

  enterZipCode(zipCode: string): void {
    cy.get(CheckoutPageSelectors.zipCodeInput).clear().type(zipCode)
  }

  clickContinue(): void {
    cy.get(CheckoutPageSelectors.continueButton).click()
  }

  clickCancel(): void {
    cy.get(CheckoutPageSelectors.cancelButton).click()
  }

  fillCheckoutInformation(firstName: string, lastName: string, zipCode: string): void {
    this.enterFirstName(firstName)
    this.enterLastName(lastName)
    this.enterZipCode(zipCode)
    this.clickContinue()
  }

  // Methods - Step Two
  visitCheckoutStepTwo(): void {
    cy.visit('/checkout-step-two.html')
  }

  clickFinish(): void {
    cy.get(CheckoutPageSelectors.finishButton).click()
  }

  clickCancelStep2(): void {
    cy.get(CheckoutPageSelectors.cancelButtonStep2).click()
  }

  // Methods - Step Three
  visitCheckoutComplete(): void {
    cy.visit('/checkout-complete.html')
  }

  clickBackHome(): void {
    cy.get(CheckoutPageSelectors.backHomeButton).click()
  }

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(CheckoutPageSelectors.errorMessage)
  }

  closeErrorMessage(): void {
    cy.get(CheckoutPageSelectors.errorButton).click()
  }

  // Validations - Step One
  validateCheckoutStepOneIsDisplayed(): void {
    cy.get(CheckoutPageSelectors.checkoutContainer).should('be.visible')
    cy.get(CheckoutPageSelectors.firstNameInput).should('be.visible')
    cy.get(CheckoutPageSelectors.lastNameInput).should('be.visible')
    cy.get(CheckoutPageSelectors.zipCodeInput).should('be.visible')
    cy.get(CheckoutPageSelectors.continueButton).should('be.visible')
    cy.url().should('include', '/checkout-step-one.html')
  }

  validateErrorMessage(expectedMessage: string): void {
    cy.get(CheckoutPageSelectors.errorMessage).should('contain.text', expectedMessage)
  }

  validateErrorMessageIsDisplayed(): void {
    cy.get(CheckoutPageSelectors.errorMessage).should('be.visible')
  }

  // Validations - Step Two
  validateCheckoutStepTwoIsDisplayed(): void {
    cy.get(CheckoutPageSelectors.checkoutSummaryContainer).should('be.visible')
    cy.get(CheckoutPageSelectors.finishButton).should('be.visible')
    cy.url().should('include', '/checkout-step-two.html')
  }

  validateOrderSummary(): void {
    cy.get(CheckoutPageSelectors.cartItems).should('have.length.greaterThan', 0)
    cy.get(CheckoutPageSelectors.summarySubtotal).should('be.visible')
    cy.get(CheckoutPageSelectors.summaryTax).should('be.visible')
    cy.get(CheckoutPageSelectors.summaryTotal).should('be.visible')
  }

  validateCartItemInSummary(itemName: string): void {
    cy.contains(CheckoutPageSelectors.cartItemNames, itemName).should('be.visible')
  }

  validateTotalCalculation(): void {
    cy.get(CheckoutPageSelectors.summarySubtotal).then(($subtotal) => {
      const subtotalText = $subtotal.text()
      const subtotalAmount = parseFloat(subtotalText.replace('Item total: $', ''))
      
      cy.get(CheckoutPageSelectors.summaryTax).then(($tax) => {
        const taxText = $tax.text()
        const taxAmount = parseFloat(taxText.replace('Tax: $', ''))
        
        cy.get(CheckoutPageSelectors.summaryTotal).then(($total) => {
          const totalText = $total.text()
          const totalAmount = parseFloat(totalText.replace('Total: $', ''))
          
          expect(totalAmount).to.equal(subtotalAmount + taxAmount)
        })
      })
    })
  }

  // Validations - Step Three
  validateCheckoutCompleteIsDisplayed(): void {
    cy.get(CheckoutPageSelectors.checkoutCompleteContainer).should('be.visible')
    cy.get(CheckoutPageSelectors.completeHeader).should('be.visible')
    cy.get(CheckoutPageSelectors.completeText).should('be.visible')
    cy.get(CheckoutPageSelectors.backHomeButton).should('be.visible')
    cy.url().should('include', '/checkout-complete.html')
  }

  validateOrderCompletionMessage(): void {
    cy.get(CheckoutPageSelectors.completeHeader).should('contain.text', 'Thank you for your order!')
    cy.get(CheckoutPageSelectors.completeText).should('contain.text', 'Your order has been dispatched')
  }

  validatePonyExpressImage(): void {
    cy.get(CheckoutPageSelectors.ponyExpressImage).should('be.visible')
  }
} 