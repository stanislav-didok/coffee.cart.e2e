import { Page, expect } from "@playwright/test";

export async function signIn(page: Page) {
   await page.getByTestId('nav-sign-in').click();
   await page.getByTestId("auth-email").fill('olena@example.com');
   await page.getByTestId("auth-password").fill('password');
   await page.getByTestId("auth-submit").click();
   await expect(page.getByTestId("feed-tab-your")).toBeVisible();
}

export async function articleCreating(page: Page, title: string, description: string, body: string) {
   await page.getByTestId("nav-new-article").click();
   await page.getByTestId("editor-title").fill(title);
   await page.getByTestId("editor-description").fill(description);
   await page.getByTestId("editor-body").fill(body);
   await page.getByTestId("editor-submit").click();
   await expect(page.getByTestId("article-title")).toBeVisible();
}

export async function moveToGlobalFeed(page: Page) {
   await page.getByTestId("nav-home").click();
   await page.getByTestId("feed-tab-global").click();
   await expect(page.getByTestId("feed-tab-global")).toHaveAttribute('data-active', 'true');
};