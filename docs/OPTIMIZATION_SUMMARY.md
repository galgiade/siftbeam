# 最適化サマリー

## 🎯 実施した最適化

### 1. **S3イベント通知の最適化**

#### 変更前
```
すべてのファイルアップロードでLambda起動
→ ファイル数 × Lambda起動
→ ファイル数 × DynamoDB書き込み
```

#### 変更後
```
トリガーファイル(_trigger.json)のみでLambda起動
→ 常に1回のLambda起動
→ 1回のDynamoDB書き込み
```

### 2. **スキーマの簡素化**

#### 削除したフィールド
- ❌ `fileSizeBytes` - `usageAmountBytes`と重複

#### 理由
同じ値（アップロードファイルの合計サイズ）を2つのフィールドで保持していたため、`usageAmountBytes`のみに統一。

---

## 📊 パフォーマンス改善

### Lambda起動回数の削減

| ファイル数 | 変更前 | 変更後 | 削減率 |
|-----------|--------|--------|--------|
| 1 | 2回 | 1回 | **50%** |
| 2 | 3回 | 1回 | **67%** |
| 5 | 6回 | 1回 | **83%** |
| 10 | 11回 | 1回 | **91%** |
| 100 | 101回 | 1回 | **99%** |

### DynamoDB書き込み回数の削減

| ファイル数 | 変更前 | 変更後 | 削減率 |
|-----------|--------|--------|--------|
| 1 | 2回 | 1回 | **50%** |
| 2 | 3回 | 1回 | **67%** |
| 5 | 6回 | 1回 | **83%** |
| 10 | 11回 | 1回 | **91%** |
| 100 | 101回 | 1回 | **99%** |

### コスト削減の試算

#### Lambda実行コスト（例: 5ファイルアップロード）

**変更前:**
- Lambda起動: 6回
- 実行時間: 100ms/回
- メモリ: 512MB
- コスト: 約 $0.0000125 × 6 = **$0.000075**

**変更後:**
- Lambda起動: 1回
- 実行時間: 100ms/回
- メモリ: 512MB
- コスト: 約 $0.0000125 × 1 = **$0.0000125**

**削減額**: 約 **83%削減**

#### DynamoDB書き込みコスト（例: 5ファイルアップロード）

**変更前:**
- 書き込み回数: 6回
- コスト: $0.00000125 × 6 = **$0.0000075**

**変更後:**
- 書き込み回数: 1回
- コスト: $0.00000125 × 1 = **$0.00000125**

**削減額**: 約 **83%削減**

---

## 🔧 実装の変更点

### 1. S3イベントLambda (`s3-event-handler/handler.py`)

#### 変更前
```python
# すべてのファイルで起動
if not is_trigger_file:
    # 個別ファイルのサイズを累積加算
    new_usage = current_usage + content_length
    table.update_item(...)
else:
    # トリガーファイルでStep Functions起動
    sfn_client.start_execution(...)
```

#### 変更後
```python
# トリガーファイルのみで起動
if not is_trigger_file:
    # 通常ファイルは無視（S3イベント設定で除外されるべき）
    print(f"Warning: Non-trigger file detected")
    return None

# トリガーファイルの内容を読み取り
trigger_data = json.loads(trigger_obj['Body'].read())

# トリガーファイルの情報でusageAmountBytesを更新
table.update_item(
    UpdateExpression="SET usageAmountBytes = :usage",
    ExpressionAttributeValues={
        ':usage': trigger_data['expectedTotalSize']
    }
)

# Step Functions起動
sfn_client.start_execution(input=json.dumps(trigger_data))
```

### 2. ProcessingHistory スキーマ

#### 変更前
```typescript
{
  usageAmountBytes: number;  // ファイルサイズの合計
  fileSizeBytes?: number;    // ❌ 重複
}
```

#### 変更後
```typescript
{
  usageAmountBytes: number;  // ファイルサイズの合計
  // fileSizeBytes削除
}
```

---

## 📋 必要な設定

### S3イベント通知の設定

**AWS Management Console:**
1. S3バケット → プロパティ → イベント通知
2. イベント名: `TriggerFileProcessing`
3. サフィックス: `_trigger.json` ⭐
4. イベントタイプ: すべてのオブジェクト作成イベント
5. 送信先: Lambda関数 `s3-event-handler`

**AWS CLI:**
```bash
aws s3api put-bucket-notification-configuration \
  --bucket siftbeam \
  --notification-configuration file://s3-notification.json
```

詳細は `S3_EVENT_CONFIGURATION.md` を参照。

---

## ✅ 検証方法

### 1. 通常ファイルのアップロード

```bash
aws s3 cp test.txt s3://siftbeam/service/input/customer/id/test.txt
```

**期待される動作:**
- Lambda起動なし
- CloudWatch Logsに記録なし

### 2. トリガーファイルのアップロード

```bash
aws s3 cp _trigger.json s3://siftbeam/service/input/customer/id/_trigger.json
```

**期待される動作:**
- Lambda起動あり
- CloudWatch Logsに以下が記録される:
  ```
  Processing trigger file: s3://siftbeam/.../_trigger.json
  Trigger file content: {...}
  Processing history updated: usageAmountBytes = 2048000 bytes
  Step Functions execution started: arn:aws:states:...
  ```

### 3. CloudWatch Logsで確認

```bash
aws logs tail /aws/lambda/s3-event-handler --follow
```

---

## 🎉 メリット

1. ✅ **Lambda起動回数が大幅に削減** (最大99%削減)
2. ✅ **DynamoDB書き込み回数が大幅に削減** (最大99%削減)
3. ✅ **コストが大幅に削減** (Lambda + DynamoDB)
4. ✅ **シンプルな設計** (トリガーファイルのみを処理)
5. ✅ **スキーマの簡素化** (`fileSizeBytes`削除)
6. ✅ **保守性の向上** (処理ロジックがシンプルに)

---

## 📁 更新したファイル

### コード
1. ✅ `lambda/s3-event-handler/handler.py` - トリガーファイルのみを処理
2. ✅ `app/lib/actions/processing-history-api.ts` - `fileSizeBytes`削除
3. ✅ `app/_containers/Service/ServiceFileUploader.tsx` - `fileSizeBytes`削除
4. ✅ `lambda/api-batch-upload/handler.py` - `fileSizeBytes`削除
5. ✅ `lambda/api-batch-upload-simple/handler.py` - `fileSizeBytes`削除

### ドキュメント
1. ✅ `docs/S3_EVENT_CONFIGURATION.md` - S3イベント設定ガイド
2. ✅ `docs/SCHEMA_CHANGES.md` - スキーマ変更ドキュメント
3. ✅ `docs/OPTIMIZATION_SUMMARY.md` - この最適化サマリー

---

## 🚀 次のステップ

1. **S3イベント通知を設定**
   - AWS Management ConsoleまたはCLIで設定
   - `suffix="_trigger.json"`を必ず設定

2. **動作確認**
   - 通常ファイルをアップロード → Lambda起動なし
   - トリガーファイルをアップロード → Lambda起動あり

3. **モニタリング**
   - CloudWatch Logsで確認
   - Lambda起動回数を確認
   - DynamoDB書き込み回数を確認

4. **既存データの移行（オプション）**
   - 既存のProcessingHistoryレコードから`fileSizeBytes`を削除
   - 詳細は `SCHEMA_CHANGES.md` を参照

---

## 📈 長期的な効果

### 月間コスト削減の試算

**前提条件:**
- 1日あたり1,000回のアップロード
- 平均5ファイル/回
- 月間30日

**変更前:**
- Lambda起動: 1,000 × 6 × 30 = 180,000回/月
- DynamoDB書き込み: 180,000回/月
- 月間コスト: 約 $2.25

**変更後:**
- Lambda起動: 1,000 × 1 × 30 = 30,000回/月
- DynamoDB書き込み: 30,000回/月
- 月間コスト: 約 $0.38

**削減額**: 約 **$1.87/月** (約83%削減)

年間では約 **$22.44の削減**!

---

すべての最適化が完了しました! 🎉

