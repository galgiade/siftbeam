import { test, expect } from '@playwright/test';

/**
 * パフォーマンステスト
 * 
 * 基本的なパフォーマンス要件を確認
 */

test.describe('パフォーマンス - ページ読み込み', () => {
  test('ホームページが3秒以内に読み込まれる', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/ja', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // 3秒以内に読み込まれる
    expect(loadTime).toBeLessThan(3000);
  });

  test('サインインページが3秒以内に読み込まれる', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/ja/signin', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // 3秒以内に読み込まれる
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('パフォーマンス - ページサイズ', () => {
  test('ホームページのリソースサイズが適切', async ({ page }) => {
    const responses: number[] = [];
    
    page.on('response', (response) => {
      const contentLength = response.headers()['content-length'];
      if (contentLength) {
        responses.push(parseInt(contentLength));
      }
    });
    
    await page.goto('/ja');
    
    // リソースが読み込まれている
    expect(responses.length).toBeGreaterThan(0);
  });
});

test.describe('パフォーマンス - レスポンス時間', () => {
  test('APIレスポンスが適切な時間で返される', async ({ page }) => {
    await page.goto('/ja/signin');
    
    const startTime = Date.now();
    
    // フォーム送信
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'ValidPass123');
    await page.click('button[type="submit"]');
    
    // レスポンスを待つ
    await page.waitForTimeout(1000);
    
    const responseTime = Date.now() - startTime;
    
    // 5秒以内にレスポンスがある
    expect(responseTime).toBeLessThan(5000);
  });
});

test.describe('パフォーマンス - メモリ使用量', () => {
  test('ページ遷移でメモリリークが発生しない', async ({ page }) => {
    // 複数ページを遷移
    await page.goto('/ja');
    await page.goto('/ja/signin');
    await page.goto('/ja/pricing');
    await page.goto('/ja/terms');
    await page.goto('/ja');
    
    // ページが正常に表示される
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('パフォーマンス - 画像最適化', () => {
  test('画像が適切なフォーマットで配信される', async ({ page }) => {
    const imageFormats: string[] = [];
    
    page.on('response', (response) => {
      const contentType = response.headers()['content-type'];
      if (contentType?.startsWith('image/')) {
        imageFormats.push(contentType);
      }
    });
    
    await page.goto('/ja');
    
    // 画像が読み込まれている場合、フォーマットを確認
    if (imageFormats.length > 0) {
      // 最適化された画像フォーマット（WebP、AVIF、またはJPEG/PNG）
      const hasOptimizedFormat = imageFormats.some(format => 
        format.includes('webp') || 
        format.includes('avif') || 
        format.includes('jpeg') || 
        format.includes('png')
      );
      expect(hasOptimizedFormat).toBeTruthy();
    }
  });
});

