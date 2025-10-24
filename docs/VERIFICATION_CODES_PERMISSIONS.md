# 認証コード機能のIAM権限設定

## 🚨 現在のエラー

```
AccessDeniedException: User: arn:aws:iam::002689294103:user/siftbeam is not authorized to perform: dynamodb:BatchWriteItem on resource: arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-verification-codes
```

## ✅ 必要な権限

### DynamoDB権限
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:GetItem",
    "dynamodb:UpdateItem", 
    "dynamodb:DeleteItem",
    "dynamodb:Query",
    "dynamodb:BatchWriteItem"
  ],
  "Resource": [
    "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-verification-codes",
    "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-verification-codes/index/*"
  ]
}
```

### SES権限
```json
{
  "Effect": "Allow",
  "Action": [
    "ses:SendTemplatedEmail"
  ],
  "Resource": "*"
}
```

### Cognito権限
```json
{
  "Effect": "Allow",
  "Action": [
    "cognito-idp:AdminUpdateUserAttributes",
    "cognito-idp:AdminConfirmSignUp"
  ],
  "Resource": [
    "arn:aws:cognito-idp:ap-northeast-1:002689294103:userpool/*"
  ]
}
```

## 🔧 修正内容

### 1. BatchWriteItem権限問題の回避
- `BatchWriteItemCommand` → 個別の `DeleteItemCommand` に変更
- 権限エラーが発生しても処理を継続

### 2. エラーハンドリングの改善
- 個別削除エラーは継続処理
- 詳細なログ出力
- 環境変数の確認ログ

### 3. 環境変数の確認
```bash
VERIFICATION_CODES_TABLE_NAME=siftbeam-verification-codes
REGION=ap-northeast-1
ACCESS_KEY_ID=your-access-key-id
SECRET_ACCESS_KEY=your-secret-access-key
```

## 📋 対応手順

1. **IAMポリシーの更新**
   - `docs/iam-policy-verification-codes.json` を適用
   - 特に `dynamodb:BatchWriteItem` 権限を追加

2. **環境変数の確認**
   - `.env.local` ファイルの設定を確認
   - コンソールログで環境変数の読み込み状況を確認

3. **テーブル名の確認**
   - DynamoDBコンソールでテーブル名を確認
   - `siftbeam-verification-codes` が正しいテーブル名か確認

## 🔍 デバッグ情報

コンソールログで以下の情報を確認：
```
Environment variables check: {
  VERIFICATION_TABLE: 'siftbeam-verification-codes',
  REGION: 'ap-northeast-1',
  ACCESS_KEY_ID: '***設定済み***',
  SECRET_ACCESS_KEY: '***設定済み***'
}
```

## ⚡ 緊急対応

権限問題が解決するまでの間、個別削除方式で動作します：
- `BatchWriteItem` → `DeleteItem` の個別実行
- エラーが発生しても認証処理は継続
- パフォーマンスは若干低下しますが機能は維持
