import { users } from "../page-actions";
import { test } from "./fixtures";

test.use({ userToLogin: users.standard });

test("LOG-001, login-with-given-credentials", async ({ loginPage, logout }) => {
  await loginPage.loginCompleted();
});

test("CAR-001, add-item-to-the-cart-and-params-check", async ({
  inventoryPage,
  cartPage,
  logout,
}) => {
  await inventoryPage.addToCartByTitle("Sauce Labs Backpack");
  await inventoryPage.goToCart();
  await cartPage.expectItemInCart("Sauce Labs Backpack", "$29.99");
});

test("CHK-001, success-checkout-completing", async ({
  inventoryPage,
  cartPage,
  checkoutStepOnePage,
  checkoutStepTwoPage,
  logout,
}) => {
  await inventoryPage.addToCartByTitle("Sauce Labs Bike Light");
  await inventoryPage.goToCart();
  await cartPage.checkout();
  await checkoutStepOnePage.fillCheckoutInfo("test", "test", "12345", true);
  await checkoutStepTwoPage.finish();
  await checkoutStepTwoPage.checkoutCompleted();
});

test("CHK-002, continue-shopping-after-item-from-cart-delete", async ({
  inventoryPage,
  cartPage,
  logout,
}) => {
  await inventoryPage.addToCartByTitle("Sauce Labs Bolt T-Shirt");
  await inventoryPage.goToCart();
  await cartPage.expectItemInCart("Sauce Labs Bolt T-Shirt", "$15.99");
  await cartPage.removeFromCartByTitle("Sauce Labs Bolt T-Shirt");
  await cartPage.continueShopping();
  await inventoryPage.inventoryPageReview();
});
