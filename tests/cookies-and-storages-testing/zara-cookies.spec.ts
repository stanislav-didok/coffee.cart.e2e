import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("прийняття та зміна cookies", async ({ page, context }) => {
  await page.goto("https://www.zara.com/es/en/");
  await page.getByRole("button", { name: "Accept All Cookies" }).click();
  await page.getByRole("button", { name: "Yes, continue on Spain" }).click();

  await expect
    .poll(async () => (await context.cookies()).length)
    .toBeGreaterThan(0);

  const cookies = await context.cookies();

  const updatedCookies = cookies.map((cookie) => {
    const isTargetedCookie =
      cookie.name === "rskxRunCookie" &&
      cookie.domain === ".zara.com" &&
      cookie.path === "/";

    if (isTargetedCookie) {
      return { ...cookie, value: "Absolute!" };
    }

    return cookie;
  });

  await context.clearCookies();
  await context.addCookies(updatedCookies);

  const cookiesAfterUpdate = await context.cookies();

  const changedCookie = cookiesAfterUpdate.find((cookie) => {
    const isChangedCookie =
      cookie.name === "rskxRunCookie" &&
      cookie.domain === ".zara.com" &&
      cookie.path === "/";

    return isChangedCookie;
  });
  expect(changedCookie).toBeDefined();
  expect(changedCookie?.value).toBe("Absolute!");
});
