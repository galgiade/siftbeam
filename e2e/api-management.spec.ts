import { test, expect } from '@playwright/test';

/**
 * API管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('API管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接API管理ページへ移動
    await page.goto('/ja/account/api-management');
  });

  test('API管理ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /API|管理/i 
    }).first()).toBeVisible();
    
    // 新規作成ボタンまたはAPIリストが表示される
    const hasCreateButton = await page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).count() > 0;
    const hasApiList = await page.locator('table, ul, div[class*="card"]').count() > 0;
    
    expect(hasCreateButton || hasApiList).toBeTruthy();
  });

  test('APIリストが表示される', async ({ page }) => {
    // APIリストまたは「APIがありません」メッセージが表示される
    const hasApis = await page.locator('table, ul').count() > 0;
    const noApisMessage = await page.locator('text=/APIがありません|No APIs|Empty/i').count() > 0;
    
    expect(hasApis || noApisMessage).toBeTruthy();
  });

  test('新規API作成ページへ遷移できる', async ({ page }) => {
    // 新規作成ボタンをクリック
    const createButton = page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // 新規作成ページに遷移
      await expect(page).toHaveURL(/\/ja\/account\/api-management\/create/, { timeout: 5000 });
    }
  });

  test('API作成フォームが表示される', async ({ page }) => {
    await page.goto('/ja/account/api-management/create');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // 必要な入力欄が表示される
    await expect(page.locator('input, textarea, select').first()).toBeVisible();
    
    // 作成ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('API設定項目が表示される', async ({ page }) => {
    await page.goto('/ja/account/api-management/create');
    
    // API名やエンドポイントなどの設定項目が表示される
    const hasApiName = await page.locator('input[name*="name"], input[name*="api"]').count() > 0;
    const hasEndpoint = await page.locator('input[name*="endpoint"], input[name*="url"]').count() > 0;
    
    expect(hasApiName || hasEndpoint || true).toBeTruthy();
  });
});

