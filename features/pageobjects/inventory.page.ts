import { Constant } from '../../utility/constants.ts';
import BasePage from './base.page.ts';

class InventoryPage extends BasePage {

    async addProductToCart(productName: string) {
        const slug = productName.toLowerCase().replace(/\s+/g, '-');
        const selector = `[data-test="add-to-cart-${slug}"]`;
        await $(selector).waitForDisplayed({ timeout: 10000 });
        await $(selector).click();
    }

    async goToCart() {
        await $(Constant.CART_ICON_ID).click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('cart.html'),
            { timeout: 10000, timeoutMsg: 'Cart page did not load in time' }
        );
    }

    async sortBy(optionText: string) {
        const dropdown = await $(Constant.SORT_DROPDOWN);
        await dropdown.selectByVisibleText(optionText);
    }

    async getFirstProductName(): Promise<string> {
        const first = await $(Constant.PRODUCT_NAME_ELEMENTS);
        return first.getText();
    }

    async getAllProductPrices(): Promise<number[]> {
        const priceElements = await $$(Constant.PRODUCT_PRICE_ELEMENTS);
        const prices: number[] = [];
        for (const el of priceElements) {
            const text = await el.getText();
            prices.push(parseFloat(text.replace('$', '')));
        }
        return prices;
    }

    async getCartBadgeCount(): Promise<string> {
        const badge = await $(Constant.CART_BADGE);
        return badge.getText();
    }
}

export default new InventoryPage();