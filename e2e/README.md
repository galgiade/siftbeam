# E2Eテスト（Playwright）

このディレクトリには、Playwrightを使用したEnd-to-End（E2E）テストが含まれています。

## 📁 ディレクトリ構造

```
e2e/
├── signin.spec.ts              # サインイン機能
├── signup.spec.ts              # サインアップ機能
├── service.spec.ts             # サービスページ（ファイルアップロード）
├── navigation.spec.ts          # ナビゲーションとページ遷移
├── responsive.spec.ts          # レスポンシブデザイン
├── api-keys.spec.ts            # APIキー管理
├── user-management.spec.ts     # ユーザー管理
├── group-management.spec.ts    # グループ管理
├── policy-management.spec.ts   # ポリシー管理
├── payment.spec.ts             # 支払い管理
├── usage-limit.spec.ts         # 利用制限管理
├── audit-log.spec.ts           # 監査ログ
├── company-info.spec.ts        # 企業情報管理
├── account-deletion.spec.ts    # アカウント削除
├── support.spec.ts             # サポートセンター
├── announcement.spec.ts        # お知らせ
├── new-order.spec.ts           # 新規注文管理
├── flow.spec.ts                # フロー
├── public-pages.spec.ts        # 公開ページ（認証不要）
├── accessibility.spec.ts       # アクセシビリティ
├── performance.spec.ts         # パフォーマンス
├── error-handling.spec.ts      # エラーハンドリング
└── README.md                   # このファイル
```

## 📊 テストカバレッジ

### 認証機能（2ファイル）
- `signin.spec.ts` - サインイン、パスワード表示切替、バリデーション
- `signup.spec.ts` - サインアップ、企業情報、管理者作成、支払い設定

### アカウント管理（10ファイル）
- `user-management.spec.ts` - ユーザー情報、ユーザー管理、招待
- `group-management.spec.ts` - グループ作成、編集、削除
- `company-info.spec.ts` - 企業情報表示、編集
- `account-deletion.spec.ts` - アカウント削除、キャンセル
- `api-keys.spec.ts` - APIキー作成、管理、削除
- `policy-management.spec.ts` - ポリシー表示、管理
- `payment.spec.ts` - 支払い方法登録、管理
- `usage-limit.spec.ts` - 利用制限設定、通知、停止
- `audit-log.spec.ts` - 監査ログ表示、フィルター
- `support.spec.ts` - サポートリクエスト作成、管理

### コア機能（3ファイル）
- `service.spec.ts` - ファイルアップロード、ポリシー選択、処理履歴
- `new-order.spec.ts` - 注文作成、管理、詳細表示
- `flow.spec.ts` - フロー表示

### UI/UX（3ファイル）
- `navigation.spec.ts` - ページ遷移、サイドナビ、サインアウト
- `responsive.spec.ts` - デスクトップ、タブレット、モバイル表示
- `public-pages.spec.ts` - ホーム、利用規約、プライバシー、料金

### 品質保証（4ファイル）
- `accessibility.spec.ts` - アクセシビリティ、キーボード操作
- `performance.spec.ts` - ページ読み込み速度、リソースサイズ
- `error-handling.spec.ts` - 404エラー、ネットワークエラー
- `announcement.spec.ts` - お知らせ表示、詳細

**合計: 22ファイル、100+テストケース**

## 🚀 テストの実行方法

### 1. 環境変数の設定

```bash
# .env.test.example を .env.test にコピー
cp .env.test.example .env.test

# .env.test を編集して、実際のテストユーザー情報を設定
```

### 2. すべてのテストを実行

```bash
# ヘッドレスモードで実行
npm run test:e2e

# UIモードで実行（デバッグに便利）
npm run test:e2e:ui

# ブラウザを表示して実行
npm run test:e2e:headed
```

### 3. 特定のテストファイルのみ実行

```bash
# サインインテストのみ
npx playwright test e2e/signin.spec.ts

# サービステストのみ
npx playwright test e2e/service.spec.ts

# 複数のテストファイル
npx playwright test e2e/signin.spec.ts e2e/service.spec.ts
```

### 4. 特定のテストケースのみ実行

```bash
# テスト名で絞り込み
npx playwright test -g "正常系"

# 特定のdescribeブロック
npx playwright test -g "サインイン機能"
```

### 5. カテゴリ別に実行

```bash
# 認証関連のテスト
npx playwright test e2e/signin.spec.ts e2e/signup.spec.ts

# アカウント管理関連のテスト
npx playwright test e2e/user-management.spec.ts e2e/group-management.spec.ts e2e/company-info.spec.ts

# 品質保証関連のテスト
npx playwright test e2e/accessibility.spec.ts e2e/performance.spec.ts e2e/error-handling.spec.ts
```

### 6. テスト結果の確認

```bash
# HTMLレポートを開く
npm run test:e2e:report

# または
npx playwright show-report
```

## 🎯 テストの方針

### ✅ テストすること
- **正常系（ハッピーパス）**: 正しい入力で機能が動作するか
- **統合確認**: 画面遷移、データ連携、API通信が正常に動作するか
- **重大なバグ検出**: アプリが完全に動かなくなるような致命的な問題
- **アクセシビリティ**: 基本的なアクセシビリティ要件
- **パフォーマンス**: ページ読み込み速度、リソースサイズ

### ❌ テストしないこと
- **入力バリデーション**: 数字のみ、空欄、形式エラーなど → ユニットテストでカバー済み
- **エッジケース**: 境界値、特殊文字、極端なデータ → 自動テストでカバー
- **エラーハンドリングの全パターン**: 各種エラーメッセージの表示確認

## 🔧 Jestとの共存

Playwrightは **Jestと完全に独立** して動作します：

| テストツール | 対象 | ディレクトリ | 実行コマンド |
|------------|------|------------|------------|
| **Jest** | ユニットテスト | `app/**/*.test.ts(x)` | `npm test` |
| **Playwright** | E2Eテスト | `e2e/**/*.spec.ts` | `npm run test:e2e` |

両者は異なるディレクトリとファイル拡張子を使用しているため、競合しません。

## 📝 テストの書き方

### 基本的なテスト構造

```typescript
import { test, expect } from '@playwright/test';

test.describe('機能名', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前の共通処理
    await page.goto('/ja/signin');
  });

  test('テストケース名', async ({ page }) => {
    // テストコード
    await page.fill('[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // アサーション
    await expect(page).toHaveURL(/\/ja\/account/);
  });
});
```

### よく使うAPI

```typescript
// ページ遷移
await page.goto('/ja/signin');

// 要素の操作
await page.fill('[name="email"]', 'test@example.com');
await page.click('button[type="submit"]');
await page.selectOption('select', 'option-value');

// 待機
await page.waitForURL(/\/ja\/account/);
await page.waitForSelector('h1');
await page.waitForLoadState('networkidle');

// アサーション
await expect(page).toHaveURL(/\/ja\/account/);
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('h1')).toContainText('ダッシュボード');
await expect(page.locator('button')).toBeDisabled();
```

## 🐛 デバッグ方法

### 1. UIモードで実行（推奨）
```bash
npm run test:e2e:ui
```
- テストをステップバイステップで実行
- 各ステップの状態を確認
- 要素のセレクターを確認

### 2. ブラウザを表示して実行
```bash
npm run test:e2e:headed
```

### 3. 特定のテストをデバッグ
```bash
npx playwright test e2e/signin.spec.ts --debug
```

### 4. トレースビューアーで分析
```bash
# トレース付きで実行
npx playwright test --trace on

# トレースを表示
npm run test:e2e:report
```

## 📊 CI/CDでの実行

GitHub Actionsなどで実行する場合：

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test:e2e
  env:
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 🎓 テストのベストプラクティス

### 1. 独立したテスト
各テストは他のテストに依存せず、独立して実行できるようにする。

### 2. 明確なテスト名
テスト名は何をテストしているか明確にする。

```typescript
// Good
test('正常系: 有効な認証情報でサインインできる', async ({ page }) => {

// Bad
test('テスト1', async ({ page }) => {
```

### 3. 適切な待機
要素が表示されるまで適切に待機する。

```typescript
// Good
await expect(page.locator('h1')).toBeVisible();

// Bad
await page.waitForTimeout(5000); // 固定時間の待機は避ける
```

### 4. 再利用可能なヘルパー関数
共通処理はヘルパー関数にまとめる。

```typescript
async function signIn(page, email, password) {
  await page.goto('/ja/signin');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/ja\/account/);
}
```

## 🔗 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [E2Eテストチェックリスト](../E2E_TEST_CHECKLIST.md)
- [Playwrightセットアップガイド](../PLAYWRIGHT_SETUP.md)

## 📈 テスト実行時間の目安

| カテゴリ | ファイル数 | 実行時間（目安） |
|---------|----------|----------------|
| 認証機能 | 2 | 30秒 |
| アカウント管理 | 10 | 2分 |
| コア機能 | 3 | 1分 |
| UI/UX | 3 | 1分 |
| 品質保証 | 4 | 1分 |
| **合計** | **22** | **約5分** |

※並列実行により実際の実行時間は短縮されます

## 🎉 まとめ

このE2Eテストスイートは、アプリケーションの主要機能を包括的にカバーしています。

- ✅ 22ファイル、100+テストケース
- ✅ 正常系のみをテスト（効率的）
- ✅ Jestと完全に独立（競合なし）
- ✅ CI/CD対応
- ✅ アクセシビリティ、パフォーマンステスト含む

テストを実行して、アプリケーションの品質を確保しましょう！
