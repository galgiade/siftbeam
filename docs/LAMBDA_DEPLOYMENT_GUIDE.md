# Lambda関数デプロイガイド: TriggerParentStepFunction

## 概要

このガイドでは、`TriggerParentStepFunction` Lambda関数のデプロイ方法を説明します。

## 前提条件

### 必要なツール

- AWS CLI v2
- Python 3.12
- zip コマンド

### 必要なAWSリソース

1. **IAM ロール**: Lambda実行ロール
2. **DynamoDB テーブル**: `siftbeam-processing-history`
3. **Step Functions**: `ServiceProcessingOrchestrator`（親Step Function）
4. **S3 バケット**: `siftbeam`

---

## デプロイ方法

### 方法1: デプロイスクリプトを使用（推奨）

#### ステップ1: IAMロールの作成

```bash
# IAMロールの作成
aws iam create-role \
  --role-name LambdaS3StepFunctionsRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# ポリシーのアタッチ
aws iam put-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-name LambdaS3StepFunctionsPolicy \
  --policy-document file://iam-policy.json
```

**iam-policy.json:**

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

#### ステップ2: デプロイスクリプトの実行

```bash
cd lambda/trigger-parent-stepfunction

# 実行権限を付与
chmod +x deploy.sh

# デプロイ実行
./deploy.sh TriggerParentStepFunction \
  arn:aws:iam::123456789012:role/LambdaS3StepFunctionsRole \
  arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator
```

**成功時の出力:**

```
======================================
Lambda Function Deployment Script
======================================

Configuration:
  Function Name: TriggerParentStepFunction
  Role ARN: arn:aws:iam::123456789012:role/LambdaS3StepFunctionsRole
  State Machine ARN: arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator
  Region: ap-northeast-1
  Runtime: python3.12
  Table Name: siftbeam-processing-history

Step 1: Creating ZIP file...
✓ ZIP file created

Step 2: Checking if function exists...
Function does not exist. Creating...
✓ Function created

Step 3: Adding S3 invoke permission...
✓ Permission configured

======================================
Deployment Completed Successfully!
======================================
```

---

### 方法2: AWS CLIで手動デプロイ

#### ステップ1: ZIPファイルの作成

```bash
cd lambda/trigger-parent-stepfunction
zip function.zip handler.py requirements.txt
```

#### ステップ2: Lambda関数の作成

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
  }" \
  --region ap-northeast-1
```

#### ステップ3: S3呼び出し権限の追加

```bash
aws lambda add-permission \
  --function-name TriggerParentStepFunction \
  --statement-id S3InvokeFunction \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::siftbeam \
  --region ap-northeast-1
```

---

### 方法3: AWSコンソールでデプロイ

#### ステップ1: ZIPファイルの作成

```bash
cd lambda/trigger-parent-stepfunction
zip function.zip handler.py requirements.txt
```

#### ステップ2: Lambda関数の作成

1. AWS Lambda コンソールを開く
2. **「関数の作成」** をクリック
3. 設定:
   - 関数名: `TriggerParentStepFunction`
   - ランタイム: `Python 3.12`
   - アーキテクチャ: `x86_64`
   - 実行ロール: `LambdaS3StepFunctionsRole`
4. **「関数の作成」** をクリック

#### ステップ3: コードのアップロード

1. **「アップロード元」** → **「.zip ファイル」**
2. `function.zip` を選択してアップロード
3. **「保存」** をクリック

#### ステップ4: 環境変数の設定

1. **「設定」** タブ → **「環境変数」**
2. **「編集」** をクリック
3. 以下を追加:
   - キー: `PROCESSING_HISTORY_TABLE`、値: `siftbeam-processing-history`
   - キー: `PARENT_STATE_MACHINE_ARN`、値: `arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator`
4. **「保存」** をクリック

#### ステップ5: タイムアウトの設定

1. **「設定」** タブ → **「一般設定」**
2. **「編集」** をクリック
3. タイムアウト: `30秒`
4. メモリ: `256 MB`
5. **「保存」** をクリック

---

## S3イベント通知の設定

### AWS CLIで設定

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

### S3コンソールで設定

1. S3コンソールを開く
2. `siftbeam` バケットを選択
3. **「プロパティ」** タブ
4. **「イベント通知」** セクション
5. **「イベント通知を作成」** をクリック
6. 設定:
   - **イベント名**: `TriggerServiceProcessing`
   - **イベントタイプ**: `すべてのオブジェクト作成イベント`
   - **プレフィックス**: `service/input/`
   - **送信先**: `Lambda 関数`
   - **Lambda 関数**: `TriggerParentStepFunction`
7. **「変更を保存」** をクリック

---

## テスト

### ローカルテスト

```bash
cd lambda/trigger-parent-stepfunction
python test_handler.py
```

**出力例:**

```
============================================================
Lambda Function Test Suite: TriggerParentStepFunction
============================================================

=== Testing validate_s3_key ===

✅ PASS: Valid input file path
  Key: service/input/customer-123/processing-456/20251016120000_file.jpg
  Result: {
    "valid": true,
    "customerId": "customer-123",
    "processingHistoryId": "processing-456",
    "fileType": "input"
  }

...
```

### AWS Lambda コンソールでテスト

1. Lambda関数を開く
2. **「テスト」** タブ
3. **「新しいイベントを作成」**
4. イベント名: `TestS3Event`
5. テンプレート: 以下のJSONを使用

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
          "key": "service/input/customer-test/processing-test/20251016120000_test.jpg",
          "size": 1234567
        }
      }
    }
  ]
}
```

6. **「テスト」** をクリック
7. 実行結果を確認

**期待される結果:**

- ステータスコード: 200
- ログ: "Successfully started Step Functions execution"

---

## トラブルシューティング

### エラー: "PARENT_STATE_MACHINE_ARN environment variable is not set"

**原因**: 環境変数が設定されていない

**解決策**:

```bash
aws lambda update-function-configuration \
  --function-name TriggerParentStepFunction \
  --environment Variables="{
    PROCESSING_HISTORY_TABLE=siftbeam-processing-history,
    PARENT_STATE_MACHINE_ARN=arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator
  }"
```

### エラー: "AccessDeniedException: User is not authorized to perform: states:StartExecution"

**原因**: IAMロールに権限がない

**解決策**: IAMポリシーを確認し、`states:StartExecution` 権限を追加

```bash
aws iam put-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-name StepFunctionsAccess \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "states:StartExecution",
        "Resource": "arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator"
      }
    ]
  }'
```

### エラー: "ResourceNotFoundException: Table 'siftbeam-processing-history' not found"

**原因**: DynamoDBテーブルが存在しないか、リージョンが異なる

**解決策**: テーブルの存在とリージョンを確認

```bash
aws dynamodb describe-table \
  --table-name siftbeam-processing-history \
  --region ap-northeast-1
```

### Lambda関数が起動されない

**原因**: S3イベント通知が設定されていない

**解決策**: S3イベント通知を確認

```bash
aws s3api get-bucket-notification-configuration \
  --bucket siftbeam
```

---

## モニタリング

### CloudWatch Logs

Lambda関数のログを確認:

```bash
# ログストリームを取得
aws logs describe-log-streams \
  --log-group-name /aws/lambda/TriggerParentStepFunction \
  --order-by LastEventTime \
  --descending \
  --max-items 5

# 最新のログを取得
aws logs tail /aws/lambda/TriggerParentStepFunction --follow
```

### CloudWatch Metrics

Lambda関数のメトリクスを確認:

```bash
# 呼び出し回数
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=TriggerParentStepFunction \
  --start-time 2025-10-16T00:00:00Z \
  --end-time 2025-10-16T23:59:59Z \
  --period 3600 \
  --statistics Sum

# エラー数
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Errors \
  --dimensions Name=FunctionName,Value=TriggerParentStepFunction \
  --start-time 2025-10-16T00:00:00Z \
  --end-time 2025-10-16T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## 更新

### コードの更新

```bash
cd lambda/trigger-parent-stepfunction

# ZIPファイルを作成
zip function.zip handler.py requirements.txt

# コードを更新
aws lambda update-function-code \
  --function-name TriggerParentStepFunction \
  --zip-file fileb://function.zip
```

### 環境変数の更新

```bash
aws lambda update-function-configuration \
  --function-name TriggerParentStepFunction \
  --environment Variables="{
    PROCESSING_HISTORY_TABLE=siftbeam-processing-history,
    PARENT_STATE_MACHINE_ARN=arn:aws:states:ap-northeast-1:123456789012:stateMachine:ServiceProcessingOrchestrator
  }"
```

---

## 削除

### Lambda関数の削除

```bash
aws lambda delete-function \
  --function-name TriggerParentStepFunction
```

### IAMロールの削除

```bash
# ポリシーをデタッチ
aws iam delete-role-policy \
  --role-name LambdaS3StepFunctionsRole \
  --policy-name LambdaS3StepFunctionsPolicy

# ロールを削除
aws iam delete-role \
  --role-name LambdaS3StepFunctionsRole
```

---

## まとめ

デプロイスクリプト（`deploy.sh`）を使用することで、簡単にLambda関数をデプロイできます。

```bash
./deploy.sh TriggerParentStepFunction \
  <IAM_ROLE_ARN> \
  <STATE_MACHINE_ARN>
```

詳細は `README.md` を参照してください。

