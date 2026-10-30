import { expect, Page } from "@playwright/test";

export class BasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

export class LoginPage extends BasePage {
  login = async (username: string, password: string) => {
    await this.page.getByTestId("username").fill(username);
    await this.page.getByTestId("password").fill(password);
    await this.page.getByTestId("login-button").click();
  };

  loginCompleted = async () => {
    await expect(this.page.getByTestId("title")).toHaveText("Products");
  };
}

export class InventoryPage extends BasePage {
  itemByTitle = (title: string) => {
    return this.page.getByTestId("inventory-item").filter({ hasText: title });
  };

  addToCartByTitle = async (title: string) => {
    return await this.itemByTitle(title)
      .getByRole("button", { name: "Add to cart" })
      .click();
  };

  removeFromCartByTitle = async (title: string) => {
    return await this.itemByTitle(title)
      .getByRole("button", { name: "Remove" })
      .click();
  };

  getPriceByTitle = async (title: string) => {
    return await this.itemByTitle(title)
      .getByTestId("inventory-item-price")
      .innerText();
  };

  goToCart = async () => {
    await this.page.getByTestId("shopping-cart-link").click();
  };

  inventoryPageReview = async () => {
    await expect(this.page.getByTestId("title")).toHaveText("Products");
  };
}

export class CartPage extends BasePage {
  itemByTitle = (title: string) => {
    return this.page.getByTestId("inventory-item").filter({ hasText: title });
  };

  removeFromCartByTitle = async (title: string) => {
    return await this.itemByTitle(title)
      .getByRole("button", { name: "Remove" })
      .click();
  };

  getPriceByTitle = async (title: string) => {
    return await this.itemByTitle(title)
      .getByTestId("inventory-item-price")
      .innerText();
  };

  checkout = async () => {
    await this.page.getByTestId("checkout").click();
  };

  continueShopping = async () => {
    await this.page.getByTestId("continue-shopping").click();
  };

  expectItemInCart = async (title: string, price: string) => {
    const item = this.itemByTitle(title);
    await expect(item).toBeVisible();
    await expect(item.getByTestId("inventory-item-price")).toHaveText(price);
  };
}

export class CheckoutStepOnePage extends BasePage {
  fillCheckoutInfo = async (
    name: string,
    lastName: string,
    postCode: string,
    submit: boolean = false,
  ) => {
    await this.page.getByPlaceholder("First Name").fill(name);
    await this.page.getByPlaceholder("Last Name").fill(lastName);
    await this.page.getByPlaceholder("Zip/Postal Code").fill(postCode);
    if (submit) {
      await this.page.getByTestId("continue").click();
    }
  };
}

export class CheckoutStepTwoPage extends BasePage {
  cancel = async () => {
    await this.page.getByTestId("cancel").click();
  };

  finish = async () => {
    await this.page.getByTestId("finish").click();
  };

  checkoutCompleted = async () => {
    await expect(this.page.getByTestId("complete-header")).toBeVisible();
  };
}
