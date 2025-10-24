# Step Functions

このディレクトリには、SiftBeamの自動化処理用のStep Function定義が含まれています。

## 利用可能なStep Functions

### 1. AccountDeletionStateMachine-Direct (アカウント削除自動化) ⭐推奨

**ファイル**: `AccountDeletionStateMachine-Direct.asl.json`

**概要**: 90日以上経過した削除リクエストのあるアカウントを自動的に削除します（Lambda不要版）。

**実行スケジュール**: 毎日午前3時(JST)

**処理フロー**:
1. Stripe APIから削除フラグ付き顧客を取得
2. 90日以上経過したアカウントをフィルター
3. 各アカウントに対して:
   - AWS SDK: Cognitoユーザー削除
   - AWS SDK: DynamoDBレコード削除
   - AWS SDK: S3オブジェクト削除
   - Stripe API: カスタマー削除

**メリット**:
- ✅ Lambda関数不要
- ✅ 89%のコスト削減
- ✅ 保守が簡単
- ✅ デプロイが簡単
- ✅ 視覚的に実行状況を確認可能

**詳細ドキュメント**: `../docs/account-deletion-direct.md`

**デプロイ**:
```bash
chmod +x deploy-direct.sh
export AWS_ACCOUNT_ID=your-account-id
./deploy-direct.sh
```

### 2. DailyStorageAggregator (日次ストレージ集計)

**ファイル**: `DailyStorageAggregator.asl.json`

**概要**: 毎日全顧客のストレージ使用量を集計し、DynamoDBに保存します。

**実行スケジュール**: 毎日午前3時(JST)

**処理フロー**:
1. Stripe APIから全顧客を取得
2. 各顧客のS3ストレージ使用量を集計
3. DynamoDBに保存

### 3. AccountDeletionStateMachine (アカウント削除自動化 - Lambda版)

**ファイル**: `AccountDeletionStateMachine.asl.json`

**概要**: 90日以上経過した削除リクエストのあるアカウントを自動的に削除します（Lambda関数使用版）。

**注意**: Lambda不要版（AccountDeletionStateMachine-Direct）の使用を推奨します。

**実行スケジュール**: 毎日午前3時(JST)

**処理フロー**:
1. Stripe APIから削除フラグ付き顧客を取得
2. 90日以上経過したアカウントをフィルター
3. 各アカウントに対して:
   - Lambda: Cognitoユーザー削除
   - Lambda: DynamoDBレコード削除
   - Lambda: S3オブジェクト削除
   - Stripe API: カスタマー削除

**詳細ドキュメント**: `../docs/account-deletion-automation.md`

**比較**: `../docs/account-deletion-comparison.md`

### 4. TestCopyStateMachine (ファイルコピー処理)

**ファイル**: `child/TestCopyStateMachine.asl.json`

**概要**: アップロードされたファイルをinputからoutputフォルダにコピーします。

**実行タイミング**: 親Step Functionから呼び出し

## デプロイ方法

### 環境変数の設定

```bash
export AWS_ACCOUNT_ID=your-account-id
```

### アカウント削除自動化のデプロイ（推奨: Lambda不要版）

```bash
cd stepfunctions
chmod +x deploy-direct.sh
./deploy-direct.sh
```

このスクリプトは以下を実行します:
1. Step Functionを作成/更新
2. CloudWatch Eventsを設定

**Lambda関数は不要です！**

### アカウント削除自動化のデプロイ（Lambda版）

Lambda版を使用する場合:

```bash
export COGNITO_USER_POOL_ID=your-user-pool-id
chmod +x deploy-account-deletion.sh
./deploy-account-deletion.sh
```

このスクリプトは以下を実行します:
1. 3つのLambda関数をデプロイ
2. Step Functionを作成/更新
3. CloudWatch Eventsを設定

**注意**: Lambda不要版の使用を推奨します（コスト89%削減、保守が簡単）

## テスト方法

### Lambda関数の個別テスト

```bash
chmod +x test-lambda-functions.sh
./test-lambda-functions.sh cus_test123
```

### Step Function全体のテスト

```bash
chmod +x test-account-deletion.sh
./test-account-deletion.sh
```

## モニタリング

### CloudWatch Logs

各Lambda関数のログを確認:
```bash
# Cognito削除ログ
aws logs tail /aws/lambda/siftbeam-delete-cognito-users --follow

# DynamoDB削除ログ
aws logs tail /aws/lambda/siftbeam-delete-dynamodb-records --follow

# S3削除ログ
aws logs tail /aws/lambda/siftbeam-delete-s3-objects --follow
```

### Step Functions実行履歴

```bash
# 実行履歴を取得
aws stepfunctions list-executions \
  --state-machine-arn arn:aws:states:ap-northeast-1:YOUR_ACCOUNT_ID:stateMachine:AccountDeletionStateMachine \
  --max-results 10

# 特定の実行の詳細
aws stepfunctions describe-execution \
  --execution-arn EXECUTION_ARN
```

## トラブルシューティング

### Lambda関数がタイムアウトする

タイムアウト時間を延長:
```bash
aws lambda update-function-configuration \
  --function-name siftbeam-delete-cognito-users \
  --timeout 900
```

### IAM権限エラー

各Lambda関数に必要な権限を確認:
- `lambda/delete-cognito-users/iam-policy.json`
- `lambda/delete-dynamodb-records/iam-policy.json`
- `lambda/delete-s3-objects/iam-policy.json`

### Step Function実行エラー

実行履歴から詳細を確認:
```bash
aws stepfunctions get-execution-history \
  --execution-arn EXECUTION_ARN \
  --max-results 100
```

## セキュリティ

1. **削除の不可逆性**: 削除されたデータは復元できません
2. **90日の猶予期間**: 誤削除を防ぐため必須
3. **監査ログ**: 全ての削除操作はログに記録
4. **最小権限**: Lambda関数には必要最小限の権限のみ付与

## コスト

- **Lambda**: 実行時間とメモリに応じて課金
- **Step Functions**: 実行回数に応じて課金
- **CloudWatch Logs**: ログ保存量に応じて課金

通常、1日あたり$0.1-1程度です。

## 関連ドキュメント

- [アカウント削除自動化の詳細](../docs/account-deletion-automation.md)
- [Lambda関数のドキュメント](../lambda/)

