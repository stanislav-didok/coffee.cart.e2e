import {
  imageCheck,
  imageSubmit,
  navSteps,
} from "../controllers/PageControllers";
import { expect, test } from "../fixtures/base-fixture";

test("profile pic changing", async ({ register, login, page }) => {
  const pictureUrl = "https://placehold.co/200x200.png";

  await page.goto("/articles");

  await navSteps(page);
  await expect(page.getByTestId("settings-username")).toHaveValue(
    register.credentials.username,
  );
  await expect(page.getByTestId("settings-email")).toHaveValue(
    register.credentials.email,
  );
  await imageSubmit(page, pictureUrl);
  await imageCheck(page.locator("main img"), pictureUrl);
  await page.reload();
  await navSteps(page);
  await expect(page.getByTestId("settings-image")).toHaveValue(pictureUrl);
  await imageCheck(page.locator("main img"), pictureUrl);
});

/*await expect(page.getByTestId("nav-profile")).toContainText(
    register.credentials.username,
  );*/
