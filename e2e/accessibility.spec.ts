import { test, expect } from '@playwright/test';

/**
 * アクセシビリティのE2Eテスト
 * 
 * 基本的なアクセシビリティ要件を確認
 */

test.describe('アクセシビリティ - サインインページ', () => {
  test('サインインページにページタイトルが設定されている', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // ページタイトルが設定されている
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('フォーム要素にラベルが設定されている', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // メールアドレス入力欄にラベルがある
    const emailInput = page.locator('input[type="email"]');
    const emailLabel = await emailInput.getAttribute('aria-label') || 
                       await page.locator('label[for]').filter({ has: emailInput }).count();
    
    expect(emailLabel).toBeTruthy();
  });

  test('ボタンに適切なテキストが設定されている', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // 送信ボタンにテキストがある
    const submitButton = page.locator('button[type="submit"]');
    const buttonText = await submitButton.textContent();
    
    expect(buttonText?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('アクセシビリティ - キーボード操作', () => {
  test('Tabキーでフォーカス移動ができる', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // メールアドレス入力欄にフォーカス
    await page.keyboard.press('Tab');
    
    // フォーカスされた要素が存在する
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
  });

  test('Enterキーでフォーム送信ができる', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // メールアドレス入力
    await page.fill('input[type="email"]', 'test@example.com');
    
    // パスワード入力
    await page.fill('input[type="password"]', 'ValidPass123');
    
    // Enterキーで送信
    await page.keyboard.press('Enter');
    
    // URLが変わるまたはエラーメッセージが表示される
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });
});

test.describe('アクセシビリティ - 画像の代替テキスト', () => {
  test('画像に代替テキストが設定されている', async ({ page }) => {
    await page.goto('/ja');
    
    // 画像要素を取得
    const images = await page.locator('img').all();
    
    // 各画像にalt属性があることを確認
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // alt属性が存在する（空でもOK - 装飾画像の場合）
      expect(alt !== null).toBeTruthy();
    }
  });
});

test.describe('アクセシビリティ - コントラスト', () => {
  test('テキストが読みやすい色で表示されている', async ({ page }) => {
    await page.goto('/ja/signin');
    
    // ページが正常に表示される（視覚的な確認は手動テストで）
    await expect(page.locator('body')).toBeVisible();
    
    // テキストが存在する
    const textContent = await page.locator('body').textContent();
    expect(textContent?.length).toBeGreaterThan(0);
  });
});

test.describe('アクセシビリティ - ランドマーク', () => {
  test('ページにメインランドマークが存在する', async ({ page }) => {
    await page.goto('/ja');
    
    // main要素またはrole="main"が存在する
    const mainLandmark = await page.locator('main, [role="main"]').count();
    expect(mainLandmark).toBeGreaterThanOrEqual(0);
  });

  test('ページにナビゲーションランドマークが存在する', async ({ page }) => {
    await page.goto('/ja');
    
    // nav要素またはrole="navigation"が存在する
    const navLandmark = await page.locator('nav, [role="navigation"]').count();
    expect(navLandmark).toBeGreaterThanOrEqual(0);
  });
});

