import { Page, expect } from "@playwright/test";

export const fillName = () => `Tester-${Math.floor(Math.random() * 100)}`;
export const fillEmail = () => `${Date.now()}${Math.floor(Math.random() * 1000)}@gm.com`;
export const fillMessage = () => `Опис запиту: ${Math.floor(Math.random() * 100)}`;

export async function fieldsFillingSteps(page: Page, name: () => string, email: () => string, themeSelection: boolean, message: () => string, priority: boolean, copyMe: boolean) {
   await page.getByTestId('contact-name').fill(name());
   await page.getByTestId('contact-email').fill(email());
   if (themeSelection) {
      await page.getByTestId('contact-subject').selectOption('feature');
   };
   if (priority) {
      await page.getByTestId('contact-priority-low').check();
   };
   await page.getByTestId('contact-message').fill(message());
   if (copyMe) {
      await page.getByTestId('contact-copy-me').check();
   };
   await page.getByTestId('contact-submit').click();
}

export const testData = [{
   id: 1,
   steps: (page: Page) => fieldsFillingSteps(page, fillName, fillEmail, true, fillMessage, true, true),
   expect: async (page: Page) => await expect(page.getByTestId("contact-success")).toBeVisible(),
},
{
   id: 2,
   steps: (page: Page) => fieldsFillingSteps(page, fillName, fillEmail, false, fillMessage, false, false),
   expect: async (page: Page) => await expect(page.getByTestId("contact-success")).toBeVisible(),

},
{
   id: 3,
   steps: (page: Page) => fieldsFillingSteps(page, () => "", () => "", true, () => "", true, true),
   expect: async (page: Page) => await expect(page.getByTestId("error-messages")).toBeVisible(),
}
];