# アカウント削除自動化（Lambda不要版）

## 概要

Lambda関数を使わず、Step FunctionsのAWS SDK統合機能を使用して直接リソースを削除します。

## メリット

### 🎯 Lambda版との比較

| 項目 | Lambda版 | 直接実行版 |
|------|---------|-----------|
| **Lambda関数** | 3つ必要 | 不要 |
| **デプロイ** | Lambda + Step Functions | Step Functionsのみ |
| **保守性** | Lambda関数のコード管理が必要 | Step Function定義のみ |
| **コスト** | Lambda実行料金 + Step Functions | Step Functionsのみ |
| **実行時間** | Lambda制限（15分） | Step Functions制限（1年） |
| **エラーハンドリング** | Lambda内で実装 | Step Functionsで宣言的に定義 |
| **可視性** | CloudWatch Logs | Step Functions実行履歴で視覚的 |

### ✅ 直接実行版の利点

1. **シンプル**: Lambda関数のコード管理不要
2. **低コスト**: Lambda実行料金が不要
3. **保守が容易**: Step Function定義のみ管理
4. **可視性が高い**: Step Functionsコンソールで実行状況を視覚的に確認
5. **デプロイが簡単**: Step Function定義を更新するだけ

## アーキテクチャ

```
CloudWatch Events (毎日午前3時 JST)
  ↓
Step Functions: AccountDeletionStateMachine-Direct
  ↓
├─ Stripe API (削除対象カスタマーを取得)
  ↓
├─ AWS SDK: Cognito (ユーザー削除)
├─ AWS SDK: DynamoDB (レコード削除)
├─ AWS SDK: S3 (オブジェクト削除)
  ↓
└─ Stripe API (カスタマー削除)
```

## 処理フロー詳細

### 1. Cognitoユーザー削除

```
ListUsers (Filter: customerId)
  ↓
Map (並列処理)
  ↓
AdminDeleteUser (各ユーザー)
```

### 2. DynamoDB削除

```
Parallel (複数テーブルを並列処理)
  ↓
├─ Query (customerId-createdAt-index)
│   ↓
│   Map (並列削除)
│     ↓
│     DeleteItem
  ↓
├─ Query (別テーブル)
│   ↓
│   Map
│     ↓
│     DeleteItem
```

### 3. S3削除

```
ListObjectsV2 (service/input/{customerId}/)
  ↓
Map (並列削除)
  ↓
DeleteObject (各オブジェクト)
  ↓
ListObjectsV2 (service/output/{customerId}/)
  ↓
Map (並列削除)
  ↓
DeleteObject (各オブジェクト)
```

## デプロイ方法

### 1. Step Functionの作成

```bash
# 環境変数を設定
export AWS_ACCOUNT_ID=your-account-id
export REGION=ap-northeast-1

# Step Functionを作成
aws stepfunctions create-state-machine \
  --name AccountDeletionStateMachine-Direct \
  --definition file://stepfunctions/AccountDeletionStateMachine-Direct.asl.json \
  --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/stepfunctions-execution-role \
  --region $REGION

# 更新
aws stepfunctions update-state-machine \
  --state-machine-arn arn:aws:states:${REGION}:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine-Direct \
  --definition file://stepfunctions/AccountDeletionStateMachine-Direct.asl.json \
  --region $REGION
```

### 2. CloudWatch Eventsの設定

```bash
# EventBridgeルールを作成（毎日午前3時 JST = 18:00 UTC）
aws events put-rule \
  --name DailyAccountDeletionDirect \
  --schedule-expression "cron(0 18 * * ? *)" \
  --state ENABLED \
  --region $REGION

# Step Functionsをターゲットに設定
aws events put-targets \
  --rule DailyAccountDeletionDirect \
  --targets "Id"="1","Arn"="arn:aws:states:${REGION}:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine-Direct","RoleArn"="arn:aws:iam::${AWS_ACCOUNT_ID}:role/events-stepfunctions-execution-role" \
  --region $REGION
```

## IAM権限

### Step Functions実行ロール

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
        "dynamodb:DeleteItem"
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

## 設定変更が必要な箇所

Step Function定義内の以下の値を環境に合わせて変更してください:

### 1. Cognito User Pool ID

```json
"cognitoUserPoolId": "ap-northeast-1_xxxxxxxxx"
```

### 2. S3 Bucket Name

```json
"s3Bucket": "siftbeam"
```

### 3. Stripe Connection ARN

```json
"ConnectionArn": "arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Production-Connection/b711004d-52d7-4b35-8b29-9f33e9e3a054"
```

### 4. DynamoDB Table Names

現在は2つのテーブルのみ実装していますが、必要に応じて追加:
- `siftbeam-users`
- `siftbeam-processing-history`

## テスト方法

### 手動実行

```bash
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:ap-northeast-1:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine-Direct \
  --input '{}' \
  --region ap-northeast-1
```

### 実行状況の確認

AWSコンソール → Step Functions → AccountDeletionStateMachine-Direct → 実行履歴

視覚的に各ステップの実行状況を確認できます。

## モニタリング

### Step Functions実行履歴

```bash
# 実行履歴を取得
aws stepfunctions list-executions \
  --state-machine-arn arn:aws:states:ap-northeast-1:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine-Direct \
  --max-results 10

# 特定の実行の詳細
aws stepfunctions describe-execution \
  --execution-arn EXECUTION_ARN

# 実行履歴の詳細
aws stepfunctions get-execution-history \
  --execution-arn EXECUTION_ARN \
  --max-results 100
```

### CloudWatch Logs

Step Functionsの実行ログを有効化:

```bash
aws stepfunctions update-state-machine \
  --state-machine-arn arn:aws:states:ap-northeast-1:${AWS_ACCOUNT_ID}:stateMachine:AccountDeletionStateMachine-Direct \
  --logging-configuration '{
    "level": "ALL",
    "includeExecutionData": true,
    "destinations": [{
      "cloudWatchLogsLogGroup": {
        "logGroupArn": "arn:aws:logs:ap-northeast-1:${AWS_ACCOUNT_ID}:log-group:/aws/stepfunctions/AccountDeletionStateMachine-Direct"
      }
    }]
  }'
```

## パフォーマンス

### 並列処理

- **Cognitoユーザー削除**: 最大10並列
- **DynamoDBテーブル削除**: 複数テーブルを並列処理、各テーブル内で最大25並列
- **S3オブジェクト削除**: 最大100並列

### 実行時間の目安

| リソース数 | 実行時間 |
|-----------|---------|
| ユーザー10人、ファイル100個 | 約30秒 |
| ユーザー100人、ファイル1000個 | 約2分 |
| ユーザー1000人、ファイル10000個 | 約10分 |

## トラブルシューティング

### エラーの確認

Step Functionsコンソールで実行履歴を確認すると、どのステップでエラーが発生したか視覚的に確認できます。

### よくあるエラー

1. **IAM権限エラー**: Step Functions実行ロールに必要な権限を追加
2. **Cognito User Pool IDが間違っている**: 定義内の値を確認
3. **DynamoDB GSIが存在しない**: `customerId-createdAt-index` を作成
4. **S3バケット名が間違っている**: 定義内の値を確認

## コスト

### Lambda版との比較

| 項目 | Lambda版 | 直接実行版 |
|------|---------|-----------|
| Lambda実行 | $0.20/月 | $0 |
| Step Functions | $0.025/月 | $0.025/月 |
| **合計** | **$0.225/月** | **$0.025/月** |

※削除対象が1日1アカウントの場合

### コスト削減効果

**約89%のコスト削減**（Lambda実行料金が不要）

## 制限事項

### Step Functionsの制限

- 実行時間: 最大1年
- ペイロードサイズ: 256KB
- 実行履歴: 25,000イベント

### 対処方法

大量のリソースがある場合:
- Map並列度を調整
- バッチ処理に分割
- 複数のStep Functionに分割

## まとめ

### 推奨: 直接実行版

以下の理由から、Lambda版よりも直接実行版を推奨します:

✅ **シンプル**: Lambda関数のコード管理不要  
✅ **低コスト**: Lambda実行料金が不要  
✅ **保守が容易**: Step Function定義のみ管理  
✅ **可視性が高い**: 実行状況を視覚的に確認  
✅ **デプロイが簡単**: Step Function定義を更新するだけ

### Lambda版が適している場合

- 複雑なビジネスロジックが必要
- 外部APIとの複雑な連携
- カスタムエラーハンドリング
- Step Functionsで表現できない処理

## 次のステップ

1. ✅ Step Function定義の作成
2. ⬜ 環境に合わせて設定値を変更
3. ⬜ IAM権限の設定
4. ⬜ Step Functionのデプロイ
5. ⬜ CloudWatch Eventsの設定
6. ⬜ テスト実行
7. ⬜ 本番環境での動作確認

