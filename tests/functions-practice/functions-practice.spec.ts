import { test, expect, Page } from "@playwright/test";

import {
   completingOrderElements,
   itemLocator,
   payButtonLocator,
   yesOfCourseButton,
}
from './page-actions';

const baseUrl = 'https://coffee-cart.app/';

test('001F - simple-order-completing', async ({ page }) => {
   await page.goto(baseUrl);
   await itemLocator(page, 'Espresso');
   await itemLocator(page, 'Americano');
   await payButtonLocator(page);
   await completingOrderElements(page, 'Stanislav Test', 'test@gm.com', false);
   await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

test('002F - order-completing-with-additional-discount-item', async ({ page }) => {
   await page.goto(baseUrl);
   await itemLocator(page, 'Espresso_Macchiato');
   await itemLocator(page, 'Espresso_Con Panna');
   await itemLocator(page, 'Americano');
   await yesOfCourseButton(page);
   await payButtonLocator(page);
   await completingOrderElements(page, 'Stanislav Test', 'test@gm.com', true);
   await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
});

