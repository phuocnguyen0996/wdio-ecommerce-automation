import { When, Then, Before } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import InventoryPage from '../pageobjects/inventory.page.ts';
import CartPage from '../pageobjects/cart.page.ts';
import { Constant } from '../../utility/constants.ts';

// Clear localStorage before each @cart scenario to prevent cart state leaking
// between scenarios that share the same browser session.
// Wrapped in try/catch because localStorage is inaccessible on about:blank (fresh session).
Before({ tags: '@cart' }, async () => {
    try {
        await browser.execute(() => window.localStorage.clear());
    } catch {
        // Fresh browser session with no page loaded — localStorage already empty.
    }
});

When('I sort products by {string}', async (option: string) => {
    await InventoryPage.sortBy(option);
});

Then('the first product name should be {string}', async (expectedName: string) => {
    const actualName = await InventoryPage.getFirstProductName();
    expect(actualName).toBe(expectedName);
});

Then('all product prices should be sorted in ascending order', async () => {
    const prices = await InventoryPage.getAllProductPrices();
    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i] <= prices[i + 1]).toBe(true);
    }
});

Then('the cart badge should show {string}', async (count: string) => {
    const badge = await InventoryPage.getCartBadgeCount();
    expect(badge).toBe(count);
});

When('I remove {string} from cart', async (productName: string) => {
    await CartPage.removeProduct(productName);
});

Then('the cart should be empty', async () => {
    const isEmpty = await CartPage.isCartEmpty();
    expect(isEmpty).toBe(true);
});

When('I click continue shopping', async () => {
    await CartPage.continueShopping();
});

Then('I should be on the inventory page', async () => {
    await expect(browser).toHaveUrl(Constant.INVENTORY_URL);
});
