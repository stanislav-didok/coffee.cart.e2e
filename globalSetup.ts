import { chromium, expect, FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("http://104.168.59.50/articles");
    await page.locator('[data-testid="nav-sign-in"]').click();
    await page.locator('[data-testid="auth-email"]').fill("olena@example.com");
    await page.locator('[data-testid="auth-password"]').fill("password");
    await page.locator('[data-testid="auth-submit"]').click();

    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("qa-dojo.token")), {
        message: "Токен має з’явитися після входу",
      })
      .toBeTruthy();

    await context.storageState({ path: "./storageState.json" });
  } finally {
    await browser.close();
  }
}
