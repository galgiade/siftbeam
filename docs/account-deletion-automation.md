# アカウント削除自動化システム

## 概要

90日以上経過した削除リクエストのあるアカウントを自動的に削除するシステムです。

## アーキテクチャ

```
CloudWatch Events (毎日午前3時 JST)
  ↓
Step Functions (AccountDeletionStateMachine)
  ↓
├─ Stripe API (削除対象カスタマーを取得)
  ↓
├─ Lambda: delete-cognito-users (Cognitoユーザー削除)
├─ Lambda: delete-dynamodb-records (DynamoDBレコード削除)
├─ Lambda: delete-s3-objects (S3オブジェクト削除)
  ↓
└─ Stripe API (Stripeカスタマー削除)
```

## セットアップ手順

### 1. Lambda関数のデプロイ

#### 1.1 Cognito削除Lambda

```bash
cd lambda/delete-cognito-users
chmod +x deploy.sh

# 初回作成
aws lambda create-function \
  --function-name siftbeam-delete-cognito-users \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 900 \
  --memory-size 512 \
  --environment Variables="{COGNITO_USER_POOL_ID=YOUR_USER_POOL_ID}" \
  --region ap-northeast-1

# 更新
./deploy.sh
```

#### 1.2 DynamoDB削除Lambda

```bash
cd lambda/delete-dynamodb-records
chmod +x deploy.sh

# 初回作成
aws lambda create-function \
  --function-name siftbeam-delete-dynamodb-records \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 900 \
  --memory-size 1024 \
  --environment Variables="{USER_TABLE_NAME=siftbeam-users,POLICY_TABLE_NAME=siftbeam-policy,...}" \
  --region ap-northeast-1

# 更新
./deploy.sh
```

#### 1.3 S3削除Lambda

```bash
cd lambda/delete-s3-objects
chmod +x deploy.sh

# 初回作成
aws lambda create-function \
  --function-name siftbeam-delete-s3-objects \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 900 \
  --memory-size 512 \
  --environment Variables="{S3_BUCKET_NAME=siftbeam}" \
  --region ap-northeast-1

# 更新
./deploy.sh
```

### 2. Step Functionsの作成

```bash
# Step Functionを作成
aws stepfunctions create-state-machine \
  --name AccountDeletionStateMachine \
  --definition file://stepfunctions/AccountDeletionStateMachine.asl.json \
  --role-arn arn:aws:iam::YOUR_ACCOUNT_ID:role/stepfunctions-execution-role \
  --region ap-northeast-1

# 更新
aws stepfunctions update-state-machine \
  --state-machine-arn arn:aws:states:ap-northeast-1:YOUR_ACCOUNT_ID:stateMachine:AccountDeletionStateMachine \
  --definition file://stepfunctions/AccountDeletionStateMachine.asl.json \
  --region ap-northeast-1
```

### 3. CloudWatch Eventsの設定

```bash
# EventBridgeルールを作成（毎日午前3時 JST = 18:00 UTC）
aws events put-rule \
  --name DailyAccountDeletion \
  --schedule-expression "cron(0 18 * * ? *)" \
  --state ENABLED \
  --region ap-northeast-1

# Step Functionsをターゲットに設定
aws events put-targets \
  --rule DailyAccountDeletion \
  --targets "Id"="1","Arn"="arn:aws:states:ap-northeast-1:YOUR_ACCOUNT_ID:stateMachine:AccountDeletionStateMachine","RoleArn"="arn:aws:iam::YOUR_ACCOUNT_ID:role/events-stepfunctions-execution-role" \
  --region ap-northeast-1
```

## IAM権限

### Lambda実行ロール

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:ListUsers",
        "cognito-idp:AdminDeleteUser"
      ],
      "Resource": "arn:aws:cognito-idp:ap-northeast-1:*:userpool/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-*",
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-*/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::siftbeam",
        "arn:aws:s3:::siftbeam/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### Step Functions実行ロール

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": [
        "arn:aws:lambda:ap-northeast-1:*:function:siftbeam-delete-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "states:InvokeHTTPEndpoint"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "events:RetrieveConnectionCredentials"
      ],
      "Resource": "arn:aws:events:ap-northeast-1:*:connection/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:events!connection/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogDelivery",
        "logs:GetLogDelivery",
        "logs:UpdateLogDelivery",
        "logs:DeleteLogDelivery",
        "logs:ListLogDeliveries",
        "logs:PutResourcePolicy",
        "logs:DescribeResourcePolicies",
        "logs:DescribeLogGroups"
      ],
      "Resource": "*"
    }
  ]
}
```

### EventBridge実行ロール

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "states:StartExecution"
      ],
      "Resource": "arn:aws:states:ap-northeast-1:*:stateMachine:AccountDeletionStateMachine"
    }
  ]
}
```

## 手動実行

```bash
# Step Functionを手動実行
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:ap-northeast-1:YOUR_ACCOUNT_ID:stateMachine:AccountDeletionStateMachine \
  --input '{}' \
  --region ap-northeast-1
```

## モニタリング

### CloudWatch Logs

各Lambda関数のログを確認:
- `/aws/lambda/siftbeam-delete-cognito-users`
- `/aws/lambda/siftbeam-delete-dynamodb-records`
- `/aws/lambda/siftbeam-delete-s3-objects`

### Step Functions実行履歴

```bash
# 実行履歴を取得
aws stepfunctions list-executions \
  --state-machine-arn arn:aws:states:ap-northeast-1:YOUR_ACCOUNT_ID:stateMachine:AccountDeletionStateMachine \
  --max-results 10 \
  --region ap-northeast-1

# 特定の実行の詳細を取得
aws stepfunctions describe-execution \
  --execution-arn arn:aws:states:ap-northeast-1:YOUR_ACCOUNT_ID:execution:AccountDeletionStateMachine:EXECUTION_ID \
  --region ap-northeast-1
```

## トラブルシューティング

### Lambda関数がタイムアウトする

- タイムアウト時間を延長（最大15分）
- メモリを増やす（処理速度向上）
- バッチサイズを調整

### DynamoDB削除が遅い

- GSI `customerId-createdAt-index` が正しく設定されているか確認
- Lambda関数のメモリを増やす
- バッチ削除のサイズを調整

### S3削除が遅い

- 大量のオブジェクトがある場合は時間がかかります
- Lambda関数のタイムアウトを延長
- 必要に応じてS3ライフサイクルポリシーを併用

## 環境変数一覧

### delete-cognito-users

- `COGNITO_USER_POOL_ID`: CognitoユーザープールID

### delete-dynamodb-records

- `USER_TABLE_NAME`: siftbeam-users
- `POLICY_TABLE_NAME`: siftbeam-policy
- `GROUP_TABLE_NAME`: siftbeam-group
- `USER_GROUP_TABLE_NAME`: siftbeam-user-group
- `POLICY_GROUP_TABLE_NAME`: siftbeam-policy-group
- `SUPPORT_REQUEST_TABLE_NAME`: siftbeam-support-request
- `SUPPORT_REPLY_TABLE_NAME`: siftbeam-support-reply
- `NEWORDER_REQUEST_TABLE_NAME`: siftbeam-neworder-request
- `NEWORDER_REPLY_TABLE_NAME`: siftbeam-neworder-reply
- `PROCESSING_HISTORY_TABLE_NAME`: siftbeam-processing-history
- `USAGE_LIMITS_TABLE_NAME`: siftbeam-usage-limits
- `AUDIT_LOG_TABLE_NAME`: siftbeam-audit-logs
- `API_KEY_TABLE_NAME`: siftbeam-api-keys
- `POLICY_ANALYSIS_TABLE_NAME`: siftbeam-policy-analysis
- `DATA_USAGE_TABLE_NAME`: siftbeam-data-usage
- `CUSTOMER_CREATED_AT_INDEX`: customerId-createdAt-index

### delete-s3-objects

- `S3_BUCKET_NAME`: siftbeam

## セキュリティ考慮事項

1. **削除の不可逆性**: 削除されたデータは復元できません
2. **90日の猶予期間**: 誤削除を防ぐため、必ず90日の猶予期間を確保
3. **監査ログ**: 削除操作はCloudWatch Logsに記録
4. **権限の最小化**: Lambda関数には必要最小限の権限のみ付与
5. **バックアップ**: 重要なデータは削除前にバックアップを検討

## 費用

- Lambda実行: 削除対象アカウント数に応じて変動
- Step Functions: 実行回数に応じて課金
- CloudWatch Logs: ログ保存量に応じて課金

通常、1日あたりの削除対象が少ない場合、月額$1-5程度です。

