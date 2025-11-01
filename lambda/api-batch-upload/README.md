# API Batch Upload Lambda

API Gateway経由で複数ファイルをバッチアップロードするLambda関数です。

## 機能

1. APIキーを検証
2. 処理履歴IDを生成（全ファイル共通）
3. 処理履歴レコードを作成
4. 各ファイルをS3にアップロード
5. 最後のファイルのみ`triggerStepFunction='true'`を設定

## ブラウザ版との違い

| 項目 | ブラウザ版 | API版（バッチ） |
|------|-----------|----------------|
| ファイル数 | 最大10ファイル | 最大10ファイル |
| 処理履歴 | 1つ（共通） | 1つ（共通） |
| Step Functions起動 | 最後のファイルのみ | 最後のファイルのみ |
| アップロード方法 | クライアント→S3直接 | API→Lambda→S3 |

## リクエスト形式

### エンドポイント

```
POST /batch-upload
```

### ヘッダー

| ヘッダー名 | 必須 | 説明 |
|-----------|------|------|
| `x-api-key` | ✅ | APIキー |
| `Content-Type` | ✅ | `application/json` |
| `x-policy-id` | ✅ | ポリシーID |

### ボディ（JSON）

```json
{
  "files": [
    {
      "fileName": "icon.png",
      "contentType": "image/png",
      "data": "iVBORw0KGgoAAAANSUhEUgAA..." // Base64エンコード
    },
    {
      "fileName": "icon2.png",
      "contentType": "image/png",
      "data": "iVBORw0KGgoAAAANSUhEUgAA..." // Base64エンコード
    }
  ]
}
```

## レスポンス形式

### 成功時 (200 OK)

```json
{
  "success": true,
  "message": "2個のファイルが正常にアップロードされました。",
  "data": {
    "processingHistoryId": "f5b182ac-6150-4006-a3ea-d75128bd057c",
    "s3Bucket": "siftbeam",
    "files": [
      {
        "fileName": "icon.png",
        "s3Key": "service/input/customer-001/f5b182ac-6150-4006-a3ea-d75128bd057c/icon.png",
        "fileSize": 1024000,
        "contentType": "image/png"
      },
      {
        "fileName": "icon2.png",
        "s3Key": "service/input/customer-001/f5b182ac-6150-4006-a3ea-d75128bd057c/icon2.png",
        "fileSize": 1024000,
        "contentType": "image/png"
      }
    ],
    "status": "in_progress",
    "uploadedAt": "2025-01-27T10:30:00.000Z"
  }
}
```

## 使用例

### Python

```python
import requests
import base64
import json

# ファイルを読み込んでBase64エンコード
def encode_file(file_path):
    with open(file_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

# リクエストデータを作成
data = {
    "files": [
        {
            "fileName": "icon.png",
            "contentType": "image/png",
            "data": encode_file("icon.png")
        },
        {
            "fileName": "icon2.png",
            "contentType": "image/png",
            "data": encode_file("icon2.png")
        }
    ]
}

# APIリクエスト
response = requests.post(
    "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload",
    headers={
        "x-api-key": "YOUR_API_KEY",
        "Content-Type": "application/json",
        "x-policy-id": "policy-123"
    },
    json=data
)

print(response.json())
```

### JavaScript (Node.js)

```javascript
const fs = require('fs');
const axios = require('axios');

// ファイルを読み込んでBase64エンコード
function encodeFile(filePath) {
  const fileData = fs.readFileSync(filePath);
  return fileData.toString('base64');
}

// リクエストデータを作成
const data = {
  files: [
    {
      fileName: 'icon.png',
      contentType: 'image/png',
      data: encodeFile('icon.png')
    },
    {
      fileName: 'icon2.png',
      contentType: 'image/png',
      data: encodeFile('icon2.png')
    }
  ]
};

// APIリクエスト
axios.post(
  'https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload',
  data,
  {
    headers: {
      'x-api-key': 'YOUR_API_KEY',
      'Content-Type': 'application/json',
      'x-policy-id': 'policy-123'
    }
  }
)
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error.response?.data || error.message);
});
```

## 処理フロー

```
1. APIリクエスト受信
   ↓
2. APIキー検証
   ↓
3. 処理履歴ID生成 (UUID)
   ↓
4. 処理履歴作成
   - status: 'in_progress'
   - usageAmountBytes: 0
   - uploadedFileKeys: [全ファイルのS3キー]
   ↓
5. 各ファイルをS3にアップロード
   - ファイル1: triggerStepFunction='false'
   - ファイル2: triggerStepFunction='true' (最後のファイル)
   ↓
6. S3イベントLambda起動（各ファイルごと）
   - ファイル1: usageAmountBytes += size1
   - ファイル2: usageAmountBytes += size2, Step Functions起動 ✅
   ↓
7. Step Functions実行
   - 処理履歴から uploadedFileKeys を取得
   - すべてのファイルを処理
   - 処理結果を保存
   - 処理履歴のステータスを更新
```

## 制限事項

1. **ファイル数**: 最大10ファイル
2. **ファイルサイズ**: 各ファイル最大100MB
3. **リクエストサイズ**: API Gatewayの制限（10MB）
   - Base64エンコード後のサイズが10MBを超える場合はエラー
   - 実質的には約7MBのファイルまで

## 注意事項

- Base64エンコードによりデータサイズが約33%増加します
- 大きなファイルの場合は、単一ファイルAPIを複数回呼び出す方が効率的です
- API Gatewayのタイムアウト（30秒）に注意してください

