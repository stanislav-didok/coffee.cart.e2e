import { faker } from "@faker-js/faker";
import { test as base, expect, request } from "@playwright/test";
import {
  CreateUserBody,
  UserController,
  UserResponse,
} from "../controllers/UserController";

export type RegisteredUser = {
  credentials: CreateUserBody["user"]; // що ми надіслали (username, email, password)
  response: UserResponse; // що повернув сервер (включно з token)
};

export type MyFixtures = {
  login: void;
  token: string;
  register: RegisteredUser;
};

const test = base.extend<MyFixtures>({
  register: async ({ baseURL }, use) => {
    // Окремий контекст без Authorization: реєстрація не потребує токена
    const context = await request.newContext({ baseURL });
    try {
      const credentials = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: "123456",
      };
      const response = await new UserController(context).createUser({
        user: credentials,
      });
      await use({ credentials, response });
    } finally {
      await context.dispose();
    }
  },

  token: async ({ register }, use) => {
    await use(register.response.user.token);
  },

  login: async ({ context, baseURL, register }, use) => {
    const token = register.response.user.token;

    const storageState = createStorageState(token, baseURL!);
    await context.setStorageState(storageState);

    await use();
  },
  request: async ({ token, baseURL }, use) => {
    const context = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        authorization: "Token " + token,
      },
    });
    try {
      await use(context);
    } finally {
      await context.dispose();
    }
  },
});

function createStorageState(token: string, baseURL: string) {
  return {
    cookies: [],
    origins: [
      {
        origin: new URL(baseURL).origin,
        localStorage: [{ name: "qa-dojo.token", value: token }],
      },
    ],
  };
}

export { expect, test };
