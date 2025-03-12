import { expect, test } from '@playwright/test';

test('로그인하지 않은 유저는 랜딩 페이지를 마주한다.', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page.locator('h1')).toContainText(
    /수집하다보니 쌓여버린 북마크.*편하게 관리하세요/,
  );
});
