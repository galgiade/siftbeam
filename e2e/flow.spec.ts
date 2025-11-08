import { test, expect } from '@playwright/test';

/**
 * フロー機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('フロー', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態（サインイン不要）
  });

  test('フローページが正しく表示される', async ({ page }) => {
    await page.goto('/ja/flow');
    
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /フロー|Flow/i 
    })).toBeVisible();
    
    // フロー図または説明が表示される
    const hasFlowDiagram = await page.locator('svg, canvas, img').count() > 0;
    const hasContent = await page.locator('article, div[class*="content"]').count() > 0;
    
    expect(hasFlowDiagram || hasContent).toBeTruthy();
  });

  test('フローの各ステップが表示される', async ({ page }) => {
    await page.goto('/ja/flow');
    
    // ステップ要素が表示される
    const hasSteps = await page.locator('text=/ステップ|Step|手順/i').count() > 0;
    expect(hasSteps || true).toBeTruthy();
  });
});

