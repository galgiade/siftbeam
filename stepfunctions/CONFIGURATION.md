# アカウント削除Step Function 設定ガイド

## 📋 設定が必要な箇所

`AccountDeletionStateMachine-Direct.asl.json`内で以下の値を環境に合わせて変更する必要があります。

### 1. Cognito User Pool ID

**ファイル**: `AccountDeletionStateMachine-Direct.asl.json`  
**行番号**: 94  
**現在の値**: `"ap-northeast-1_xxxxxxxxx"`

```json
"cognitoUserPoolId": "ap-northeast-1_xxxxxxxxx"
```

**変更方法**:
```bash
# User Pool IDを確認
aws cognito-idp list-user-pools --max-results 10 --region ap-northeast-1

# または環境変数から
echo $COGNITO_USER_POOL_ID
```

---

### 2. S3 Bucket Name

**ファイル**: `AccountDeletionStateMachine-Direct.asl.json`  
**行番号**: 95  
**現在の値**: `"siftbeam"`

```json
"s3Bucket": "siftbeam"
```

**変更方法**:
```bash
# バケット名を確認
aws s3 ls

# または環境変数から
echo $S3_BUCKET_NAME
```

---

### 3. Stripe Connection ARN

**ファイル**: `AccountDeletionStateMachine-Direct.asl.json`  
**行番号**: 24, 511（2箇所）  
**現在の値**: `"arn:aws:events:ap-northeast-1:002689294103:connection/..."`

```json
"ConnectionArn": "arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Production-Connection/b711004d-52d7-4b35-8b29-9f33e9e3a054"
```

**変更方法**:
```bash
# Connection ARNを確認
aws events list-connections --region ap-northeast-1

# または環境変数から
echo $STRIPE_CONNECTION_ARN
```

---

### 4. DynamoDB Table Names

**ファイル**: `AccountDeletionStateMachine-Direct.asl.json`  
**行番号**: 194, 229, 273, 308  
**現在の値**: 
- `"siftbeam-users"`
- `"siftbeam-processing-history"`

```json
"TableName": "siftbeam-users"
"TableName": "siftbeam-processing-history"
```

**変更方法**:
```bash
# テーブル名を確認
aws dynamodb list-tables --region ap-northeast-1

# または環境変数から
echo $USER_TABLE_NAME
echo $PROCESSING_HISTORY_TABLE_NAME
```

---

## 🚀 自動設定方法（推奨）

### 方法1: 設定スクリプトを使用

```bash
# 1. 環境変数を設定
export COGNITO_USER_POOL_ID="ap-northeast-1_YourPoolId"
export S3_BUCKET_NAME="siftbeam"
export STRIPE_CONNECTION_ARN="arn:aws:events:ap-northeast-1:xxxxx:connection/..."

# 2. 設定スクリプトを実行
cd stepfunctions
chmod +x configure-account-deletion.sh
./configure-account-deletion.sh
```

### 方法2: .envファイルから読み込み

```bash
# 1. プロジェクトルートの.envファイルを読み込み
cd stepfunctions
source ../.env

# 2. 設定スクリプトを実行
./configure-account-deletion.sh
```

---

## ✏️ 手動設定方法

### エディタで直接編集

```bash
# 1. ファイルを開く
code AccountDeletionStateMachine-Direct.asl.json

# 2. 以下の箇所を検索して置換
# - ap-northeast-1_xxxxxxxxx → 実際のUser Pool ID
# - siftbeam → 実際のS3バケット名（必要に応じて）
# - arn:aws:events:... → 実際のConnection ARN
```

### sedコマンドで一括置換

```bash
# バックアップを作成
cp AccountDeletionStateMachine-Direct.asl.json AccountDeletionStateMachine-Direct.asl.json.backup

# 置換
sed -i 's/ap-northeast-1_xxxxxxxxx/ap-northeast-1_YourPoolId/g' AccountDeletionStateMachine-Direct.asl.json
sed -i 's/"s3Bucket": "siftbeam"/"s3Bucket": "your-bucket-name"/g' AccountDeletionStateMachine-Direct.asl.json
sed -i 's|arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Production-Connection/b711004d-52d7-4b35-8b29-9f33e9e3a054|arn:aws:events:ap-northeast-1:xxxxx:connection/YourConnection|g' AccountDeletionStateMachine-Direct.asl.json
```

---

## ✅ 設定確認

設定が正しく適用されたか確認：

```bash
# 1. Cognito User Pool IDを確認
grep "cognitoUserPoolId" AccountDeletionStateMachine-Direct.asl.json

# 2. S3 Bucketを確認
grep "s3Bucket" AccountDeletionStateMachine-Direct.asl.json

# 3. Stripe Connection ARNを確認
grep "ConnectionArn" AccountDeletionStateMachine-Direct.asl.json

# 4. すべてを一度に確認
grep -E "cognitoUserPoolId|s3Bucket|ConnectionArn" AccountDeletionStateMachine-Direct.asl.json
```

期待される出力:
```json
              "cognitoUserPoolId": "ap-northeast-1_YourActualPoolId",
              "s3Bucket": "your-actual-bucket-name"
                "ConnectionArn": "arn:aws:events:ap-northeast-1:xxxxx:connection/YourActualConnection"
                "ConnectionArn": "arn:aws:events:ap-northeast-1:xxxxx:connection/YourActualConnection"
```

---

## 🔍 環境変数の取得方法

### Cognito User Pool ID

```bash
# 方法1: AWS CLIで取得
aws cognito-idp list-user-pools --max-results 10 --region ap-northeast-1 \
  --query 'UserPools[?Name==`siftbeam-users`].Id' --output text

# 方法2: 環境変数ファイルから
grep COGNITO_USER_POOL_ID ../.env
```

### S3 Bucket Name

```bash
# 方法1: AWS CLIで取得
aws s3 ls | grep siftbeam

# 方法2: 環境変数ファイルから
grep S3_BUCKET_NAME ../.env
```

### Stripe Connection ARN

```bash
# 方法1: AWS CLIで取得
aws events list-connections --region ap-northeast-1 \
  --query 'Connections[?Name==`Stripe-Production-Connection`].ConnectionArn' --output text

# 方法2: 環境変数ファイルから
grep STRIPE_CONNECTION_ARN ../.env
```

---

## 🔄 バックアップと復元

### バックアップ

```bash
# 設定前にバックアップを作成
cp AccountDeletionStateMachine-Direct.asl.json AccountDeletionStateMachine-Direct.asl.json.backup
```

### 復元

```bash
# バックアップから復元
cp AccountDeletionStateMachine-Direct.asl.json.backup AccountDeletionStateMachine-Direct.asl.json
```

---

## ⚠️ 注意事項

1. **Connection ARNは2箇所あります**
   - Line 24: Stripe顧客リスト取得
   - Line 511: Stripeカスタマー削除
   - 両方とも同じARNに変更してください

2. **User Pool IDの形式**
   - 正しい形式: `ap-northeast-1_AbCdEfGhI`
   - リージョン + アンダースコア + 9文字のID

3. **テーブル名は環境に合わせて**
   - デフォルト: `siftbeam-users`, `siftbeam-processing-history`
   - 環境変数で異なる名前を使用している場合は変更が必要

4. **設定後は必ずテスト**
   - 設定変更後は必ずStep Functionをテスト実行してください
   - テスト用のCustomer IDを使用することを推奨

---

## 📚 関連ドキュメント

- [デプロイ方法](./README.md)
- [詳細ドキュメント](../docs/account-deletion-direct.md)
- [環境変数一覧](../env.example)

