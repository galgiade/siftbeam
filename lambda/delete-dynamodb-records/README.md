# DynamoDB レコード削除 Lambda

## 概要
指定されたcustomerIdに関連する全てのDynamoDBレコードを削除するLambda関数です。

## 対象テーブル

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

## 環境変数

全てのテーブル名を環境変数で設定可能（デフォルト値あり）:
- `USER_TABLE_NAME`
- `POLICY_TABLE_NAME`
- `GROUP_TABLE_NAME`
- など...

## 入力

```json
{
  "customerId": "cus_xxx",
  "executionId": "arn:aws:states:..."
}
```

## 出力

```json
{
  "statusCode": 200,
  "deletedRecords": {
    "users": 5,
    "policy": 3,
    "processing_history": 120
  },
  "totalDeleted": 150,
  "customerId": "cus_xxx"
}
```

## デプロイ

```bash
chmod +x deploy.sh
./deploy.sh
```

## IAM権限

`iam-policy.json`を参照してください。

## 注意事項

- GSI `customerId-createdAt-index` が各テーブルに必要です
- バッチ削除を使用して効率的に削除します
- エラーが発生しても他のテーブルの削除は続行されます

