# 環境変数設定チェックリスト

## 🚨 現在の問題

`VERIFICATION_CODES_TABLE_NAME`環境変数が正しく設定されていない可能性があります。

## ✅ 必要な環境変数

### `.env.local`ファイルに以下を設定してください：

```bash
# AWS設定
REGION=ap-northeast-1
ACCESS_KEY_ID=your-access-key-id
SECRET_ACCESS_KEY=your-secret-access-key

# Cognito設定
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id

# DynamoDB設定
ANNOUNCEMENT_TABLE_NAME=siftbeam-announcements
VERIFICATION_CODES_TABLE_NAME=siftbeam-verification-codes  # ← これが重要！
USER_TABLE_NAME=siftbeam-users

# S3設定
S3_BUCKET_NAME=your-bucket-name

# SES設定
SES_FROM_EMAIL=noreply@yourdomain.com

# Stripe設定
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRICE_PROCESSING_ID=price_1S6OKOFJRMc2FODoYLsEJrQg
STRIPE_PRICE_STORAGE_ID=price_1S6OOmFJRMc2FODoqOlACIGy

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔍 確認方法

### 1. コンソールログを確認
アプリケーション起動時に以下のログが表示されます：

```
Environment variables check: {
  VERIFICATION_CODES_TABLE_NAME: 'siftbeam-verification-codes',  // ← これが表示されるべき
  VERIFICATION_TABLE: 'siftbeam-verification-codes',
  REGION: 'ap-northeast-1',
  ACCESS_KEY_ID: '***設定済み***',
  SECRET_ACCESS_KEY: '***設定済み***'
}
```

### 2. エラーメッセージを確認
環境変数が未設定の場合、以下のエラーが表示されます：

```
🚨 VERIFICATION_CODES_TABLE_NAME環境変数が設定されていません！
📋 .env.localファイルに以下を追加してください:
VERIFICATION_CODES_TABLE_NAME=siftbeam-verification-codes
```

## 🛠️ トラブルシューティング

### 問題1: 環境変数が`undefined`
**原因**: `.env.local`ファイルに`VERIFICATION_CODES_TABLE_NAME`が設定されていない
**解決**: 上記の環境変数を`.env.local`に追加

### 問題2: 環境変数が読み込まれない
**原因**: `.env.local`ファイルの場所が間違っている
**解決**: プロジェクトルート（`package.json`と同じ階層）に配置

### 問題3: Next.jsが環境変数を認識しない
**原因**: サーバーの再起動が必要
**解決**: `npm run dev`を再実行

## 📋 チェックリスト

- [ ] `.env.local`ファイルがプロジェクトルートに存在する
- [ ] `VERIFICATION_CODES_TABLE_NAME=siftbeam-verification-codes`が設定されている
- [ ] 他の必要な環境変数も設定されている
- [ ] Next.jsサーバーを再起動した
- [ ] コンソールログで環境変数が正しく読み込まれていることを確認した

## 🚀 設定後の確認

1. Next.jsサーバーを再起動
2. ブラウザのコンソールまたはサーバーログを確認
3. 環境変数チェックログが正しい値を表示することを確認
4. メール変更機能をテスト
