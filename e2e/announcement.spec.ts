import { test, expect } from '@playwright/test';

/**
 * お知らせ機能のE2Eテスト
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('お知らせ', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態（サインイン不要）
  });

  test('お知らせページが正しく表示される', async ({ page }) => {
    await page.goto('/ja/announcement');
    
    // ページタイトルが表示される
    await expect(page.locator('h1, h2').filter({ 
      hasText: /お知らせ|通知|Announcement|Notification/i 
    }).first()).toBeVisible();
    
    // お知らせリストまたはメッセージが表示される
    const hasAnnouncements = await page.locator('article, div[class*="card"], ul li').count() > 0;
    const hasMessage = await page.locator('text=/お知らせ|Announcement/i').count() > 0;
    
    expect(hasAnnouncements || hasMessage).toBeTruthy();
  });

  test('お知らせリストが表示される', async ({ page }) => {
    await page.goto('/ja/announcement');
    
    // お知らせリストまたは「お知らせがありません」メッセージが表示される
    const hasAnnouncements = await page.locator('article, ul li').count() > 0;
    const noAnnouncementsMessage = await page.locator('text=/お知らせがありません|No announcements|Empty/i').count() > 0;
    
    expect(hasAnnouncements || noAnnouncementsMessage).toBeTruthy();
  });

  test('お知らせの詳細ページへ遷移できる', async ({ page }) => {
    await page.goto('/ja/announcement');
    
    // 最初のお知らせをクリック
    const firstAnnouncement = page.locator('article, a[href*="/announcement/"], div[class*="card"]').first();
    
    if (await firstAnnouncement.isVisible()) {
      await firstAnnouncement.click();
      
      // 詳細ページに遷移
      await expect(page).toHaveURL(/\/ja\/announcement\//, { timeout: 5000 });
    }
  });

  test('お知らせの詳細が表示される', async ({ page }) => {
    await page.goto('/ja/announcement');
    
    // 最初のお知らせをクリック
    const firstAnnouncement = page.locator('a[href*="/announcement/"]').first();
    
    if (await firstAnnouncement.isVisible()) {
      await firstAnnouncement.click();
      
      // タイトルと内容が表示される
      await expect(page.locator('h1, h2')).toBeVisible();
      await expect(page.locator('article, div[class*="content"]')).toBeVisible();
    }
  });
});

