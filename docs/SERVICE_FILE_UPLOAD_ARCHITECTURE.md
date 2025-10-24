# サービスページファイルアップロード機能アーキテクチャ

## 概要
このドキュメントでは、サービスページのファイルアップロード機能の実装アーキテクチャと、ワークフローについて説明します。

## ワークフロー

### 1. ポリシー選択
ユーザーは処理に使用するポリシーを選択します。

### 2. ファイル選択
ユーザーは処理したいファイルを選択します（最大10ファイル、各100MB以下）。

### 3. 利用制限チェック
**分岐1: 利用停止制限にかかっていない**
- アップロード可能
- ステップ4に進む

**分岐2: 利用停止制限にかかっている**
- アップロード不可
- エラーメッセージを表示
- 処理終了

**分岐3: 通知制限にかかっている（利用停止制限には未到達）**
- アップロード可能
- 通知メールを送信
- ステップ4に進む

### 4. ファイルアップロード
- S3にファイルをアップロード
- 処理履歴（processing-history）を作成
  - `createdAt`: 処理開始時刻（自動設定）
  - `status`: 'in_progress'
  - 使用量（`usageAmountBytes`）を記録

### 5. サーバーサイド処理待ち
- Step Functionsが自動的にトリガーされる（S3イベント経由）
- バックエンドでAI処理が実行される

### 6. 処理完了後
- サーバーサイド処理が完了
- 処理履歴を更新:
  - `status`: 'success' | 'failed'
  - `completedAt`: 処理完了時刻（ISO8601形式）
  - `downloadS3Keys`: 出力ファイルのS3キー
- 処理時間の計算: `completedAt - createdAt`
- 処理したデータをダウンロード可能になる

## S3パス構造

### サービスファイル（入力）
```
service/input/{customerId}/{processingHistoryId}/{fileName}
```

### サービスファイル（出力）
```
service/output/{customerId}/{processingHistoryId}/{fileName}
```

### サービスファイル（一時ファイル）
```
service/temp/{customerId}/{processingHistoryId}/{stepName}/{fileName}
```

### パス構造の説明
- `customerId`: 企業ID
- `processingHistoryId`: 処理履歴ID（UUIDv4）
- `fileName`: サニタイズされたファイル名（**タイムスタンプなし**）
- `stepName`: Step Functionsのステップ名（一時ファイルのみ）

**重要**: タイムスタンプは使用しない
- `processingHistoryId`（UUID）で一意性が保証される
- 同じファイル名でも異なる`processingHistoryId`なら別ディレクトリに保存
- 元のファイル名がそのまま保持される（可読性・追跡性向上）
- S3上のファイル名 = 元のファイル名（サニタイズ済み）

## データベーステーブル

### 1. processing-history（処理履歴）
処理の実行状態を管理します。

**主要フィールド:**
- `processing-historyId`: 処理履歴ID（PK）
- `userId`: ユーザーID
- `customerId`: 企業ID
- `policyId`: ポリシーID
- `policyName`: ポリシー名
- `status`: 処理状態（in_progress, success, failed, canceled, deleted）
- `uploadedFileKeys`: アップロードされたファイルのS3キー配列
- `downloadS3Keys`: ダウンロード可能なファイルのS3キー配列
- `fileSizeBytes`: 合計ファイルサイズ（バイト）
- `usageAmountBytes`: 使用量（バイト）
- `aiTrainingUsage`: AI学習への使用許可（allow/deny）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `completedAt`: 完了日時

**GSI:**
- `userId-createdAt-index`: ユーザーごとの処理履歴取得用
- `customerId-createdAt-index`: 企業ごとの処理履歴取得用
- `status-createdAt-index`: ステータスごとの処理履歴取得用
- `policyId-createdAt-index`: ポリシーごとの処理履歴取得用

### 2. data-usage（データ使用量）
月次のデータ使用量を記録します。

**主要フィールド:**
- `data-usageId`: データ使用量ID（PK）
- `customerId`: 企業ID
- `userId`: ユーザーID
- `userName`: ユーザー名（削除されたユーザーも表示可能にするため）
- `processingHistoryId`: 処理履歴ID
- `policyId`: ポリシーID
- `policyName`: ポリシー名（削除されたポリシーも表示可能にするため）
- `usageAmountBytes`: 使用量（バイト）
- `usageType`: 使用タイプ（processing, storage）
- `createdAt`: 作成日時（ISO8601形式）
- `updatedAt`: 更新日時（ISO8601形式）
- `completedAt`: 処理完了時刻（ISO8601形式、オプショナル）

**GSI:**
- `customerId-createdAt-index`: 企業の月次使用量取得用
- `userId-createdAt-index`: ユーザーの月次使用量取得用（オプショナル）

**設計思想:**
- ユーザーやポリシーが削除されても履歴を正しく表示できるよう、IDと名前の両方を保持
- `completedAt`で処理時間を計算可能（`completedAt - createdAt`）
- `createdAt`でソートすることで、月次使用量を効率的に取得

### 3. usage-limits（利用制限）
企業の利用制限を管理します。

**主要フィールド:**
- `usage-limitsId`: 利用制限ID（PK）
- `customerId`: 企業ID
- `usageLimitValue`: データ量制限値（数値）
- `usageUnit`: データ量単位（MB, GB, TB）
- `amountLimitValue`: 金額制限値（ドル）
- `exceedAction`: 超過時のアクション（notify, restrict）
- `emails`: 通知先メールアドレスリスト
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

**GSI:**
- `customerId-createdAt-index`: 企業ごとの利用制限取得用

## 実装されたAPI

### 1. ファイルアップロードAPI
**ファイル:** `app/lib/actions/file-upload-api.ts`

- `uploadServiceFileToS3()`: サービスファイルをS3にアップロード
- `uploadMultipleServiceFiles()`: 複数のサービスファイルを一括アップロード

### 2. 処理履歴API
**ファイル:** `app/lib/actions/processing-history-api.ts`

- `createProcessingHistory()`: 処理履歴を作成
- `updateProcessingHistory()`: 処理履歴を更新
- `getProcessingHistoryById()`: 処理履歴をIDで取得
- `queryProcessingHistory()`: 処理履歴をクエリで検索

### 3. データ使用量API
**ファイル:** `app/lib/actions/data-usage-api.ts`

- `createDataUsage()`: データ使用量を記録
- `getCustomerMonthlyUsage()`: 企業の月次使用量を取得
- `getUserMonthlyUsage()`: ユーザーの月次使用量を取得
- `updateDataUsage()`: データ使用量を更新（処理完了時刻の記録など）
- `getDataUsageById()`: data-usageIdでデータ使用量を取得（S3メタデータから取得したIDを使用）

### 4. 利用制限API
**ファイル:** `app/lib/actions/usage-limits-api.ts`

- `getCustomerUsageLimits()`: 企業の利用制限を取得
- `createUsageLimit()`: 利用制限を作成
- `updateUsageLimit()`: 利用制限を更新
- `deleteUsageLimit()`: 利用制限を削除

### 5. 利用制限チェックAPI
**ファイル:** `app/lib/actions/usage-limit-check.ts`

- `checkUsageLimits()`: 利用制限をチェック

### 6. メール送信API
**ファイル:** `app/lib/actions/email-actions.ts`

- `sendUsageLimitNotificationEmailAction()`: 使用量通知メールを送信

## UIコンポーネント

### 1. ServiceContainer
**ファイル:** `app/_containers/Service/ServiceContainer.tsx`

サーバーサイドコンテナコンポーネント。以下のデータを取得します:
- ユーザープロファイル
- 処理履歴
- ポリシー
- 利用制限

### 2. ServicePresentation
**ファイル:** `app/_containers/Service/ServicePresentation.tsx`

プレゼンテーションコンポーネント。以下を表示します:
- 利用制限の状況
- ポリシー選択UI
- ファイルアップロードUI
- 処理履歴テーブル

### 3. ServiceFileUploader
**ファイル:** `app/_containers/Service/ServiceFileUploader.tsx`

ファイルアップロード専用コンポーネント。以下の機能を持ちます:
- ドラッグ&ドロップでのファイル選択
- ファイルサイズ制限チェック
- 利用制限チェック
- ファイルアップロード
- データ使用量記録
- 通知メール送信

## 料金計算

### 処理料金
- $0.00001 per Byte

### 換算例
- 1 MB = 1,048,576 Bytes = $10.49
- 1 GB = 1,073,741,824 Bytes = $10,737.42
- 1 TB = 1,099,511,627,776 Bytes = $10,995,116.28

## メールテンプレート

### 使用量通知メール
**テンプレート名:** `SiftbeamUsageLimitNotification_{locale}`

**テンプレートデータ:**
- `customerId`: 企業ID
- `currentUsage`: 現在の使用量（表示用）
- `exceedingLimit`: 超過した制限値
- `dashboardUrl`: ダッシュボードURL
- `companyName`: 会社名
- `supportEmail`: サポートメールアドレス

## 環境変数

以下の環境変数が必要です:

```bash
# DynamoDB テーブル名
PROCESSING_HISTORY_TABLE_NAME=siftbeam-processing-history
USAGE_LIMITS_TABLE_NAME=siftbeam-usage-limits
DATA_USAGE_TABLE_NAME=siftbeam-data-usage

# S3 設定
S3_BUCKET_NAME=your-bucket-name

# SES 設定
SES_FROM_EMAIL=noreply@yourdomain.com

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## セキュリティ考慮事項

1. **ファイル名のサニタイズ**: 特殊文字を除去し、安全なファイル名に変換
2. **ファイルサイズ制限**: 各ファイル100MB、最大10ファイルまで
3. **利用制限チェック**: アップロード前に必ず利用制限をチェック
4. **S3メタデータ**: ファイルにメタデータを付与してトレーサビリティを確保

## 今後の拡張

1. **ファイルタイプ検証**: ポリシーで指定されたファイルタイプのみを受け入れる
2. **進捗表示**: Step Functionsの状態をリアルタイムで表示
3. **ダウンロード機能**: 処理完了後のファイルダウンロード機能
4. **通知の拡張**: Slack、SMS等への通知対応
5. **AI学習使用許可の管理**: ユーザー設定からの取得

