# タイムスタンプ削除の変更まとめ

## 📋 変更概要

S3パス構造からタイムスタンプを削除し、シンプルな構造に変更しました。

**対象**:
- ✅ サービスファイル（入力/出力/一時ファイル）
- ✅ サポートリクエストファイル（リクエスト/リプライ）

## 🔄 変更前 vs 変更後

### S3パス構造

#### Before（タイムスタンプあり）
```
# サービスファイル
service/input/{customerId}/{processingHistoryId}/20251016_145932_icon.png
service/output/{customerId}/{processingHistoryId}/20251016_145932_icon.png
service/temp/{customerId}/{processingHistoryId}/{stepName}/20251016_145932_icon.png

# サポートファイル
support/{customerId}/{supportRequestId}/request/20251016_150000_screenshot.png
support/{customerId}/{supportRequestId}/reply/{replyId}/20251016_150100_solution.pdf
```

#### After（タイムスタンプなし） ✅
```
# サービスファイル
service/input/{customerId}/{processingHistoryId}/icon.png
service/output/{customerId}/{processingHistoryId}/icon.png
service/temp/{customerId}/{processingHistoryId}/{stepName}/icon.png

# サポートファイル
support/{customerId}/{supportRequestId}/request/screenshot.png
support/{customerId}/{supportRequestId}/reply/{replyId}/solution.pdf
```

---

## 🎯 変更理由

### ✅ タイムスタンプが不要な理由

#### サービスファイル

1. **`processingHistoryId`で一意性が保証される**
   - 各アップロードで`crypto.randomUUID()`で生成
   - 異なるアップロードは必ず異なる`processingHistoryId`
   - パスが完全に分離される

2. **ファイル名の衝突が起こらない**
   - 同じ`processingHistoryId`内では、同じファイル名は同じファイル
   - 異なる`processingHistoryId`なら、ディレクトリが異なる

#### サポートファイル

1. **`supportRequestId`と`replyId`で一意性が保証される**
   - `supportRequestId`: サポートリクエストごとにUUIDで生成
   - `replyId`: リプライごとにUUIDで生成
   - 異なるrequest/replyは必ず異なるディレクトリ

2. **ファイル名の衝突が起こらない**
   - 同じリクエスト内では、同じファイル名は同じファイル（上書き）
   - 異なるリクエスト/リプライなら、ディレクトリが異なる

#### 共通のメリット

- **シンプル**: ファイル名がそのまま
- **可読性**: S3コンソールで見やすい
- **追跡性**: 元のファイル名が保持される
- **API**: 返り値がシンプル（元のファイル名 = S3上のファイル名）

---

## 📝 変更されたファイル

### 1. **TypeScript/React（フロントエンド）**

#### `app/lib/actions/file-upload-api.ts`

##### 変更1: サービスファイル用の関数
- **変更箇所**: `generateServiceS3Key` 関数
- **変更内容**: タイムスタンプ生成を削除、元のファイル名を直接使用

```typescript
// Before
const timestamp = generateTimestamp();
const fileNameWithTimestamp = `${timestamp}_${sanitizedFileName}`;
return `service/${input.fileType}/${input.customerId}/${input.processingHistoryId}/${fileNameWithTimestamp}`;

// After
const sanitizedFileName = sanitizeFileName(fileName);
return `service/${input.fileType}/${input.customerId}/${input.processingHistoryId}/${sanitizedFileName}`;
```

##### 変更2: サポートファイル用の関数
- **変更箇所**: `uploadFileToS3` 関数
- **変更内容**: タイムスタンプ生成を削除、元のファイル名を直接使用

```typescript
// Before
const timestamp = generateTimestamp();
const fileNameWithTimestamp = `${timestamp}_${sanitizedFileName}`;
if (input.context === 'reply' && input.replyId) {
  fileKey = `support/${input.customerId}/${supportRequestId}/reply/${input.replyId}/${fileNameWithTimestamp}`;
} else {
  fileKey = `support/${input.customerId}/${supportRequestId}/request/${fileNameWithTimestamp}`;
}

// After
const sanitizedFileName = sanitizeFileName(input.file.name);
if (input.context === 'reply' && input.replyId) {
  fileKey = `support/${input.customerId}/${supportRequestId}/reply/${input.replyId}/${sanitizedFileName}`;
} else {
  fileKey = `support/${input.customerId}/${supportRequestId}/request/${sanitizedFileName}`;
}
```

##### 変更3: インポート
- **変更内容**: 不要な`generateTimestamp`のインポートを削除

```typescript
// Before
import { sanitizeFileName, generateTimestamp } from '@/app/lib/utils/s3-utils';

// After
import { sanitizeFileName } from '@/app/lib/utils/s3-utils';
```

#### 返り値の`UploadFileResult`
- `fileName`: 元のファイル名（タイムスタンプなし）
- `fileKey`: S3キー（タイムスタンプなし）

---

### 2. **Python（Lambda）**

#### `lambda/trigger-parent-stepfunction/handler.py`
- **変更箇所**: `validate_s3_key` 関数
- **変更内容**: パス構造のコメント更新、`fileName`を返り値に追加

```python
# Before
# 期待されるパス: service/input/{customerId}/{processingHistoryId}/{timestamp}_{fileName}

# After
# 期待されるパス:
#   service/input/{customerId}/{processingHistoryId}/{fileName}
#   service/output/{customerId}/{processingHistoryId}/{fileName}
#   service/temp/{customerId}/{processingHistoryId}/{stepName}/{fileName}
# 注: タイムスタンプなし (processingHistoryIdで一意性が保証される)
```

#### `lambda/test-copy-file/handler.py`
- **変更箇所**: ドキュメントコメント
- **変更内容**: S3パス構造のコメント更新

---

### 3. **Step Functions（ASL）**

#### `stepfunctions/child/TestCopyStateMachine.asl.json`
- **変更箇所**: `CopyFileToOutput` State
- **変更内容**: コメント追加

```json
{
  "CopyFileToOutput": {
    "Type": "Task",
    "Comment": "ファイルをコピー (タイムスタンプなし: processingHistoryIdで一意性保証)",
    ...
  }
}
```

---

### 4. **ドキュメント**

#### `docs/SERVICE_FILE_UPLOAD_ARCHITECTURE.md`
- S3パス構造の説明を更新
- タイムスタンプ削除の理由を追加

#### `docs/S3_CUSTOMER_ID_PATH_REVIEW.md`
- 現在のS3パス構造を更新

#### `docs/TIMESTAMP_REMOVAL_SUMMARY.md` (このファイル)
- 変更のまとめドキュメントを新規作成

---

## 🧪 テスト方法

### 1. **ファイルアップロードテスト**

```bash
# UIからファイルをアップロード
# S3パスを確認
aws s3 ls s3://siftbeam/service/input/cus_TEST123/
```

**期待される結果**:
```
service/input/cus_TEST123/<processing-history-id>/icon.png
```

**確認ポイント**:
- ✅ タイムスタンプが含まれていない
- ✅ 元のファイル名がそのまま保持されている

---

### 2. **同じファイル名の複数アップロードテスト**

```bash
# 1回目のアップロード
curl -X POST /api/upload -F "file=@test.png"
# -> service/input/{customerId}/{processingHistoryId-1}/test.png

# 2回目のアップロード（同じファイル名）
curl -X POST /api/upload -F "file=@test.png"
# -> service/input/{customerId}/{processingHistoryId-2}/test.png
```

**確認ポイント**:
- ✅ 異なる`processingHistoryId`により、別ディレクトリに保存される
- ✅ ファイル名が衝突しない

---

### 3. **Lambda & Step Functionsテスト**

```bash
# S3にファイルをアップロード（メタデータ付き）
aws s3api put-object \
  --bucket siftbeam \
  --key "service/input/cus_TEST/test-history-123/test.png" \
  --body test.png \
  --metadata "customerId=cus_TEST,userId=user-1,policyId=policy-1,processingHistoryId=test-history-123,fileType=input,triggerStepFunction=true"

# Lambda呼び出しを確認
aws logs tail /aws/lambda/TriggerParentStepFunction --follow

# Step Function実行を確認
aws stepfunctions list-executions --state-machine-arn <arn>
```

**確認ポイント**:
- ✅ Lambda がS3キーを正しくパースできる
- ✅ Step Function がファイル名を正しく処理できる

---

## 🚨 影響範囲

### ✅ 影響なし

以下のコンポーネントは**変更不要**:

1. **`ServiceFileUploader.tsx`**
   - `uploadServiceFileToS3`の返り値(`fileKey`, `fileName`)をそのまま使用
   - `uploadedFileKeys`に保存されるのは元のファイル名

2. **`ServicePresentation.tsx`**
   - 処理履歴の表示に影響なし

3. **`processing-history-api.ts`**
   - DynamoDB のデータ構造は変更なし
   - `uploadedFileKeys`には元のファイル名が保存される

4. **既存のS3ファイル**
   - 過去にアップロードされたファイル（タイムスタンプ付き）は影響を受けない
   - 新規アップロードのみタイムスタンプなし

---

## 📊 データフロー

### アップロードフロー

```
1. ユーザーがファイル選択: "icon.png"
   ↓
2. ServiceFileUploader
   - processingHistoryId生成: "abc-123-def-456"
   ↓
3. uploadServiceFileToS3
   - S3キー生成: "service/input/cus_TEST/abc-123-def-456/icon.png"
   - S3にアップロード
   - 返り値: { fileKey: "service/input/...", fileName: "icon.png" }
   ↓
4. createProcessingHistory
   - uploadedFileKeys: ["icon.png"]
   - DynamoDBに保存
   ↓
5. S3イベント → Lambda → Step Function
   - S3キー: "service/input/cus_TEST/abc-123-def-456/icon.png"
   - Lambda: validate_s3_key() → fileName: "icon.png"
   - Step Function: 処理実行
```

---

## 🔍 変更の検証

### チェックリスト

- [x] `file-upload-api.ts`のタイムスタンプ削除
- [x] `handler.py` (TriggerParentStepFunction) のパース処理更新
- [x] `handler.py` (TestCopyFile) のコメント更新
- [x] `TestCopyStateMachine.asl.json`のコメント更新
- [x] ドキュメント更新
  - [x] `SERVICE_FILE_UPLOAD_ARCHITECTURE.md`
  - [x] `S3_CUSTOMER_ID_PATH_REVIEW.md`
  - [x] `TIMESTAMP_REMOVAL_SUMMARY.md` (新規)

### 動作確認

- [ ] UIからファイルアップロード → S3パス確認
- [ ] 同じファイル名を複数回アップロード → 衝突しないことを確認
- [ ] Lambda呼び出し → CloudWatch Logsでパース処理確認
- [ ] Step Function実行 → 正常に処理されることを確認
- [ ] 処理履歴表示 → ファイル名が正しく表示されることを確認

---

## 📌 注意事項

### 1. **既存データとの互換性**

- **問題なし**: 過去のタイムスタンプ付きファイルは影響を受けない
- 新規アップロードのみ新しいパス構造を使用

### 2. **ファイル名の衝突**

- **現在の設計では問題なし**:
  - 各アップロードで新しい`processingHistoryId`が生成される
  - 同じファイル名でも別ディレクトリに保存

- **将来的に注意が必要な場合**:
  - 同じ`processingHistoryId`内で追加アップロード機能を追加する場合
  - その場合は、タイムスタンプを再導入するか、別の一意化手法を検討

### 3. **ファイル名のサニタイゼーション**

- `sanitizeFileName`で危険な文字を除去
- スペース、特殊文字などを安全な形式に変換

---

## 🎉 期待される効果

### 1. **可読性の向上**

S3コンソールでファイルを確認する際、一目で元のファイル名が分かる:

```
# Before
20251016_145932_user_profile.png
20251016_145933_company_logo.png

# After
user_profile.png
company_logo.png
```

### 2. **デバッグの簡素化**

CloudWatch Logsやエラーメッセージで、元のファイル名がそのまま表示される。

### 3. **コードのシンプル化**

- タイムスタンプ生成ロジックが不要
- APIの返り値がシンプル
- ファイル名の変換処理が不要

---

## 🔗 関連ドキュメント

- [サービスファイルアップロードアーキテクチャ](./SERVICE_FILE_UPLOAD_ARCHITECTURE.md)
- [S3パス設計レビュー](./S3_CUSTOMER_ID_PATH_REVIEW.md)
- [子Step Functionテストセットアップ](./CHILD_STEPFUNCTION_TEST_SETUP.md)

---

**更新日**: 2025-10-16
**バージョン**: 1.0.0

