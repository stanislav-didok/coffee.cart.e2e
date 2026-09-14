import { test, expect } from '@playwright/test';

test('проведення звичайного замовлення', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Americano"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Stanislav Test');
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gm.com');
  await page.getByRole('button', { name: 'Submit' }).click();
});

test('проведення замовлення з додатковим товаром зі знижкою', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Espresso_Con Panna"]').click();
  await page.locator('[data-test="Americano"]').click();
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Stanislav Test');
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gm.com');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
});

test('товар зі знижкою все ще у корзині після видалення звичайних товарів', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Espresso"]').click();
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await page.getByRole('button', { name: 'Remove all Espresso' }).click();
});

test('товар зі знижкою не додається якщо додати товари у корзині', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Americano"]').click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await page.getByRole('button', { name: 'Add one Americano' }).click();
  await page.getByRole('button', { name: 'Add one Americano' }).click();
});

test('товар зі знижкою додається у корзині навіть якщо не додати звичайні товари', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Flat_White"]').click();
  await page.locator('[data-test="Cafe_Latte"]').click();
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await page.getByRole('button', { name: 'Add one (Discounted) Mocha' }).click();
});
