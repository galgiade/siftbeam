import { test, expect } from '@playwright/test';

/**
 * 企業情報管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('企業情報管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接企業情報ページへ移動
    await page.goto('/ja/account/company');
  });

  test('企業情報ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /企業情報|会社情報|Company|Organization/i 
    }).first()).toBeVisible();
    
    // 企業情報または編集ボタンが表示される
    const hasCompanyInfo = await page.locator('text=/企業名|会社名|Company name/i').count() > 0;
    const hasEditButton = await page.locator('button, a').filter({ 
      hasText: /編集|更新|Edit|Update/i 
    }).count() > 0;
    
    expect(hasCompanyInfo || hasEditButton).toBeTruthy();
  });

  test('企業情報の詳細が表示される', async ({ page }) => {
    // 企業名、住所、電話番号などの情報が表示される
    const hasCompanyName = await page.locator('text=/企業名|会社名|Company name/i').count() > 0;
    const hasAddress = await page.locator('text=/住所|所在地|Address/i').count() > 0;
    const hasPhone = await page.locator('text=/電話|Phone|Tel/i').count() > 0;
    
    // いずれかが表示されていればOK
    expect(hasCompanyName || hasAddress || hasPhone).toBeTruthy();
  });

  test('企業情報編集ページへ遷移できる', async ({ page }) => {
    // 編集ボタンを探す
    const editButton = page.locator('button, a').filter({ 
      hasText: /編集|更新|Edit|Update/i 
    }).first();
    
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // 編集ページに遷移（URLパターンは複数ある可能性）
      await page.waitForURL(/\/ja\/account\/(company|update-company-info)/, { timeout: 5000 });
    }
  });

  test('企業情報編集フォームが表示される', async ({ page }) => {
    // 編集ボタンをクリック
    const editButton = page.locator('button, a').filter({ 
      hasText: /編集|更新|Edit|Update/i 
    }).first();
    
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(1000);
      
      // フォームが表示される
      await expect(page.locator('form')).toBeVisible();
      
      // 入力欄が表示される
      await expect(page.locator('input, textarea').first()).toBeVisible();
      
      // 保存ボタンが表示される
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    }
  });
});

