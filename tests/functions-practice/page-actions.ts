import { Page } from "@playwright/test";

export async function completingOrderElements(page: Page, name: string, email: string, promotion: boolean) {
   await page.locator('#name').fill(name);
   await page.locator('#email').fill(email);
   if (promotion === true) {
      await page.locator('#promotion').check();
   }
   await page.locator('#submit-payment').click();
};

export async function itemLocator(page: Page, name: string) {
   await page.locator(`[data-test="${name}"]`).click();
}

export async function payButtonLocator(page: Page) {
   await page.locator('button.pay').click();
}

export async function yesOfCourseButton(page: Page) {
   await page.locator('button.yes').click();

}
