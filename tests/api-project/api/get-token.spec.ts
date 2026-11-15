import { ArticleController } from "../controllers/ArticleController";
import { expect, test } from "../fixtures/base-fixture";

test("get token - check that user logged", async ({ request }) => {
  const response = await request.post("http://104.168.59.50/api/users/login", {
    data: { user: { email: "olena@example.com", password: "password" } },
    failOnStatusCode: true,
  });
  const json = await response.json(); //Передає респонс у форматі  json(може давати помилку якщо  json не може обробити синтаксис або звичайний текст)

  const text = await response.text(); //Передає респонс у форматі  text
  const isOk = response.ok(); // true/false - чи успішний запит

  /*токен елемент обʼєкта user, тому звертаємось до нього через обʼєкт!*/
  const token = json.user.token;
});

test("get articles - check body", async ({ request }) => {
  const response = await request.get("http://104.168.59.50/api/articles", {
    params: {
      sort: "newest",
      limit: 10,
      offset: 0,
    },
    failOnStatusCode: true,
  });
  const json = await response.json();
});

test("create article - should be successful", async ({ request }) => {
  let response = await request.post("http://104.168.59.50/api/users/login", {
    data: { user: { email: "olena@example.com", password: "password" } },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const token = json.user.token;

  response = await request.post("http://104.168.59.50/api/articles", {
    headers: {
      Authorization: "Token " + token,
    },
    data: {
      article: {
        title: "test",
        description: "test",
        body: "test",
        tagList: [],
        category: "general",
        visibility: "public",
        allowComments: true,
        cover: "",
      },
    },
    failOnStatusCode: true,
  });
});

test("login via api - user should be logged", async ({
  page,
  request,
  login,
}) => {
  const articleController = new ArticleController(request);
  await page.goto("http://104.168.59.50/articles/editor");

  const body = {
    article: {
      title: "test12",
      description: "test",
      body: "test",
      tagList: [],
      category: "general",
      visibility: "public",
      allowComments: true,
      cover: "",
    },
  };

  await articleController.createArticle(body);

  await expect(page.getByTestId("nav-profile")).toHaveText("olena");
});
