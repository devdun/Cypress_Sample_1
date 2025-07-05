export class CartPageSelectors {
  // Container selectors
  static readonly cartContainer = '.cart_contents_container'
  static readonly cartList = '.cart_list'
  static readonly appLogo = '.app_logo'
  
  // Cart item selectors
  static readonly cartItems = '.cart_item'
  static readonly cartItemNames = '.inventory_item_name'
  static readonly cartItemPrices = '.inventory_item_price'
  static readonly cartItemDescriptions = '.inventory_item_desc'
  static readonly cartItemQuantities = '.cart_quantity'
  
  // Button selectors
  static readonly removeButtons = '[data-test*="remove"]'
  static readonly checkoutButton = '[data-test="checkout"]'
  static readonly continueShoppingButton = '[data-test="continue-shopping"]'
  
  // Dynamic button selectors
  static removeButton = (itemName: string) => {
    // Try different formats for remove button selectors
    const itemId = itemName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    return `[data-test="remove-${itemId}"]`
  }
  
  // Cart badge selectors
  static readonly shoppingCartLink = '[data-test="shopping-cart-link"]'
  static readonly shoppingCartBadge = '.shopping_cart_badge'
  
  // Page validation selectors
  static readonly pageBody = 'body'
} 