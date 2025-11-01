# トリガーファイル仕様

## 概要

トリガーファイル(`_trigger.json`)は、すべてのデータファイルのアップロードが完了した後に作成される特別なファイルです。このファイルのS3アップロードイベントがStep Functionsを起動します。

## 目的

1. **確実なStep Functions起動**: すべてのファイルがアップロード完了後にのみ処理を開始
2. **検証**: アップロードされたファイル数とサイズの整合性チェック
3. **Step Functions入力データ**: トリガーファイルの内容がそのままStep Functionsに渡される
4. **監査性**: S3に永続化されるため、後から確認・再実行が可能
5. **将来の拡張性**: ブラウザ版とAPI版で異なる処理フローを実装可能

## ファイル構造

### ブラウザ版のトリガーファイル

```json
{
  "processing-historyId": "f5b182ac-6150-4006-a3ea-d75128bd057c",
  "userId": "user_abc123",
  "userName": "田中太郎",
  "customerId": "cus_TB7TNGpqOEFcst",
  "policyId": "policy_xyz789",
  "policyName": "標準処理ポリシー",
  "uploadedFileKeys": [
    "service/input/cus_TB7TNGpqOEFcst/f5b182ac-6150-4006-a3ea-d75128bd057c/icon.png",
    "service/input/cus_TB7TNGpqOEFcst/f5b182ac-6150-4006-a3ea-d75128bd057c/icon2.png"
  ],
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

### API版のトリガーファイル

```json
{
  "processing-historyId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "userId": "apikey_def456",
  "userName": "Production API Key",
  "customerId": "cus_XYZ123ABC456",
  "policyId": "policy_api789",
  "policyName": "API処理ポリシー",
  "uploadedFileKeys": [
    "service/input/cus_XYZ123ABC456/a1b2c3d4-5678-90ab-cdef-1234567890ab/data1.csv",
    "service/input/cus_XYZ123ABC456/a1b2c3d4-5678-90ab-cdef-1234567890ab/data2.csv",
    "service/input/cus_XYZ123ABC456/a1b2c3d4-5678-90ab-cdef-1234567890ab/data3.csv",
    "service/input/cus_XYZ123ABC456/a1b2c3d4-5678-90ab-cdef-1234567890ab/data4.csv",
    "service/input/cus_XYZ123ABC456/a1b2c3d4-5678-90ab-cdef-1234567890ab/data5.csv"
  ],
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

## フィールド説明

### 共通フィールド

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| `processing-historyId` | string | ✅ | 処理履歴のID (UUID) |
| `userId` | string | ✅ | ユーザーID（ブラウザ版）またはAPIキーID（API版） |
| `userName` | string | ✅ | ユーザー名またはAPIキー名 |
| `customerId` | string | ✅ | カスタマーID (Stripe) |
| `policyId` | string | ✅ | ポリシーID |
| `policyName` | string | ✅ | ポリシー名 |
| `uploadedFileKeys` | string[] | ✅ | アップロードされたファイルのS3キー配列 |
| `aiTrainingUsage` | string | ✅ | AI学習利用許可 (`allow` または `deny`) |
| `fileCount` | number | ✅ | アップロードされたファイル数 |
| `usageAmountBytes` | number | ✅ | 合計ファイルサイズ(バイト) ※課金計算に使用 |
| `metadata` | object | ✅ | メタデータ（`source`フィールドを含む） |

### 共通の時刻フィールド

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| `createdAt` | string | ✅ | 作成時刻 (ISO 8601) |

### メタデータフィールド

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| `metadata.source` | string | ✅ | アップロード元（`browser` または `api`） |
| `metadata.apiVersion` | string | ✅ | APIバージョン（日付形式: `YYYY-MM-DD`） |

## S3パス

```
service/input/{customerId}/{processingHistoryId}/_trigger.json
```

## S3メタデータ

トリガーファイルには以下のメタデータが付与されます:

```python
Metadata={
    'customerId': customer_id,
    'userId': user_id,
    'policyId': policy_id,
    'processingHistoryId': processing_history_id,
    'fileType': 'input',
    'uploadedAt': '2025-01-27T10:30:05Z',
    'triggerStepFunction': 'true'  # Step Functions起動フラグ
}
```

## ワークフロー

### ブラウザ版

```typescript
// 1. 処理履歴を作成
const processingHistoryId = crypto.randomUUID();
await createProcessingHistory({...});

// 2. すべてのファイルをアップロード (isLastFile=false)
for (const file of files) {
  await uploadServiceFileToS3({
    file,
    isLastFile: false  // 通常ファイル
  });
}

// 3. トリガーファイルを作成してアップロード
const triggerContent = {
  'processing-historyId': processingHistoryId,
  userId,
  userName,
  customerId,
  policyId,
  policyName,
  uploadedFileKeys,
  aiTrainingUsage: 'allow',
  fileCount: files.length,
  usageAmountBytes: totalSize,
  createdAt: new Date().toISOString(),
  metadata: {
    source: 'browser',
    apiVersion: '2025-10-28'
  }
};

await uploadServiceFileToS3({
  file: triggerFile,
  isLastFile: true  // Step Functions起動
});
```

### API版

```python
# 1. 処理履歴を作成
processing_history_id = str(uuid.uuid4())
create_processing_history(...)

# 2. すべてのファイルをアップロード
for file_path in file_paths:
    s3_client.put_object(
        Bucket=bucket,
        Key=file_key,
        Body=file_data,
        Metadata={
            'triggerStepFunction': 'false'  # 通常ファイル
        }
    )

# 3. トリガーファイルを作成してアップロード
trigger_content = {
    'processing-historyId': processing_history_id,
    'userId': api_key_id,
    'userName': api_key_name,
    'customerId': customer_id,
    'policyId': policy_id,
    'policyName': policy_name,
    'uploadedFileKeys': uploaded_file_keys,
    'aiTrainingUsage': 'allow',
    'fileCount': len(file_paths),
    'expectedTotalSize': total_size,
    'createdAt': datetime.utcnow().isoformat() + 'Z',
    'metadata': {
        'source': 'api',
        'apiVersion': '2025-10-28'
    }
}

s3_client.put_object(
    Bucket=bucket,
    Key=trigger_key,
    Body=json.dumps(trigger_content),
    Metadata={
        'triggerStepFunction': 'true'  # Step Functions起動
    }
)
```

## S3イベントLambdaでの処理

```python
# トリガーファイルかどうかを判定
is_trigger_file = object_key.endswith('/_trigger.json')

if is_trigger_file:
    # トリガーファイルの内容を読み取り
    trigger_obj = s3_client.get_object(Bucket=bucket, Key=object_key)
    trigger_data = json.loads(trigger_obj['Body'].read())
    
    # 検証: ファイル数とサイズの整合性チェック
    expected_file_count = trigger_data.get('fileCount')
    expected_total_size = trigger_data.get('expectedTotalSize')
    actual_file_count = len(processing_history['uploadedFileKeys'])
    actual_total_size = processing_history['usageAmountBytes']
    
    if expected_file_count != actual_file_count:
        print(f"Warning: File count mismatch!")
    
    if abs(expected_total_size - actual_total_size) > 1024:
        print(f"Warning: File size mismatch!")
    
    # トリガーファイルの内容をそのままStep Functionsに渡す
    sfn_input = trigger_data
    
    # Step Functionsを起動
    if metadata.get('triggerStepFunction') == 'true':
        stepfunctions_client.start_execution(
            stateMachineArn=STEP_FUNCTION_ARN,
            name=execution_name,
            input=json.dumps(sfn_input, ensure_ascii=False)
        )
```

## Step Functionsでの利用

Step Functionsは、トリガーファイルの内容をそのまま入力として受け取ります:

```json
{
  "Comment": "ファイル処理ワークフロー",
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
      },
      "Iterator": {
        "StartAt": "ProcessSingleFile",
        "States": {
          "ProcessSingleFile": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:function:process-file",
            "End": true
          }
        }
      },
      "Next": "UpdateStatus"
    },
    "UpdateStatus": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:update-status",
      "End": true
    }
  }
}
```

### 将来の拡張: sourceに基づく処理分岐

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
      ],
      "Default": "DefaultProcessing"
    },
    "BrowserProcessing": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:browser-processing",
      "Next": "SendUserNotification"
    },
    "ApiProcessing": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:api-processing",
      "Next": "SendWebhookNotification"
    }
  }
}
```

## エラーハンドリング

### ファイル数の不一致

```python
if expected_file_count != actual_file_count:
    print(f"Warning: File count mismatch! Expected {expected_file_count}, got {actual_file_count}")
    # Step Functions起動は継続（Step Functions内でエラー処理）
```

### ファイルサイズの不一致

```python
if abs(expected_total_size - actual_total_size) > 1024:  # 1KB以上の差
    print(f"Warning: File size mismatch! Expected {expected_total_size}, got {actual_total_size}")
    # Step Functions起動は継続（Step Functions内でエラー処理）
```

### トリガーファイル読み取りエラー

```python
try:
    trigger_data = json.loads(trigger_obj['Body'].read())
    sfn_input = trigger_data
except Exception as e:
    print(f"Error reading trigger file: {str(e)}")
    # フォールバック: 最小限の情報を渡す
    sfn_input = {
        'processing-historyId': processing_history_id,
        'customerId': customer_id,
        'policyId': policy_id
    }
```

## 利点

1. **パフォーマンス**: DynamoDBクエリ不要で即座に処理開始
2. **コスト**: S3読み取りのみ（DynamoDB読み取り不要）
3. **シンプル**: Step Functions定義がシンプル
4. **監査性**: S3に永続化され、後から確認可能
5. **デバッグ**: トリガーファイルを見れば入力データが分かる
6. **再実行**: 同じトリガーファイルで簡単に再実行可能
7. **拡張性**: `metadata.source`で将来的に異なる処理フローを実装可能

## 注意事項

1. トリガーファイルは必ず最後にアップロードする
2. トリガーファイルのファイルサイズは更新しない（usageAmountBytesに含めない）
3. `triggerStepFunction='true'`メタデータは必須
4. `metadata.source`フィールドは必ず設定する（`browser`または`api`）
5. トリガーファイルの内容がそのままStep Functionsに渡されるため、必要な情報をすべて含める
