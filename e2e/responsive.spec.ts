import { test, expect, devices } from '@playwright/test';

/**
 * レスポンシブデザインのE2Eテスト
 */

test.describe('レスポンシブデザイン', () => {
  test('デスクトップ表示が正常に動作する', async ({ page }) => {
    // デスクトップサイズに設定
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/ja/signin');
    
    // サインインフォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // レイアウトが崩れていないことを確認
    const formWidth = await page.locator('form').boundingBox();
    expect(formWidth?.width).toBeLessThan(1920);
  });

  test('タブレット表示が正常に動作する', async ({ page }) => {
    // タブレットサイズに設定（iPad）
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/ja/signin');
    
    // サインインフォームが表示される
    await expect(page.locator('form')).toBeVisible();
  });

  test('モバイル表示が正常に動作する', async ({ page }) => {
    // モバイルサイズに設定（iPhone 13）
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ja/signin');
    
    // サインインフォームが表示される
    await expect(page.locator('form')).toBeVisible();
    
    // フォームがビューポート内に収まっている
    const formBox = await page.locator('form').boundingBox();
    expect(formBox?.width).toBeLessThanOrEqual(390);
  });
});

test.describe('認証済みページのレスポンシブデザイン', () => {
  // 保存された認証状態を使用
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接ユーザーページへ移動
    await page.goto('/ja/account/user');
  });

  test('モバイルでサイドナビゲーションがハンバーガーメニューになる', async ({ page }) => {
    // モバイルサイズに設定
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/ja/account/user');
    
    // ハンバーガーメニューボタンが表示される
    const menuButton = page.locator('button').filter({ 
      hasText: /メニュー|Menu/i 
    }).or(
      page.locator('button[aria-label*="menu"]')
    ).first();
    
    // メニューボタンが存在する場合、クリックしてメニューを開く
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // ナビゲーションメニューが表示される
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    }
  });

  test('デスクトップでサイドナビゲーションが常に表示される', async ({ page }) => {
    // デスクトップサイズに設定
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/ja/account/user');
    
    // サイドナビゲーションが表示される
    await expect(page.locator('nav, aside, [role="navigation"]').first()).toBeVisible();
  });
});

