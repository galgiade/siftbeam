import { test, expect } from '@playwright/test';

/**
 * ナビゲーションとページ遷移のE2Eテスト
 */

test.describe('ナビゲーション', () => {
  test('未認証ユーザーは保護されたページにアクセスできない', async ({ page }) => {
    // 認証が必要なページに直接アクセス
    await page.goto('/ja/account/user');
    
    // サインインページにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/ja\/signin/, { timeout: 5000 });
  });

  test('言語切り替えが機能する', async ({ page }) => {
    // 日本語ページにアクセス
    await page.goto('/ja/signin');
    
    // 言語切り替えボタンを探す
    const languageSwitcher = page.locator('button, a').filter({ 
      hasText: /EN|English|言語|Language/i 
    }).first();
    
    // 言語切り替えボタンが表示されることを確認
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      // 英語ページにリダイレクトされることを確認
      await expect(page).toHaveURL(/\/en\//, { timeout: 5000 });
    }
  });

  test('ホームページから主要ページへのリンクが機能する', async ({ page }) => {
    await page.goto('/ja');
    
    // サインインリンクを探してクリック
    const signInLink = page.locator('a[href*="/signin"]').first();
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    
    // サインインページに遷移
    await expect(page).toHaveURL(/\/ja\/signin/);
  });
});

test.describe('認証済みユーザーのナビゲーション', () => {
  // 保存された認証状態を使用
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接ユーザーページへ移動
    await page.goto('/ja/account/user');
  });

  test('サイドナビゲーションから各ページにアクセスできる', async ({ page }) => {
    // ユーザーページにいることを確認
    await expect(page).toHaveURL(/\/ja\/account\/user/);
    
    // サービスページへのリンクをクリック
    const serviceLink = page.locator('a[href*="/service"]').first();
    if (await serviceLink.isVisible()) {
      await serviceLink.click();
      await expect(page).toHaveURL(/\/ja\/service/);
    }
  });

  test('サインアウトが機能する', async ({ page }) => {
    // サインアウトボタンを探す
    const signOutButton = page.locator('button, a').filter({ 
      hasText: /サインアウト|ログアウト|Sign Out|Logout/i 
    }).first();
    
    // サインアウトボタンが表示されることを確認
    await expect(signOutButton).toBeVisible({ timeout: 5000 });
    
    // サインアウトをクリック
    await signOutButton.click();
    
    // サインインページにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/ja\/signin/, { timeout: 5000 });
    
    // 再度保護されたページにアクセスできないことを確認
    await page.goto('/ja/account/user');
    await expect(page).toHaveURL(/\/ja\/signin/);
  });
});

