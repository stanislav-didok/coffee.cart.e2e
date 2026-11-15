import { faker } from "@faker-js/faker";
import { expect, request as newContext } from "@playwright/test";
import { ArticleController } from "../controllers/ArticleController";
import { UserController } from "../controllers/UserController";
import { test } from "../fixtures/base-fixture";

test("login via api - user should be logged", async ({
  page,
  request,
  login,
}) => {
  const userController = new UserController(request);

  // 1. Create User
  const userData = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: "123456",
  };
  await userController.createUser({
    user: userData,
  });

  // 2. Login as created user

  const token = await userController.loginAsUser(
    userData.email,
    userData.password,
  );

  // 3. Create context with token

  const apiContext = await newContext.newContext({
    extraHTTPHeaders: {
      Authorization: "Token " + token,
    },
  });

  // 4. Контроллер під новоствореним користувачем

  const articleController = new ArticleController(apiContext);

  const title = faker.book.title();
  const body = {
    article: {
      title: title,
      description: "test",
      body: "test",
      tagList: [],
      category: "general",
      visibility: "public",
      allowComments: true,
      cover: "",
    },
  };

  const { article } = await articleController.createArticle(body);
  const slug = article.slug;

  // 5. Повертаємось на Олену і переходимо на сторінку створеного артіклу

  await page.goto(`http://104.168.59.50/articles/article/${slug}`);
  await page.getByTestId("article-favorite-button").click();
  await page.getByTestId("nav-profile").click();
  await page.getByTestId("profile-tab-favorited").click();
  await expect(page.getByTestId("article-list")).toContainText(title);
});
