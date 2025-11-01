# Presigned URL方式でのファイルサイズ計算

## 📋 問題点

### ❌ 当初の設計

```
クライアント
  ↓ リクエスト: {"files": [{"fileName": "file.pdf", "fileSize": 1048576}]}
  
Lambda: 署名付きURL生成
  ↓ トリガーファイル作成: {"usageAmountBytes": 1048576}
  
クライアント
  ↓ PUT _trigger.json
  
S3イベントLambda
  ↓ トリガーファイル読み取り
  ↓ usageAmountBytes = 1048576 で更新
```

**問題**:
1. クライアント側でファイルサイズを取得できない場合がある
2. クライアントが誤ったサイズを送信する可能性
3. 実際にアップロードされたファイルサイズと不一致

---

## ✅ 改善後の設計

### 方式: **S3イベントLambdaで実際のファイルサイズを計算**

```
クライアント
  ↓ リクエスト: {"files": [{"fileName": "file.pdf"}]}
  ↓ (ファイルサイズ不要)
  
Lambda: 署名付きURL生成
  ↓ トリガーファイル作成: {"usageAmountBytes": 0, "uploadedFileKeys": [...]}
  
クライアント
  ↓ PUT file.pdf (実際のサイズ: 1,048,576 bytes)
  ↓ PUT _trigger.json
  
S3イベントLambda
  ↓ トリガーファイル読み取り
  ↓ uploadedFileKeys からファイルサイズを取得
  ├─ file.pdf → 1,048,576 bytes
  ├─ file2.pdf → 2,097,152 bytes
  └─ 合計: 3,145,728 bytes
  ↓ usageAmountBytes = 3,145,728 で更新 ✅
```

---

## 🔧 実装詳細

### S3イベントLambda (`s3-event-handler/handler.py`)

```python
# トリガーファイルから値を取得
uploaded_file_keys = trigger_data.get('uploadedFileKeys', [])

# 実際のファイルサイズを計算（S3から取得）
total_size = 0
for file_key in uploaded_file_keys:
    try:
        head_response = s3_client.head_object(Bucket=bucket_name, Key=file_key)
        file_size = head_response.get('ContentLength', 0)
        total_size += file_size
        print(f"File: {file_key}, Size: {file_size} bytes")
    except Exception as e:
        print(f"Warning: Could not get size for {file_key}: {str(e)}")
        # ファイルが見つからない場合でも処理を継続

print(f"Total calculated size: {total_size} bytes")

# ProcessingHistoryを更新（実際のファイルサイズを使用）
table.update_item(
    Key={'processing-historyId': processing_history_id},
    UpdateExpression="SET usageAmountBytes = :usageAmountBytes, updatedAt = :updatedAt, #status = :status",
    ExpressionAttributeValues={
        ':usageAmountBytes': total_size,
        ':updatedAt': now,
        ':status': 'in_progress'
    },
    ExpressionAttributeNames={
        '#status': 'status'
    }
)
```

---

## 🎯 メリット

### 1. **正確性**

- ✅ S3に実際にアップロードされたファイルサイズを使用
- ✅ クライアント側の誤った情報に依存しない
- ✅ ファイルが圧縮/変換されても正確

### 2. **シンプルさ**

- ✅ クライアント側でファイルサイズを取得する必要なし
- ✅ リクエストボディがシンプル
- ✅ エラーハンドリングが容易

### 3. **セキュリティ**

- ✅ クライアントが偽のサイズを送信できない
- ✅ 実際の使用量を正確に課金可能

---

## 📊 処理フロー

### ステップ1: 署名付きURL生成

```json
// リクエスト
{
  "files": [
    {"fileName": "file1.pdf"},
    {"fileName": "file2.pdf"}
  ]
}

// レスポンス
{
  "success": true,
  "data": {
    "processingHistoryId": "xxx-xxx-xxx",
    "uploadUrls": [...],
    "triggerUrl": "https://s3.amazonaws.com/.../_trigger.json",
    "triggerContent": {
      "uploadedFileKeys": [
        "service/input/.../file1.pdf",
        "service/input/.../file2.pdf"
      ],
      "usageAmountBytes": 0,  // ← 0で初期化
      "fileCount": 2
    }
  }
}
```

### ステップ2: ファイルアップロード

```
PUT https://s3.amazonaws.com/.../file1.pdf
  ↓ S3に保存 (ContentLength: 1,048,576 bytes)

PUT https://s3.amazonaws.com/.../file2.pdf
  ↓ S3に保存 (ContentLength: 2,097,152 bytes)
```

### ステップ3: トリガーファイルアップロード

```
PUT https://s3.amazonaws.com/.../_trigger.json
Body: {
  "uploadedFileKeys": [
    "service/input/.../file1.pdf",
    "service/input/.../file2.pdf"
  ],
  "usageAmountBytes": 0,
  "fileCount": 2
}
```

### ステップ4: S3イベントLambda処理

```
S3イベント → Lambda
  ↓
1. トリガーファイル読み取り
  ├─ uploadedFileKeys: ["file1.pdf", "file2.pdf"]
  └─ usageAmountBytes: 0
  
2. 実際のファイルサイズを取得
  ├─ HEAD file1.pdf → ContentLength: 1,048,576 bytes
  ├─ HEAD file2.pdf → ContentLength: 2,097,152 bytes
  └─ 合計: 3,145,728 bytes
  
3. DynamoDB更新
  ├─ usageAmountBytes: 3,145,728
  └─ status: in_progress
  
4. Step Functions起動
```

---

## 🔍 エラーハンドリング

### ケース1: ファイルが見つからない

```python
try:
    head_response = s3_client.head_object(Bucket=bucket_name, Key=file_key)
    file_size = head_response.get('ContentLength', 0)
    total_size += file_size
except Exception as e:
    print(f"Warning: Could not get size for {file_key}: {str(e)}")
    # ファイルが見つからない場合でも処理を継続
    # total_size には加算されない
```

**結果**:
- 見つかったファイルのサイズのみ合計
- エラーログを出力
- Step Functions は起動（エラーは Step Functions 内で処理）

### ケース2: 一部のファイルのみアップロード

```
uploadedFileKeys: ["file1.pdf", "file2.pdf", "file3.pdf"]

実際のアップロード:
  ✅ file1.pdf → 1,048,576 bytes
  ✅ file2.pdf → 2,097,152 bytes
  ❌ file3.pdf → 見つからない

結果:
  usageAmountBytes = 3,145,728 (file1 + file2)
  fileCount = 3 (期待値)
  実際のファイル数 = 2
  
  → Step Functions で不整合を検出
```

---

## 📈 パフォーマンス

### HEAD リクエストのコスト

```
ファイル数: 10個
HEAD リクエスト: 10回

コスト:
  - S3 HEAD リクエスト: $0.0004 / 1,000 リクエスト
  - 10回 = $0.000004 (約0.0004円)
  
Lambda実行時間:
  - HEAD リクエスト: 約50ms/ファイル
  - 10ファイル: 約500ms
  - 追加コスト: ほぼ無視できる
```

**結論**: コストとパフォーマンスへの影響は無視できるレベル

---

## 🆚 代替案との比較

### 方式A: クライアントがファイルサイズを送信

```
メリット:
  - Lambda実行時間が短い

デメリット:
  ❌ クライアント側でファイルサイズを取得できない場合がある
  ❌ クライアントが誤った情報を送信する可能性
  ❌ 実際のサイズと不一致のリスク
```

### 方式B: S3イベントLambdaで計算 (採用)

```
メリット:
  ✅ 正確なファイルサイズを保証
  ✅ クライアント実装がシンプル
  ✅ セキュリティが高い

デメリット:
  - Lambda実行時間が若干増加 (約500ms/10ファイル)
  - HEAD リクエストのコスト (無視できるレベル)
```

### 方式C: 各ファイルアップロード時にS3イベント

```
メリット:
  - リアルタイムでサイズを計算

デメリット:
  ❌ S3イベントが複数回発火
  ❌ Lambda実行回数が増加
  ❌ トリガーファイルの役割が不明確
  ❌ 無限ループのリスク
```

---

## 🎯 まとめ

### 採用した方式

**S3イベントLambdaで実際のファイルサイズを計算**

### 理由

1. ✅ **正確性**: S3に保存された実際のサイズを使用
2. ✅ **シンプルさ**: クライアント実装が簡単
3. ✅ **セキュリティ**: クライアントの偽装を防止
4. ✅ **コスト**: パフォーマンスへの影響は無視できる
5. ✅ **保守性**: エラーハンドリングが容易

### トレードオフ

- Lambda実行時間: +500ms/10ファイル (許容範囲)
- HEAD リクエストコスト: $0.000004/10ファイル (無視できる)

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

