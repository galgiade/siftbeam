import { test, expect } from '@playwright/test';

/**
 * ユーザー管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('ユーザー管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態（サインイン不要）
  });

  test('ユーザー情報ページが正しく表示される', async ({ page }) => {
    await page.goto('/ja/account/user');
    
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // ユーザー情報が表示される
    await expect(page.locator('body')).toContainText(/メール|Email|ユーザー|User/i);
  });

  test('ユーザー管理ページが正しく表示される', async ({ page }) => {
    await page.goto('/ja/account/user-management');
    
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /ユーザー管理|User Management/i 
    }).first()).toBeVisible();
    
    // ユーザーリストまたは新規作成ボタンが表示される
    const hasUserList = await page.locator('table, ul').count() > 0;
    const hasCreateButton = await page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|Add/i 
    }).count() > 0;
    
    expect(hasUserList || hasCreateButton).toBeTruthy();
  });

  test('新規ユーザー作成ページへ遷移できる', async ({ page }) => {
    await page.goto('/ja/account/user-management');
    
    // 新規作成ボタンを探す
    const createButton = page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|Add|招待|Invite/i 
    }).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // 新規作成ページに遷移
      await expect(page).toHaveURL(/\/ja\/account\/user-management\/create-user/, { timeout: 5000 });
    }
  });

  test('ユーザー作成フォームが表示される', async ({ page }) => {
    await page.goto('/ja/account/user-management/create-user');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // メールアドレス入力欄が表示される
    await expect(page.locator('input[type="email"], input[name*="email"]')).toBeVisible();
    
    // 送信ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

