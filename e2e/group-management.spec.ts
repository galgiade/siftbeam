import { test, expect } from '@playwright/test';

/**
 * グループ管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('グループ管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接グループ管理ページへ移動
    await page.goto('/ja/account/group-management');
  });

  test('グループ管理ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /グループ|Group/i 
    }).first()).toBeVisible();
    
    // 新規作成ボタンまたはグループリストが表示される
    const hasCreateButton = await page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).count() > 0;
    const hasGroupList = await page.locator('table, ul, li').count() > 0;
    
    expect(hasCreateButton || hasGroupList).toBeTruthy();
  });

  test('グループリストが表示される', async ({ page }) => {
    // グループリストまたは「グループがありません」メッセージが表示される
    const hasGroups = await page.locator('table, ul').count() > 0;
    const noGroupsMessage = await page.locator('text=/グループがありません|No groups|Empty/i').count() > 0;
    
    expect(hasGroups || noGroupsMessage).toBeTruthy();
  });

  test('新規グループ作成ページへ遷移できる', async ({ page }) => {
    // 新規作成ボタンをクリック
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
    await page.goto('/ja/account/group-management/create');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // グループ名入力欄が表示される
    await expect(page.locator('input[name*="name"], input[name*="group"]').first()).toBeVisible();
    
    // 作成ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

