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

   const payButton = page.locator('button.pay');
   const successfulPaymentMessage = page.getByText('Thanks for your purchase. Please check your email for payment.');

   await page.goto(baseUrl);
   await testIdLocator(page, 'Espresso').click();
   await testIdLocator(page, 'Americano').click();
   await payButton.click();
   await paymentCredentialsFill(page);
   await expect(successfulPaymentMessage).toBeVisible();
});

test('проведення замовлення з додатковим товаром зі знижкою', async ({ page }) => {

   const promotion = true;
   const successfulPaymentMessage = page.getByText('Thanks for your purchase. Please check your email for payment.');
   const payButton = page.locator('button.pay');

   await page.goto(baseUrl);
   await testIdLocator(page, 'Espresso_Macchiato').click();
   await testIdLocator(page, 'Espresso_Con Panna').click();
   await testIdLocator(page, 'Americano').click();
   await extraCupYesButton(page);
   await payButton.click();
   await paymentCredentialsFill(page, promotion);
   await expect(successfulPaymentMessage).toBeVisible();
});


test('товар зі знижкою все ще у корзині після видалення звичайних товарів', async ({ page }) => {

   let cartLocator = page.locator('a[href="/cart"]');
   let removeItemsButton = page.locator('button[aria-label="Remove all Espresso"]');
   let discountItem = page.locator('ul:not(.cart-preview) > li.list-item > div:first-child');

   await page.goto(baseUrl);
   await testIdLocator(page, 'Espresso').click({ clickCount: 3 });
   await extraCupYesButton(page);
   await cartLocator.click();
   await removeItemsButton.click();
   await expect(discountItem).toBeVisible();

});

test('товар зі знижкою не додається якщо додати товари у корзині', async ({ page }) => {

   let cartLocator = page.locator('a[href="/cart"]');
   let plusItemButton = page.locator('ul:not(.cart-preview) button[aria-label="Add one Americano"]');
   let discountItemQuantity = page.locator('li.list-header > div:nth-child(2)')

   await page.goto(baseUrl);
   await testIdLocator(page, 'Americano').click();
   await cartLocator.click();
   await plusItemButton.click({ clickCount: 2 });
   await expect(discountItemQuantity).toHaveText('Unit');

});

test('товар зі знижкою додається "+" у корзині навіть якщо не додати звичайні товари', async ({ page }) => {

   let cartLocator = page.locator('a[href="/cart"]');
   let addDiscountedItemButton = page.locator('ul:not(.cart-preview) button[aria-label="Add one (Discounted) Mocha"]');
   let checkDiscountedItemQuantity = page.locator('div:has(> .unit-controller button[aria-label="Add one (Discounted) Mocha"]) > span.unit-desc');

   await page.goto(baseUrl);
   await testIdLocator(page, 'Espresso_Macchiato').click();
   await testIdLocator(page, 'Flat_White').click();
   await testIdLocator(page, 'Cafe_Latte').click();
   await extraCupYesButton(page);
   await cartLocator.click();
   await addDiscountedItemButton.click();
   await expect(checkDiscountedItemQuantity).toHaveText('$4.00 x 2');
});

