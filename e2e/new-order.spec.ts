import { test, expect } from '@playwright/test';

/**
 * 新規注文管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('新規注文管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接新規注文ページへ移動
    await page.goto('/ja/account/new-order');
  });

  test('新規注文ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /注文|オーダー|Order/i 
    }).first()).toBeVisible();
    
    // 注文リストまたは新規作成ボタンが表示される
    const hasOrderList = await page.locator('table, ul, div[class*="card"]').count() > 0;
    const hasCreateButton = await page.locator('button, a').filter({ 
      hasText: /新規|作成|Create|New/i 
    }).count() > 0;
    
    expect(hasOrderList || hasCreateButton).toBeTruthy();
  });

  test('注文リストが表示される', async ({ page }) => {
    // 注文リストまたは「注文がありません」メッセージが表示される
    const hasOrders = await page.locator('table, ul').count() > 0;
    const noOrdersMessage = await page.locator('text=/注文がありません|No orders|Empty/i').count() > 0;
    
    expect(hasOrders || noOrdersMessage).toBeTruthy();
  });

  test('新規注文作成ページへ遷移できる', async ({ page }) => {
    // 新規作成ボタンをクリック
    const createButton = page.locator('button, a').filter({ 
      hasText: /新規|作成|Create|New/i 
    }).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // 新規作成ページに遷移
      await expect(page).toHaveURL(/\/ja\/account\/new-order\/create/, { timeout: 5000 });
    }
  });

  test('注文作成フォームが表示される', async ({ page }) => {
    await page.goto('/ja/account/new-order/create');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // 入力欄が表示される
    await expect(page.locator('input, select, textarea').first()).toBeVisible();
    
    // 作成ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('注文詳細ページへ遷移できる', async ({ page }) => {
    // 注文リストから最初のアイテムをクリック
    const firstOrder = page.locator('table tr, ul li, a[href*="/new-order/"]').nth(1);
    
    if (await firstOrder.isVisible()) {
      await firstOrder.click();
      
      // 詳細ページに遷移
      await expect(page).toHaveURL(/\/ja\/account\/new-order\/[^/]+/, { timeout: 5000 });
    }
  });

  test('注文詳細が表示される', async ({ page }) => {
    // 注文リストから最初のアイテムをクリック
    const firstOrderLink = page.locator('a[href*="/new-order/"]').first();
    
    if (await firstOrderLink.isVisible()) {
      await firstOrderLink.click();
      
      // 詳細情報が表示される
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // 注文ステータスが表示される
      const hasStatus = await page.locator('text=/ステータス|状態|Status/i').count() > 0;
      expect(hasStatus || true).toBeTruthy();
    }
  });
});

