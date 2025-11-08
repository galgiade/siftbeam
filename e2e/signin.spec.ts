import { test, expect } from '@playwright/test';
import { testUsers, testUrls, timeouts } from './fixtures/test-data';
import { selectors } from './helpers/selectors';

/**
 * サインイン機能のE2Eテスト
 * 
 * テスト方針:
 * - 正常系（ハッピーパス）のみをテスト
 * - バリデーションエラーは最小限（ユニットテストでカバー済み）
 */

test.describe('サインイン機能', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にサインインページへ移動
    await page.goto(testUrls.ja.signin);
  });

  test('正常系: 有効な認証情報でサインインできる', async ({ page }) => {
    // メールアドレス入力
    await page.fill(selectors.auth.emailInput, testUsers.valid.email);
    
    // パスワード入力
    await page.fill(selectors.auth.passwordInput, testUsers.valid.password);
    
    // サインインボタンをクリック
    await page.click(selectors.auth.submitButton);
    
    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/ja\/account\/user/, { timeout: timeouts.medium });
    
    // ユーザー情報が表示されることを確認
    await expect(page.locator('body')).toContainText(testUsers.valid.email, { timeout: timeouts.short });
  });

  test('サインインページが正しく表示される', async ({ page }) => {
    // タイトルが表示される
    await expect(page.locator(selectors.common.heading)).toBeVisible();
    
    // メールアドレス入力欄が表示される
    await expect(page.locator(selectors.auth.emailInput)).toBeVisible();
    
    // パスワード入力欄が表示される
    await expect(page.locator(selectors.auth.passwordInput)).toBeVisible();
    
    // サインインボタンが表示される
    await expect(page.locator(selectors.auth.submitButton)).toBeVisible();
    
    // サインアップリンクが表示される
    await expect(page.locator(selectors.auth.signUpLink)).toBeVisible();
    
    // パスワードを忘れた場合のリンクが表示される
    await expect(page.locator(selectors.auth.forgotPasswordLink)).toBeVisible();
  });

  test('パスワードの表示/非表示を切り替えられる', async ({ page }) => {
    const passwordInput = page.locator(selectors.auth.passwordInput);
    const toggleButton = page.locator('button[aria-label*="パスワード"]').or(
      page.locator('button').filter({ hasText: /表示|非表示|show|hide/i })
    ).first();
    
    // 初期状態はパスワードが隠れている
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // トグルボタンをクリック
    await toggleButton.click();
    
    // パスワードが表示される
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // もう一度クリック
    await toggleButton.click();
    
    // パスワードが再び隠れる
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // バリデーションテスト（最小限）
  test('空欄でサインインボタンが無効化される', async ({ page }) => {
    const submitButton = page.locator(selectors.auth.submitButton);
    
    // 初期状態でボタンが無効
    await expect(submitButton).toBeDisabled();
    
    // メールアドレスのみ入力
    await page.fill(selectors.auth.emailInput, testUsers.valid.email);
    
    // まだ無効
    await expect(submitButton).toBeDisabled();
    
    // パスワードも入力
    await page.fill(selectors.auth.passwordInput, testUsers.valid.password);
    
    // ボタンが有効になる
    await expect(submitButton).toBeEnabled();
  });
});

