import { expect, test } from "@playwright/test";

// Авторизація вже виконана в globalSetup (storageState.json)
test.use({ storageState: "storageState.json" });

test("LOG-001, user-is-logged-in-via-storageState", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByTestId("feed-tab-your")).toBeVisible();
});
