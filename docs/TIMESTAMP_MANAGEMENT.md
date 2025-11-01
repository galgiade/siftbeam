# タイムスタンプ管理ガイド

## 📋 問題点

### ❌ 以前の実装

#### タイムライン

```
1. クライアント (日本時間 15:00:00)
   ↓ POST /generate-upload-urls
   ↓ createdAt: "2025-10-30T06:00:00Z" (UTC)
   
2. Lambda: 署名付きURL生成 (UTC 06:00:00)
   ↓ DynamoDB作成
   ↓ createdAt: "2025-10-30T06:00:00Z"
   
3. クライアント (日本時間 15:00:05)
   ↓ ファイルアップロード (5秒後)
   ↓ PUT _trigger.json
   
4. S3イベントLambda (UTC 06:00:05)
   ↓ Step Functions起動
   
5. Step Functions (UTC 06:00:10)
   ↓ 処理完了
   ↓ updatedAt: "2025-10-30T06:00:10Z"
   ↓ completedAt: "2025-10-30T06:00:10Z"
```

#### 問題

```
処理時間 = updatedAt - createdAt
         = 06:00:10 - 06:00:00
         = 10秒 ✅

しかし、実際の表示では:
  createdAt: 2025-10-30T06:00:00Z
  updatedAt: 2025-10-30T05:59:52Z  ← なぜか過去!?
  処理時間: -8秒 ❌
```

**原因**:
- クライアントとサーバーの時刻のずれ
- Lambda実行環境の時刻のずれ
- Step Functionsの時刻のずれ
- タイムゾーンの変換ミス

---

## ✅ 改善後の実装

### 🎯 基本方針

**すべてのタイムスタンプをサーバー側（AWS）で管理**

#### タイムライン

```
1. クライアント
   ↓ POST /generate-upload-urls
   
2. Lambda: 署名付きURL生成 (UTC 06:00:00)
   ↓ DynamoDB作成
   ↓ createdAt: "2025-10-30T06:00:00Z" (仮の値)
   ↓ status: "pending"
   
3. クライアント
   ↓ ファイルアップロード
   ↓ PUT _trigger.json
   
4. S3イベントLambda (UTC 06:00:05) ← 実際のアップロード完了時刻
   ↓ createdAt を現在時刻に更新 ✅
   ↓ createdAt: "2025-10-30T06:00:05Z"
   ↓ updatedAt: "2025-10-30T06:00:05Z"
   ↓ status: "in_progress"
   ↓ Step Functions起動
   
5. Step Functions (UTC 06:00:10)
   ↓ 処理完了
   ↓ updatedAt: "2025-10-30T06:00:10Z"
   ↓ completedAt: "2025-10-30T06:00:10Z"
   ↓ status: "success"
```

#### 結果

```
処理時間 = completedAt - createdAt
         = 06:00:10 - 06:00:05
         = 5秒 ✅

表示:
  開始時刻: 2025-10-30T06:00:05Z
  完了時刻: 2025-10-30T06:00:10Z
  処理時間: 5秒 ✅
```

---

## 🔧 実装詳細

### 1️⃣ **署名付きURL生成Lambda**

```python
# 処理履歴を作成
now = datetime.utcnow().isoformat() + 'Z'
processing_history = {
    'processing-historyId': processing_history_id,
    'userId': api_key_id,
    'userName': api_key_info['apiName'],
    'customerId': customer_id,
    'policyId': policy_id,
    'policyName': policy_info['policyName'],
    'usageAmountBytes': 0,  # S3イベントLambdaで更新
    'status': 'pending',    # アップロード待ち
    'downloadS3Keys': [],
    'uploadedFileKeys': uploaded_file_keys,
    'aiTrainingUsage': 'allow',
    'createdAt': now,       # 仮の値（後で更新される）
    'updatedAt': now
}

table.put_item(Item=processing_history)
```

**ポイント**:
- `createdAt` は仮の値
- `status` は `pending` (アップロード待ち)

---

### 2️⃣ **S3イベントLambda**

```python
# ProcessingHistoryを更新
now = datetime.utcnow().isoformat() + 'Z'

update_expression = "SET usageAmountBytes = :usageAmountBytes, createdAt = :createdAt, updatedAt = :updatedAt, #status = :status"
expression_values = {
    ':usageAmountBytes': total_size,
    ':createdAt': now,      # 実際のアップロード完了時刻
    ':updatedAt': now,
    ':status': 'in_progress'
}
expression_names = {
    '#status': 'status'
}

table.update_item(
    Key={'processing-historyId': processing_history_id},
    UpdateExpression=update_expression,
    ExpressionAttributeValues=expression_values,
    ExpressionAttributeNames=expression_names
)
```

**ポイント**:
- `createdAt` を現在時刻（実際のアップロード完了時刻）に更新
- `status` を `in_progress` に変更
- `usageAmountBytes` も同時に更新

---

### 3️⃣ **Step Functions (子ステートマシン)**

```json
{
  "Type": "Task",
  "Resource": "arn:aws:states:::dynamodb:updateItem",
  "Parameters": {
    "TableName": "siftbeam-processing-history",
    "Key": {
      "processing-historyId": {
        "S": "{% $processingHistoryId %}"
      }
    },
    "UpdateExpression": "SET downloadS3Keys = :downloadKeys, updatedAt = :updatedAt, completedAt = :completedAt, #status = :status",
    "ExpressionAttributeNames": {
      "#status": "status"
    },
    "ExpressionAttributeValues": {
      ":downloadKeys": "{% {'L': $downloadS3Keys[].{'S': $}} %}",
      ":updatedAt": {
        "S": "{% $states.context.State.EnteredTime %}"
      },
      ":completedAt": {
        "S": "{% $states.context.State.EnteredTime %}"
      },
      ":status": {
        "S": "success"
      }
    }
  }
}
```

**ポイント**:
- `updatedAt` と `completedAt` を Step Functions の実行時刻に設定
- `$states.context.State.EnteredTime` を使用

---

## 📊 タイムスタンプの意味

### DynamoDBフィールド

| フィールド | 意味 | 設定タイミング | 設定場所 |
|-----------|------|--------------|---------|
| `createdAt` | **実際のアップロード完了時刻** | トリガーファイルアップロード時 | S3イベントLambda |
| `updatedAt` | 最終更新時刻 | 各更新時 | 各Lambda/Step Functions |
| `completedAt` | 処理完了時刻 | 処理完了時 | Step Functions |

### ステータスと時刻の関係

```
pending (アップロード待ち)
  ↓ createdAt: 仮の値
  
in_progress (処理中)
  ↓ createdAt: 実際のアップロード完了時刻 ✅
  ↓ updatedAt: 同上
  
success/failed (完了)
  ↓ completedAt: 処理完了時刻
  ↓ updatedAt: 同上
```

---

## 🎯 処理時間の計算

### フロントエンド表示

```typescript
// 開始時刻のみ表示（処理時間は表示しない）
const startTime = new Date(processingHistory.createdAt);

// 表示
<TableCell>
  <div className="text-sm">
    {formatDate(processingHistory.createdAt)}
  </div>
</TableCell>
```

**理由**:
- 処理時間は数秒〜数十秒の誤差が生じる可能性
- ユーザーに不信感を与える可能性
- 開始時刻のみ表示することで、シンプルで正確

---

## 🔍 時刻の整合性チェック

### 正常なケース

```
createdAt:   2025-10-30T06:00:05Z
updatedAt:   2025-10-30T06:00:10Z
completedAt: 2025-10-30T06:00:10Z

検証:
  ✅ createdAt <= updatedAt
  ✅ createdAt <= completedAt
  ✅ updatedAt <= completedAt
```

### 異常なケース（以前の実装）

```
createdAt:   2025-10-30T06:00:00Z
updatedAt:   2025-10-30T05:59:52Z  ← 過去!?
completedAt: -

検証:
  ❌ createdAt > updatedAt (おかしい)
  
原因:
  - クライアントとサーバーの時刻のずれ
  - タイムゾーンの変換ミス
```

---

## 🧪 テストケース

### ケース1: 正常なアップロード

```
1. POST /generate-upload-urls (06:00:00)
   → createdAt: 06:00:00 (仮)
   → status: pending

2. PUT _trigger.json (06:00:05)
   → S3イベントLambda起動
   → createdAt: 06:00:05 (実際の時刻) ✅
   → updatedAt: 06:00:05
   → status: in_progress

3. Step Functions完了 (06:00:10)
   → updatedAt: 06:00:10
   → completedAt: 06:00:10
   → status: success

結果:
  開始時刻: 06:00:05
  完了時刻: 06:00:10
  処理時間: 5秒 ✅
```

### ケース2: 長時間のアップロード

```
1. POST /generate-upload-urls (06:00:00)
   → createdAt: 06:00:00 (仮)
   → status: pending

2. 大容量ファイルアップロード (5分かかる)

3. PUT _trigger.json (06:05:00)
   → S3イベントLambda起動
   → createdAt: 06:05:00 (実際の時刻) ✅
   → updatedAt: 06:05:00
   → status: in_progress

4. Step Functions完了 (06:05:10)
   → updatedAt: 06:05:10
   → completedAt: 06:05:10
   → status: success

結果:
  開始時刻: 06:05:00 (アップロード完了時刻)
  完了時刻: 06:05:10
  処理時間: 10秒 ✅
  
  ※ アップロード時間(5分)は含まれない
```

---

## 📚 ベストプラクティス

### 1. **すべての時刻をUTCで管理**

```python
# ✅ 正しい
now = datetime.utcnow().isoformat() + 'Z'

# ❌ 間違い
now = datetime.now().isoformat()  # ローカルタイムゾーン
```

### 2. **クライアント側の時刻を使用しない**

```typescript
// ❌ 間違い
const createdAt = new Date().toISOString();
fetch('/api/upload', {
  body: JSON.stringify({ createdAt })  // クライアントの時刻
});

// ✅ 正しい
fetch('/api/upload', {
  body: JSON.stringify({ fileName: 'file.pdf' })  // 時刻は送信しない
});
```

### 3. **Step Functionsの実行時刻を使用**

```json
// ✅ 正しい
":updatedAt": {
  "S": "{% $states.context.State.EnteredTime %}"
}

// ❌ 間違い
":updatedAt": {
  "S": "{% $now() %}"  // JSONataの$now()は使用しない
}
```

### 4. **タイムスタンプの更新は必ず同じタイミングで**

```python
# ✅ 正しい
now = datetime.utcnow().isoformat() + 'Z'
update_expression = "SET createdAt = :createdAt, updatedAt = :updatedAt, ..."
expression_values = {
    ':createdAt': now,
    ':updatedAt': now,
    ...
}

# ❌ 間違い
createdAt = datetime.utcnow().isoformat() + 'Z'
time.sleep(1)  # 1秒待機
updatedAt = datetime.utcnow().isoformat() + 'Z'  # 時刻がずれる
```

---

## 🎯 まとめ

### 改善点

1. ✅ **createdAt を S3イベントLambda で更新**
   - 実際のアップロード完了時刻を記録
   - クライアントの時刻に依存しない

2. ✅ **時差の問題を解決**
   - すべてUTCで管理
   - サーバー側で一貫して時刻を設定

3. ✅ **処理時間の計算が正確に**
   - マイナスの処理時間が発生しない
   - 数秒の誤差も最小限

4. ✅ **ユーザー体験の向上**
   - 開始時刻のみ表示
   - 不信感を与えない

### タイムライン（最終版）

```
pending → in_progress → success
  ↓          ↓            ↓
仮の値    実際の時刻    完了時刻
         (createdAt)   (completedAt)
```

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

