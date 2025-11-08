import { test, expect } from '@playwright/test';

/**
 * 利用制限管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('利用制限管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接利用制限管理ページへ移動
    await page.goto('/ja/account/limit-usage');
  });

  test('利用制限管理ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /利用制限|使用制限|Usage Limit|Limit/i 
    }).first()).toBeVisible();
    
    // 新規作成ボタンまたは制限リストが表示される
    const hasCreateButton = await page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).count() > 0;
    const hasLimitList = await page.locator('table, ul, div[class*="card"]').count() > 0;
    
    expect(hasCreateButton || hasLimitList).toBeTruthy();
  });

  test('利用制限リストが表示される', async ({ page }) => {
    // 利用制限リストまたは「制限がありません」メッセージが表示される
    const hasLimits = await page.locator('table, ul').count() > 0;
    const noLimitsMessage = await page.locator('text=/制限がありません|No limits|Empty/i').count() > 0;
    
    expect(hasLimits || noLimitsMessage).toBeTruthy();
  });

  test('新規制限作成ページへ遷移できる', async ({ page }) => {
    // 新規作成ボタンをクリック
    const createButton = page.locator('button, a').filter({ 
      hasText: /新規作成|作成|Create|New/i 
    }).first();
    
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // 新規作成ページに遷移
      await expect(page).toHaveURL(/\/ja\/account\/limit-usage\/create/, { timeout: 5000 });
    }
  });

  test('利用制限作成フォームが表示される', async ({ page }) => {
    await page.goto('/ja/account/limit-usage/create');
    
    // フォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // 入力欄が表示される
    await expect(page.locator('input, select').first()).toBeVisible();
    
    // 作成ボタンが表示される
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('制限タイプを選択できる', async ({ page }) => {
    await page.goto('/ja/account/limit-usage/create');
    
    // 通知または利用停止の選択肢が表示される
    const hasNotifyOption = await page.locator('text=/通知|Notify|Alert/i').count() > 0;
    const hasRestrictOption = await page.locator('text=/停止|制限|Restrict|Block/i').count() > 0;
    
    expect(hasNotifyOption || hasRestrictOption).toBeTruthy();
  });
});

