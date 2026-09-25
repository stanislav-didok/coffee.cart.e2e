import { test, expect } from '@playwright/test';

// 1. Практика accessibility-локаторів

test('aria locators testing', async ({ page }) => {
   await page.goto('http://104.168.59.50/laboratory/aria');
   await page.getByPlaceholder('student@example.com').fill('aa@gm.com')  //плейсхолдер взятий по назві плейсхолдеру для елементу "email" у css властивостях
   //await page.getByRole('textbox', { name: "Email адреса *" }).fill('aa@gm.com'); //роль елемента взята з accessibility властивостей елемента name з ім'я елемента в css
   await page.getByLabel('Пароль *').fill('QWErty123'); // елемент взятий з css властивості eлемента label
   await page.getByRole('button', { name: "Створити профіль" }).click(); // роль узята з пошуку у css dom дереві по тегу button + тексту
   //await expect(page.getByText('Форма містить помилки. Виправте позначені поля.')).toBeVisible(); // пошук по тексту css НЕ строго
   //await expect(page.getByText(/Форма містить помилки./)).toBeVisible(); // пошук по частині тексту css
   //await expect(page.getByText('Форма містить помилки. Виправте позначені поля.', { exact: true })).toBeVisible(); // пошук у css строго по визначеному тексту.
});

test('get by alt text', async ({ page }) => {
   await page.goto('https://playwright.dev/');
   await page.getByAltText('Chromium, Firefox, WebKit').click(); // пошук по css alt властивості eлементу dom дерева 
});

// 2. Таблиця

test('table testing', async ({ page }) => {
   await page.goto('');
   await expect(page.getByRole('table')).toBeVisible();

   const rows = page.getByRole('row');
   const rowCount = await rows.count();
   //console.log(await page.getByRole('row').count());
   //console.log(await page.getByRole('row').filter({ hasText: "Користувач" }).innerText());
   const targetRow = page.getByRole('row').filter({ hasText: "Користувач" });
   const emailCell = targetRow.getByRole('cell').nth(0);
   await expect(emailCell).toHaveText('maria@example.com');
   // for (let i = 0; i < rowCount; i++) {
   //    const row = rows.nth(i);
   //    const rowText = await row.innerText();
   //    console.log(`Рядок ${i}:`, rowText);
   // };
});
