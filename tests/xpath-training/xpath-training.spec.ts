import { test, expect } from '@playwright/test';

test('XPATH-001-all-checkboxes-checking', async ({ page }) => {
   await page.goto('');
   await page.locator('xpath=//*[@data-testid = "interactions-row-select-1"]').check();
   await expect(page.locator('xpath=//*[@data-testid = "interactions-row-select-1"]')).toBeChecked();
   await page.locator('xpath=//*[@data-testid = "interactions-row-select-2"]').check();
   await expect(page.locator('xpath=//*[@data-testid = "interactions-row-select-2"]')).toBeChecked();
   await page.locator('xpath=//*[@data-testid = "interactions-row-select-3"]').check();
   await expect(page.locator('xpath=//*[@data-testid = "interactions-row-select-3"]')).toBeChecked();
   await page.locator('xpath=//*[@data-testid = "interactions-row-select-4"]').check();
   await expect(page.locator('xpath=//*[@data-testid = "interactions-row-select-4"]')).toBeChecked();
   await expect(page.locator('xpath=//span[@data-testid="interactions-selected-count"]')).toHaveText('Вибрано: 4');
});

test('XPATH-002-sorting-functions-checking', async ({ page }) => {
   await page.goto('');
   await page.locator('xpath=//button[@data-testid="interactions-sort-name"]').click();
   await expect(page.locator('xpath=//button[contains(text(), "Тест")]/parent::th[@aria-sort="descending"]')).toBeVisible();
   await page.locator('xpath=//button[@data-testid="interactions-sort-status"]').click();
   await expect(page.locator('xpath=//button[contains(text(), "Статус")]/parent::th[@aria-sort="ascending"]')).toBeVisible();
   await page.locator('xpath=//button[@data-testid="interactions-sort-duration"]').click();
   await expect(page.locator('xpath=//button[contains(text(), "Тривалість")]/parent::th[@aria-sort="ascending"]')).toBeVisible();
});
