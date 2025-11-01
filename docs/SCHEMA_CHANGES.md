# ProcessingHistory スキーマ変更

## 変更内容

### 削除したフィールド

- ❌ `fileSizeBytes` - `usageAmountBytes`と重複していたため削除

### 理由

`fileSizeBytes`と`usageAmountBytes`は同じ値（アップロードされたファイルの合計サイズ）を保持していました。データの重複を避けるため、`usageAmountBytes`のみを使用することにしました。

## 最終スキーマ

```typescript
export interface ProcessingHistory {
  'processing-historyId': string;
  userId: string;
  userName: string;
  customerId: string;
  policyId: string;
  policyName: string;
  usageAmountBytes: number;  // ← これのみ使用（ファイルサイズの合計）
  status: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed';
  downloadS3Keys: string[];
  uploadedFileKeys: string[];
  aiTrainingUsage: 'allow' | 'deny';
  errorDetail?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

## 影響範囲

### 修正したファイル

1. ✅ `app/lib/actions/processing-history-api.ts`
   - `ProcessingHistory`インターフェースから`fileSizeBytes`を削除
   - `CreateProcessingHistoryInput`インターフェースから`fileSizeBytes`を削除
   - `createProcessingHistory`関数から`fileSizeBytes`の設定を削除

2. ✅ `app/_containers/Service/ServiceFileUploader.tsx`
   - `createProcessingHistory`呼び出しから`fileSizeBytes: 0`を削除

3. ✅ `lambda/s3-event-handler/handler.py`
   - `fileSizeBytes`の更新処理を削除
   - `usageAmountBytes`のみを更新

4. ✅ `lambda/api-batch-upload/handler.py`
   - 処理履歴作成時に`fileSizeBytes: 0`を削除

5. ✅ `lambda/api-batch-upload-simple/handler.py`
   - 処理履歴作成時に`fileSizeBytes: 0`を削除

## DynamoDB移行

既存のDynamoDBレコードに`fileSizeBytes`が存在する場合がありますが、以下の理由で問題ありません:

1. **読み取り**: TypeScriptインターフェースで`fileSizeBytes`を削除しても、DynamoDBから読み取る際に無視されるだけ
2. **書き込み**: 新しいレコードには`fileSizeBytes`が含まれない
3. **互換性**: `usageAmountBytes`は常に存在するため、既存のコードは動作し続ける

### 必要に応じて実行する移行スクリプト（オプション）

既存のレコードから`fileSizeBytes`を削除したい場合:

```python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('siftbeam-processing-history')

# すべてのレコードをスキャン
response = table.scan()
items = response['Items']

for item in items:
    if 'fileSizeBytes' in item:
        # fileSizeBytesを削除
        table.update_item(
            Key={'processing-historyId': item['processing-historyId']},
            UpdateExpression='REMOVE fileSizeBytes'
        )
        print(f"Removed fileSizeBytes from {item['processing-historyId']}")
```

**注意**: このスクリプトは必須ではありません。既存の`fileSizeBytes`フィールドは害を及ぼしません。

