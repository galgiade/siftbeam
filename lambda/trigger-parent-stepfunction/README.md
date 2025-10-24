# Lambda関数: TriggerParentStepFunction

## 概要

S3イベント通知を受けて、親Step Function（`ServiceProcessingOrchestrator`）を起動するLambda関数です。

## 役割

1. S3イベント通知を受信
2. S3パスからprocessingHistoryIdを抽出
3. DynamoDBからprocessing-historyを取得
4. S3メタデータを検証
5. 親Step Functionを起動

## 処理フロー

```
S3イベント通知
  ↓
Lambda関数起動
  ↓
S3パス検証
  ├─ 有効なパス → 続行
  └─ 無効なパス → スキップ
  ↓
inputファイルチェック
  ├─ inputファイル → 続行
  └─ output/tempファイル → スキップ
  ↓
S3メタデータ取得
  ├─ triggerStepFunction == 'true' → 続行
  └─ それ以外 → スキップ
  ↓
DynamoDBからprocessing-history取得
  ├─ データあり → 続行
  └─ データなし → スキップ
  ↓
customerID整合性チェック
  ├─ 一致 → 続行
  └─ 不一致 → スキップ
  ↓
Step Functions起動
```

## 環境変数

| 変数名 | 説明 | 必須 | デフォルト値 |
|--------|------|------|------------|
| `PROCESSING_HISTORY_TABLE` | processing-historyテーブル名 | ✅ | `siftbeam-processing-history` |
| `PARENT_STATE_MACHINE_ARN` | 親Step FunctionのARN | ✅ | なし |

### 例

```bash
PROCESSING_HISTORY_TABLE=siftbeam-processing-history
PARENT_STATE_MACHINE_ARN=arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator
```

## IAM権限

Lambda実行ロールに以下の権限が必要です:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-1:123456789012:table/siftbeam-processing-history"
    },
    {
      "Effect": "Allow",
      "Action": [
        "states:StartExecution"
      ],
      "Resource": "arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator"
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

## デプロイ方法

### 1. ZIP ファイルの作成

```bash
cd lambda/trigger-parent-stepfunction
zip -r function.zip handler.py requirements.txt
```

### 2. Lambda関数の作成

```bash
aws lambda create-function \
  --function-name TriggerParentStepFunction \
  --runtime python3.12 \
  --role arn:aws:iam::123456789012:role/LambdaS3StepFunctionsRole \
  --handler handler.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{
    PROCESSING_HISTORY_TABLE=siftbeam-processing-history,
    PARENT_STATE_MACHINE_ARN=arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator
  }"
```

### 3. S3バケットにLambda呼び出し権限を付与

```bash
aws lambda add-permission \
  --function-name TriggerParentStepFunction \
  --statement-id S3InvokeFunction \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::siftbeam
```

### 4. S3イベント通知の設定

S3コンソール → バケット → プロパティ → イベント通知:

```
名前: TriggerServiceProcessing
イベントタイプ: すべてのオブジェクト作成イベント
プレフィックス: service/input/
送信先タイプ: Lambda 関数
送信先: TriggerParentStepFunction
```

または、AWS CLIで:

```bash
aws s3api put-bucket-notification-configuration \
  --bucket siftbeam \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [
      {
        "Id": "TriggerServiceProcessing",
        "LambdaFunctionArn": "arn:aws:lambda:ap-northeast-1:123456789012:function:TriggerParentStepFunction",
        "Events": ["s3:ObjectCreated:*"],
        "Filter": {
          "Key": {
            "FilterRules": [
              {
                "Name": "prefix",
                "Value": "service/input/"
              }
            ]
          }
        }
      }
    ]
  }'
```

## 入力イベント形式

### S3イベント通知

```json
{
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "ap-northeast-1",
      "eventTime": "2025-10-16T12:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "siftbeam"
        },
        "object": {
          "key": "service/input/customer-123/processing-456/20251016120000_file.jpg",
          "size": 1234567
        }
      }
    }
  ]
}
```

## 出力形式

### 成功時

```json
{
  "statusCode": 200,
  "body": "{\"message\": \"Processing completed\", \"processed\": 1, \"skipped\": 0, \"errors\": 0}"
}
```

### Step Functionsへの入力

```json
{
  "processingHistoryId": "processing-456",
  "customerId": "customer-123",
  "userId": "user-789",
  "userName": "山田太郎",
  "policyId": "policy-image-processing",
  "policyName": "画像処理サービス",
  "inputS3Bucket": "siftbeam",
  "uploadedFileKeys": [
    "service/input/customer-123/processing-456/file1.jpg",
    "service/input/customer-123/processing-456/file2.jpg"
  ],
  "downloadS3Keys": [],
  "aiTrainingUsage": "allow",
  "fileSizeBytes": 1234567,
  "usageAmountBytes": 1234567,
  "createdAt": "2025-10-16T12:00:00.000Z"
}
```

**注意**:
- `inputS3Key`: 削除（子ステートマシンで不要）
- `uploadedFileKeys`: フルS3パスの配列（複数ファイル対応）
- `downloadS3Keys`: 空配列で初期化（子ステートマシンで更新）

## エラーハンドリング

### スキップされるケース

1. **無効なS3パス**: パス構造が期待と異なる
2. **非inputファイル**: output/tempファイル
3. **triggerStepFunctionフラグがfalse**: メタデータで無効化
4. **processing-historyが見つからない**: DynamoDBに存在しない
5. **customerID不一致**: パスとDBで不一致

### エラー時の動作

- エラーが発生しても、他のレコードの処理は継続
- CloudWatch Logsに詳細なログを出力
- エラーカウントを返す

## ログ

CloudWatch Logsに以下の情報を出力:

- 受信したS3イベント
- S3パス検証結果
- S3メタデータ
- processing-history取得結果
- Step Functions起動結果
- エラー詳細

### ログ例

```
Received event: {"Records": [...]}
Processing S3 event: s3://siftbeam/service/input/customer-123/processing-456/file.jpg
S3 metadata: {"triggerstepfunction": "true", "customerid": "customer-123", ...}
Processing history found: processing-456
Starting Step Functions execution: processing-456-20251016-120000-12345
Successfully started Step Functions execution: arn:aws:states:...
```

## テスト

### ローカルテスト

```python
# test_handler.py
from handler import lambda_handler

event = {
    "Records": [
        {
            "s3": {
                "bucket": {"name": "siftbeam"},
                "object": {"key": "service/input/customer-123/processing-456/file.jpg"}
            }
        }
    ]
}

class Context:
    def get_remaining_time_in_millis(self):
        return 30000

result = lambda_handler(event, Context())
print(result)
```

### AWS Lambda コンソールでのテスト

テストイベント:

```json
{
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "ap-northeast-1",
      "eventTime": "2025-10-16T12:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "siftbeam"
        },
        "object": {
          "key": "service/input/customer-123/processing-456/20251016120000_test.jpg",
          "size": 1234567
        }
      }
    }
  ]
}
```

## モニタリング

### CloudWatch Metrics

- Invocations: 呼び出し回数
- Duration: 実行時間
- Errors: エラー数
- Throttles: スロットル数

### カスタムメトリクス

ログから以下を抽出可能:

- processed: 処理されたファイル数
- skipped: スキップされたファイル数
- errors: エラー数

### アラーム設定例

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name TriggerParentStepFunction-Errors \
  --alarm-description "Alert when Lambda function has errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=FunctionName,Value=TriggerParentStepFunction
```

## トラブルシューティング

### Step Functionsが起動されない

1. **環境変数の確認**
   ```bash
   aws lambda get-function-configuration --function-name TriggerParentStepFunction
   ```

2. **IAM権限の確認**
   - Lambda実行ロールに`states:StartExecution`権限があるか

3. **CloudWatch Logsの確認**
   - スキップされた理由を確認

### customerID不一致エラー

- S3パスの`customerId`とDynamoDBの`customerId`が一致しているか確認
- アップロード時に正しい`customerId`が設定されているか確認

### processing-historyが見つからない

- アップロード前に`processing-history`が作成されているか確認
- `processing-historyId`が正しく設定されているか確認

## パフォーマンス

- **実行時間**: 平均 50-100ms
- **メモリ使用量**: 平均 128MB
- **Cold Start**: 初回 100-200ms
- **タイムアウト設定**: 30秒（推奨）

## コスト試算

### Lambda料金（ap-northeast-1）

- リクエスト料金: $0.20 / 100万リクエスト
- 実行時間料金: $0.0000166667 / GB-秒

### 例: 100万ファイル/月の場合

```
リクエスト料金: $0.20
実行時間料金: 100万 × 0.1秒 × 256MB/1024 × $0.0000166667 = $0.42
合計: 約 $0.62/月
```

## 更新履歴

- 2025-10-16: 初版作成

