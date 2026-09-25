import { test, expect } from '@playwright/test';

test('проведення звичайного замовлення', async ({ page }) => {
  await page.goto('');
  await page.getByTestId('Espresso').click();
  await page.getByTestId('Americano').click();
  await page.getByRole('button', { name: 'checkout' }).click();
  await page.getByLabel('name').fill('Stanislav Test');
  await page.getByLabel('email').fill('test@gm.com');
  await page.getByText('Submit', { exact: true }).click();
  await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

test('проведення замовлення з додатковим товаром зі знижкою', async ({ page }) => {
  await page.goto('');
  await page.getByLabel('Espresso Macchiato').click();
  await page.getByLabel('Espresso Con Panna').click();
  await page.getByLabel('Americano').click();
  await page.locator('button.yes').click();
  await page.getByLabel('Proceed to checkout').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Stanislav Test');
  await page.getByRole('textbox', { name: 'Email' }).fill('test@gm.com');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
});

test('товар зі знижкою все ще у корзині після видалення звичайних товарів', async ({ page }) => {
  await page.goto('');
  await page.getByLabel('Espresso', { exact: true }).click({ clickCount: 3 });
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await page.getByRole('button', { name: 'Remove all Espresso' }).click();
});

test('товар зі знижкою не додається якщо додати товари у корзині', async ({ page }) => {
  await page.goto('');
  await page.getByLabel('Americano').click();
  await page.getByLabel('Cart page').click();
  await page.getByRole('button', { name: 'Add one Americano' }).click({ clickCount: 2 });
});

test('товар зі знижкою додається "+" у корзині навіть якщо не додати звичайні товари', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.getByLabel('Espresso Macchiato').click();
  await page.getByLabel('Flat White').click();
  await page.getByLabel('Cafe Latte').click();
  await page.getByRole('button', { name: 'Yes, of course!' }).click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await page.getByRole('button', { name: 'Add one (Discounted) Mocha'}).click();
});
