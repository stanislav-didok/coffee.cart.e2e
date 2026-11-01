import { test } from "@playwright/test";
import {
  CartPage,
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  InventoryPage,
  LoginPage,
} from "./page-actions";

test("LOG-001, login-with-given-credentials", async ({ page }) => {
  await page.goto("/");

  const loginPage = new LoginPage(page);
  await loginPage.login("standard_user", "secret_sauce");
  await loginPage.loginCompleted();
});

test("CAR-001, add-item-to-the-cart-and-params-check", async ({ page }) => {
  await page.goto("/inventory.html");

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.addToCartByTitle("Sauce Labs Backpack");
  await inventoryPage.goToCart();
  await cartPage.expectItemInCart("Sauce Labs Backpack", "$29.99");
});

test("CHK-001, success-checkout-completing", async ({ page }) => {
  await page.goto("/");

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.addToCartByTitle("Sauce Labs Bike Light");
  await inventoryPage.goToCart();
  await cartPage.checkout();
  await checkoutStepOnePage.fillCheckoutInfo("test", "test", "12345", true);
  await checkoutStepTwoPage.finish();
  await checkoutStepTwoPage.checkoutCompleted();
});

test("CHK-002, continue-shopping-after-item-from-cart-delete", async ({
  page,
}) => {
  await page.goto("/");

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.addToCartByTitle("Sauce Labs Bolt T-Shirt");
  await inventoryPage.goToCart();
  await cartPage.expectItemInCart("Sauce Labs Bolt T-Shirt", "$15.99");
  await cartPage.removeFromCartByTitle("Sauce Labs Bolt T-Shirt");
  await cartPage.continueShopping();
  await inventoryPage.inventoryPageReview();
});
