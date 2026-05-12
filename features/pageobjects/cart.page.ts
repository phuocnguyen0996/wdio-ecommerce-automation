import { Constant } from '../../utility/constants.ts';
import BasePage from './base.page.ts';

class CartPage extends BasePage {

    get checkoutBtn() { return $(Constant.CHECKOUT_BUTTON_ID); }

    async clickCheckout() {
        await this.checkoutBtn.click();
    }

    async removeProduct(productName: string) {
        const slug = productName.toLowerCase().replace(/\s+/g, '-');
        const removeBtn = $(`[data-test="remove-${slug}"]`);
        await removeBtn.waitForDisplayed({ timeout: 10000 });
        await removeBtn.click();
    }

    async continueShopping() {
        await $(Constant.CONTINUE_SHOPPING_BTN).click();
    }

    async isCartEmpty(): Promise<boolean> {
        await browser.waitUntil(
            async () => (await $$(Constant.CART_ITEMS)).length === 0,
            { timeout: 5000, interval: 300, timeoutMsg: 'Cart still has items after removal' }
        );
        return true;
    }
}

export default new CartPage();