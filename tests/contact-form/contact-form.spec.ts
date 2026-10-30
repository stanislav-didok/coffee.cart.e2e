import { test, expect, Page } from '@playwright/test';

import {
  fillName,
  fillEmail,
  fillMessage,
  fieldsFillingSteps,
  testData
}
  from './project-actions';

for (const data of testData) {
  test(`CF00${data.id} - contact-form-with-all-fields-filled`, async ({ page }) => {
    await page.goto('');
    await data.steps(page);
    await (data.expect(page));
  });
}

