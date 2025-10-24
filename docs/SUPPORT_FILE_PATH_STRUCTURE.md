# サポートリクエストファイルのS3パス構造

## 📋 概要

サポートリクエストとリプライのファイルアップロードにおけるS3パス構造を定義します。

## 🔄 変更履歴

### v2.0.0 (2025-10-16) - タイムスタンプ削除

**変更理由**: `supportRequestId`と`replyId`で一意性が保証されるため、タイムスタンプは不要

---

## 📂 S3パス構造

### Before (タイムスタンプあり) - 廃止

```
support/{customerId}/{supportRequestId}/request/20251016_145932_screenshot.png
support/{customerId}/{supportRequestId}/reply/{replyId}/20251016_145933_response.pdf
```

### After (タイムスタンプなし) - 現行 ✅

```
support/{customerId}/{supportRequestId}/request/screenshot.png
support/{customerId}/{supportRequestId}/reply/{replyId}/response.pdf
```

---

## 🎯 パス構造の詳細

### 1. **リクエストファイル（初回問い合わせ）**

```
support/{customerId}/{supportRequestId}/request/{fileName}
```

**例**:
```
support/cus_ABC123/req_xyz789/request/error_screenshot.png
support/cus_ABC123/req_xyz789/request/log_file.txt
```

**説明**:
- `customerId`: 顧客ID（Stripe Customer ID）
- `supportRequestId`: サポートリクエストID（UUID）
- `fileName`: サニタイズされた元のファイル名

---

### 2. **リプライファイル（返信）**

```
support/{customerId}/{supportRequestId}/reply/{replyId}/{fileName}
```

**例**:
```
support/cus_ABC123/req_xyz789/reply/rep_001/solution_guide.pdf
support/cus_ABC123/req_xyz789/reply/rep_002/updated_config.json
```

**説明**:
- `customerId`: 顧客ID
- `supportRequestId`: サポートリクエストID
- `replyId`: リプライID（UUID）
- `fileName`: サニタイズされた元のファイル名

---

## ✅ タイムスタンプが不要な理由

### 1. **一意性が保証される**

#### リクエストファイル
- `supportRequestId`（UUID）で一意性が保証される
- 異なるリクエストは必ず異なる`supportRequestId`を持つ
- 同じリクエスト内では、同じファイル名は同じファイルを意味する

#### リプライファイル
- `replyId`（UUID）で一意性が保証される
- 異なるリプライは必ず異なる`replyId`を持つ
- 同じリプライ内では、同じファイル名は同じファイルを意味する

### 2. **ディレクトリ構造で分離**

```
support/
└── cus_ABC123/
    ├── req_xyz789/          ← リクエスト1
    │   ├── request/
    │   │   └── screenshot.png
    │   └── reply/
    │       ├── rep_001/     ← リプライ1
    │       │   └── solution.pdf
    │       └── rep_002/     ← リプライ2
    │           └── update.pdf
    └── req_abc456/          ← リクエスト2
        ├── request/
        │   └── screenshot.png  ← 同じファイル名でもOK（別ディレクトリ）
        └── reply/
            └── rep_003/
                └── solution.pdf  ← 同じファイル名でもOK（別ディレクトリ）
```

### 3. **メリット**

- **シンプル**: ファイル名がそのまま
- **可読性**: S3コンソールで見やすい
- **追跡性**: 元のファイル名が保持される
- **デバッグ**: ログやエラーメッセージで元のファイル名が表示される

---

## 🔍 ファイル名の衝突シナリオ

### シナリオ1: 同じリクエスト内で同じファイル名

```typescript
// ユーザーが同じリクエスト内で"screenshot.png"を2回アップロード
// 1回目
uploadFileToS3({ 
  file: screenshot_v1.png,
  supportRequestId: "req_xyz789",
  context: "request"
});
// -> support/cus_ABC123/req_xyz789/request/screenshot.png

// 2回目（上書き）
uploadFileToS3({ 
  file: screenshot_v2.png,
  supportRequestId: "req_xyz789",
  context: "request"
});
// -> support/cus_ABC123/req_xyz789/request/screenshot.png (上書き)
```

**結果**: 上書きされる（これは意図された動作）
- 同じリクエスト内の同じファイル名は、更新されたファイルを意味する

---

### シナリオ2: 異なるリクエストで同じファイル名

```typescript
// リクエスト1
uploadFileToS3({ 
  file: screenshot.png,
  supportRequestId: "req_xyz789",
  context: "request"
});
// -> support/cus_ABC123/req_xyz789/request/screenshot.png

// リクエスト2（別のリクエスト）
uploadFileToS3({ 
  file: screenshot.png,
  supportRequestId: "req_abc456",
  context: "request"
});
// -> support/cus_ABC123/req_abc456/request/screenshot.png
```

**結果**: 衝突しない（異なるディレクトリ）

---

### シナリオ3: 異なるリプライで同じファイル名

```typescript
// リプライ1
uploadFileToS3({ 
  file: solution.pdf,
  supportRequestId: "req_xyz789",
  replyId: "rep_001",
  context: "reply"
});
// -> support/cus_ABC123/req_xyz789/reply/rep_001/solution.pdf

// リプライ2（同じリクエストの別のリプライ）
uploadFileToS3({ 
  file: solution.pdf,
  supportRequestId: "req_xyz789",
  replyId: "rep_002",
  context: "reply"
});
// -> support/cus_ABC123/req_xyz789/reply/rep_002/solution.pdf
```

**結果**: 衝突しない（異なる`replyId`ディレクトリ）

---

## 📊 データフロー

### リクエストファイルのアップロード

```
1. ユーザーがファイル選択: "error_log.txt"
   ↓
2. サポートリクエスト作成: supportRequestId = "req_xyz789"
   ↓
3. uploadFileToS3
   - S3キー生成: "support/cus_ABC123/req_xyz789/request/error_log.txt"
   - S3にアップロード
   - 返り値: { fileKey: "support/...", fileName: "error_log.txt" }
   ↓
4. DynamoDBに保存
   - support-requests テーブル
   - attachmentS3Keys: ["support/cus_ABC123/req_xyz789/request/error_log.txt"]
```

### リプライファイルのアップロード

```
1. 管理者がファイル選択: "solution_guide.pdf"
   ↓
2. リプライ作成: replyId = "rep_001"
   ↓
3. uploadFileToS3
   - S3キー生成: "support/cus_ABC123/req_xyz789/reply/rep_001/solution_guide.pdf"
   - S3にアップロード
   - 返り値: { fileKey: "support/...", fileName: "solution_guide.pdf" }
   ↓
4. DynamoDBに保存
   - support-replies テーブル
   - attachmentS3Keys: ["support/cus_ABC123/req_xyz789/reply/rep_001/solution_guide.pdf"]
```

---

## 🔧 実装詳細

### TypeScript (file-upload-api.ts)

```typescript
export async function uploadFileToS3(input: UploadFileInput): Promise<ApiResponse<UploadFileResult>> {
  // 安全なファイル名を生成
  const sanitizedFileName = sanitizeFileName(input.file.name);
  
  // S3キーを生成（タイムスタンプなし）
  const supportRequestId = input.supportRequestId || 'unknown';
  
  let fileKey: string;
  if (input.context === 'reply' && input.replyId) {
    fileKey = `support/${input.customerId}/${supportRequestId}/reply/${input.replyId}/${sanitizedFileName}`;
  } else {
    fileKey = `support/${input.customerId}/${supportRequestId}/request/${sanitizedFileName}`;
  }
  
  // S3にアップロード
  // ...
  
  return {
    success: true,
    data: {
      fileKey,
      fileName: input.file.name,  // 元のファイル名
      fileSize: input.file.size,
      contentType: input.file.type,
      uploadedAt: new Date().toISOString()
    }
  };
}
```

---

## 📝 S3メタデータ

各ファイルには以下のメタデータが付与されます:

```typescript
Metadata: {
  originalFileName: input.file.name,
  uploadedBy: input.userId,
  customerId: input.customerId,
  supportRequestId: supportRequestId,
  uploadedAt: new Date().toISOString()
}
```

**用途**:
- `originalFileName`: 元のファイル名（サニタイズ前）
- `uploadedBy`: アップロードしたユーザーID
- `customerId`: 顧客ID
- `supportRequestId`: サポートリクエストID
- `uploadedAt`: アップロード日時（ISO8601）

---

## 🧪 テスト方法

### 1. リクエストファイルのアップロード

```bash
# UIからファイルをアップロード
# S3パスを確認
aws s3 ls s3://siftbeam/support/cus_ABC123/req_xyz789/request/

# 期待される結果
error_screenshot.png
log_file.txt
```

### 2. リプライファイルのアップロード

```bash
# 管理者UIからファイルをアップロード
# S3パスを確認
aws s3 ls s3://siftbeam/support/cus_ABC123/req_xyz789/reply/rep_001/

# 期待される結果
solution_guide.pdf
config_sample.json
```

### 3. 同じファイル名の複数アップロード

```bash
# 異なるリクエストで同じファイル名をアップロード
aws s3 ls s3://siftbeam/support/cus_ABC123/ --recursive | grep screenshot.png

# 期待される結果（異なるディレクトリに存在）
support/cus_ABC123/req_xyz789/request/screenshot.png
support/cus_ABC123/req_abc456/request/screenshot.png
```

---

## ⚠️ 注意事項

### 1. ファイルの上書き

同じ`supportRequestId`/`replyId`内で同じファイル名をアップロードすると、**上書き**されます。

**対策**:
- UIでアップロード前に警告を表示
- または、ファイル名に連番を付与（`screenshot_1.png`, `screenshot_2.png`）

### 2. ファイル名のサニタイゼーション

`sanitizeFileName`で以下の処理を実行:
- 特殊文字を除去
- スペースをアンダースコアに変換
- パストラバーサル攻撃を防止

### 3. 既存データとの互換性

- **過去のタイムスタンプ付きファイルは影響を受けない**
- 新規アップロードのみ新しいパス構造を使用
- 既存ファイルの移行は不要

---

## 🔗 関連ドキュメント

- [サービスファイルアップロードアーキテクチャ](./SERVICE_FILE_UPLOAD_ARCHITECTURE.md)
- [タイムスタンプ削除まとめ](./TIMESTAMP_REMOVAL_SUMMARY.md)
- [S3パス設計レビュー](./S3_CUSTOMER_ID_PATH_REVIEW.md)

---

## 📊 パス構造の比較

| ファイルタイプ | Before (タイムスタンプあり) | After (タイムスタンプなし) |
|--------------|----------------------------|--------------------------|
| サービス入力 | `service/input/{customerId}/{processingHistoryId}/20251016_145932_file.png` | `service/input/{customerId}/{processingHistoryId}/file.png` |
| サービス出力 | `service/output/{customerId}/{processingHistoryId}/20251016_145933_result.png` | `service/output/{customerId}/{processingHistoryId}/result.png` |
| サポートリクエスト | `support/{customerId}/{supportRequestId}/request/20251016_150000_screenshot.png` | `support/{customerId}/{supportRequestId}/request/screenshot.png` |
| サポートリプライ | `support/{customerId}/{supportRequestId}/reply/{replyId}/20251016_150100_solution.pdf` | `support/{customerId}/{supportRequestId}/reply/{replyId}/solution.pdf` |

---

**更新日**: 2025-10-16
**バージョン**: 2.0.0

