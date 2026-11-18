import { faker } from "@faker-js/faker";
import { expect, test } from "../api-project/fixtures/base-fixture";

test("article title is replaced in request before it is sent", async ({
  page,
  register,
  login,
}) => {
  const typedTitle = "Test.Title.123";
  const mockedTitle = faker.lorem.words(5);

  await page.route(
    (url) => url.pathname === "/api/articles",
    async (route, request) => {
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }

      const body = request.postDataJSON();
      body.article.title = mockedTitle;
      await route.continue({ postData: body });
    },
  );

  await page.goto("/articles/editor");
  await page.getByTestId("nav-new-article").click();
  await page.getByTestId("editor-title").fill(typedTitle);
  await page.getByTestId("editor-description").fill("test");
  await page.getByTestId("editor-body").fill("test");
  await page.getByTestId("editor-submit").click();

  await expect(page.getByText(mockedTitle)).toBeVisible();
});

test("articles list is replaced via route.fulfill", async ({
  page,
  register,
  login,
}) => {
  const articleTitle = faker.book.author();
  const articleSlug = "aqaupdviaroute452617";
  const article = {
    slug: articleSlug,
    title: articleTitle,
    description: "aqa UPD_via_ROUTE",
    body: "aqa UPD_via_ROUTE",
    tagList: ["automation, api, route"],
    category: "general",
    visibility: "public",
    allowComments: true,
    cover: "",
    createdAt: "2026-11-17T15:15:25.627Z",
    updatedAt: "2026-11-17T15:15:25.627Z",
    favorited: false,
    favoritesCount: 0,
    author: {
      username: "aqa_1794928523909",
      bio: "",
      image: "/avatar-placeholder.svg",
      following: false,
    },
  };

  await page.route(
    (url) => url.pathname === "/api/articles",
    async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            articles: [article],
            articlesCount: 1,
          }),
        });
        return;
      }

      await route.continue();
    },
  );

  await page.goto("/articles");
  await expect(page.locator("article.qa-entry")).toHaveCount(1);
  await expect(page.getByTestId("preview-title")).toContainText(articleTitle);
});
