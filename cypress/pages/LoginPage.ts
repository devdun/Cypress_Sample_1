import { LoginPageSelectors } from './selectors/LoginPageSelectors'

export class LoginPage {
  // Methods
  visit(): void {
    cy.visit('/')
  }

  enterUsername(username: string): void {
    cy.get(LoginPageSelectors.usernameInput).clear()
    if (username) {
      cy.get(LoginPageSelectors.usernameInput).type(username)
    }
  }

  enterPassword(password: string): void {
    cy.get(LoginPageSelectors.passwordInput).clear()
    if (password) {
      cy.get(LoginPageSelectors.passwordInput).type(password)
    }
  }

  clickLogin(): void {
    cy.get(LoginPageSelectors.loginButton).click()
  }

  login(username: string, password: string): void {
    this.enterUsername(username)
    this.enterPassword(password)
    this.clickLogin()
  }

  getErrorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(LoginPageSelectors.errorMessage)
  }

  closeErrorMessage(): void {
    cy.get(LoginPageSelectors.errorButton).click()
  }

  // Validations
  validateLoginPageIsDisplayed(): void {
    cy.get(LoginPageSelectors.loginContainer).should('be.visible')
    cy.get(LoginPageSelectors.loginLogo).should('be.visible')
    cy.get(LoginPageSelectors.usernameInput).should('be.visible')
    cy.get(LoginPageSelectors.passwordInput).should('be.visible')
    cy.get(LoginPageSelectors.loginButton).should('be.visible')
  }

  validateErrorMessage(expectedMessage: string): void {
    cy.get(LoginPageSelectors.errorMessage).should('contain.text', expectedMessage)
  }

  validateErrorMessageIsDisplayed(): void {
    cy.get(LoginPageSelectors.errorMessage).should('be.visible')
  }

  validateLoginCredentialsAreDisplayed(): void {
    cy.get(LoginPageSelectors.loginCredentials).should('be.visible')
    cy.get(LoginPageSelectors.loginPassword).should('be.visible')
  }

  validatePageTitle(): void {
    cy.title().should('eq', 'Swag Labs')
  }

  validatePageURL(): void {
    cy.url().should('include', 'saucedemo.com')
  }
} 