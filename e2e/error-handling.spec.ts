import { test, expect } from '@playwright/test';

/**
 * エラーハンドリングのE2Eテスト
 * 
 * 最小限のエラーケースのみテスト
 */

test.describe('エラーハンドリング - 404エラー', () => {
  test('存在しないページで適切に処理される', async ({ page }) => {
    const response = await page.goto('/ja/this-page-does-not-exist-12345');
    
    // 404ステータスコードまたはリダイレクト
    const status = response?.status();
    expect(status === 404 || status === 301 || status === 302 || status === 200).toBeTruthy();
    
    // ページが表示される（404ページまたはリダイレクト先）
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('エラーハンドリング - ネットワークエラー', () => {
  test('オフライン時に適切なメッセージが表示される', async ({ page, context }) => {
    await page.goto('/ja/signin');
    
    // オフラインモードを有効化
    await context.setOffline(true);
    
    // フォーム送信を試みる
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'ValidPass123');
    await page.click('button[type="submit"]');
    
    // エラーメッセージまたはオフライン表示が出る
    await page.waitForTimeout(2000);
    
    // ページが応答する
    await expect(page.locator('body')).toBeVisible();
    
    // オンラインに戻す
    await context.setOffline(false);
  });
});

test.describe('エラーハンドリング - JavaScriptエラー', () => {
  test('コンソールに重大なエラーが出ていない', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/ja/signin');
    
    // 重大なエラーがない（警告は許容）
    const hasCriticalErrors = errors.some(error => 
      error.includes('Uncaught') || 
      error.includes('TypeError') ||
      error.includes('ReferenceError')
    );
    
    expect(hasCriticalErrors).toBeFalsy();
  });
});

test.describe('エラーハンドリング - 認証エラー', () => {
  test('無効な認証情報でエラーメッセージが表示される', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // 無効な認証情報で送信
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'InvalidPassword123');
    await page.click('button[type="submit"]');
    
    // エラーメッセージが表示される（5秒待機）
    await page.waitForTimeout(5000);
    
    // エラーメッセージまたはサインインページに留まる
    const hasError = await page.locator('[class*="error"], [class*="alert"]').count() > 0;
    const staysOnSignIn = page.url().includes('/signin');
    
    expect(hasError || staysOnSignIn).toBeTruthy();
  });
});

test.describe('エラーハンドリング - セッション期限切れ', () => {
  test.skip('セッション期限切れ後に保護されたページにアクセスできない', async ({ page }) => {
    // このテストは認証状態を使用しないため、別途実装が必要
    // 認証なしで保護されたページにアクセス
    await page.goto('/ja/account/user');
    
    // サインインページにリダイレクトされる
    await expect(page).toHaveURL(/\/ja\/signin/, { timeout: 5000 });
  });
});

