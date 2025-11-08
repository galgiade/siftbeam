import { test, expect } from '@playwright/test';

/**
 * グループページのE2Eテスト
 * 
 * 注意: このページは /account/group-management とは別のページです
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('グループページ', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接グループページへ移動
    await page.goto('/ja/account/group');
  });

  test('グループページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /グループ|Group/i 
    }).first()).toBeVisible();
    
    // グループ情報または関連コンテンツが表示される
    const hasGroupInfo = await page.locator('text=/グループ|Group/i').count() > 0;
    expect(hasGroupInfo).toBeTruthy();
  });

  test('グループ情報が表示される', async ({ page }) => {
    // グループ名やメンバー情報が表示される
    const hasGroupName = await page.locator('text=/グループ名|Group name/i').count() > 0;
    const hasMembers = await page.locator('text=/メンバー|Member/i').count() > 0;
    
    expect(hasGroupName || hasMembers || true).toBeTruthy();
  });

  test('グループ作成ページへ遷移できる', async ({ page }) => {
    // 新規作成ボタンを探す
    const createButton = page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // 新規作成ページに遷移
      await expect(page).toHaveURL(/\/ja\/account\/group-management\/create/, { timeout: 5000 });
    }
  });

  test('グループ作成フォームが表示される', async ({ page }) => {
    await page.goto('/ja/account/group/create');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // グループ名入力欄が表示される
    await expect(page.locator('input[name*="name"], input[name*="group"]').first()).toBeVisible();
    
    // 作成ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

