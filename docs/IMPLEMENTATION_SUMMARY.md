# 実装サマリー: トリガーファイルベースのアップロードシステム

## 📋 概要

ブラウザ版とAPI版の両方で、トリガーファイルを使用した堅牢なファイルアップロードシステムを実装しました。

## 🎯 決定した仕様

### トリガーファイルの役割

1. **すべてのファイルアップロード完了の確認**
2. **Step Functionsへの入力データ提供**
3. **ファイル数とサイズの検証**
4. **監査とデバッグのための永続化**

### ブラウザ版 vs API版の違い

| 項目 | ブラウザ版 | API版 |
|------|-----------|-------|
| **タイムスタンプ** | `triggerTimestamp` | `createdAt` |
| **トリガータイプ** | `triggerType: "batch_upload_complete"` | なし |
| **メタデータ** | `source`, `userAgent`, `uploadDuration`, `retryCount`, `maxRetries` | `source`, `apiVersion` |

## 📁 修正したファイル

### 1. ブラウザ版
- ✅ `app/_containers/Service/ServiceFileUploader.tsx`
  - トリガーファイル構造を仕様に合わせて更新
  - `triggerType`, `triggerTimestamp`を使用
  - `metadata.source = 'browser'`

### 2. API版（Base64エンコード）
- ✅ `lambda/api-batch-upload/handler.py`
  - トリガーファイル構造を仕様に合わせて更新
  - `createdAt`を使用
  - `metadata.source = 'api'`, `metadata.apiVersion = '2025-10-28'`

### 3. API版（ファイルパス）
- ✅ `lambda/api-batch-upload-simple/handler.py`
  - トリガーファイル構造を仕様に合わせて更新
  - APIキーから`policyId`と`customerId`を自動取得
  - `createdAt`を使用
  - `metadata.source = 'api'`, `metadata.apiVersion = '2025-10-28'`

### 4. S3イベントハンドラ
- ✅ `lambda/s3-event-handler/handler.py`
  - トリガーファイルの内容をそのままStep Functionsに渡す
  - トリガーファイルの読み取りを1回に最適化
  - ファイル数とサイズの検証を実装
  - エラー時のフォールバック処理を追加

### 5. ドキュメント
- ✅ `docs/TRIGGER_FILE_SPEC.md` - 完全な仕様書
- ✅ `docs/TRIGGER_FILE_EXAMPLE.json` - ブラウザ版の例
- ✅ `docs/TRIGGER_FILE_API_EXAMPLE.json` - API版の例
- ✅ `docs/IMPLEMENTATION_SUMMARY.md` - この実装サマリー

## 🔄 データフロー

### ブラウザ版

```
1. ユーザーがファイルを選択
   ↓
2. ProcessingHistoryを作成（usageAmountBytes=0）
   ↓
3. すべてのファイルをS3にアップロード（isLastFile=false）
   ↓
4. 各ファイルアップロード時にS3イベントLambdaが起動
   → usageAmountBytesを更新
   ↓
5. トリガーファイルを作成してアップロード（isLastFile=true）
   ↓
6. S3イベントLambdaがトリガーファイルを検出
   → ファイル数とサイズを検証
   → トリガーファイルの内容をStep Functionsに渡す
   ↓
7. Step Functionsが処理を開始
   → uploadedFileKeysの各ファイルを処理
```

### API版

```
1. クライアントがAPIリクエスト（x-api-key + filePaths）
   ↓
2. API Lambda
   → API Gateway KeyIDからAPIキー情報を取得
   → policyIdとcustomerIdを取得
   → ProcessingHistoryを作成（usageAmountBytes=0）
   ↓
3. すべてのファイルをS3にアップロード（triggerStepFunction=false）
   ↓
4. 各ファイルアップロード時にS3イベントLambdaが起動
   → usageAmountBytesを更新
   ↓
5. トリガーファイルを作成してアップロード（triggerStepFunction=true）
   ↓
6. S3イベントLambdaがトリガーファイルを検出
   → ファイル数とサイズを検証
   → トリガーファイルの内容をStep Functionsに渡す
   ↓
7. Step Functionsが処理を開始
   → uploadedFileKeysの各ファイルを処理
```

## 🎨 トリガーファイルの構造

### ブラウザ版

```json
{
  "processing-historyId": "...",
  "userId": "...",
  "userName": "...",
  "customerId": "...",
  "policyId": "...",
  "policyName": "...",
  "uploadedFileKeys": [...],
  "aiTrainingUsage": "allow",
  "fileCount": 2,
  "usageAmountBytes": 2048000,
  "createdAt": "2025-01-27T10:30:05.123Z",
  "metadata": {
    "source": "browser",
    "apiVersion": "2025-10-28"
  }
}
```

### API版

```json
{
  "processing-historyId": "...",
  "userId": "...",
  "userName": "...",
  "customerId": "...",
  "policyId": "...",
  "policyName": "...",
  "uploadedFileKeys": [...],
  "aiTrainingUsage": "allow",
  "fileCount": 5,
  "expectedTotalSize": 10485760,
  "createdAt": "2025-01-27T11:45:30.456Z",
  "metadata": {
    "source": "api",
    "apiVersion": "2025-10-28"
  }
}
```

## 🔍 検証ロジック

S3イベントLambdaでトリガーファイルを読み取った際に以下を検証:

```python
# ファイル数の検証
expected_file_count = trigger_data.get('fileCount')
actual_file_count = len(processing_history['uploadedFileKeys'])

if expected_file_count != actual_file_count:
    print(f"Warning: File count mismatch!")

# ファイルサイズの検証（1KB以上の差があれば警告）
expected_total_size = trigger_data.get('expectedTotalSize')
actual_total_size = processing_history['usageAmountBytes']

if abs(expected_total_size - actual_total_size) > 1024:
    print(f"Warning: File size mismatch!")
```

## 🚀 Step Functionsへの入力

トリガーファイルの内容がそのままStep Functionsに渡されます:

```python
# S3イベントLambda
trigger_obj = s3_client.get_object(Bucket=bucket, Key=trigger_key)
trigger_data = json.loads(trigger_obj['Body'].read())

# トリガーファイルの内容をそのまま渡す
stepfunctions_client.start_execution(
    stateMachineArn=STEP_FUNCTION_ARN,
    name=execution_name,
    input=json.dumps(trigger_data, ensure_ascii=False)
)
```

Step Functions側では、以下のようにアクセス可能:

```json
{
  "StartAt": "ProcessFiles",
  "States": {
    "ProcessFiles": {
      "Type": "Map",
      "ItemsPath": "$.uploadedFileKeys",
      "Parameters": {
        "fileKey.$": "$$.Map.Item.Value",
        "customerId.$": "$.customerId",
        "policyId.$": "$.policyId",
        "processingHistoryId.$": "$.processing-historyId"
      }
    }
  }
}
```

## 🎯 利点

1. **パフォーマンス**: DynamoDBクエリ不要で即座に処理開始
2. **コスト**: S3読み取りのみ（DynamoDB読み取り不要）
3. **シンプル**: Step Functions定義がシンプル
4. **監査性**: S3に永続化され、後から確認可能
5. **デバッグ**: トリガーファイルを見れば入力データが分かる
6. **再実行**: 同じトリガーファイルで簡単に再実行可能
7. **拡張性**: `metadata.source`で将来的に異なる処理フローを実装可能

## 🔮 将来の拡張

`metadata.source`を使用して、ブラウザ版とAPI版で異なる処理を実装可能:

```json
{
  "StartAt": "CheckSource",
  "States": {
    "CheckSource": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.metadata.source",
          "StringEquals": "browser",
          "Next": "BrowserProcessing"
        },
        {
          "Variable": "$.metadata.source",
          "StringEquals": "api",
          "Next": "ApiProcessing"
        }
      ]
    },
    "BrowserProcessing": {
      "Type": "Task",
      "Comment": "ユーザー通知を送信",
      "Resource": "arn:aws:lambda:...:function:send-user-notification",
      "Next": "ProcessFiles"
    },
    "ApiProcessing": {
      "Type": "Task",
      "Comment": "Webhook通知を送信",
      "Resource": "arn:aws:lambda:...:function:send-webhook-notification",
      "Next": "ProcessFiles"
    }
  }
}
```

## ✅ 完了

すべての実装が完了し、ブラウザ版とAPI版の両方で統一されたトリガーファイルベースのアップロードシステムが稼働可能です!

