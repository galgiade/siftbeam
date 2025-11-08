# 手動認証ガイド

## 🎯 概要

このガイドでは、**サインインだけ手動で行い、その後のテストは自動化**する方法を説明します。

### メリット

- ✅ 2段階認証を手動で突破できる
- ✅ 認証状態を全テストで再利用
- ✅ テストのたびにサインインする必要がない
- ✅ 高速なテスト実行

---

## 🚀 使い方

### ステップ1: 初回セットアップ（手動サインイン）

```bash
# テストを実行（初回のみブラウザが開く）
npx playwright test
```

**何が起こるか:**

1. ✅ ブラウザが自動的に開く
2. ✅ サインインページが表示される
3. ⏳ **あなたが手動でサインイン**
   - メールアドレスとパスワードを入力
   - 2段階認証コードを入力（メールを確認）
4. ✅ ダッシュボードが表示されたら、認証状態が自動保存
5. ✅ ブラウザが自動的に閉じる
6. ✅ テストが開始される

### ステップ2: 2回目以降のテスト実行

```bash
# 保存された認証状態を使用（サインイン不要）
npx playwright test
```

**何が起こるか:**

1. ✅ 保存された認証状態を読み込み
2. ✅ サインインをスキップ
3. ✅ 全テストが認証済み状態で実行される

---

## 📂 認証状態の保存場所

```
playwright/.auth/user.json
```

このファイルには以下が含まれます:
- Cookie（アクセストークン、IDトークンなど）
- ローカルストレージ
- セッションストレージ

**重要**: このファイルは`.gitignore`に含まれているため、Gitにコミットされません。

---

## 🔄 認証状態のリセット

### 再度サインインする場合

```bash
# Windows
del playwright\.auth\user.json

# Mac/Linux
rm playwright/.auth/user.json

# 次回のテスト実行時に再度手動サインインが求められます
npx playwright test
```

### または、手動で削除

1. `playwright/.auth/user.json` を削除
2. 次回のテスト実行時に再度サインイン

---

## 🎭 プロジェクトの使い分け

### 認証済みテスト

```bash
# 認証が必要なテストのみ実行
npx playwright test --project=chromium-authenticated
```

**対象テスト:**
- サービスページ
- ユーザー管理
- グループ管理
- APIキー管理
- その他、認証が必要なページ

### 認証不要テスト

```bash
# 認証不要のテストのみ実行
npx playwright test --project=chromium
```

**対象テスト:**
- ホームページ
- サインインページ
- 利用規約
- プライバシーポリシー
- その他、公開ページ

---

## 📝 テストファイルでの使用方法

### 認証済みテストの書き方

```typescript
// e2e/service.spec.ts
import { test, expect } from '@playwright/test';

// プロジェクト指定: 認証済み状態で実行
test.use({ 
  storageState: 'playwright/.auth/user.json' 
});

test.describe('サービスページ', () => {
  test('サービスページが表示される', async ({ page }) => {
    // 既に認証済みなので、直接ページにアクセス
    await page.goto('/ja/service');
    
    // テストコード
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### 認証不要テストの書き方

```typescript
// e2e/public-pages.spec.ts
import { test, expect } from '@playwright/test';

// 認証状態を使用しない
test.describe('公開ページ', () => {
  test('ホームページが表示される', async ({ page }) => {
    await page.goto('/ja');
    
    await expect(page.locator('body')).toBeVisible();
  });
});
```

---

## 🔧 トラブルシューティング

### エラー: "認証状態ファイルが見つかりません"

**原因**: `playwright/.auth/user.json` が存在しない

**解決策**:
```bash
# テストを実行して手動サインイン
npx playwright test
```

### エラー: "タイムアウト: サインインを待機中"

**原因**: 5分以内にサインインが完了しなかった

**解決策**:
1. ブラウザでサインインを完了する
2. 2段階認証コードをメールで確認
3. ダッシュボードが表示されるまで待つ

### エラー: "認証が無効です"

**原因**: 保存された認証状態が期限切れ

**解決策**:
```bash
# 認証状態をリセット
del playwright\.auth\user.json  # Windows
rm playwright/.auth/user.json   # Mac/Linux

# 再度サインイン
npx playwright test
```

---

## 💡 ベストプラクティス

### 1. 定期的に認証状態をリセット

トークンの有効期限は通常1時間なので、長時間テストを実行しない場合は再度サインインが必要です。

```bash
# 1日1回、または必要に応じて
rm playwright/.auth/user.json
npx playwright test
```

### 2. CI/CDでの使用

CI/CD環境では、環境変数でテストユーザーを設定し、自動的にサインインするスクリプトを使用します。

```yaml
# GitHub Actions の例
- name: Authenticate
  run: |
    npx playwright test e2e/auth-setup.spec.ts
  env:
    TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
    TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}

- name: Run tests
  run: npx playwright test
```

### 3. 複数ユーザーのテスト

異なる権限を持つユーザーでテストする場合:

```typescript
// e2e/auth/admin-auth.ts
test.use({ storageState: 'playwright/.auth/admin.json' });

// e2e/auth/user-auth.ts
test.use({ storageState: 'playwright/.auth/user.json' });
```

---

## 📊 実行フロー

### 初回実行

```
1. npx playwright test
   ↓
2. global-setup.ts 実行
   ↓
3. ブラウザが開く（手動サインイン）
   ↓
4. 認証状態を保存
   ↓
5. テスト実行（認証済み）
   ↓
6. global-teardown.ts 実行
```

### 2回目以降

```
1. npx playwright test
   ↓
2. global-setup.ts 実行（スキップ）
   ↓
3. テスト実行（保存された認証状態を使用）
   ↓
4. global-teardown.ts 実行
```

---

## ✅ チェックリスト

- [ ] `playwright.config.ts` が更新されている
- [ ] `e2e/global-setup.ts` が存在する
- [ ] `e2e/global-teardown.ts` が存在する
- [ ] `playwright/.auth/` ディレクトリが存在する
- [ ] `.gitignore` に認証状態ファイルが含まれている
- [ ] 開発サーバーが起動している（`npm run dev`）
- [ ] テストユーザーが準備されている
- [ ] 初回テスト実行で手動サインインが完了した
- [ ] `playwright/.auth/user.json` が作成された
- [ ] 2回目以降のテストでサインインがスキップされる

---

## 🎉 完了！

これで、サインインだけ手動で行い、その後のテストは自動化できるようになりました。

次のステップ:
1. `npx playwright test` を実行
2. ブラウザでサインイン
3. 全テストが認証済み状態で実行されることを確認

