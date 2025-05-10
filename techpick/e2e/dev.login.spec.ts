import { expect, test } from '@playwright/test';

/**
 * 개발 환경 로그인 페이지 테스트
 * @author sangwon
 */

test.describe('개발 환경 로그인 페이지 테스트', () => {
  const baseUrl = process.env.TEST_BASE_URL;
  const devLoginUrl = `${baseUrl}/dev/login`; // 개발 환경 로그인 페이지
  const apiUrl = process.env.NEXT_PUBLIC_API; // API URL

  const devPassword = process.env.DEV_PASSWORD;

  test.beforeEach(async ({ page }) => {
    // 접속할 url
    await page.goto(devLoginUrl);

    // id, password 입력
    await page.getByLabel('아이디').fill(`test_${Date.now()}`);
    await page.getByLabel('비밀번호').fill(`${devPassword}`);
  });

  test('회원 가입 성공 후 회원 탈퇴 테스트', async ({ page, request }) => {
    // 회원 가입 버튼 클릭 및 응답 값 저장 (회원 탈퇴에 쓸 userId 구하기 위함)
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/development/users/new/signup') &&
          res.request().method() === 'POST',
      ),
      page.getByRole('button', { name: '회원가입' }).click(),
    ]);

    // 회원 탈퇴 API 호출
    const responseBody = await response.json();
    const userId = responseBody.id;
    const deleteResponse = await request.delete(
      `${apiUrl}/development/users?userId=${userId}`,
    );

    // 검증
    expect(
      page.locator('text=회원가입이 되었습니다. 로그인을 해주세요.'),
    ).toBeVisible(); // toast 메시지 검증
    expect(deleteResponse.status()).toBe(204);
  });

  test('중복 회원 가입 시 회원 가입 실패', async ({ page, request }) => {
    // 최초 회원 가입 버튼 클릭
    const [successResponse] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/development/users/new/signup') &&
          res.request().method() === 'POST' &&
          res.status() === 200,
      ),
      page.getByRole('button', { name: '회원가입' }).click(),
    ]);

    // 두 번째 회원 가입 버튼 클릭 (중복 회원 가입)
    const [failResponse] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/development/users/new/signup') &&
          res.request().method() === 'POST',
      ),
      page.getByRole('button', { name: '회원가입' }).click(),
    ]);

    // 회원 탈퇴 API 호출
    const responseBody = await successResponse.json();
    const userId = responseBody.id;
    const deleteResponse = await request.delete(
      `${apiUrl}/development/users?userId=${userId}`,
    );

    // 검증
    expect(failResponse.status()).toBe(400); // 중복 회원 가입 실패 검증
    expect(deleteResponse.status()).toBe(204); // 회원 탈퇴 성공 검증
    expect(page.locator('text=중복된 사용자 이름입니다.')).toBeVisible(); // toast 메시지 검증
  });

  test('로그인 성공 후 튜토리얼 종료', async ({ page }) => {
    // id 입력
    await page.getByLabel('아이디').fill('playwright');

    // 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 성공 후 페이지 이동 대기
    await page.waitForURL(`${baseUrl}/recommend`);
    await expect(page).toHaveURL(`${baseUrl}/recommend`);

    // 튜토리얼: 다음 → 다음 → 종료
    await page.getByRole('tab', { name: '다음' }).click();
    await page.getByRole('tab', { name: '다음' }).click();
    await page.getByRole('button', { name: '종료' }).click();
  });

  test('비밀번호 틀림', async ({ page }) => {
    // id 입력
    await page.getByLabel('아이디').fill('playwright');

    // 비밀번호 입력
    await page.getByLabel('비밀번호').fill('wrong_password');

    // 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 실패 후 페이지 이동 대기
    await expect(page).toHaveURL(devLoginUrl);
    await expect(page.locator('text=잘못된 정보입니다')).toBeVisible(); // toast 메시지 검증
  });
});
