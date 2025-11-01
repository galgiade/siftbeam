# ファイルアップロード方式の比較

## 📊 3つのアップロード方式

SiftBeam APIでは、用途に応じて3つのアップロード方式を提供しています。

---

## 1️⃣ 直接アップロード (multipart/form-data)

### 📝 概要

API Gateway経由で、ファイルをLambda関数に直接送信します。

### 🎯 適用範囲

- **ファイルサイズ**: **最大 10MB**
- **ファイル数**: 1〜10個
- **合計サイズ**: 最大 10MB

### ✅ メリット

- シンプルな実装
- 1回のAPIコールで完結
- リアルタイム処理

### ❌ デメリット

- **10MB制限** (API Gateway)
- **29秒タイムアウト** (API Gateway)
- Lambda実行時間を消費

### 📦 リクエスト例

```python
files = [
    ('files', ('file1.pdf', open('file1.pdf', 'rb'), 'application/pdf')),
    ('files', ('file2.pdf', open('file2.pdf', 'rb'), 'application/pdf'))
]

response = requests.post(
    'https://api.example.com/prod/process',
    headers={'x-api-key': API_KEY},
    files=files
)
```

### 🎯 推奨用途

- ✅ 小ファイル (< 5MB)
- ✅ 画像・アイコン
- ✅ 設定ファイル
- ✅ プロトタイプ・開発環境

---

## 2️⃣ JSONアップロード (Base64エンコード)

### 📝 概要

ファイルをBase64エンコードしてJSON形式で送信します。

### 🎯 適用範囲

- **ファイルサイズ**: **最大 7.5MB** (Base64で10MBになる)
- **ファイル数**: 1〜10個
- **合計サイズ**: 最大 7.5MB

### ✅ メリット

- JSON形式で統一
- メタデータと一緒に送信可能
- デバッグしやすい

### ❌ デメリット

- **データサイズが33%増加**
- エンコード/デコードのオーバーヘッド
- **7.5MB制限** (Base64後に10MB)

### 📦 リクエスト例

```python
import base64

files_data = []
for file_path in file_paths:
    with open(file_path, 'rb') as f:
        file_content = f.read()
        file_base64 = base64.b64encode(file_content).decode('utf-8')
        
        files_data.append({
            'fileName': Path(file_path).name,
            'fileData': file_base64,
            'contentType': 'application/pdf'
        })

response = requests.post(
    'https://api.example.com/prod/process',
    headers={
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    },
    json={'files': files_data}
)
```

### 🎯 推奨用途

- ✅ 超小ファイル (< 3MB)
- ✅ JSONベースのAPI
- ✅ メタデータ重視
- ❌ 大容量ファイルには不向き

---

## 3️⃣ S3 Presigned URL (推奨)

### 📝 概要

署名付きURLを取得し、S3に直接アップロードします。

### 🎯 適用範囲

- **ファイルサイズ**: **最大 5TB** ✅
- **ファイル数**: 1〜10個
- **合計サイズ**: 無制限

### ✅ メリット

- **大容量ファイル対応** (最大5TB)
- **タイムアウトなし**
- Lambda実行時間を消費しない
- **コスト削減** (約90%)
- 並列アップロード可能

### ❌ デメリット

- 実装がやや複雑 (3ステップ)
- 2回のAPIコール必要

### 📦 リクエスト例

```python
# ステップ1: 署名付きURLを生成
response = requests.post(
    'https://api.example.com/prod/generate-upload-urls',
    headers={
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    },
    json={
        'files': [
            {'fileName': 'large_file.pdf', 'fileSize': 100000000, 'contentType': 'application/pdf'}
        ]
    }
)
upload_data = response.json()['data']

# ステップ2: S3に直接アップロード
for upload_info, file_path in zip(upload_data['uploadUrls'], file_paths):
    with open(file_path, 'rb') as f:
        requests.put(
            upload_info['uploadUrl'],
            data=f,
            headers={'Content-Type': upload_info['contentType']}
        )

# ステップ3: トリガーファイルをアップロード
requests.put(
    upload_data['triggerUrl'],
    data=json.dumps(upload_data['triggerContent']).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
```

### 🎯 推奨用途

- ✅ 大容量ファイル (> 10MB)
- ✅ 動画・音声ファイル
- ✅ 大量のファイル
- ✅ 本番環境

---

## 📊 比較表

| 項目 | 直接アップロード | JSONアップロード | Presigned URL |
|------|----------------|-----------------|---------------|
| **最大ファイルサイズ** | 10 MB | 7.5 MB | **5 TB** ✅ |
| **タイムアウト** | 29秒 | 29秒 | **なし** ✅ |
| **データ増加** | なし | +33% | なし ✅ |
| **Lambda実行時間** | 消費 | 消費 | **消費なし** ✅ |
| **実装の複雑さ** | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **コスト** | 中 | 中 | **低** ✅ |
| **並列アップロード** | 不可 | 不可 | **可能** ✅ |
| **エンドポイント** | `/process` | `/process` | `/generate-upload-urls` |

---

## 🎯 選択ガイド

### ファイルサイズで選ぶ

```
< 5 MB
  └─ 直接アップロード (multipart/form-data) ⭐

5 MB ~ 10 MB
  └─ 直接アップロード (multipart/form-data) ⭐⭐

> 10 MB
  └─ Presigned URL ⭐⭐⭐ (必須)
```

### 用途で選ぶ

```
開発・プロトタイプ
  └─ 直接アップロード ⭐

小ファイル (画像・アイコン)
  └─ 直接アップロード ⭐

中ファイル (PDF・ドキュメント)
  └─ 直接アップロード or Presigned URL ⭐⭐

大ファイル (動画・音声・大容量PDF)
  └─ Presigned URL ⭐⭐⭐ (必須)

本番環境
  └─ Presigned URL ⭐⭐⭐ (推奨)
```

---

## 💡 推奨事項

### 🎯 基本方針

1. **< 10MB**: 直接アップロード (シンプル)
2. **> 10MB**: Presigned URL (必須)
3. **本番環境**: Presigned URL (コスト削減)

### 🔄 移行パス

```
開発フェーズ
  ↓ 直接アップロード (シンプル実装)
  
テストフェーズ
  ↓ 直接アップロード (動作確認)
  
本番環境
  ↓ Presigned URL (パフォーマンス・コスト最適化)
```

---

## 📈 パフォーマンス比較

### 10MBファイルのアップロード

| 方式 | 転送時間 | Lambda実行時間 | コスト |
|------|---------|---------------|--------|
| 直接 (multipart) | 3秒 | 3秒 | $0.00006 |
| JSON (Base64) | ❌ 不可 (13MB) | - | - |
| Presigned URL | 3秒 | **0秒** | **$0.00001** ✅ |

### 100MBファイルのアップロード

| 方式 | 転送時間 | Lambda実行時間 | コスト |
|------|---------|---------------|--------|
| 直接 (multipart) | ❌ 不可 | - | - |
| JSON (Base64) | ❌ 不可 | - | - |
| Presigned URL | 30秒 | **0秒** | **$0.0001** ✅ |

### 1GBファイルのアップロード

| 方式 | 転送時間 | Lambda実行時間 | コスト |
|------|---------|---------------|--------|
| 直接 (multipart) | ❌ 不可 | - | - |
| JSON (Base64) | ❌ 不可 | - | - |
| Presigned URL | 5分 | **0秒** | **$0.001** ✅ |

---

## 🔧 実装チェックリスト

### 直接アップロード

- [ ] API Gateway に `multipart/form-data` を追加
- [ ] Lambda関数に `multipart_parser.py` を追加
- [ ] テストスクリプトを作成
- [ ] 10MB以下のファイルで動作確認

### Presigned URL

- [ ] Lambda関数 `api-generate-presigned-url` を作成
- [ ] API Gateway に `/generate-upload-urls` エンドポイントを追加
- [ ] IAM権限を設定 (`s3:PutObject`)
- [ ] テストスクリプトを作成
- [ ] 100MB以上のファイルで動作確認

---

## 📚 関連ドキュメント

- [API_GATEWAY_MULTIPART_SETUP.md](./API_GATEWAY_MULTIPART_SETUP.md) - multipart/form-data設定
- [LARGE_FILE_UPLOAD_SOLUTION.md](./LARGE_FILE_UPLOAD_SOLUTION.md) - Presigned URL詳細
- [MULTIPART_MIGRATION.md](../lambda/api-batch-upload-simple/MULTIPART_MIGRATION.md) - 移行ガイド

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

