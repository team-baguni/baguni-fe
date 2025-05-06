import { test, expect } from '@playwright/test';

/**
 * 랜딩 페이지 테스트
 * @author sangwon
 */

// 로그인되지 않은 상태에서만 랜딩 페이지 접근 가능
test.describe('랜딩 페이지 테스트', () => {
    const baseUrl = process.env.TEST_BASE_URL;

    test.beforeEach(async ({ page }) => {
        // 접속할 url
        await page.goto(`${baseUrl}`);
    });

    test('랜딩 페이지 제목, 익스텐션 링크 유효성 검사', async ({ page, context }) => {
        // title 확인
        await expect(page).toHaveTitle('바구니 | 깔끔한 북마크 관리');

        // 스크롤 내리기 (스크롤 내리지 않으면 익스텐션 버튼을 찾을 수 없음)
        await page.mouse.wheel(0, 1000);

        // 익스텐션 텍스트 클릭
        const [extensionPage] = await Promise.all([
            context.waitForEvent('page'),
            await page.getByRole('link', { name: '익스텐션' }).click()
        ]);

        // 익스텐션 링크가 일치한지 확인
        const extensionUrl = 'https://chromewebstore.google.com/detail/%EB%B0%94%EA%B5%AC%EB%8B%88-%EC%9D%B5%EC%8A%A4%ED%85%90%EC%85%98/gfkkgllophliamkdclhekgfiohnbdddl';
        await expect(extensionPage).toHaveURL(extensionUrl);
    });

    test('로그인 버튼 클릭 시 로그인 페이지로 이동', async ({ page }) => {
        // 로그인 버튼 클릭
        await page.getByRole('link', { name: '로그인' }).click();

        // 로그인 페이지로 이동 확인
        const loginUrl = `${baseUrl}/login`;
        await expect(page).toHaveURL(loginUrl);
    });

    test('회원가입 버튼 클릭 시 로그인 페이지로 이동', async ({ page }) => {
        // 회원가입 버튼 클릭
        await page.getByRole('link', { name: '회원가입' }).click();

        // 로그인 페이지로 이동 확인
        const loginUrl = `${baseUrl}/login`;
        await expect(page).toHaveURL(loginUrl);
    });
})