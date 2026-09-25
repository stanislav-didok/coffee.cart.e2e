import { test, expect } from '@playwright/test';

test('проведення звичайного замовлення', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Americano"]').click();
  await page.locator('button', { hasText: 'Total' }).click();
  await page.locator('#name').fill('Stanislav Test');
  await page.locator('#email').fill('test@gm.com');
  await page.locator('#submit-payment').click();
  await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

test('проведення замовлення з додатковим товаром зі знижкою', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Espresso_Con Panna"]').click();
  await page.locator('[data-test="Americano"]').click();
  await page.locator('button.yes').click();
  await page.locator('button', { hasText: 'Total' }).click();
  await page.locator('#name').fill('Stanislav Test');
  await page.locator('#email').fill('test@gm.com');
  await page.locator('#promotion').check();
  await page.locator('#submit-payment').click();
  await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

test('товар зі знижкою все ще у корзині після видалення звичайних товарів', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Espresso"]').click({ clickCount: 3 });
  await page.locator('button.yes').click();
  await page.locator('a[href="/cart"]').click();
  await page.locator('button[aria-label="Remove all Espresso"]').click();
});

test('товар зі знижкою не додається якщо додати товари у корзині', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Americano"]').click();
  await page.locator('a[href="/cart"]').click();
  await page.locator('ul:not(.cart-preview) button[aria-label="Add one Americano"]').click({ clickCount: 2 });
});

test('товар зі знижкою додається "+" у корзині навіть якщо не додати звичайні товари', async ({ page }) => {
  await page.goto('');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Flat_White"]').click();
  await page.locator('[data-test="Cafe_Latte"]').click();
  await page.locator('button.yes').click();
  await page.locator('a[href="/cart"]').click();
  await page.locator('ul:not(.cart-preview) button[aria-label="Add one (Discounted) Mocha"]').click();
});
