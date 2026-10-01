import { test, expect } from '@playwright/test';

const baseUrl = 'https://coffee-cart.app/';

const extraCupYesButton = async (page) => {
   await page.locator('button.yes').click();
}

const paymentCredentialsFill = async (page, promotion = false) => {
   await page.locator('#name').fill('Stanislav Test');
   await page.locator('#email').fill('test@gm.com');
   if (promotion) {
      await page.locator('#promotion').check();
   }
   await page.locator('#submit-payment').click();
};

const testIdLocator = (page, locatorId) => {
   return page.getByTestId(locatorId);
};

test('проведення звичайного замовлення', async ({ page }) => {

   const payButton = await page.locator('button.pay');
   const s

   await page.goto(baseUrl);
   await testIdLocator(page, 'Espresso').click();
   await testIdLocator(page, 'Americano').click();
   await payButton.click();
   await paymentCredentialsFill(page);
   await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

test('проведення замовлення з додатковим товаром зі знижкою', async ({ page }) => {

   const promotion = true;

   await page.goto(baseUrl);
   await page.locator('[data-test="Espresso_Macchiato"]').click();
   await page.locator('[data-test="Espresso_Con Panna"]').click();
   await page.locator('[data-test="Americano"]').click();
   await extraCupYesButton(page);
   await page.locator('button.pay').click();
   await paymentCredentialsFill(page, promotion);
   await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

test('товар зі знижкою все ще у корзині після видалення звичайних товарів', async ({ page }) => {
   await page.goto(baseUrl);
   await page.getByTestId('Espresso').click({ clickCount: 3 });
   await extraCupYesButton(page);
   await page.locator('a[href="/cart"]').click();
   await page.locator('button[aria-label="Remove all Espresso"]').click();
   await expect(page.locator('ul:not(.cart-preview) > li.list-item > div:first-child')).toBeVisible();

});

test('товар зі знижкою не додається якщо додати товари у корзині', async ({ page }) => {
   await page.goto(baseUrl);
   await page.locator('[data-test="Americano"]').click();
   await page.locator('a[href="/cart"]').click();
   await page.locator('ul:not(.cart-preview) button[aria-label="Add one Americano"]').click({ clickCount: 2 });
   await expect(page.locator('li.list-header > div:nth-child(2)')).toHaveText('Unit');

});

test('товар зі знижкою додається "+" у корзині навіть якщо не додати звичайні товари', async ({ page }) => {
   await page.goto(baseUrl);
   await page.locator('[data-test="Espresso_Macchiato"]').click();
   await page.locator('[data-test="Flat_White"]').click();
   await page.locator('[data-test="Cafe_Latte"]').click();
   await extraCupYesButton(page);
   await page.locator('a[href="/cart"]').click();
   await page.locator('ul:not(.cart-preview) button[aria-label="Add one (Discounted) Mocha"]').click();
   await expect(page.locator('div:has(> .unit-controller button[aria-label="Add one (Discounted) Mocha"]) > span.unit-desc')).toHaveText('$4.00 x 2');
});


// const emailField = page.locator('#email');
//    const nameField = page.locator('#name');
//    const promField = page.locator('#promotion');
//    const submitPay = page.locator('#submit-payment');