export class LoginPageSelectors {
  // Input selectors
  static readonly usernameInput = '[data-test="username"]'
  static readonly passwordInput = '[data-test="password"]'
  static readonly loginButton = '[data-test="login-button"]'
  
  // Error selectors
  static readonly errorMessage = '[data-test="error"]'
  static readonly errorButton = '[data-test="error-button"]'
  
  // Container selectors
  static readonly loginContainer = '.login_container'
  static readonly loginLogo = '.login_logo'
  static readonly loginCredentials = '.login_credentials'
  static readonly loginPassword = '.login_password'
  
  // Page elements
  static readonly pageTitle = 'title'
  static readonly pageBody = 'body'
} 