# API Lambda フロー仕様

## 概要

API経由でファイルをアップロードする際のLambda関数のフロー仕様です。
ブラウザ版と同じトリガーファイル方式を採用し、統一されたアーキテクチャを実現しています。

## アーキテクチャ

```
API Gateway → API Lambda → S3 → S3イベントLambda → Step Functions
```

### フロー詳細

1. **API Gateway**: APIキーで認証
2. **API Lambda**: ファイルをS3にアップロード + トリガーファイル作成
3. **S3**: ファイル保存
4. **S3イベントLambda**: トリガーファイル検知 → Step Functions起動
5. **Step Functions**: ファイル処理実行

## API Lambda の種類

### 1. 単一ファイルアップロード (`api-upload`)

**エンドポイント**: `POST /upload`

**リクエスト**:
```http
POST /upload?fileName=example.png
Content-Type: image/png
x-api-key: YOUR_API_KEY

[Binary file data]
```

**注意**: ポリシーIDはAPIキーから自動的に取得されます。

**処理フロー**:
1. APIキー検証
2. **APIキーテーブルからpolicyId, customerIdを取得**
3. **ポリシーテーブルからpolicyNameを取得**
4. 処理履歴ID生成
5. DynamoDBに処理履歴作成 (`status: 'in_progress'`)
6. S3に通常ファイルアップロード (`triggerStepFunction: 'false'`)
7. S3にトリガーファイルアップロード (`triggerStepFunction: 'true'`)
8. レスポンス返却

### 2. バッチアップロード (`api-batch-upload`)

**エンドポイント**: `POST /batch-upload`

**リクエスト**:
```json
{
  "files": [
    {
      "fileName": "file1.png",
      "data": "base64-encoded-data",
      "contentType": "image/png"
    },
    {
      "fileName": "file2.jpg",
      "data": "base64-encoded-data",
      "contentType": "image/jpeg"
    }
  ]
}
```

**処理フロー**:
1. APIキー検証
2. **APIキーテーブルからpolicyId, customerIdを取得**
3. **ポリシーテーブルからpolicyNameを取得**
4. 処理履歴ID生成（全ファイル共通）
5. DynamoDBに処理履歴作成
6. 各ファイルをS3にアップロード (`triggerStepFunction: 'false'`)
7. トリガーファイルをS3にアップロード (`triggerStepFunction: 'true'`)
8. レスポンス返却

### 3. シンプルバッチアップロード (`api-batch-upload-simple`)

**エンドポイント**: `POST /batch-upload-simple`

**リクエスト**:
```json
{
  "policyId": "policy-456",
  "filePaths": [
    "/path/to/file1.png",
    "/path/to/file2.jpg"
  ]
}
```

**処理フロー**:
1. APIキー検証
2. APIキーテーブルからpolicyId, customerIdを取得
3. 処理履歴ID生成
4. DynamoDBに処理履歴作成
5. 各ファイルをローカルから読み込み、S3にアップロード
6. トリガーファイルをS3にアップロード
7. レスポンス返却

## トリガーファイル仕様

### ファイル名
```
service/input/{customerId}/{processingHistoryId}/_trigger.json
```

### トリガーファイル内容（API版）

```json
{
  "processing-historyId": "uuid-v4",
  "userId": "api-key-id",
  "userName": "API Name",
  "customerId": "cus_xxxxx",
  "policyId": "policy-123",
  "policyName": "Policy Name",
  "uploadedFileKeys": [
    "service/input/{customerId}/{processingHistoryId}/file1.png",
    "service/input/{customerId}/{processingHistoryId}/file2.jpg"
  ],
  "aiTrainingUsage": "allow",
  "fileCount": 2,
  "usageAmountBytes": 12345,
  "createdAt": "2025-10-29T12:34:56.789Z",
  "metadata": {
    "source": "api",
    "apiVersion": "2025-10-28"
  }
}
```

### ブラウザ版との違い

| 項目 | API版 | ブラウザ版 |
|------|-------|-----------|
| `metadata.source` | `"api"` | `"browser"` |
| `userId` | APIキーID | Cognito User Sub |
| `userName` | API名 | ユーザー名 |

## S3メタデータ

### 通常ファイル

```json
{
  "customerId": "cus_xxxxx",
  "userId": "api-key-id",
  "policyId": "policy-123",
  "processingHistoryId": "uuid-v4",
  "fileType": "input",
  "uploadedAt": "2025-10-29T12:34:56.789Z",
  "triggerStepFunction": "false"
}
```

### トリガーファイル

```json
{
  "customerId": "cus_xxxxx",
  "userId": "api-key-id",
  "policyId": "policy-123",
  "processingHistoryId": "uuid-v4",
  "fileType": "input",
  "uploadedAt": "2025-10-29T12:34:56.789Z",
  "triggerStepFunction": "true"
}
```

## S3イベントLambda

### トリガー条件

S3イベント通知は**トリガーファイルのみ**に設定:
- **Suffix**: `_trigger.json`

### 処理フロー

1. S3イベント受信
2. トリガーファイルかどうか判定（`_trigger.json`で終わるか）
3. トリガーファイルでない場合は早期リターン
4. トリガーファイルの内容を読み取る
5. DynamoDBの処理履歴を更新（`usageAmountBytes`を設定）
6. Step Functionsを起動（トリガーファイルの内容を入力として渡す）

## ProcessingHistory DynamoDB項目

| 項目 | API Lambda | S3イベントLambda | Step Functions |
|------|-----------|-----------------|----------------|
| `processing-historyId` | ✅ 生成 | 📖 読み取り | 📖 読み取り |
| `userId` | ✅ 設定 | - | - |
| `userName` | ✅ 設定 | - | - |
| `customerId` | ✅ 設定 | 📖 読み取り | - |
| `policyId` | ✅ 設定 | 📖 読み取り | - |
| `policyName` | ✅ 設定 | - | - |
| `usageAmountBytes` | ✅ 初期値: 0 | ✅ **更新** | - |
| `status` | ✅ 初期値: 'in_progress' | - | ✅ 完了時に更新 |
| `downloadS3Keys` | ✅ 初期値: [] | - | ✅ 処理完了時に設定 |
| `uploadedFileKeys` | ✅ 設定 | 📖 検証 | 📖 読み取り |
| `aiTrainingUsage` | ✅ 設定: 'allow' | - | - |
| `createdAt` | ✅ 設定 | - | - |
| `updatedAt` | ✅ 初期値 | ✅ **更新** | ✅ 更新 |
| `completedAt` | - | - | ✅ 完了時に設定 |
| `errorDetail` | - | - | ✅ エラー時に設定 |

## 環境変数

### API Lambda

```bash
DYNAMODB_TABLE_NAME=siftbeam-processing-history
S3_BUCKET_NAME=siftbeam
AWS_REGION=ap-northeast-1
APIKEY_TABLE_NAME=siftbeam-api-keys
POLICY_TABLE_NAME=siftbeam-policies
```

### S3イベントLambda

```bash
DYNAMODB_TABLE_NAME=siftbeam-processing-history
STEP_FUNCTION_ARN=arn:aws:states:ap-northeast-1:xxx:stateMachine:xxx
AWS_REGION=ap-northeast-1
```

## IAM権限

### API Lambda

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectMetadata"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-processing-history"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:GetItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-api-keys",
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-api-keys/index/*",
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-policies"
      ]
    }
  ]
}
```

### S3イベントLambda

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectMetadata",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-processing-history"
    },
    {
      "Effect": "Allow",
      "Action": [
        "states:StartExecution"
      ],
      "Resource": "arn:aws:states:ap-northeast-1:*:stateMachine:*"
    }
  ]
}
```

## エラーハンドリング

### API Lambda

- **401 Unauthorized**: APIキーが見つからない
- **400 Bad Request**: 
  - リクエストボディが空
  - ファイル名が指定されていない
  - ポリシーIDが指定されていない
  - ファイルサイズが100MBを超える
  - ファイル数が10を超える
- **404 Not Found**:
  - APIキーが見つからない
  - ポリシーが見つからない
- **500 Internal Server Error**: サーバーエラー

### S3イベントLambda

- トリガーファイルでない場合は早期リターン（エラーではない）
- メタデータにprocessingHistoryIdがない場合は警告ログ
- 処理履歴が見つからない場合は警告ログ
- DynamoDB更新エラーはログに記録して処理継続
- Step Functions起動エラーはログに記録して処理継続

## ブラウザ版との統一

### 共通点

1. **トリガーファイル方式**: 両方ともトリガーファイルでStep Functionsを起動
2. **トリガーファイル構造**: 同じJSON構造（`metadata.source`のみ異なる）
3. **S3キー構造**: `service/input/{customerId}/{processingHistoryId}/...`
4. **ProcessingHistory構造**: 同じDynamoDBスキーマ

### 相違点

| 項目 | API版 | ブラウザ版 |
|------|-------|-----------|
| 認証 | APIキー | Cognito |
| userId | APIキーID | Cognito User Sub |
| userName | API名 | ユーザー名 |
| metadata.source | `"api"` | `"browser"` |
| アップロード方法 | Lambda内でS3にアップロード | ブラウザから直接S3にアップロード |

## テスト方法

### 単一ファイルアップロード

```bash
curl -X POST "https://api.example.com/upload?fileName=test.png" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: image/png" \
  --data-binary "@test.png"
```

**注意**: `x-policy-id`ヘッダーは不要です。APIキーから自動的に取得されます。

### バッチアップロード

```bash
curl -X POST "https://api.example.com/batch-upload" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {
        "fileName": "file1.png",
        "data": "base64-encoded-data",
        "contentType": "image/png"
      }
    ]
  }'
```

**注意**: `x-policy-id`ヘッダーは不要です。APIキーから自動的に取得されます。

## まとめ

- ✅ API版とブラウザ版で統一されたトリガーファイル方式
- ✅ S3イベントLambdaは両方に対応
- ✅ Step Functionsは同じ入力形式で起動
- ✅ ProcessingHistoryは統一されたスキーマ
- ✅ エラーハンドリングとログ出力の充実

