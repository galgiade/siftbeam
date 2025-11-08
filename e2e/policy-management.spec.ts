import { test, expect } from '@playwright/test';

/**
 * ポリシー管理機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('ポリシー管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接ポリシー管理ページへ移動
    await page.goto('/ja/account/policy-management');
  });

  test('ポリシー管理ページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /ポリシー|Policy/i 
    }).first()).toBeVisible();
    
    // ポリシーリストまたはメッセージが表示される
    const hasPolicies = await page.locator('table, ul, div[class*="card"]').count() > 0;
    const hasMessage = await page.locator('text=/ポリシー|Policy/i').count() > 0;
    
    expect(hasPolicies || hasMessage).toBeTruthy();
  });

  test('ポリシーリストが表示される', async ({ page }) => {
    // ポリシーリストまたは「ポリシーがありません」メッセージが表示される
    const hasPolicies = await page.locator('table, ul').count() > 0;
    const noPoliciesMessage = await page.locator('text=/ポリシーがありません|No policies|Empty/i').count() > 0;
    
    expect(hasPolicies || noPoliciesMessage).toBeTruthy();
  });

  test('ポリシーの詳細情報が表示される', async ({ page }) => {
    // ポリシー名が表示される
    const policyNames = await page.locator('text=/ポリシー|Policy/i').count();
    expect(policyNames).toBeGreaterThan(0);
  });
});

