import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * 
 * Jestとの共存:
 * - Playwrightは e2e/ ディレクトリのテストを実行
 * - Jestは app/ ディレクトリの *.test.ts(x) を実行
 * - 両者は完全に独立して動作
 */
export default defineConfig({
  // テストディレクトリ（Jestと分離）
  testDir: './e2e',
  
  // 完全並列実行
  fullyParallel: true,
  
  // CI環境でのみfail fast
  forbidOnly: !!process.env.CI,
  
  // リトライ設定
  retries: process.env.CI ? 2 : 0,
  
  // 並列ワーカー数
  workers: process.env.CI ? 2 : undefined,
  
  // グローバルセットアップ・ティアダウン
  globalSetup: require.resolve('./e2e/global-setup'),
  globalTeardown: require.resolve('./e2e/global-teardown'),
  
  // レポーター
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  // 共通設定
  use: {
    // ベースURL（開発サーバー）
    baseURL: 'http://localhost:3000',
    
    // トレース設定（失敗時のみ記録）
    trace: 'on-first-retry',
    
    // スクリーンショット（失敗時のみ）
    screenshot: 'only-on-failure',
    
    // ビデオ（失敗時のみ）
    video: 'retain-on-failure',
  },

  // テスト対象ブラウザ
  projects: [
    // 認証済みテスト用プロジェクト
    {
      name: 'chromium-authenticated',
      use: { 
        ...devices['Desktop Chrome'],
        // 保存された認証状態を使用
        storageState: 'playwright/.auth/user.json',
      },
    },
    
    // 認証不要テスト用プロジェクト
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
    
    // 必要に応じてコメント解除
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // モバイルテスト
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // 開発サーバー自動起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分
  },
});

