# API Upload Lambda

API Gateway経由でファイルをアップロードするLambda関数です。

## 機能

1. APIキーを検証
2. APIキーからpolicyId, customerId, apiNameを取得
3. ポリシーを検証 (acceptedFileTypes)
4. 処理履歴IDを生成 (UUID)
5. 処理履歴レコードを作成 (status: 'in_progress')
6. S3にファイルをアップロード
7. レスポンスを返す

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `DYNAMODB_TABLE_NAME` | DynamoDBテーブル名 | `siftbeam-processing-history` |
| `S3_BUCKET_NAME` | S3バケット名 | `siftbeam` |
| `AWS_REGION` | AWSリージョン | `ap-northeast-1` |

## リクエスト形式

### エンドポイント

```
POST /upload
```

### ヘッダー

| ヘッダー名 | 必須 | 説明 |
|-----------|------|------|
| `x-api-key` | ✅ | APIキー |
| `Content-Type` | ✅ | ファイルのMIMEタイプ |
| `x-file-name` | ✅ | ファイル名 |
| `x-file-size` | ❌ | ファイルサイズ（バイト） |
| `x-policy-id` | ✅ | ポリシーID |

### クエリパラメータ

| パラメータ名 | 必須 | 説明 |
|-------------|------|------|
| `fileName` | ✅ | ファイル名（ヘッダーの代わりに使用可） |
| `fileSize` | ❌ | ファイルサイズ（バイト） |
| `policyId` | ✅ | ポリシーID（ヘッダーの代わりに使用可） |

### ボディ

バイナリデータ（Base64エンコード）

## レスポンス形式

### 成功時 (200 OK)

```json
{
  "success": true,
  "message": "ファイルが正常にアップロードされました。",
  "data": {
    "processingHistoryId": "550e8400-e29b-41d4-a716-446655440000",
    "s3Key": "service/input/customer-001/550e8400-e29b-41d4-a716-446655440000/document.pdf",
    "s3Bucket": "siftbeam",
    "fileName": "document.pdf",
    "fileSize": 1024000,
    "contentType": "application/pdf",
    "status": "in_progress",
    "uploadedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

### エラー時

#### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "APIキーが見つかりません。"
}
```

#### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "ファイル名が指定されていません。クエリパラメータ\"fileName\"またはヘッダー\"x-file-name\"を設定してください。"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "サーバーエラーが発生しました: ..."
}
```

## 使用例

### curlコマンド

```bash
curl -X POST "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload?fileName=document.pdf&policyId=policy-123" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/pdf" \
  --data-binary @document.pdf
```

### Python

```python
import requests

url = "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload"
headers = {
    "x-api-key": "YOUR_API_KEY",
    "Content-Type": "application/pdf",
    "x-file-name": "document.pdf",
    "x-policy-id": "policy-123"
}

with open("document.pdf", "rb") as f:
    response = requests.post(url, headers=headers, data=f)
    print(response.json())
```

## デプロイ

```bash
cd lambda/api-upload
./deploy.sh
```

## IAMポリシー

Lambda関数には以下の権限が必要です:

- `dynamodb:PutItem` - 処理履歴の作成
- `s3:PutObject` - ファイルのアップロード
- `logs:CreateLogGroup` - CloudWatch Logsの作成
- `logs:CreateLogStream` - CloudWatch Logsの作成
- `logs:PutLogEvents` - CloudWatch Logsへの書き込み

詳細は `iam-policy.json` を参照してください。

## S3パス構造

```
service/input/{customerId}/{processingHistoryId}/{fileName}
```

例:
```
service/input/customer-001/550e8400-e29b-41d4-a716-446655440000/document.pdf
```

## S3メタデータ

アップロードされたファイルには以下のメタデータが付与されます:

| キー | 説明 |
|------|------|
| `customerId` | カスタマーID |
| `userId` | ユーザーID（APIキーID） |
| `policyId` | ポリシーID |
| `processingHistoryId` | 処理履歴ID |
| `fileType` | ファイルタイプ（`input`） |
| `uploadedAt` | アップロード日時 |
| `triggerStepFunction` | Step Functionsトリガーフラグ（`true`） |

## 処理フロー

1. **APIキー検証**: API Gatewayが自動的に検証
2. **リクエストパース**: ヘッダー、クエリパラメータ、ボディを取得
3. **バリデーション**: ファイル名、ポリシーID、ファイルサイズをチェック
4. **処理履歴作成**: DynamoDBに処理履歴レコードを作成（status: `in_progress`）
5. **S3アップロード**: ファイルをS3にアップロード（メタデータ付き）
6. **S3イベント**: S3イベントトリガーでS3イベントLambdaが起動
7. **ファイルサイズ更新**: S3イベントLambdaが処理履歴のファイルサイズを更新
8. **Step Functions起動**: S3イベントLambdaがStep Functionsを起動（`triggerStepFunction: true`の場合）

## 注意事項

- ファイルサイズの上限は100MBです
- APIキー情報の取得は簡略化されています。実際にはAPIキーテーブルから取得する必要があります
- ポリシー情報の取得も簡略化されています。実際にはポリシーテーブルから取得する必要があります
- エラーハンドリングは基本的なもののみ実装されています

