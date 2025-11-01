# API Batch Upload Lambda (Simple Version)

ファイルパスのみを受け取るシンプルなバッチアップロードAPI

## 特徴

- ✅ **シンプル**: ファイルパスのみを指定
- ✅ **効率的**: Lambda内でファイル読み込み・エンコード
- ✅ **自動取得**: 必要な情報はDynamoDBから取得
- ✅ **自動判定**: Content-Typeを自動推測

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

### ボディ（JSON）

```json
{
  "filePaths": [
    "/path/to/icon.png",
    "/path/to/icon2.png"
  ]
}
```

**フィールド説明:**
- `filePaths`: アップロードするファイルのパス配列（最大10ファイル）

**注意:**
- ポリシーIDは不要です（APIキーから自動取得）
- カスタマーIDも不要です（APIキーから自動取得）

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

## 🎯 おすすめのテスト方法

| ツール | 難易度 | おすすめ度 | 用途 |
|--------|--------|-----------|------|
| **Postman** | ⭐ | ⭐⭐⭐⭐⭐ | GUI で直感的、初心者に最適 |
| **Python** | ⭐⭐ | ⭐⭐⭐⭐⭐ | 自動化・スクリプト化に最適 |
| **HTTPie** | ⭐⭐ | ⭐⭐⭐⭐ | モダンなCLI、見やすい出力 |
| **cURL** | ⭐⭐⭐ | ⭐⭐⭐ | 標準ツール、どこでも使える |
| **PowerShell** | ⭐⭐⭐ | ⭐⭐ | Windows環境のみ |

### 初めての方へ

1. **GUI が好きな方** → **Postman** を使用
2. **プログラミングに慣れている方** → **Python** を使用
3. **コマンドラインが好きな方** → **HTTPie** を使用

## 使用例

### 🐍 Python (おすすめ!)

#### シンプルな使い方

```python
import requests

# 単一ファイルアップロード
with open('test.png', 'rb') as f:
    response = requests.post(
        "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload?fileName=test.png",
        headers={"x-api-key": "YOUR_API_KEY"},
        data=f.read()
    )
print(response.json())

# バッチアップロード
response = requests.post(
    "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload",
    headers={
        "x-api-key": "YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "filePaths": [
            "/path/to/icon.png",
            "/path/to/icon2.png"
        ]
    }
)
print(response.json())
```

#### テストスクリプトを使う

```bash
# 単一ファイル
python test-api-upload.py test.png

# バッチアップロード
python test-api-batch-upload.py file1.png file2.jpg

# または設定を編集して実行
python test-api-upload.py
```

**メリット**:
- ✅ シンプルで読みやすい
- ✅ エラーハンドリングが簡単
- ✅ クロスプラットフォーム（Windows/Mac/Linux）
- ✅ 自動化しやすい

### 📮 Postman / Insomnia (GUIツール - おすすめ!)

**Postman**: https://www.postman.com/downloads/
**Insomnia**: https://insomnia.rest/download

#### 設定方法

1. **新しいリクエストを作成**
2. **Method**: `POST`
3. **URL**: `https://YOUR_API_GATEWAY_URL/prod/upload?fileName=test.png`
4. **Headers**:
   - `x-api-key`: `YOUR_API_KEY`
   - `Content-Type`: `image/png` (単一ファイルの場合)
5. **Body**:
   - 単一ファイル: `Binary` → ファイルを選択
   - バッチ: `JSON` → JSONを入力

**メリット**:
- ✅ **GUI で直感的**
- ✅ レスポンスが見やすい
- ✅ リクエスト履歴が残る
- ✅ コレクションとして保存・共有可能
- ✅ 環境変数でAPI URLやAPIキーを管理

### 🌐 HTTPie (モダンなcURL)

```bash
# インストール
pip install httpie

# 単一ファイルアップロード
http POST "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload?fileName=test.png" \
  x-api-key:YOUR_API_KEY \
  Content-Type:image/png \
  < test.png

# バッチアップロード
http POST "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload" \
  x-api-key:YOUR_API_KEY \
  filePaths:='["/path/to/icon.png", "/path/to/icon2.png"]'
```

**メリット**:
- ✅ curlより読みやすい構文
- ✅ JSONレスポンスが自動的に色付け・整形
- ✅ シンプルで覚えやすい

### 🔧 cURL (標準ツール)

```bash
# 単一ファイルアップロード
curl -X POST "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload?fileName=test.png" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: image/png" \
  --data-binary "@test.png"

# バッチアップロード
curl -X POST "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "filePaths": [
      "/path/to/icon.png",
      "/path/to/icon2.png"
    ]
  }'
```

### PowerShell

```powershell
# APIエンドポイントとAPIキーを設定
$apiUrl = "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload"
$apiKey = "YOUR_API_KEY"

# リクエストボディを作成
$body = @{
    filePaths = @(
        "C:\path\to\icon.png",
        "C:\path\to\icon2.png"
    )
} | ConvertTo-Json

# ヘッダーを設定
$headers = @{
    "x-api-key" = $apiKey
    "Content-Type" = "application/json"
}

# APIリクエストを送信
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body
    
    # 成功時の処理
    Write-Host "✅ アップロード成功!" -ForegroundColor Green
    Write-Host "Processing History ID: $($response.data.processingHistoryId)"
    Write-Host "アップロードファイル数: $($response.data.files.Count)"
    
    # レスポンス全体を表示
    $response | ConvertTo-Json -Depth 10
    
} catch {
    # エラー時の処理
    Write-Host "❌ アップロード失敗!" -ForegroundColor Red
    Write-Host "エラー: $($_.Exception.Message)"
    
    # エラーレスポンスを表示
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}
```

### PowerShell (単一ファイル - api-upload)

```powershell
# APIエンドポイントとAPIキーを設定
$apiUrl = "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload"
$apiKey = "YOUR_API_KEY"
$filePath = "C:\path\to\test.png"
$fileName = "test.png"

# ファイルを読み込む
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)

# Content-Typeを取得
$contentType = switch ([System.IO.Path]::GetExtension($filePath).ToLower()) {
    ".png"  { "image/png" }
    ".jpg"  { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".gif"  { "image/gif" }
    ".pdf"  { "application/pdf" }
    ".txt"  { "text/plain" }
    default { "application/octet-stream" }
}

# ヘッダーを設定
$headers = @{
    "x-api-key" = $apiKey
    "Content-Type" = $contentType
}

# URLにファイル名を追加
$uploadUrl = "$apiUrl`?fileName=$fileName"

# APIリクエストを送信
try {
    $response = Invoke-RestMethod -Uri $uploadUrl -Method Post -Headers $headers -Body $fileBytes
    
    # 成功時の処理
    Write-Host "✅ アップロード成功!" -ForegroundColor Green
    Write-Host "Processing History ID: $($response.data.processingHistoryId)"
    Write-Host "S3 Key: $($response.data.s3Key)"
    Write-Host "ファイルサイズ: $($response.data.fileSize) bytes"
    
    # レスポンス全体を表示
    $response | ConvertTo-Json -Depth 10
    
} catch {
    # エラー時の処理
    Write-Host "❌ アップロード失敗!" -ForegroundColor Red
    Write-Host "エラー: $($_.Exception.Message)"
    
    # エラーレスポンスを表示
    if ($_.ErrorDetails.Message) {
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}
```

## Lambda内の処理フロー

```
1. APIキー検証（API Gateway）
   ↓
2. ファイルパスのバリデーション
   ↓
3. APIキー情報をDynamoDBから取得 ← 自動
   - API Gateway KeyID → APIキーテーブル（GSI: gatewayApiKeyId-index）
   - 取得: apiName, policyId, customerId
   ↓
4. ポリシー情報をDynamoDBから取得 ← 自動
   - policyId → ポリシーテーブル
   - 取得: policyName, acceptedFileTypes
   ↓
5. 処理履歴IDを生成（UUID）
   ↓
6. 処理履歴を作成（DynamoDB）
   ↓
7. 各ファイルを処理
   - ファイル読み込み ← Lambda内で実行
   - Content-Type自動推測 ← Lambda内で実行
   - S3にアップロード
   ↓
8. トリガーファイルを作成
   - 最小限の情報のみ
   - Step Functions起動
```

## トリガーファイル

最小限の情報のみを含む:

```json
{
  "processing-historyId": "f5b182ac-6150-4006-a3ea-d75128bd057c",
  "fileCount": 2,
  "expectedTotalSize": 2048000,
  "triggerTimestamp": "2025-01-27T10:30:05.000Z"
}
```

## 利点

### 1. シンプルなAPI

- ✅ ファイルパスのみを指定
- ✅ Base64エンコード不要
- ✅ Content-Type指定不要

### 2. 効率的

- ✅ Lambda内でファイル読み込み
- ✅ 必要な情報はDynamoDBから自動取得
- ✅ Content-Typeを自動推測

### 3. 保守性

- ✅ クライアント側のコードが簡潔
- ✅ エラーハンドリングがLambda側に集約
- ✅ 拡張が容易

## 制限事項

1. **ファイル数**: 最大10ファイル
2. **ファイルサイズ**: 各ファイル最大100MB
3. **Lambda実行時間**: 最大15分
4. **ファイルアクセス**: Lambda実行環境からアクセス可能なパスのみ

## 注意事項

- ファイルパスはLambda実行環境からアクセス可能である必要があります
- 大きなファイルの場合は、Lambda実行時間に注意してください
- Content-Typeは自動推測されますが、不正確な場合があります

## テストスクリプト

### PowerShellスクリプトの使い方

#### 1. 単一ファイルアップロード

```powershell
# スクリプトをダウンロード
# test-api-upload.ps1

# 設定を編集
$API_URL = "https://YOUR_API_GATEWAY_URL/prod/upload"
$API_KEY = "YOUR_API_KEY"
$TEST_FILE = "C:\path\to\test.png"

# スクリプトを実行
.\test-api-upload.ps1
```

**出力例:**
```
============================================
API Upload Test
============================================

API URL: https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload
Test File: C:\Users\test\image.png

ファイル名: image.png
ファイルサイズ: 1.23 MB
Content-Type: image/png

✓ ファイル読み込み完了

アップロード中...

============================================
✅ アップロード成功!
============================================

Processing History ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
S3 Bucket: siftbeam
S3 Key: service/input/cus_xxxxx/a1b2c3d4.../image.png
Status: in_progress
Uploaded At: 2025-10-30T12:34:56.789Z
```

#### 2. バッチアップロード

```powershell
# スクリプトをダウンロード
# test-api-batch-upload.ps1

# 設定を編集
$API_URL = "https://YOUR_API_GATEWAY_URL/prod/batch-upload"
$API_KEY = "YOUR_API_KEY"
$TEST_FILES = @(
    "C:\path\to\file1.png",
    "C:\path\to\file2.jpg"
)

# スクリプトを実行
.\test-api-batch-upload.ps1
```

**出力例:**
```
============================================
API Batch Upload Test
============================================

API URL: https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload
ファイル数: 2

✓ file1.png - 1.23 MB
✓ file2.jpg - 2.45 MB

合計サイズ: 3.68 MB

アップロード中...

============================================
✅ アップロード成功!
============================================

Message: 2個のファイルが正常にアップロードされました。
Processing History ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
S3 Bucket: siftbeam
Status: in_progress

アップロードされたファイル:
  - file1.png
    S3 Key: service/input/cus_xxxxx/.../file1.png
    Size: 1.23 MB
    Content-Type: image/png

  - file2.jpg
    S3 Key: service/input/cus_xxxxx/.../file2.jpg
    Size: 2.45 MB
    Content-Type: image/jpeg
```

### 簡易版（ワンライナー）

#### 単一ファイル

```powershell
$response = Invoke-RestMethod -Uri "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload?fileName=test.png" -Method Post -Headers @{"x-api-key"="YOUR_API_KEY";"Content-Type"="image/png"} -Body ([System.IO.File]::ReadAllBytes("C:\path\to\test.png")); $response | ConvertTo-Json -Depth 10
```

#### バッチアップロード

```powershell
$response = Invoke-RestMethod -Uri "https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/batch-upload" -Method Post -Headers @{"x-api-key"="YOUR_API_KEY";"Content-Type"="application/json"} -Body (@{filePaths=@("C:\path\to\file1.png","C:\path\to\file2.jpg")} | ConvertTo-Json); $response | ConvertTo-Json -Depth 10
```

