# 大容量ファイルアップロード対応ガイド

## 📋 問題点

### ⚠️ API Gateway の制限

| 項目 | 制限値 | 影響 |
|------|--------|------|
| **ペイロードサイズ** | **最大 10 MB** | 10MB以上のファイルはアップロード不可 |
| **タイムアウト** | **最大 29 秒** | 大容量ファイルの転送が間に合わない |
| **Lambda実行時間** | **最大 15 分** | 長時間処理には不向き |

### 現在の要件

- ファイルサイズ: **最大 100MB/ファイル**
- ファイル数: **最大 10ファイル**
- 合計サイズ: **最大 1GB**

**結論**: API Gateway経由の直接アップロードは **不可能** ❌

---

## ✅ 解決策: S3 Presigned URL

### 🎯 アーキテクチャ

```
┌─────────────┐
│ クライアント │
└──────┬──────┘
       │ (1) アップロードURL要求
       │     POST /generate-upload-urls
       │     {"files": [{"fileName": "file.pdf", "fileSize": 100000000}]}
       ↓
┌─────────────────────────────────────┐
│ API Gateway (10MB制限内)             │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│ Lambda: 署名付きURL生成               │
│ - 処理履歴ID生成                     │
│ - DynamoDBに処理履歴作成             │
│ - S3署名付きURL生成(各ファイル)       │
└──────┬──────────────────────────────┘
       │ (2) 署名付きURL返却
       │     {"uploadUrls": [...], "triggerUrl": "..."}
       ↓
┌─────────────┐
│ クライアント │
└──────┬──────┘
       │ (3) S3に直接アップロード
       │     PUT https://s3.amazonaws.com/...
       │     ✅ 100MB OK! API Gatewayを経由しない
       ↓
┌─────────────────────────────────────┐
│ S3 Bucket                            │
│ ✅ 最大5TBまで対応                   │
└──────┬──────────────────────────────┘
       │ (4) 全ファイルアップロード完了後
       │     PUT _trigger.json (トリガーファイル)
       ↓
┌─────────────────────────────────────┐
│ S3 Event Notification                │
└──────┬──────────────────────────────┘
       │ (5) S3イベント
       ↓
┌─────────────────────────────────────┐
│ Lambda: S3イベントハンドラー          │
│ - トリガーファイル検知                │
│ - Step Functions起動                 │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│ Step Functions: 処理オーケストレーション│
│ - ファイルコピー                      │
│ - 処理実行                           │
│ - 結果保存                           │
└─────────────────────────────────────┘
```

---

## 🎉 メリット

| 項目 | 従来方式 (API Gateway経由) | 新方式 (Presigned URL) |
|------|---------------------------|------------------------|
| **最大ファイルサイズ** | 10 MB | **5 TB** ✅ |
| **タイムアウト** | 29秒 | **なし** ✅ |
| **Lambda実行時間** | 消費する | **消費しない** ✅ |
| **データ転送コスト** | Lambda経由 | **S3直接** (安い) ✅ |
| **実装の複雑さ** | シンプル | やや複雑 |

---

## 🔧 実装手順

### 1️⃣ Lambda関数: 署名付きURL生成

**ファイル**: `lambda/api-generate-presigned-url/handler.py`

#### 環境変数

```
PROCESSING_HISTORY_TABLE_NAME=siftbeam-processing-history
API_KEY_TABLE_NAME=siftbeam-api-keys
POLICY_TABLE_NAME=siftbeam-policy
S3_BUCKET_NAME=siftbeam
AWS_REGION=ap-northeast-1
PRESIGNED_URL_EXPIRATION=3600  # 1時間
```

#### IAM権限

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::siftbeam/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-processing-history",
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-api-keys",
        "arn:aws:dynamodb:ap-northeast-1:*:table/siftbeam-policy"
      ]
    }
  ]
}
```

---

### 2️⃣ API Gateway設定

#### リソースを追加

```
/generate-upload-urls
  └─ POST
     ├─ APIキー必須
     ├─ Lambda統合: api-generate-presigned-url
     └─ CORS有効化
```

#### 設定手順

1. **リソースを作成**:
   - リソース名: `generate-upload-urls`
   - リソースパス: `/generate-upload-urls`

2. **POSTメソッドを作成**:
   - 統合タイプ: Lambda関数
   - Lambda プロキシ統合: 有効
   - Lambda関数: `api-generate-presigned-url`

3. **APIキー必須に設定**:
   - メソッドリクエスト → APIキー必須: `true`

4. **CORSを有効化**:
   - アクション → CORSを有効化

5. **APIをデプロイ**:
   - ステージ: `prod`

---

### 3️⃣ クライアント実装

#### Python例

```python
import requests
import json

# ステップ1: 署名付きURLを生成
def generate_upload_urls(api_url, api_key, files_info):
    response = requests.post(
        f"{api_url}/generate-upload-urls",
        headers={
            'x-api-key': api_key,
            'Content-Type': 'application/json'
        },
        json={'files': files_info}
    )
    return response.json()['data']

# ステップ2: ファイルをS3に直接アップロード
def upload_file_to_s3(upload_url, file_path, content_type):
    with open(file_path, 'rb') as f:
        response = requests.put(
            upload_url,
            data=f,
            headers={'Content-Type': content_type}
        )
    response.raise_for_status()

# ステップ3: トリガーファイルをアップロード
def trigger_processing(trigger_url, trigger_content):
    response = requests.put(
        trigger_url,
        data=json.dumps(trigger_content).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    response.raise_for_status()

# 実行
files_info = [
    {'fileName': 'large_file.pdf', 'fileSize': 100000000, 'contentType': 'application/pdf'}
]

# URL生成
upload_data = generate_upload_urls(API_URL, API_KEY, files_info)

# ファイルアップロード
for upload_info, file_path in zip(upload_data['uploadUrls'], file_paths):
    upload_file_to_s3(upload_info['uploadUrl'], file_path, upload_info['contentType'])

# 処理開始
trigger_processing(upload_data['triggerUrl'], upload_data['triggerContent'])
```

#### JavaScript/TypeScript例

```typescript
// ステップ1: 署名付きURLを生成
async function generateUploadUrls(files: File[]) {
  const filesInfo = files.map(file => ({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type || 'application/octet-stream'
  }));

  const response = await fetch(`${API_URL}/generate-upload-urls`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ files: filesInfo })
  });

  const result = await response.json();
  return result.data;
}

// ステップ2: ファイルをS3に直接アップロード
async function uploadFileToS3(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream'
    }
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
}

// ステップ3: トリガーファイルをアップロード
async function triggerProcessing(triggerUrl: string, triggerContent: any) {
  const response = await fetch(triggerUrl, {
    method: 'PUT',
    body: JSON.stringify(triggerContent),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Trigger failed: ${response.statusText}`);
  }
}

// 実行
async function uploadFiles(files: File[]) {
  // URL生成
  const uploadData = await generateUploadUrls(files);

  // ファイルアップロード
  for (let i = 0; i < files.length; i++) {
    await uploadFileToS3(uploadData.uploadUrls[i].uploadUrl, files[i]);
  }

  // 処理開始
  await triggerProcessing(uploadData.triggerUrl, uploadData.triggerContent);

  return uploadData.processingHistoryId;
}
```

---

## 🧪 テスト方法

### Python スクリプト

```bash
cd lambda/api-generate-presigned-url
python test-presigned-upload.py large_file.pdf
```

### cURL

```bash
# ステップ1: 署名付きURLを生成
curl -X POST \
  https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/generate-upload-urls \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {"fileName": "large_file.pdf", "fileSize": 100000000, "contentType": "application/pdf"}
    ]
  }' > response.json

# ステップ2: ファイルをS3にアップロード
UPLOAD_URL=$(jq -r '.data.uploadUrls[0].uploadUrl' response.json)
curl -X PUT "$UPLOAD_URL" \
  -H "Content-Type: application/pdf" \
  --data-binary @large_file.pdf

# ステップ3: トリガーファイルをアップロード
TRIGGER_URL=$(jq -r '.data.triggerUrl' response.json)
TRIGGER_CONTENT=$(jq -c '.data.triggerContent' response.json)
curl -X PUT "$TRIGGER_URL" \
  -H "Content-Type: application/json" \
  -d "$TRIGGER_CONTENT"
```

---

## 📊 パフォーマンス比較

### 100MBファイルのアップロード

| 項目 | API Gateway経由 | Presigned URL |
|------|----------------|---------------|
| **可否** | ❌ 不可能 (10MB制限) | ✅ 可能 |
| **転送時間** | - | 約30秒 (3.3MB/s) |
| **Lambda実行時間** | - | **0秒** (消費なし) |
| **コスト** | - | **S3転送料金のみ** |

### 1GBファイル (10ファイル x 100MB)

| 項目 | API Gateway経由 | Presigned URL |
|------|----------------|---------------|
| **可否** | ❌ 不可能 | ✅ 可能 |
| **転送時間** | - | 約5分 |
| **Lambda実行時間** | - | **0秒** |
| **コスト削減** | - | **約90%削減** |

---

## 🔒 セキュリティ

### 署名付きURLの有効期限

- **デフォルト**: 1時間 (3600秒)
- **推奨**: 用途に応じて調整
  - 小ファイル: 15分 (900秒)
  - 大ファイル: 1時間 (3600秒)
  - 超大容量: 6時間 (21600秒)

### アクセス制御

1. **APIキー認証**: URL生成時に必須
2. **S3メタデータ**: アップロード時に自動付与
   - `customerId`
   - `userId`
   - `policyId`
   - `processingHistoryId`
3. **S3バケットポリシー**: 必要に応じて制限

---

## 🆘 トラブルシューティング

### エラー1: "SignatureDoesNotMatch"

**原因**: 署名付きURLの有効期限切れ

**解決方法**:
- URL生成からアップロードまでの時間を短縮
- `PRESIGNED_URL_EXPIRATION` を延長

---

### エラー2: "AccessDenied"

**原因**: Lambda関数のIAM権限不足

**解決方法**:
```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject"],
  "Resource": "arn:aws:s3:::siftbeam/*"
}
```

---

### エラー3: ファイルアップロード後、処理が開始されない

**原因**: トリガーファイルがアップロードされていない

**解決方法**:
- 全ファイルアップロード完了後、必ずトリガーファイルをアップロード
- S3イベント通知が正しく設定されているか確認

---

## 📚 参考資料

- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [API Gateway Limits](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html)
- [S3 Object Size Limits](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

