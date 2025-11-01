# API Gateway multipart/form-data 設定手順

## 📋 概要

API Gateway で `multipart/form-data` 形式のファイルアップロードをサポートするための設定手順です。

---

## 🎯 設定手順

### ステップ1: API Gateway コンソールにアクセス

1. **AWS マネジメントコンソール** にログイン
2. **API Gateway** サービスを開く
3. **siftbeam** API を選択

---

### ステップ2: バイナリメディアタイプを追加

#### 📍 ナビゲーション

左側メニューから以下を選択:

```
API: siftbeam
├── リソース
├── ステージ
├── オーソライザー
├── ゲートウェイのレスポンス
├── モデル
├── リソースポリシー
├── ドキュメント
├── ダッシュボード
├── API の設定
├── 使用量プラン
├── API キー
├── クライアント証明書
└── 設定  ← ここをクリック
```

#### 📝 設定内容

1. **「設定」** ページを開く
2. 下にスクロールして **「バイナリメディアタイプ」** セクションを見つける
3. **「バイナリメディアタイプを追加」** ボタンをクリック
4. 以下を入力:

```
multipart/form-data
```

5. **「変更を保存」** をクリック

#### 📸 設定画面イメージ

```
┌─────────────────────────────────────────┐
│ バイナリメディアタイプ                    │
├─────────────────────────────────────────┤
│ [+] バイナリメディアタイプを追加          │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ multipart/form-data              │    │
│ └─────────────────────────────────┘    │
│                                         │
│ [変更を保存]                             │
└─────────────────────────────────────────┘
```

---

### ステップ3: API を再デプロイ

バイナリメディアタイプの設定を反映させるため、APIを再デプロイする必要があります。

#### 📍 ナビゲーション

1. 左側メニューから **「リソース」** をクリック
2. 画面上部の **「API をデプロイ」** ボタンをクリック

#### 📝 デプロイ設定

1. **デプロイされるステージ**: `prod` を選択
2. **デプロイの説明** (オプション):
   ```
   multipart/form-data サポートを追加
   ```
3. **「デプロイ」** ボタンをクリック

#### 📸 デプロイ画面イメージ

```
┌─────────────────────────────────────────┐
│ API をデプロイ                            │
├─────────────────────────────────────────┤
│ デプロイされるステージ:                   │
│ ┌─────────────────────────────────┐    │
│ │ prod                             │ ▼  │
│ └─────────────────────────────────┘    │
│                                         │
│ デプロイの説明:                          │
│ ┌─────────────────────────────────┐    │
│ │ multipart/form-data サポートを追加│    │
│ └─────────────────────────────────┘    │
│                                         │
│ [キャンセル]  [デプロイ]                 │
└─────────────────────────────────────────┘
```

---

### ステップ4: 設定の確認

#### 📍 確認方法

1. 左側メニューから **「ステージ」** をクリック
2. **prod** ステージを選択
3. **「URL を呼び出す」** を確認:
   ```
   https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod
   ```

#### ✅ 確認項目

- [ ] バイナリメディアタイプに `multipart/form-data` が追加されている
- [ ] API が正常にデプロイされている
- [ ] 呼び出しURLが表示されている

---

## 🧪 動作確認

### テスト1: cURL でテスト

```bash
curl -X POST \
  https://8xbh4xmrid.execute-api.ap-northeast-1.amazonaws.com/prod/process \
  -H "x-api-key: LQc3ybCI6zJtOPPlKcvA2HpQM4wWvlL7W6NOVrcd" \
  -F "files=@icon.png" \
  -F "files=@icon2.png"
```

### テスト2: Python スクリプトでテスト

```bash
cd C:\Users\81903\Downloads\api-test
python test-api-batch-upload.py icon.png icon2.png
```

### 期待される結果

```json
{
  "success": true,
  "message": "2個のファイルが正常にアップロードされました。",
  "data": {
    "processingHistoryId": "xxx-xxx-xxx",
    "s3Bucket": "siftbeam",
    "files": [
      {
        "fileName": "icon.png",
        "s3Key": "service/input/.../icon.png",
        "fileSize": 968,
        "contentType": "image/png"
      }
    ],
    "status": "in_progress"
  }
}
```

---

## 🔧 Lambda関数の設定

### 必要なファイル

Lambda関数に以下のファイルを追加:

```
lambda/api-batch-upload/
├── handler.py
└── multipart_parser.py  ← 新規追加
```

### デプロイ方法

1. **Lambda関数のコードを更新**:
   ```bash
   cd lambda/api-batch-upload
   zip -r function.zip handler.py multipart_parser.py
   ```

2. **AWS Lambda コンソール**:
   - Lambda → 関数 → `SiftBeamAPI`
   - 「コード」タブ → 「アップロード元」 → 「.zip ファイル」
   - `function.zip` をアップロード

3. **デプロイ** ボタンをクリック

---

## 📊 設定完了チェックリスト

### API Gateway

- [ ] バイナリメディアタイプに `multipart/form-data` を追加
- [ ] API を `prod` ステージに再デプロイ
- [ ] デプロイが成功したことを確認

### Lambda関数

- [ ] `multipart_parser.py` を追加
- [ ] `handler.py` を更新
- [ ] Lambda関数をデプロイ

### テスト

- [ ] cURL でテスト成功
- [ ] Python スクリプトでテスト成功
- [ ] S3にファイルがアップロードされている
- [ ] DynamoDB に処理履歴が作成されている
- [ ] Step Functions が起動している

---

## 🆘 トラブルシューティング

### エラー1: "Execution failed due to configuration error: Malformed Lambda proxy response"

**原因**: Lambda関数のレスポンス形式が不正

**解決方法**:
```python
return {
    'statusCode': 200,
    'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    'body': json.dumps(response_body)
}
```

---

### エラー2: "Content-Type header not found"

**原因**: API Gateway でバイナリメディアタイプが設定されていない

**解決方法**:
1. API Gateway → 設定 → バイナリメディアタイプ
2. `multipart/form-data` を追加
3. API を再デプロイ

---

### エラー3: "boundary not found in Content-Type"

**原因**: Content-Type ヘッダーに boundary が含まれていない

**解決方法**:
- Python の `requests` ライブラリを使用する場合、`files` パラメータを使用すると自動的に設定されます
- 手動で設定する場合:
  ```python
  headers = {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  }
  ```

---

### エラー4: ファイルが空でアップロードされる

**原因**: ファイルハンドルが閉じられている

**解決方法**:
```python
# ❌ 間違い
with open('file.png', 'rb') as f:
    file_data = f.read()
files = [('files', ('file.png', file_data, 'image/png'))]

# ✅ 正しい
files = [('files', ('file.png', open('file.png', 'rb'), 'image/png'))]
response = requests.post(url, files=files)

# ファイルハンドルをクローズ
for _, (_, file_handle, _) in files:
    file_handle.close()
```

---

## 📚 参考資料

- [AWS API Gateway - バイナリメディアタイプの設定](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-payload-encodings.html)
- [Python requests - ファイルのアップロード](https://requests.readthedocs.io/en/latest/user/quickstart/#post-a-multipart-encoded-file)
- [RFC 7578 - multipart/form-data](https://datatracker.ietf.org/doc/html/rfc7578)

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

