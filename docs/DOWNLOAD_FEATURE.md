# ダウンロード機能

処理履歴から出力ファイルをダウンロードする機能の実装ドキュメント

## 📋 概要

- **単一ファイル**: 直接ダウンロード
- **複数ファイル**: ZIP圧縮してダウンロード
- **保存期間**: 1年間（S3ライフサイクルポリシーで自動削除）

---

## 🎯 機能仕様

### ダウンロード対象

- ✅ 処理完了（`status: 'success'`）の出力ファイル（`downloadS3Keys`）
- ❌ 処理中・失敗・キャンセル済みのファイルはダウンロード不可
- ❌ 1年経過したファイルは自動削除済み

### ファイル形式

| ファイル数 | ダウンロード形式 | ファイル名 |
|----------|---------------|----------|
| 1つ | 直接ダウンロード | 元のファイル名 |
| 2つ以上 | ZIP圧縮 | `{ポリシー名}_{処理履歴ID(8桁)}.zip` |

---

## 🔧 実装詳細

### 1. ダウンロードServer Action

**ファイル:** `app/lib/actions/download-api.ts`

**関数:** `downloadFiles(s3Keys: string[])`

**パラメータ:**
- `s3Keys` (必須): S3キーの配列

**レスポンス:**
```typescript
{
  success: boolean;
  data?: {
    content: string;      // Base64エンコードされたファイルデータ
    fileName: string;     // ファイル名
    contentType: string;  // MIMEタイプ
  };
  error?: string;
}
```

**エラーレスポンス:**
- S3キーが指定されていない
- ファイルが見つからない（保存期間経過）
- サーバーエラー

---

### 2. フロントエンド実装

#### ProcessingHistoryList.tsx

```typescript
const handleDownload = async (history: ProcessingHistory) => {
  // 出力ファイルのみを取得
  const outputFiles = getDownloadableFiles(history).filter(f => f.fileType === 'output');
  
  // S3キーの配列を取得
  const s3Keys = outputFiles.map(f => f.s3Key);
  
  // Server Actionを呼び出してファイルをダウンロード
  const result = await downloadFiles(s3Keys);
  
  if (!result.success || !result.data) {
    alert(result.error || 'ダウンロードに失敗しました。');
    return;
  }

  // Base64データをBlobに変換
  const binaryString = atob(result.data.content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: result.data.contentType });
  
  // ダウンロード用のURLを作成
  const url = URL.createObjectURL(blob);
  
  // ファイル名を決定
  let fileName = result.data.fileName;
  if (s3Keys.length > 1) {
    // 複数ファイルの場合はカスタムZIPファイル名
    fileName = `${history.policyName}_${history['processing-historyId'].substring(0, 8)}.zip`;
  }
  
  // ダウンロードを開始
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // URLを解放
  URL.revokeObjectURL(url);
};
```

---

### 3. 処理時間とファイルサイズの表示

#### 処理時間の計算

```typescript
// updatedAt - createdAt から計算
const processingTimeSeconds = history.completedAt && history.createdAt
  ? Math.round((new Date(history.completedAt).getTime() - new Date(history.createdAt).getTime()) / 1000)
  : null;
```

#### ファイルサイズの表示

```typescript
// usageAmountBytes から表示
const fileSize = history.usageAmountBytes 
  ? formatFileSize(history.usageAmountBytes) 
  : '-';
```

---

## 📊 データフロー

```
1. ユーザーがダウンロードボタンをクリック
   ↓
2. ProcessingHistoryからdownloadS3Keysを取得
   ↓
3. Server Action (downloadFiles) を呼び出し
   ↓
4. S3からファイルを取得
   ├─ 単一ファイル → そのまま返す
   └─ 複数ファイル → JSZipでZIP圧縮
   ↓
5. Base64エンコードしてクライアントに返す
   ↓
6. クライアント側でBase64をBlobに変換
   ↓
7. Blob URLを作成してダウンロード開始
   ↓
8. ダウンロード完了後、Blob URLを解放
```

---

## 🔒 セキュリティ

### 認証・認可

- ✅ Server ActionはNext.jsのサーバーサイドで実行
- ✅ 環境変数からAWS認証情報を取得
- ✅ クライアントからAWS認証情報が漏洩しない
- ⚠️ 現在は認証チェックなし（TODO: ユーザー認証を追加）

### ファイルアクセス制御

- ✅ S3キーは処理履歴から取得（ユーザーが任意のS3キーを指定できない）
- ✅ `downloadS3Keys`に含まれるファイルのみダウンロード可能
- ⚠️ TODO: カスタマーIDベースのアクセス制御を追加

### データ転送

- ✅ Base64エンコードでデータ転送
- ✅ クライアント側でBlobに変換
- ✅ ダウンロード後、Blob URLを適切に解放

---

## 🎨 UI/UX

### ダウンロードボタンの状態

| 状態 | ボタン表示 | 動作 |
|-----|----------|------|
| 処理完了 & ファイルあり | 🟢 有効 | ダウンロード可能 |
| 処理中 | ⚪ 無効 | クリック不可 |
| 処理失敗 | ⚪ 無効 | クリック不可 |
| 1年経過 | 🟡 無効（警告） | 「保存期間経過」ツールチップ表示 |

### ファイル名の例

**単一ファイル:**
```
icon.png
```

**複数ファイル（ZIP）:**
```
ポリシー2_bba99740.zip
```

---

## 🐛 エラーハンドリング

### ファイルが見つからない場合

```typescript
if (response.status === 404) {
  alert('ファイルは保存期間（1年）を過ぎたため削除されました。');
}
```

### ダウンロード失敗

```typescript
catch (error) {
  console.error('Download error:', error);
  alert('ダウンロードに失敗しました。');
}
```

---

## 📦 依存パッケージ

```json
{
  "dependencies": {
    "jszip": "^3.10.1",
    "@aws-sdk/client-s3": "^3.x.x"
  },
  "devDependencies": {
    "@types/jszip": "^3.4.1"
  }
}
```

---

## 🚀 今後の改善案

1. **認証・認可の追加**
   - ユーザーセッションチェック
   - カスタマーIDベースのアクセス制御

2. **ダウンロード進捗表示**
   - 大きなファイルの場合、進捗バーを表示

3. **ダウンロード履歴**
   - ダウンロード日時を記録

4. **プレビュー機能**
   - 画像・PDFなどはダウンロード前にプレビュー表示

5. **バッチダウンロード**
   - 複数の処理履歴から一括ダウンロード

---

## 📝 テスト項目

- [ ] 単一ファイルのダウンロード
- [ ] 複数ファイルのZIPダウンロード
- [ ] 1年経過したファイルのエラーハンドリング
- [ ] ファイルが存在しない場合のエラーハンドリング
- [ ] 処理中のファイルはダウンロードボタンが無効
- [ ] 処理時間の正しい計算
- [ ] ファイルサイズの正しい表示

