import { test as base } from "@playwright/test";

import {
  CartPage,
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  InventoryPage,
  LoginPage,
  users,
} from "../page-actions";

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  generalLogin: void;
  logout: void;
  userToLogin: { username: string; password: string };
};

export const test = base.extend<MyFixtures>({
  userToLogin: users.standard,

  generalLogin: [
    async ({ loginPage, userToLogin }, use) => {
      await loginPage.goToLoginPage();
      await loginPage.login(userToLogin.username, userToLogin.password);
      await loginPage.loginCompleted();

      await use();
    },
    { auto: true },
  ],

  logout: [
    async ({ page }, use) => {
      await use();
      await page.getByRole("button", { name: "Open Menu" }).click();
      await page.getByTestId("reset-sidebar-link").click();
      await page.getByTestId("logout-sidebar-link").click();
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);

    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);

    await use(cartPage);
  },

  checkoutStepOnePage: async ({ page }, use) => {
    const checkoutStepOnePage = new CheckoutStepOnePage(page);

    await use(checkoutStepOnePage);
  },

  checkoutStepTwoPage: async ({ page }, use) => {
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    await use(checkoutStepTwoPage);
  },
});
