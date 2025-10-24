# S3 オブジェクト削除 Lambda

## 概要
指定されたcustomerIdに関連する全てのS3オブジェクトを削除するLambda関数です。

## 削除対象

- `service/input/{customerId}/` 配下の全オブジェクト
- `service/output/{customerId}/` 配下の全オブジェクト

## 環境変数

- `S3_BUCKET_NAME`: S3バケット名（デフォルト: siftbeam）

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
  "deletedObjects": {
    "input": 50,
    "output": 45
  },
  "totalDeleted": 95,
  "customerId": "cus_xxx",
  "bucket": "siftbeam"
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

- バッチ削除を使用して効率的に削除します（最大1000個/回）
- 大量のオブジェクトがある場合は複数回に分けて削除されます
- エラーが発生してもログに記録され、処理は続行されます

## テスト

```bash
aws lambda invoke \
  --function-name siftbeam-delete-s3-objects \
  --payload '{"customerId":"cus_test123","executionId":"test"}' \
  --region ap-northeast-1 \
  response.json

cat response.json
```

