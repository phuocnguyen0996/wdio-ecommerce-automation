export class Constant {
    // Login
    static readonly ERROR_MESSAGE_TEXT = "Epic sadface: Sorry, this user has been locked out.";
    static readonly BASE_URL = 'https://www.saucedemo.com';
    static readonly INVENTORY_URL = 'https://www.saucedemo.com/inventory.html';
    static readonly USERNAME = 'standard_user';
    static readonly PASSWORD = 'secret_sauce';
    static readonly USER_NAME_CLASS = '#user-name';
    static readonly PASSWORD_CLASS = '#password';
    static readonly LOGIN_BUTTON_CLASS = '#login-button';
    static readonly ERROR_MESSAGE_CLASS = '.error-message-container.error';

    // Inventory
    static readonly CART_ICON_ID = '.shopping_cart_link';
    static readonly PRODUCT_ELEMENT = `//div[text()="[PRODUCT_NAME]"]/ancestor::div[@class="inventory_item"]`;
    static readonly SORT_DROPDOWN = 'select[data-test="product-sort-container"]';
    static readonly PRODUCT_NAME_ELEMENTS = '.inventory_item_name';
    static readonly PRODUCT_PRICE_ELEMENTS = '.inventory_item_price';
    static readonly CART_BADGE = '.shopping_cart_badge';

    // Cart
    static readonly CHECKOUT_BUTTON_ID = '#checkout';
    static readonly CART_ITEMS = '.cart_item';
    static readonly CONTINUE_SHOPPING_BTN = '[data-test="continue-shopping"]';

    // Checkout
    static readonly FIRST_NAME_CLASS = '#first-name';
    static readonly LAST_NAME_CLASS = '#last-name';
    static readonly POSTAL_CODE_CLASS = '#postal-code';
    static readonly CONTINUE_BUTTON_ID = '#continue';
    static readonly FINISH_BUTTON_ID = '#finish';
    static readonly COMPLETE_HEADER_CLASS = '.complete-header';
}

