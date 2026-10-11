import { test, expect, Page } from "@playwright/test";

import {
   signIn,
   articleCreating,
   moveToGlobalFeed
}
   from './page-objects-ac';

test('001 - log-in-with-given-credentials-and-articles-creating', async ({ page }) => {
   test.setTimeout(100_000);
   await page.goto('');
   await signIn(page);

   const articles = [];
   const artIndex = Date.now();
   for (let i = 1; i <= 10; i++) {
      const title = `Article ${artIndex}-${i}`;
      await articleCreating(page, title, "Опис статті, 12345", "Текст статті, 12345");
      articles.push(title);
   }

   await moveToGlobalFeed(page);

   const titles = page.getByTestId("preview-title");
   await expect(titles.first()).toHaveText(articles[9]);

   const pageNumber = page.locator('[data-testid^="pagination-page-"]');
   const pages = await pageNumber.count();
   const alreadySeen = [];
   for (let i = 1; i <= pages; i++) {
      await page.getByTestId(`pagination-page-${i}`).click();
      await expect(page.getByTestId(`pagination-page-${i}`)).toHaveAttribute('aria-current', "true");
      const texts = await titles.allInnerTexts();
      alreadySeen.push(...texts);
   }

   for (const article of articles) {
      expect(alreadySeen, `Стаття "${article}" не знайдена`).toContain(article);
   }

});