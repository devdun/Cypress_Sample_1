export class CheckoutPageSelectors {
  // Step One (Information) selectors
  static readonly checkoutContainer = '.checkout_info_container'
  static readonly firstNameInput = '[data-test="firstName"]'
  static readonly lastNameInput = '[data-test="lastName"]'
  static readonly zipCodeInput = '[data-test="postalCode"]'
  static readonly continueButton = '[data-test="continue"]'
  static readonly cancelButton = '[data-test="cancel"]'
  
  // Error selectors
  static readonly errorMessage = '[data-test="error"]'
  static readonly errorButton = '[data-test="error-button"]'
  
  // Step Two (Overview) selectors
  static readonly checkoutSummaryContainer = '.checkout_summary_container'
  static readonly cartItems = '.cart_item'
  static readonly cartItemNames = '.inventory_item_name'
  static readonly cartItemPrices = '.inventory_item_price'
  static readonly cartItemQuantities = '.cart_quantity'
  
  // Summary information selectors
  static readonly paymentInfo = '.summary_info_label'
  static readonly shippingInfo = '.summary_info_label'
  static readonly priceTotal = '.summary_info_label'
  static readonly summarySubtotal = '.summary_subtotal_label'
  static readonly summaryTax = '.summary_tax_label'
  static readonly summaryTotal = '.summary_total_label'
  
  // Step Two buttons
  static readonly finishButton = '[data-test="finish"]'
  static readonly cancelButtonStep2 = '[data-test="cancel"]'
  
  // Step Three (Complete) selectors
  static readonly checkoutCompleteContainer = '.checkout_complete_container'
  static readonly completeHeader = '.complete-header'
  static readonly completeText = '.complete-text'
  static readonly backHomeButton = '[data-test="back-to-products"]'
  static readonly ponyExpressImage = '.pony_express'
  
  // Page validation selectors
  static readonly pageBody = 'body'
} 