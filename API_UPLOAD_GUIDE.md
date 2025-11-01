# SiftBeam API アップロードガイド

このガイドでは、SiftBeam APIを使用してファイルをアップロードする方法を説明します。

## 目次

1. [前提条件](#前提条件)
2. [APIキーの取得](#apiキーの取得)
3. [アップロード方法](#アップロード方法)
   - [方法1: Pythonスクリプト（推奨）](#方法1-pythonスクリプト推奨)
   - [方法2: curlコマンド](#方法2-curlコマンド)
   - [方法3: JavaScriptコード](#方法3-javascriptコード)
4. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

- SiftBeamアカウント
- 有効なAPIキー
- アップロードするファイル（サポートされている形式）

### サポートされているファイル形式

- **ドキュメント**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV
- **画像**: JPG, JPEG, PNG, GIF, BMP, TIFF, TIF

### ファイルサイズ制限

- 最大: 100MB

---

## APIキーの取得

### 1. ブラウザでAPIキー管理ページにアクセス

```
https://your-domain.com/ja/account/api-management
```

### 2. APIキーを作成（まだない場合）

1. 「APIキーを作成」ボタンをクリック
2. 以下の情報を入力:
   - **API名**: わかりやすい名前（例: "テスト用API"）
   - **説明**: 用途の説明（例: "開発環境でのテスト用"）
   - **ポリシー**: 使用するポリシーを選択
3. 「作成」ボタンをクリック

### 3. APIキーの値を取得

1. APIキーテーブルで、目のアイコン（👁️）をクリック
2. 40文字のAPIキー値が表示されます
   ```
   例: J8UAUZmtqJ5RzilDq441N1v0KR55jUqvaTQFgiI7
   ```
3. クリップボードアイコンでコピー

### 4. API Gateway エンドポイントURLを確認

管理者に問い合わせるか、AWS API Gateway コンソールで確認してください。

```
形式: https://{api-id}.execute-api.ap-northeast-1.amazonaws.com/{stage}/upload
例: https://abc123xyz.execute-api.ap-northeast-1.amazonaws.com/prod/upload
```

---

## アップロード方法

### 方法1: Pythonスクリプト（推奨）

#### インストール

```bash
# 必要なパッケージをインストール
pip install requests
```

#### 環境変数の設定（オプション）

```bash
# Windows (PowerShell)
$env:SIFTBEAM_API_KEY="your_api_key_here"
$env:SIFTBEAM_API_URL="https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload"

# macOS / Linux
export SIFTBEAM_API_KEY="your_api_key_here"
export SIFTBEAM_API_URL="https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload"
```

#### 基本的な使い方

```bash
# 環境変数を使用
python test_api_upload.py --file document.pdf --policy policy-123

# コマンドラインオプションで指定
python test_api_upload.py \
  --api-key YOUR_API_KEY \
  --api-url https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload \
  --file document.pdf \
  --policy policy-123
```

#### 詳細ログ付き

```bash
python test_api_upload.py --file document.pdf --policy policy-123 --verbose
```

#### 実行例

```bash
$ python test_api_upload.py --file test-report.pdf --policy pol_abc123

============================================================
SiftBeam API ファイルアップロードテスト
============================================================
開始時刻: 2025-01-27 10:30:00
ファイル: test-report.pdf
サイズ: 1,024,000 bytes (0.98 MB)
タイプ: application/pdf
ポリシー: pol_abc123

============================================================
ステップ1: アップロードURL取得
============================================================
API URL: https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload
ドキュメント名: test-report.pdf
ポリシーID: pol_abc123
ファイルサイズ: 1,024,000 bytes (0.98 MB)

リクエスト送信中...
ステータスコード: 200
✅ アップロードURL取得成功
プロセスID: 550e8400-e29b-41d4-a716-446655440000
S3キー: service/input/cus_xxx/550e8400-e29b-41d4-a716-446655440000/test-report.pdf

============================================================
ステップ2: ファイルアップロード
============================================================
ファイル: test-report.pdf
Content-Type: application/pdf

アップロード中...
ステータスコード: 200
✅ ファイルアップロード成功

============================================================
✅ アップロード完了
============================================================
プロセスID: 550e8400-e29b-41d4-a716-446655440000
S3バケット: siftbeam
S3キー: service/input/cus_xxx/550e8400-e29b-41d4-a716-446655440000/test-report.pdf
ステータス: pending

完了時刻: 2025-01-27 10:30:05
```

---

### 方法2: curlコマンド

#### ステップ1: アップロードURL取得

```bash
curl -X POST https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -d '{
    "document": "test-document.pdf",
    "policy": "policy-123",
    "fileSize": 1024000
  }'
```

**レスポンス例:**

```json
{
  "processId": "550e8400-e29b-41d4-a716-446655440000",
  "uploadUrl": "https://siftbeam.s3.amazonaws.com/service/input/...",
  "downloadUrl": "https://siftbeam.s3.amazonaws.com/service/output/...",
  "s3Key": "service/input/cus_xxx/550e8400-e29b-41d4-a716-446655440000/test-document.pdf",
  "s3Bucket": "siftbeam",
  "documentName": "test-document.pdf",
  "policyId": "policy-123",
  "contentType": "application/pdf",
  "expiresIn": 3600,
  "status": "pending",
  "message": "Upload URL generated successfully",
  "timestamp": "2025-01-27T01:30:00.000000Z"
}
```

#### ステップ2: ファイルをアップロード

```bash
# レスポンスから取得したuploadUrlを使用
curl -X PUT "UPLOAD_URL_FROM_RESPONSE" \
  -H "Content-Type: application/pdf" \
  --data-binary @/path/to/your/file.pdf
```

---

### 方法3: JavaScriptコード

#### Node.js

```javascript
const axios = require('axios');
const fs = require('fs');

async function uploadFile(apiKey, apiUrl, filePath, policyId) {
  try {
    // ステップ1: アップロードURL取得
    const fileName = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;
    
    const response = await axios.post(apiUrl, {
      document: fileName,
      policy: policyId,
      fileSize: fileSize
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });
    
    console.log('✅ アップロードURL取得成功');
    console.log('プロセスID:', response.data.processId);
    
    // ステップ2: ファイルをアップロード
    const fileContent = fs.readFileSync(filePath);
    
    await axios.put(response.data.uploadUrl, fileContent, {
      headers: {
        'Content-Type': 'application/pdf'
      }
    });
    
    console.log('✅ ファイルアップロード成功');
    return response.data;
    
  } catch (error) {
    console.error('❌ エラー:', error.response?.data || error.message);
    throw error;
  }
}

// 使用例
uploadFile(
  'YOUR_API_KEY',
  'https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload',
  './test-document.pdf',
  'policy-123'
);
```

#### ブラウザ (Fetch API)

```javascript
async function uploadFile(apiKey, apiUrl, file, policyId) {
  try {
    // ステップ1: アップロードURL取得
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        document: file.name,
        policy: policyId,
        fileSize: file.size
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ アップロードURL取得成功');
    console.log('プロセスID:', data.processId);
    
    // ステップ2: ファイルをアップロード
    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed! status: ${uploadResponse.status}`);
    }
    
    console.log('✅ ファイルアップロード成功');
    return data;
    
  } catch (error) {
    console.error('❌ エラー:', error);
    throw error;
  }
}

// 使用例（ファイル入力から）
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    await uploadFile(
      'YOUR_API_KEY',
      'https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload',
      file,
      'policy-123'
    );
  }
});
```

---

## トラブルシューティング

### エラー: 401 Unauthorized

**原因**: APIキーが無効または指定されていない

**解決方法**:
- APIキーが正しいか確認
- APIキーが有効（active）状態か確認
- `x-api-key` ヘッダーが正しく設定されているか確認

```bash
# APIキーの確認
curl -X POST https://xxx.execute-api.ap-northeast-1.amazonaws.com/prod/upload \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"document":"test.pdf","policy":"policy-123","fileSize":1000}'
```

---

### エラー: 400 Bad Request - "Document name is required"

**原因**: ドキュメント名が指定されていない

**解決方法**:
- リクエストボディに `document` フィールドを含める

```json
{
  "document": "test-document.pdf",
  "policy": "policy-123",
  "fileSize": 1024000
}
```

---

### エラー: 400 Bad Request - "File size is required"

**原因**: ファイルサイズが指定されていない

**解決方法**:
- リクエストボディに `fileSize` フィールド（バイト単位）を含める

```json
{
  "document": "test-document.pdf",
  "policy": "policy-123",
  "fileSize": 1024000
}
```

---

### エラー: 400 Bad Request - "Unsupported file type"

**原因**: サポートされていないファイル形式

**解決方法**:
- サポートされているファイル形式を使用
- ファイル拡張子が正しいか確認

**サポート形式**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, JPG, JPEG, PNG, GIF, BMP, TIFF, TIF

---

### エラー: 403 Forbidden - "Usage limit exceeded"

**原因**: 使用量制限を超過

**解決方法**:
1. 使用量制限管理ページで現在の使用状況を確認
2. 制限を引き上げるか、次の請求サイクルまで待つ
3. 不要なファイルを削除して容量を確保

---

### エラー: 403 Forbidden - "Policy not found or access denied"

**原因**: ポリシーが存在しないか、アクセス権限がない

**解決方法**:
- ポリシーIDが正しいか確認
- ポリシーが有効か確認
- APIキーにポリシーへのアクセス権限があるか確認

---

### エラー: ファイルアップロードは成功したが、処理が開始されない

**原因**: S3トリガーの設定問題、またはLambda関数のエラー

**解決方法**:
1. 処理履歴ページで状態を確認
2. 数分待ってから再度確認
3. 管理者に連絡

---

## よくある質問

### Q: アップロードしたファイルはいつ処理されますか？

A: ファイルがS3にアップロードされると、自動的に処理が開始されます。通常、数秒から数分で完了します。処理履歴ページで進捗を確認できます。

### Q: 同時に複数のファイルをアップロードできますか？

A: はい、可能です。各ファイルごとに個別にアップロードURLを取得してアップロードしてください。

### Q: アップロードURLの有効期限はどのくらいですか？

A: アップロードURLは3600秒（1時間）有効です。有効期限内にファイルをアップロードしてください。

### Q: アップロードに失敗した場合、再試行できますか？

A: はい、最初から（アップロードURL取得から）やり直してください。

### Q: APIキーを複数作成できますか？

A: はい、用途や環境ごとに複数のAPIキーを作成できます。

---

## サポート

問題が解決しない場合は、以下の情報を含めてサポートに連絡してください：

- エラーメッセージ
- 使用したAPIキーID（値ではなく）
- ファイル名とサイズ
- タイムスタンプ
- プロセスID（取得できた場合）

サポート連絡先: support@siftbeam.com

