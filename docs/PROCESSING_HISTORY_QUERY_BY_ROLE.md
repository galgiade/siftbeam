# 処理履歴クエリのロール別仕様

## 📋 概要

処理履歴の取得方法は、ユーザーのロール（`role`）によって異なります。

- **一般ユーザー**: 自分がアップロードしたデータのみ表示
- **管理者（admin）**: 顧客全体のデータを表示（API経由のデータも含む）

---

## 🎯 背景

### 問題

以前の実装では、すべてのユーザーが `userId` でクエリしていたため、以下の問題がありました:

```typescript
// ❌ 以前の実装
queryProcessingHistory({
  userId: userProfile.sub,  // 常にuserIdでクエリ
  limit: 20
})
```

**問題点**:
1. **API経由のデータが表示されない**
   - API経由でアップロードされたデータは `userId` が API キーID
   - ブラウザユーザーの `userId` とは異なる
   - 管理者でもAPI経由のデータをダウンロードできない

2. **顧客全体のデータが見えない**
   - 管理者は顧客全体のデータを管理する必要がある
   - 他のユーザーがアップロードしたデータも確認したい

---

## ✅ 改善後の実装

### ロール別クエリ

```typescript
// ✅ 改善後の実装
queryProcessingHistory(
  userProfile.role === 'admin'
    ? { customerId: userProfile.customerId, limit: 20 }  // 管理者: 顧客全体
    : { userId: userProfile.sub, limit: 20 }             // 一般ユーザー: 自分のみ
)
```

---

## 📊 データ取得の違い

### 一般ユーザー（role: 'user'）

```
クエリ条件:
  userId = "27346a28-6001-70ec-6151-b62d7b092242"

取得されるデータ:
  ✅ ブラウザから自分がアップロードしたデータ
  ❌ API経由でアップロードされたデータ
  ❌ 他のユーザーがアップロードしたデータ

GSI使用:
  userId-createdAt-index
```

### 管理者（role: 'admin'）

```
クエリ条件:
  customerId = "cus_TB7TNGpqOEFcst"

取得されるデータ:
  ✅ ブラウザから自分がアップロードしたデータ
  ✅ API経由でアップロードされたデータ
  ✅ 他のユーザーがアップロードしたデータ
  ✅ 顧客全体のすべてのデータ

GSI使用:
  customerId-createdAt-index
```

---

## 🔍 実装詳細

### ServiceContainer.tsx

```typescript
// データを並列取得（処理履歴、ポリシー、利用制限）
// 管理者の場合、customerIdでクエリしてAPI経由のデータも含めて取得
const [processingHistoryResult, policiesResult, usageLimitsResult] = await Promise.all([
  queryProcessingHistory(
    userProfile.role === 'admin'
      ? { customerId: userProfile.customerId, limit: 20 }  // 管理者: 顧客全体のデータ
      : { userId: userProfile.sub, limit: 20 }             // 一般ユーザー: 自分のデータのみ
  ),
  getPoliciesForUser(
    userProfile.sub,
    userProfile.customerId
  ),
  getCustomerUsageLimits(userProfile.customerId)
]);
```

### processing-history-api.ts

```typescript
export async function queryProcessingHistory(
  input: QueryProcessingHistoryInput
): Promise<ApiResponse<{ processingHistory: ProcessingHistory[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    let command: QueryCommand;

    if (input.userId) {
      // userIdでクエリ（GSI1使用）
      command = new QueryCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
        IndexName: 'userId-createdAt-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': input.userId
        },
        ScanIndexForward: false, // 新しい順にソート
        Limit: input.limit || 1000,
        ExclusiveStartKey: input.lastEvaluatedKey
      });
    } else if (input.customerId) {
      // customerIdでクエリ（GSI2使用）
      command = new QueryCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
        IndexName: 'customerId-createdAt-index',
        KeyConditionExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
          ':customerId': input.customerId
        },
        ScanIndexForward: false, // 新しい順にソート
        Limit: input.limit || 1000,
        ExclusiveStartKey: input.lastEvaluatedKey
      });
    }
    // ... 他のクエリ条件
  }
}
```

---

## 📦 DynamoDBテーブル構造

### 処理履歴テーブル

| フィールド | 説明 | 例 |
|-----------|------|-----|
| `processing-historyId` | パーティションキー | `"00c86699-9084-41f0-aae8-632fe401556c"` |
| `userId` | ユーザーID（ブラウザユーザーまたはAPIキーID） | `"27346a28-6001-..."` または `"5tg87cxxd5"` |
| `userName` | ユーザー名 | `"ガルギアデ"` または `"APIテストキー"` |
| `customerId` | 顧客ID | `"cus_TB7TNGpqOEFcst"` |
| `policyId` | ポリシーID | `"dab72b9a-56fc-..."` |
| `status` | ステータス | `"success"`, `"in_progress"`, etc. |
| `createdAt` | 作成日時 | `"2025-10-30T11:54:59.724454Z"` |

### GSI（Global Secondary Index）

| GSI名 | パーティションキー | ソートキー | 用途 |
|-------|------------------|-----------|------|
| `userId-createdAt-index` | `userId` | `createdAt` | ユーザー個人のデータ取得 |
| `customerId-createdAt-index` | `customerId` | `createdAt` | 顧客全体のデータ取得 |
| `status-createdAt-index` | `status` | `createdAt` | ステータス別のデータ取得 |
| `policyId-createdAt-index` | `policyId` | `createdAt` | ポリシー別のデータ取得 |

---

## 🧪 テストケース

### ケース1: 一般ユーザーがサービスページを開く

```
ユーザー情報:
  userId: "27346a28-6001-70ec-6151-b62d7b092242"
  userName: "ガルギアデ"
  customerId: "cus_TB7TNGpqOEFcst"
  role: "user"

クエリ:
  userId = "27346a28-6001-70ec-6151-b62d7b092242"

取得されるデータ:
  - processing-historyId: "bba99740-dffa-430a-b251-09bf1b0f01b9"
    userId: "27346a28-6001-70ec-6151-b62d7b092242"
    userName: "ガルギアデ"
    customerId: "cus_TB7TNGpqOEFcst"
    status: "success"
    
  ❌ 以下のデータは取得されない:
  - processing-historyId: "00c86699-9084-41f0-aae8-632fe401556c"
    userId: "5tg87cxxd5"  ← APIキーID（異なるuserIdのため除外）
    userName: "APIテストキー"
    customerId: "cus_TB7TNGpqOEFcst"
    status: "success"
```

### ケース2: 管理者がサービスページを開く

```
ユーザー情報:
  userId: "27346a28-6001-70ec-6151-b62d7b092242"
  userName: "ガルギアデ"
  customerId: "cus_TB7TNGpqOEFcst"
  role: "admin"

クエリ:
  customerId = "cus_TB7TNGpqOEFcst"

取得されるデータ:
  ✅ ブラウザからアップロードしたデータ:
  - processing-historyId: "bba99740-dffa-430a-b251-09bf1b0f01b9"
    userId: "27346a28-6001-70ec-6151-b62d7b092242"
    userName: "ガルギアデ"
    customerId: "cus_TB7TNGpqOEFcst"
    status: "success"
    
  ✅ API経由でアップロードしたデータ:
  - processing-historyId: "00c86699-9084-41f0-aae8-632fe401556c"
    userId: "5tg87cxxd5"
    userName: "APIテストキー"
    customerId: "cus_TB7TNGpqOEFcst"
    status: "success"
    
  ✅ 他のユーザーがアップロードしたデータ:
  - processing-historyId: "..."
    userId: "別のユーザーID"
    userName: "別のユーザー"
    customerId: "cus_TB7TNGpqOEFcst"
    status: "success"
```

---

## 🎯 メリット

### 1. **管理者の利便性向上**
- ✅ 顧客全体のデータを一元管理
- ✅ API経由のデータもダウンロード可能
- ✅ 他のユーザーのデータも確認可能

### 2. **セキュリティ**
- ✅ 一般ユーザーは自分のデータのみアクセス
- ✅ ロールベースのアクセス制御
- ✅ データの分離が適切に実装されている

### 3. **パフォーマンス**
- ✅ GSIを使用した効率的なクエリ
- ✅ 必要なデータのみを取得
- ✅ ページネーション対応

---

## 📚 関連ドキュメント

- [API Lambda Flow](./API_LAMBDA_FLOW.md)
- [Processing History API](../app/lib/actions/processing-history-api.ts)
- [Service Container](../app/_containers/Service/ServiceContainer.tsx)

---

## 🔍 デバッグ情報

### コンソールログ

```typescript
console.log('取得データ:', {
  processingHistoryCount: processingHistory.length,
  processingHistoryQueryType: userProfile.role === 'admin' 
    ? 'customerId (全データ)' 
    : 'userId (個人データのみ)',
  policiesCount: policies.length,
  notifyLimitsCount: usageLimits.notifyLimits.length,
  restrictLimitsCount: usageLimits.restrictLimits.length
});
```

### 期待される出力

**一般ユーザー:**
```
取得データ: {
  processingHistoryCount: 5,
  processingHistoryQueryType: 'userId (個人データのみ)',
  policiesCount: 2,
  notifyLimitsCount: 1,
  restrictLimitsCount: 1
}
```

**管理者:**
```
取得データ: {
  processingHistoryCount: 15,  // より多くのデータ
  processingHistoryQueryType: 'customerId (全データ)',
  policiesCount: 2,
  notifyLimitsCount: 1,
  restrictLimitsCount: 1
}
```

---

作成日: 2025-10-30  
最終更新: 2025-10-30  
バージョン: 1.0

