# DynamoDB インデックス比較結果

## ❌ 不足しているインデックス

### 1. **siftbeam-support-replies**
- **コードで使用**: `support-requestId-createdAt-index` (support-api.ts:609)
- **YAMLで定義**: `supportRequestId-createdAt-index` (dynamodb-tables.yaml:426)
- **問題**: 名前が一致していない (`support-requestId` vs `supportRequestId`)
- **修正**: コードを `supportRequestId-createdAt-index` に変更

### 2. **siftbeam-new-order-replies**
- **コードで使用**: `neworder-requestId-createdAt-index` (neworder-api.ts:666)
- **YAMLで定義**: `newOrderRequestId-createdAt-index` (dynamodb-tables.yaml:182)
- **問題**: 名前が一致していない (`neworder-requestId` vs `newOrderRequestId`)
- **修正**: コードを `newOrderRequestId-createdAt-index` に変更

### 3. **siftbeam-processing-histories**
- **コードで使用**: `status-createdAt-index` (processing-history-api.ts:252)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 4. **siftbeam-processing-histories**
- **コードで使用**: `policyId-createdAt-index` (processing-history-api.ts:268)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 5. **siftbeam-support-requests**
- **コードで使用**: `status-createdAt-index` (support-api.ts:245)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 6. **siftbeam-new-order-requests**
- **コードで使用**: `status-createdAt-index` (neworder-api.ts:280)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 7. **siftbeam-api-keys**
- **コードで使用**: `policyId-index` (api-key-actions.ts:486)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 8. **siftbeam-api-keys**
- **コードで使用**: `gatewayApiKeyId-index` (api-key-actions.ts:559)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 9. **siftbeam-data-usages**
- **コードで使用**: `userId-createdAt-index` (data-usage-api.ts:238)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 10. **siftbeam-policy-analyses**
- **コードで使用**: `status-customerId-index` (policy-analysis-actions.ts:565)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 11. **siftbeam-users**
- **コードで使用**: `email-index` (user-verification-actions.ts:94)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

### 12. **siftbeam-announcements**
- **コードで使用**: `locale-createdAt-index` (announcement-actions.ts:57)
- **YAMLで定義**: なし
- **問題**: インデックスが存在しない
- **修正**: YAMLに追加が必要

## ✅ 正しく定義されているインデックス

### siftbeam-api-keys
- ✅ `customerId-createdAt-index`

### siftbeam-audit-logs
- ✅ `customerId-createdAt-index`

### siftbeam-data-usages
- ✅ `customerId-createdAt-index`

### siftbeam-groups
- ✅ `customerId-createdAt-index`
- ✅ `customerId-groupName-index`

### siftbeam-new-order-requests
- ✅ `customerId-createdAt-index`
- ✅ `customerId-status-index`

### siftbeam-policies
- ✅ `customerId-createdAt-index`
- ✅ `customerId-policyName-index`

### siftbeam-policy-analyses
- ✅ `policyId-createdAt-index`

### siftbeam-policy-groups
- ✅ `groupId-policyId-index`

### siftbeam-processing-histories
- ✅ `userId-createdAt-index`
- ✅ `customerId-createdAt-index`
- ✅ `customerId-status-index`

### siftbeam-support-requests
- ✅ `customerId-createdAt-index`
- ✅ `customerId-status-index`

### siftbeam-usage-limits
- ✅ `customerId-createdAt-index`

### siftbeam-user-groups
- ✅ `userId-groupId-index`
- ✅ `groupId-userId-index`

### siftbeam-users
- ✅ `customerId-userName-index`

### siftbeam-verification-codes
- ✅ `email-createdAt-index`

## 📋 修正が必要な項目まとめ

### コード修正 (2件)
1. `support-api.ts`: `support-requestId-createdAt-index` → `supportRequestId-createdAt-index`
2. `neworder-api.ts`: `neworder-requestId-createdAt-index` → `newOrderRequestId-createdAt-index`

### YAML追加 (10件)
1. `siftbeam-processing-histories`: `status-createdAt-index`
2. `siftbeam-processing-histories`: `policyId-createdAt-index`
3. `siftbeam-support-requests`: `status-createdAt-index` (既に存在)
4. `siftbeam-new-order-requests`: `status-createdAt-index` (既に存在)
5. `siftbeam-api-keys`: `policyId-index`
6. `siftbeam-api-keys`: `gatewayApiKeyId-index`
7. `siftbeam-data-usages`: `userId-createdAt-index`
8. `siftbeam-policy-analyses`: `status-customerId-index`
9. `siftbeam-users`: `email-index`
10. `siftbeam-announcements`: `locale-createdAt-index`

**注**: 3番と4番は既にYAMLに `customerId-status-index` として存在していますが、コードでは `status-createdAt-index` を使用しています。これは設計の不一致です。

