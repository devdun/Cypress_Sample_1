export class ProductsPageSelectors {
  // Container selectors
  static readonly productsContainer = '.inventory_container'
  static readonly productsList = '.inventory_list'
  static readonly appLogo = '.app_logo'
  
  // Product selectors
  static readonly productItems = '.inventory_item'
  static readonly productNames = '.inventory_item_name'
  static readonly productPrices = '.inventory_item_price'
  static readonly productDescriptions = '.inventory_item_desc'
  static readonly productImages = '.inventory_item_img'
  
  // Button selectors
  static readonly addToCartButtons = '[data-test*="add-to-cart"]'
  static readonly removeFromCartButtons = '[data-test*="remove"]'
  
  // Dynamic button selectors (require item name)
  static addToCartButton = (itemName: string) => `[data-test="add-to-cart-${itemName}"]`
  static removeButton = (itemName: string) => `[data-test="remove-${itemName}"]`
  
  // Cart selectors
  static readonly shoppingCartLink = '[data-test="shopping-cart-link"]'
  static readonly shoppingCartBadge = '.shopping_cart_badge'
  
  // Sort selectors
  static readonly sortDropdown = '[data-test="product-sort-container"]'
  
  // Menu selectors
  static readonly menuButton = '#react-burger-menu-btn'
  static readonly menuContainer = '.bm-menu'
  static readonly menuCloseButton = '#react-burger-cross-btn'
  static readonly logoutLink = '#logout_sidebar_link'
  
  // Product detail selectors
  static readonly backToProductsButton = '[data-test="back-to-products"]'
} 