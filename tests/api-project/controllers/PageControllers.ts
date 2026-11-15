import { expect, Locator, Page } from "@playwright/test";

export const navSteps = async (page: Page) => {
  await page.getByTestId("nav-profile").click();
  await page.getByRole("link", { name: "Edit profile" }).click();
};

export const imageSubmit = async (page: Page, url: string) => {
  await page.getByTestId("settings-image").fill(url);

  // Спершу «підписуємось» на відповідь, потім натискаємо кнопку
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/user") &&
      response.request().method() === "PUT",
  );
  await page.getByTestId("settings-submit").click();
  const response = await responsePromise;

  expect(response.status()).toBe(200);
};

export const imageCheck = async (avatar: Locator, avatarUrl: string) => {
  await expect(avatar).toHaveAttribute("src", avatarUrl);
  await expect
    .poll(() =>
      avatar.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
};
