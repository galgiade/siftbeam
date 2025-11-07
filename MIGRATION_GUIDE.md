# DynamoDB リファクタリング移行ガイド

## 📋 概要

このガイドでは、DynamoDBのパーティションキー命名規則をハイフン区切りからcamelCaseに統一するリファクタリング手順を説明します。

### 変更内容

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| **テーブル名** | `siftbeam-support-request` | `siftbeam-support-requests` |
| **PK命名** | `'support-requestId'` | `supportRequestId` |
| **コード参照** | `input['support-requestId']` | `input.supportRequestId` |

---

## 🎯 リファクタリングの目的

1. **Step Functions互換性の向上**
   - JSONPathでドット記法が使用可能に
   - `$.supportRequestId` vs `$['support-requestId']`

2. **コードの可読性向上**
   - TypeScriptのドット記法でアクセス可能
   - IDE補完の改善

3. **AWS ベストプラクティスへの準拠**
   - camelCaseはDynamoDBの推奨命名規則

---

## 📦 変更されたファイル

### ✅ 完了した変更

#### 1. 環境変数（1ファイル）
- `env.example` - テーブル名を複数形に統一

#### 2. 型定義（1ファイル）
- `app/lib/types/TypeAPIs.ts` - すべてのインターフェースをcamelCaseに

#### 3. Server Actions（12ファイル）
- `app/lib/actions/support-api.ts`
- `app/lib/actions/neworder-api.ts`
- `app/lib/actions/processing-history-api.ts`
- `app/lib/actions/group-api.ts`
- `app/lib/actions/policy-api.ts`
- `app/lib/actions/audit-log-actions.ts`
- `app/lib/actions/api-key-actions.ts`
- `app/lib/actions/usage-limits-api.ts`
- `app/lib/actions/data-usage-api.ts`
- `app/lib/actions/policy-analysis-actions.ts`
- その他関連ファイル

#### 4. Container/Presentationコンポーネント（12ファイル）
- Support関連: 4ファイル
- NewOrder関連: 4ファイル
- Service関連: 3ファイル
- GroupManagement: 1ファイル

---

## 🚀 移行手順

### Phase 1: 準備（完了）

✅ **1.1 コードベースの修正**
```bash
# すべてのコード変更は完了済み
git status
```

✅ **1.2 環境変数の更新**
```bash
# .env ファイルを env.example に合わせて更新
cp env.example .env
# 必要な値を設定
```

---

### Phase 2: DynamoDBテーブルの作成

#### 2.1 CloudFormationスタックのデプロイ

```bash
# CloudFormationテンプレートを使用してテーブルを作成
aws cloudformation create-stack \
  --stack-name siftbeam-dynamodb-refactored \
  --template-body file://dynamodb-tables.yaml \
  --region ap-northeast-1
```

#### 2.2 スタック作成の確認

```bash
# スタックの状態を確認
aws cloudformation describe-stacks \
  --stack-name siftbeam-dynamodb-refactored \
  --region ap-northeast-1 \
  --query 'Stacks[0].StackStatus'

# CREATE_COMPLETE になるまで待機（約5-10分）
aws cloudformation wait stack-create-complete \
  --stack-name siftbeam-dynamodb-refactored \
  --region ap-northeast-1
```

---

### Phase 3: データ移行

#### 3.1 ドライラン（テスト）

```bash
# 移行スクリプトをドライランモードで実行
npx ts-node migrate-dynamodb-data.ts --dry-run
```

**確認項目:**
- ✅ すべてのテーブルが読み取り可能
- ✅ アイテム数が正しい
- ✅ キー変換が正しく行われている

#### 3.2 本番移行

```bash
# 環境変数を設定
export REGION=ap-northeast-1
export ACCESS_KEY_ID=your-access-key
export SECRET_ACCESS_KEY=your-secret-key

# データ移行を実行
npx ts-node migrate-dynamodb-data.ts
```

**⚠️ 注意事項:**
- 移行中はアプリケーションを停止してください
- 実行前に必ずバックアップを取得してください
- 移行には10-30分程度かかる場合があります

#### 3.3 データ検証

```bash
# 各テーブルのアイテム数を確認
aws dynamodb describe-table \
  --table-name siftbeam-support-requests \
  --query 'Table.ItemCount'

# 旧テーブルと新テーブルのアイテム数を比較
```

---

### Phase 4: アプリケーションのデプロイ

#### 4.1 ビルドとテスト

```bash
# Next.jsアプリケーションをビルド
npm run build

# ローカルで動作確認
npm run dev
```

#### 4.2 本番環境へのデプロイ

```bash
# 本番環境の環境変数を更新
# AWS Systems Manager Parameter Store または .env.production

# デプロイ
npm run build
npm run start
```

---

### Phase 5: 旧テーブルの削除（慎重に）

#### 5.1 猶予期間（推奨: 1-2週間）

新テーブルで問題なく動作することを確認後、1-2週間の猶予期間を設けてください。

#### 5.2 旧テーブルのバックアップ

```bash
# 各テーブルのバックアップを作成
aws dynamodb create-backup \
  --table-name siftbeam-support-request \
  --backup-name siftbeam-support-request-final-backup
```

#### 5.3 旧テーブルの削除

```bash
# 旧テーブルを削除（慎重に！）
aws dynamodb delete-table --table-name siftbeam-support-request
aws dynamodb delete-table --table-name siftbeam-support-reply
aws dynamodb delete-table --table-name siftbeam-neworder-request
aws dynamodb delete-table --table-name siftbeam-neworder-reply
aws dynamodb delete-table --table-name siftbeam-processing-history
aws dynamodb delete-table --table-name siftbeam-user-group
aws dynamodb delete-table --table-name siftbeam-policy-group
aws dynamodb delete-table --table-name siftbeam-group
aws dynamodb delete-table --table-name siftbeam-policy
aws dynamodb delete-table --table-name siftbeam-policy-analysis
aws dynamodb delete-table --table-name siftbeam-data-usage
```

---

## 🧪 テストチェックリスト

### 機能テスト

- [ ] **サポートリクエスト**
  - [ ] 新規作成
  - [ ] 詳細表示
  - [ ] 返信追加
  - [ ] ステータス更新
  - [ ] ファイルアップロード

- [ ] **新規オーダー**
  - [ ] 新規作成
  - [ ] 詳細表示
  - [ ] 返信追加
  - [ ] ファイルアップロード

- [ ] **サービス（処理履歴）**
  - [ ] ファイルアップロード
  - [ ] 処理履歴表示
  - [ ] ダウンロード

- [ ] **グループ管理**
  - [ ] グループ作成
  - [ ] ユーザー割り当て
  - [ ] ポリシー割り当て

- [ ] **その他**
  - [ ] API Keys管理
  - [ ] Audit Logs表示
  - [ ] Usage Limits設定

### パフォーマンステスト

- [ ] ページロード時間が変わらない
- [ ] クエリ応答時間が改善または同等
- [ ] GSIが正しく機能している

---

## 📊 変更サマリー

### テーブル名の変更（12テーブル）

| 旧テーブル名 | 新テーブル名 | データサイズ |
|-------------|-------------|-------------|
| `siftbeam-support-request` | `siftbeam-support-requests` | 6.1 KB |
| `siftbeam-support-reply` | `siftbeam-support-replies` | 6.5 KB |
| `siftbeam-neworder-request` | `siftbeam-new-order-requests` | 7.5 KB |
| `siftbeam-neworder-reply` | `siftbeam-new-order-replies` | 3.2 KB |
| `siftbeam-processing-history` | `siftbeam-processing-histories` | 24.5 KB |
| `siftbeam-group` | `siftbeam-groups` | 364 B |
| `siftbeam-user-group` | `siftbeam-user-groups` | 1.4 KB |
| `siftbeam-policy-group` | `siftbeam-policy-groups` | 462 B |
| `siftbeam-policy` | `siftbeam-policies` | 1.1 KB |
| `siftbeam-policy-analysis` | `siftbeam-policy-analyses` | 0 B |
| `siftbeam-data-usage` | `siftbeam-data-usages` | 554 B |
| `siftbeam-usage-limits` | `siftbeam-usage-limits` | 1.2 KB |

**合計データサイズ:** 約 53 KB（移行は数分で完了）

### PK名の変更

| 旧PK名 | 新PK名 |
|--------|--------|
| `'support-requestId'` | `supportRequestId` |
| `'support-replyId'` | `supportReplyId` |
| `'neworder-requestId'` | `newOrderRequestId` |
| `'neworder-replyId'` | `newOrderReplyId` |
| `'processing-historyId'` | `processingHistoryId` |
| `'user-groupId'` | `userGroupId` |
| `'policy-groupId'` | `policyGroupId` |
| `'api-keysId'` | `apiKeyId` |
| `'audit-logsId'` | `auditLogId` |
| `'data-usageId'` | `dataUsageId` |
| `'usage-limitsId'` | `usageLimitId` |
| `'policy-analysisId'` | `policyAnalysisId` |

---

## 🔧 トラブルシューティング

### 問題: CloudFormationスタックの作成に失敗

**原因:** IAM権限不足

**解決策:**
```bash
# 必要な権限を確認
aws iam get-user
aws iam list-attached-user-policies --user-name YOUR_USER
```

必要な権限:
- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `cloudformation:CreateStack`

---

### 問題: データ移行スクリプトがエラー

**原因:** レート制限

**解決策:**
```typescript
// migrate-dynamodb-data.ts の待機時間を増やす
await new Promise(resolve => setTimeout(resolve, 500)); // 100ms → 500ms
```

---

### 問題: 型エラーが発生

**原因:** 一部のファイルで旧キー名が残っている

**解決策:**
```bash
# 残っているハイフン区切りキーを検索
grep -r "support-requestId" app/
grep -r "neworder-requestId" app/
grep -r "processing-historyId" app/
```

---

## 📞 サポート

問題が発生した場合:

1. **ログを確認**
   ```bash
   # CloudWatch Logs
   aws logs tail /aws/lambda/your-function-name --follow
   ```

2. **ロールバック手順**
   - 旧テーブルが残っている場合は、環境変数を元に戻す
   - CloudFormationスタックを削除
   - コードを以前のコミットに戻す

3. **バックアップから復元**
   ```bash
   aws dynamodb restore-table-from-backup \
     --target-table-name siftbeam-support-request \
     --backup-arn YOUR_BACKUP_ARN
   ```

---

## ✅ 完了確認

すべての手順が完了したら、以下を確認してください:

- [ ] すべてのテーブルが新しい命名規則で作成されている
- [ ] データが正しく移行されている
- [ ] アプリケーションが正常に動作している
- [ ] すべての機能テストがパスしている
- [ ] 旧テーブルのバックアップが取得されている
- [ ] ドキュメントが更新されている

---

**移行完了日:** _______________

**実施者:** _______________

**確認者:** _______________

