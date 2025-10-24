# Cognito ユーザー削除 Lambda

## 概要
指定されたcustomerIdを持つ全てのCognitoユーザーを削除するLambda関数です。

## 環境変数

- `COGNITO_USER_POOL_ID`: CognitoユーザープールID

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
  "deletedUsers": ["user1@example.com", "user2@example.com"],
  "deletedCount": 2,
  "totalFound": 2,
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

## テスト

```bash
aws lambda invoke \
  --function-name siftbeam-delete-cognito-users \
  --payload '{"customerId":"cus_test123","executionId":"test"}' \
  --region ap-northeast-1 \
  response.json

cat response.json
```

