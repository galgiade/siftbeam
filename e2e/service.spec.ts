import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * サービスページ（ファイルアップロード）のE2Eテスト
 * 
 * 前提条件:
 * - ユーザーが既にサインイン済み（認証状態を使用）
 * - ポリシーが1つ以上存在する
 */

// 保存された認証状態を使用
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('サービスページ - ファイルアップロード', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で直接サービスページへ移動
    await page.goto('/ja/service');
  });

  test('サービスページが正しく表示される', async ({ page }) => {
    // ページタイトルが表示される
    await expect(page.locator('h1')).toBeVisible();
    
    // 利用制限カードが表示される
    await expect(page.locator('text=/通知制限|利用停止制限/i').first()).toBeVisible();
    
    // ポリシー選択セクションが表示される
    await expect(page.locator('text=/ポリシー|Policy/i')).toBeVisible();
    
    // ファイルアップロードセクションが表示される
    await expect(page.locator('text=/ファイル|アップロード|File|Upload/i')).toBeVisible();
  });

  test('ポリシーを選択できる', async ({ page }) => {
    // ポリシー選択ドロップダウンを探す
    const policySelect = page.locator('select, [role="combobox"], button').filter({ 
      hasText: /ポリシー|Policy|選択|Select/i 
    }).first();
    
    // ポリシー選択が表示されることを確認
    await expect(policySelect).toBeVisible({ timeout: 5000 });
    
    // ポリシーをクリック（ドロップダウンを開く）
    await policySelect.click();
    
    // ポリシーオプションが表示されることを確認（最大5秒待機）
    const policyOption = page.locator('[role="option"], li, div').filter({ 
      hasText: /ポリシー|Policy/i 
    }).first();
    
    await expect(policyOption).toBeVisible({ timeout: 5000 });
  });

  test('処理履歴が表示される', async ({ page }) => {
    // 処理履歴セクションを探す
    const historySection = page.locator('text=/処理履歴|履歴|History/i').first();
    
    // 処理履歴が表示されることを確認
    await expect(historySection).toBeVisible({ timeout: 5000 });
  });

  // 注意: 実際のファイルアップロードテストは環境依存が高いため、
  // UIの表示確認のみに留めています。
  // 実際のアップロード処理をテストする場合は、以下のようなコードを使用できます：
  
  test.skip('ファイルアップロード機能（スキップ - 環境依存）', async ({ page }) => {
    // ポリシーを選択
    const policySelect = page.locator('select, [role="combobox"]').first();
    await policySelect.click();
    await page.locator('[role="option"]').first().click();
    
    // テストファイルのパス（100KB以下の小さなファイル）
    const testFilePath = path.join(__dirname, 'fixtures', 'test-file.pdf');
    
    // ファイル入力要素を探す
    const fileInput = page.locator('input[type="file"]');
    
    // ファイルをアップロード
    await fileInput.setInputFiles(testFilePath);
    
    // アップロード進捗が表示されることを確認
    await expect(page.locator('text=/アップロード中|Uploading|進捗/i')).toBeVisible({ timeout: 5000 });
    
    // 処理履歴に新しいエントリが追加されることを確認
    await expect(page.locator('text=/処理中|成功|Success/i')).toBeVisible({ timeout: 30000 });
  });
});

