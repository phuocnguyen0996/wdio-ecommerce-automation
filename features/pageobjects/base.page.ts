export default class BasePage {
    async open(path = '') {
        await browser.url(path);
    }

    async getTitle(): Promise<string> {
        return browser.getTitle();
    }

    async getCurrentUrl(): Promise<string> {
        return browser.getUrl();
    }

    async waitAndClick(selector: string, timeout = 10000): Promise<void> {
        const el = await $(selector);
        await el.waitForDisplayed({ timeout });
        await el.click();
    }

    async waitAndSetValue(selector: string, value: string, timeout = 10000): Promise<void> {
        const el = await $(selector);
        await el.waitForDisplayed({ timeout });
        await el.setValue(value);
    }

    async isElementDisplayed(selector: string): Promise<boolean> {
        try {
            return await $(selector).isDisplayed();
        } catch {
            return false;
        }
    }
}
