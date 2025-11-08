# 2FA対応の実装ガイド

## 🎯 推奨: テスト環境で2FAを無効化

最もシンプルで効果的な方法です。

## 📝 実装手順

### ステップ1: 環境変数を追加

**`.env.test`ファイルに追加:**

```bash
# 2段階認証をスキップ（テスト環境のみ）
SKIP_2FA=true
```

### ステップ2: `auth-actions.ts`を修正

**`app/lib/auth/auth-actions.ts`の103行目付近を修正:**

```typescript
if (response.AuthenticationResult) {
  // テスト環境では2FAをスキップ
  if (process.env.SKIP_2FA === 'true') {
    // トークンを直接保存
    const cookieStore = await cookies();
    cookieStore.set('accessToken', response.AuthenticationResult.AccessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1時間
    });
    
    cookieStore.set('idToken', response.AuthenticationResult.IdToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
    });
    
    if (response.AuthenticationResult.RefreshToken) {
      cookieStore.set('refreshToken', response.AuthenticationResult.RefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30日
      });
    }
    
    return {
      success: true,
      message: 'Sign in successful',
      errors: {},
      redirectTo: `/${locale}/account/user`,
    };
  }

  // 本番環境では2FAを実行（既存のコード）
  const emailResult = await sendVerificationEmailAction(
    email,
    email,
    locale
  );
  
  // ... 既存の2FA処理 ...
}
```

### ステップ3: Playwright設定を更新

**`playwright.config.ts`を修正:**

```typescript
export default defineConfig({
  // ... 既存の設定 ...
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      SKIP_2FA: 'true', // テスト時は2FAをスキップ
    },
  },
});
```

### ステップ4: テストを実行

```bash
# サインインテストを実行
npx playwright test e2e/signin.spec.ts --headed

# 全テストを実行
npx playwright test
```

---

## ✅ 期待される結果

- ✅ サインインテストが成功する
- ✅ 2FA画面が表示されない
- ✅ 直接ダッシュボードにリダイレクトされる
- ✅ 認証が必要なページにアクセスできる

---

## 🔒 セキュリティの注意事項

### ✅ 安全な実装

1. **環境変数で制御**
   - `SKIP_2FA=true` はテスト環境のみ
   - 本番環境では絶対に設定しない

2. **`.env.test`はGitにコミットしない**
   - 既に`.gitignore`に含まれています

3. **本番デプロイ時の確認**
   - 環境変数 `SKIP_2FA` が設定されていないことを確認

### ❌ 避けるべき

1. **本番環境で2FAをスキップしない**
2. **環境変数をハードコードしない**
3. **`.env.test`をGitにコミットしない**

---

## 🐛 トラブルシューティング

### エラー: "Verification code sent"

**原因**: 環境変数が読み込まれていない

**解決策**:
1. `.env.test`ファイルが存在することを確認
2. `SKIP_2FA=true`が設定されていることを確認
3. 開発サーバーを再起動

```bash
# サーバーを停止
Ctrl+C

# 再起動
npm run dev
```

### エラー: "Cannot set headers after they are sent"

**原因**: トークン保存の実装に問題がある

**解決策**:
`cookies()`の呼び出しを確認し、正しく実装されているか確認

---

## 📊 実装の確認

### チェックリスト

- [ ] `.env.test`に`SKIP_2FA=true`を追加
- [ ] `auth-actions.ts`を修正
- [ ] `playwright.config.ts`を更新
- [ ] 開発サーバーを再起動
- [ ] サインインテストが成功する
- [ ] 2FA画面が表示されない
- [ ] ダッシュボードにアクセスできる

---

## 🎉 完了！

これで、E2Eテストで2FAを突破できるようになりました。

次のステップ:
1. 認証が必要な全テストを実行
2. CI/CDパイプラインに組み込む

