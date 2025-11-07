# IAM ポリシー更新ガイド

## 概要
DynamoDBテーブル名のリファクタリングに伴い、IAMポリシーを更新する必要があります。

## 変更されたテーブル名

### 削除する旧テーブル名
以下のテーブル名への参照を削除してください:

1. `User` → **削除** (siftbeam-usersに統合)
2. `siftbeam-policy` → `siftbeam-policies` に変更
3. `siftbeam-group` → `siftbeam-groups` に変更
4. `siftbeam-user-group` → `siftbeam-user-groups` に変更
5. `siftbeam-policy-group` → `siftbeam-policy-groups` に変更
6. `siftbeam-support-request` → `siftbeam-support-requests` に変更
7. `siftbeam-support-reply` → `siftbeam-support-replies` に変更
8. `siftbeam-neworder-request` → `siftbeam-new-order-requests` に変更
9. `siftbeam-neworder-reply` → `siftbeam-new-order-replies` に変更
10. `siftbeam-processing-history` → `siftbeam-processing-histories` に変更
11. `siftbeam-policy-analysis` → `siftbeam-policy-analyses` に変更
12. `siftbeam-data-usage` → `siftbeam-data-usages` に変更

### 追加する新テーブル名

| 旧テーブル名 | 新テーブル名 | 変更内容 |
|------------|------------|---------|
| `User` | `siftbeam-users` | プレフィックス追加、既存のsiftbeam-usersに統合 |
| `siftbeam-policy` | `siftbeam-policies` | 複数形に変更 |
| `siftbeam-group` | `siftbeam-groups` | 複数形に変更 |
| `siftbeam-user-group` | `siftbeam-user-groups` | 複数形に変更 |
| `siftbeam-policy-group` | `siftbeam-policy-groups` | 複数形に変更 |
| `siftbeam-support-request` | `siftbeam-support-requests` | 複数形に変更 |
| `siftbeam-support-reply` | `siftbeam-support-replies` | 複数形に変更 |
| `siftbeam-neworder-request` | `siftbeam-new-order-requests` | ハイフン追加、複数形に変更 |
| `siftbeam-neworder-reply` | `siftbeam-new-order-replies` | ハイフン追加、複数形に変更 |
| `siftbeam-processing-history` | `siftbeam-processing-histories` | 複数形に変更 |
| `siftbeam-policy-analysis` | `siftbeam-policy-analyses` | 複数形に変更 |
| `siftbeam-data-usage` | `siftbeam-data-usages` | 複数形に変更 |
| (新規) | `siftbeam-policy-stepfunction-mapping` | 新規追加 |

### 変更なし (そのまま使用)
- `siftbeam-announcements`
- `siftbeam-verification-codes`
- `siftbeam-users`
- `siftbeam-usage-limits`
- `siftbeam-audit-logs`
- `siftbeam-api-keys`

## 更新手順

### 1. IAMコンソールでポリシーを更新

1. **AWSマネジメントコンソール**にログイン
2. **IAM** サービスに移動
3. **ポリシー**を選択
4. 該当するポリシーを選択 (例: `serviceAdmin-policy`)
5. **ポリシーの編集**をクリック
6. **JSON**タブを選択
7. `iam-policy-updated.json` の内容をコピー&ペースト
8. **ポリシーの確認**をクリック
9. **変更の保存**をクリック

### 2. 更新されたリソースARNの確認

更新後のポリシーには、以下の18個のDynamoDBテーブルとそのインデックスへのアクセス権限が含まれています:

```
1.  siftbeam-announcements
2.  siftbeam-api-keys
3.  siftbeam-audit-logs
4.  siftbeam-data-usages (新)
5.  siftbeam-groups (新)
6.  siftbeam-new-order-replies (新)
7.  siftbeam-new-order-requests (新)
8.  siftbeam-policies (新)
9.  siftbeam-policy-analyses (新)
10. siftbeam-policy-groups (新)
11. siftbeam-policy-stepfunction-mapping (新)
12. siftbeam-processing-histories (新)
13. siftbeam-support-replies (新)
14. siftbeam-support-requests (新)
15. siftbeam-usage-limits
16. siftbeam-user-groups (新)
17. siftbeam-users
18. siftbeam-verification-codes
```

### 3. 動作確認

IAMポリシー更新後、以下の操作が正常に動作することを確認してください:

- [ ] ユーザー登録 (siftbeam-users)
- [ ] ユーザー管理 (siftbeam-users, siftbeam-user-groups)
- [ ] サポートリクエスト作成・返信 (siftbeam-support-requests, siftbeam-support-replies)
- [ ] 新規注文リクエスト作成・返信 (siftbeam-new-order-requests, siftbeam-new-order-replies)
- [ ] ポリシー管理 (siftbeam-policies, siftbeam-policy-groups)
- [ ] グループ管理 (siftbeam-groups)
- [ ] 処理履歴表示 (siftbeam-processing-histories)
- [ ] API キー管理 (siftbeam-api-keys)
- [ ] データ使用量表示 (siftbeam-data-usages)
- [ ] 監査ログ表示 (siftbeam-audit-logs)

## トラブルシューティング

### AccessDeniedエラーが発生する場合

1. **IAMポリシーが正しく更新されているか確認**
   - IAMコンソールでポリシーのJSONを確認
   - 新しいテーブル名が含まれているか確認

2. **IAMユーザー/ロールにポリシーがアタッチされているか確認**
   - IAMコンソールで該当ユーザー/ロールを確認
   - ポリシーが正しくアタッチされているか確認

3. **環境変数のテーブル名が正しいか確認**
   - `.env.local` ファイルを確認
   - 新しいテーブル名が設定されているか確認

4. **CloudFormationでテーブルが作成されているか確認**
   - DynamoDBコンソールで18個のテーブルが存在するか確認
   - テーブル名が正しいか確認

## 注意事項

- 旧テーブル名 (`User`, `siftbeam-policy`, `siftbeam-group` など) への参照は完全に削除されています
- 新しいポリシーは18個のDynamoDBテーブルすべてをカバーしています
- S3バケット (`siftbeam`)、Cognito User Pool、API Gateway、SESへのアクセス権限は変更されていません

## 参考ファイル

- `iam-policy-updated.json`: 更新後のIAMポリシーJSON
- `dynamodb-tables.yaml`: CloudFormationテンプレート (18個のテーブル定義)

