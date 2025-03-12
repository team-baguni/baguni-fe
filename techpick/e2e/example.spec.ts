import { expect, test } from '@playwright/test';

test('has h1 tag', async ({ page }) => {
  await page.goto('/landing');

  // Expect a title "to contain" a substring.
  await expect(page.locator('h1')).toContainText(
    /수집하다보니 쌓여버린 북마크.*편하게 관리하세요/,
  );
});
