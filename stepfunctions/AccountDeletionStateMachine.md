# アカウント削除自動化 Step Function

## 概要
90日以上経過した削除リクエストのあるアカウントを自動的に削除するStep Functionです。

## 処理フロー

1. **PrepareCurrentDate**: 現在日時と90日前の閾値を計算
2. **GetStripeCustomersWithDeletionFlag**: Stripeから全顧客を取得
3. **FilterExpiredAccounts**: 90日以上経過したアカウントをフィルター
4. **ProcessEachExpiredAccount**: 各アカウントに対して並列処理
   - **DeleteCognitoUsers**: Cognitoユーザーを削除
   - **DeleteDynamoDBRecords**: DynamoDBレコードを削除
   - **DeleteS3Objects**: S3オブジェクトを削除
   - **DeleteStripeCustomer**: Stripeカスタマーを削除

## 必要なLambda関数

### 1. siftbeam-delete-cognito-users
- Cognitoユーザープールから該当customerIdの全ユーザーを削除

### 2. siftbeam-delete-dynamodb-records
- 以下のテーブルから該当customerIdのレコードを削除:
  - siftbeam-users
  - siftbeam-policy
  - siftbeam-group
  - siftbeam-user-group
  - siftbeam-policy-group
  - siftbeam-support-request
  - siftbeam-support-reply
  - siftbeam-neworder-request
  - siftbeam-neworder-reply
  - siftbeam-processing-history
  - siftbeam-usage-limits
  - siftbeam-audit-logs
  - siftbeam-api-keys
  - siftbeam-policy-analysis
  - siftbeam-data-usage
  - siftbeam-storage-usage-daily

### 3. siftbeam-delete-s3-objects
- S3バケットから該当customerIdのフォルダを削除:
  - service/input/{customerId}/
  - service/output/{customerId}/

## CloudWatch Events設定

毎日午前3時(JST)に実行:
```json
{
  "schedule": "cron(0 18 * * ? *)"
}
```

## IAM権限

Step Functionに必要な権限:
- Lambda関数の実行権限
- Stripe API接続権限
- CloudWatch Logsへの書き込み権限

## エラーハンドリング

各ステップでエラーが発生しても、次のステップに進みます。
エラーはログに記録され、最終的な結果に含まれます。

## モニタリング

- CloudWatch Logsで実行ログを確認
- 削除結果は各Lambda関数のレスポンスに含まれる
- 削除されたアカウント数と詳細を確認可能

