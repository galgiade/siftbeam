import { test, expect } from '@playwright/test';

/**
 * APIキー管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('APIキー管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接APIキー管理ページへ移動
    await page.goto('/ja/account/api-keys');
  });

  test('APIキー管理ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ hasText: /API|キー/i }).first()).toBeVisible();
    
    // 新規作成ボタンが表示される
    await expect(page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).first()).toBeVisible();
  });

  test('APIキーリストが表示される', async ({ page }) => {
    // APIキーリストまたは「APIキーがありません」メッセージが表示される
    const hasApiKeys = await page.locator('table, ul, li').count() > 0;
    const noApiKeysMessage = await page.locator('text=/APIキーがありません|No API keys|Empty/i').count() > 0;
    
    expect(hasApiKeys || noApiKeysMessage).toBeTruthy();
  });

  test('新規作成ページへ遷移できる', async ({ page }) => {
    // 新規作成ボタンをクリック
    const createButton = page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).first();
    
    await createButton.click();
    
    // 新規作成ページに遷移
    await expect(page).toHaveURL(/\/ja\/account\/api-keys\/create/, { timeout: 5000 });
  });

  test('APIキー作成フォームが表示される', async ({ page }) => {
    // 新規作成ページへ移動
    await page.goto('/ja/account/api-management/create');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // 必要な入力欄が表示される
    await expect(page.locator('input, textarea, select').first()).toBeVisible();
    
    // 作成ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

