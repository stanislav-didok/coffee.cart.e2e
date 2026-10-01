import { test, expect } from '@playwright/test';

const baseUrl = 'https://coffee-cart.app/';

// const extraCupYesButton = async (page) => {
//    await page.locator('button.yes').click();
// }

// const paymentCredentialsFill = async (page, promotion = false) => {
//    await page.locator('#name').fill('Stanislav Test');
//    await page.locator('#email').fill('test@gm.com');
//    if (promotion) {
//       await page.locator('#promotion').check();
//    }
//    await page.locator('#submit-payment').click();
// };

// const testIdLocator = (page, locatorId) => {
//    return page.getByTestId(locatorId);
// };

test('проведення звичайного замовлення', async ({ page }) => {

   const payButton = page.locator('button.pay');
   const successfulPaymentMessage = page.getByText('Thanks for your purchase. Please check your email for payment.');
   const tesIdLocatorEspresso = page.getByTestId('Espresso');
   const tesIdLocatorAmericano = page.getByTestId('Americano');
   let testLocatorName = page.locator('#name');
   let testLocatorEmail = page.locator('#email');
   let testSubmitButton = page.locator('#submit-payment');

   await page.goto(baseUrl);
   await tesIdLocatorEspresso.click();
   await tesIdLocatorAmericano.click();
   await payButton.click();
   await testLocatorName.fill('Stanislav Test');
   await testLocatorEmail.fill('test@gm.com');
   await testSubmitButton.click(); 
   await expect(successfulPaymentMessage).toBeVisible();
});

test('проведення замовлення з додатковим товаром зі знижкою', async ({ page }) => {

   const tesIdLocatorEspressoMacchiato = page.getByTestId('Espresso_Macchiato');
   const tesIdLocatorEspressoPanna = page.getByTestId('Espresso_Con Panna');
   const tesIdLocatorAmericano = page.getByTestId('Americano');
   const successfulPaymentMessage = page.getByText('Thanks for your purchase. Please check your email for payment.');
   const payButton = page.locator('button.pay');
   const yesButton = page.locator('button.yes');
   let testLocatorName = page.locator('#name');
   let testLocatorEmail = page.locator('#email');
   let testPromotionCheck = page.locator('#promotion');
   let testSubmitButton = page.locator('#submit-payment');

   await page.goto(baseUrl);
   await tesIdLocatorEspressoMacchiato.click();
   await tesIdLocatorEspressoPanna.click();
   await tesIdLocatorAmericano.click();
   await yesButton.click();
   await payButton.click();
   await testLocatorName.fill('Stanislav Test');
   await testLocatorEmail.fill('test@gm.com');
   await testPromotionCheck.check();
   await testSubmitButton.click();
   await expect(successfulPaymentMessage).toBeVisible();
});


test('товар зі знижкою все ще у корзині після видалення звичайних товарів', async ({ page }) => {

   const tesIdLocatorEspresso = page.getByTestId('Espresso');
   const yesButton = page.locator('button.yes');
   let cartLocator = page.locator('a[href="/cart"]');
   let removeItemsButton = page.locator('button[aria-label="Remove all Espresso"]');
   let discountItem = page.locator('ul:not(.cart-preview) > li.list-item > div:first-child');
   

   await page.goto(baseUrl);
   await tesIdLocatorEspresso.click({ clickCount: 3 });
   await yesButton.click();
   await cartLocator.click();
   await removeItemsButton.click();
   await expect(discountItem).toBeVisible();

});

test('товар зі знижкою не додається якщо додати товари у корзині', async ({ page }) => {

   let cartLocator = page.locator('a[href="/cart"]');
   let plusItemButton = page.locator('ul:not(.cart-preview) button[aria-label="Add one Americano"]');
   let discountItemQuantity = page.locator('li.list-header > div:nth-child(2)');
   const tesIdLocatorAmericano = page.getByTestId('Americano');

   await page.goto(baseUrl);
   await tesIdLocatorAmericano.click();
   await cartLocator.click();
   await plusItemButton.click({ clickCount: 2 });
   await expect(discountItemQuantity).toHaveText('Unit');

});

test('товар зі знижкою додається "+" у корзині навіть якщо не додати звичайні товари', async ({ page }) => {

   const tesIdLocatorEspressoMacchiato = page.getByTestId('Espresso_Macchiato');
   const tesIdLocatorFlatWhite = page.getByTestId('Flat_White');
   const tesIdLocatorCafeLatte = page.getByTestId('Cafe_Latte');
   const yesButton = page.locator('button.yes');
   let cartLocator = page.locator('a[href="/cart"]');
   let addDiscountedItemButton = page.locator('ul:not(.cart-preview) button[aria-label="Add one (Discounted) Mocha"]');
   let checkDiscountedItemQuantity = page.locator('div:has(> .unit-controller button[aria-label="Add one (Discounted) Mocha"]) > span.unit-desc');

   await page.goto(baseUrl);
   await tesIdLocatorEspressoMacchiato.click();
   await tesIdLocatorFlatWhite.click();
   await tesIdLocatorCafeLatte.click();
   await yesButton.click();
   await cartLocator.click();
   await addDiscountedItemButton.click();
   await expect(checkDiscountedItemQuantity).toHaveText('$4.00 x 2');
});
