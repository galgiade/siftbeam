import { Page } from '@playwright/test';

/**
 * 認証ヘルパー関数
 * 
 * Playwrightベストプラクティス: 共通処理を再利用可能な関数にまとめる
 */

/**
 * サインイン処理を実行
 * 
 * @param page - Playwrightのページオブジェクト
 * @param email - メールアドレス（デフォルト: 環境変数またはtest@example.com）
 * @param password - パスワード（デフォルト: 環境変数またはValidPass123）
 */
export async function signIn(
  page: Page,
  email?: string,
  password?: string
): Promise<void> {
  const testEmail = email || process.env.TEST_EMAIL || 'test@example.com';
  const testPassword = password || process.env.TEST_PASSWORD || 'ValidPass123';

  await page.goto('/ja/signin');
  await page.fill('[name="email"]', testEmail);
  await page.fill('[name="password"]', testPassword);
  await page.click('button[type="submit"]');
  
  // サインイン完了を待機
  await page.waitForURL(/\/ja\/account/, { timeout: 10000 });
}

/**
 * サインアウト処理を実行
 * 
 * @param page - Playwrightのページオブジェクト
 */
export async function signOut(page: Page): Promise<void> {
  // サインアウトボタンを探す
  const signOutButton = page.locator('button, a').filter({ 
    hasText: /サインアウト|ログアウト|Sign Out|Logout/i 
  }).first();
  
  if (await signOutButton.isVisible()) {
    await signOutButton.click();
    
    // サインインページにリダイレクトされることを確認
    await page.waitForURL(/\/ja\/signin/, { timeout: 5000 });
  }
}

/**
 * 認証済み状態でページに移動
 * 
 * @param page - Playwrightのページオブジェクト
 * @param url - 移動先のURL
 * @param email - メールアドレス（オプション）
 * @param password - パスワード（オプション）
 */
export async function navigateAsAuthenticated(
  page: Page,
  url: string,
  email?: string,
  password?: string
): Promise<void> {
  await signIn(page, email, password);
  await page.goto(url);
}

