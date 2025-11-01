# APIキータグ付け機能の使用例

## 概要
APIキーには自動的にタグが付与されます。タグを使用することで、プロジェクト、環境、バージョンなどの情報を管理できます。

## 基本的な使用方法

### 1. APIキー作成（タグは自動付与）

```typescript
import { createAPIKeyAction } from '@/app/lib/actions/api-key-actions';

const result = await createAPIKeyAction({
  apiName: 'Production API Key',
  description: '本番環境用のAPIキー',
  policyId: 'policy-xxx'
  // タグは自動的に付与されます（environment: 'Production', version: 'v1.0'）
});

if (result.success) {
  console.log('APIキーが作成されました:', result.apiKey);
  console.log('APIキー値:', result.gatewayApiKeyValue);
  console.log('タグ:', result.apiKey?.tags);
  // 出力例:
  // {
  //   Project: 'siftbeam',
  //   customerId: 'cus_xxxxx',
  //   environment: 'Production',
  //   version: 'v1.0'
  // }
}
```

### 2. 既存のAPIキーにタグを追加/更新

```typescript
import { updateAPIKeyAction } from '@/app/lib/actions/api-key-actions';

const result = await updateAPIKeyAction({
  'api-keysId': 'abc123',
  tags: {
    environment: 'Staging',
    version: 'v2.0'
  }
});

if (result.success) {
  console.log('タグが更新されました:', result.apiKey?.tags);
}
```

### 3. APIキーのタグを取得

```typescript
import { getAPIKeyTagsAction } from '@/app/lib/actions/api-key-actions';

const result = await getAPIKeyTagsAction('abc123');

if (result.success) {
  console.log('タグ:', result.tags);
  // 出力例:
  // {
  //   Project: 'siftbeam',
  //   customerId: 'cus_xxxxx',
  //   environment: 'Production',
  //   version: 'v1.0'
  // }
}
```

## タグの種類

### 自動付与されるタグ
すべてのAPIキーに以下のタグが自動的に付与されます：

| タグキー | 説明 | デフォルト値 | 変更可能 |
|---------|------|------------|---------|
| `Project` | プロジェクト名（固定） | `siftbeam` | ❌ |
| `customerId` | 顧客ID（所有者の識別用） | 認証ユーザーのID | ❌ |
| `environment` | 環境 | `Production` | ✅ |
| `version` | バージョン | `v1.0` | ✅ |

> **設計思想**: 
> - **シンプルさ**: 必要最小限のタグのみを使用
> - **自動化**: すべてのAPIキーに一貫したタグを自動付与
> - **柔軟性**: `environment`と`version`は更新可能
> - **重複排除**: 作成日時はAWSコンソールで確認可能なため除外
> - **識別**: 所有者は`customerId`で識別可能

### タグの更新
`environment`と`version`タグは、APIキー作成後に更新できます。`Project`と`customerId`は固定です。

## 実装例

### React コンポーネントでの使用

```typescript
'use client'

import { useState } from 'react';
import { Input, Button, Card } from '@heroui/react';
import { createAPIKeyAction } from '@/app/lib/actions/api-key-actions';

export default function CreateAPIKeyForm() {
  const [apiName, setApiName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await createAPIKeyAction({
        apiName,
        description,
        policyId: 'policy-xxx'
        // タグは自動的に付与されます
        // Project: 'siftbeam'
        // customerId: (認証ユーザーのID)
        // environment: 'Production'
        // version: 'v1.0'
      });

      if (result.success) {
        alert('APIキーが作成されました！');
        console.log('APIキー値:', result.gatewayApiKeyValue);
        console.log('付与されたタグ:', result.apiKey?.tags);
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Input
        label="API名"
        value={apiName}
        onChange={(e) => setApiName(e.target.value)}
      />
      <Input
        label="説明"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        color="primary"
        onPress={handleSubmit}
        isLoading={loading}
      >
        APIキーを作成
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        ※ タグ（Project, customerId, environment, version）は自動的に付与されます
      </p>
    </Card>
  );
}
```

### タグによるフィルタリング

```typescript
import { getAPIKeysByCustomerIdAction } from '@/app/lib/actions/api-key-actions';

// すべてのAPIキーを取得
const result = await getAPIKeysByCustomerIdAction(100);

if (result.success && result.apiKeys) {
  // Production環境のAPIキーのみをフィルタリング
  const productionKeys = result.apiKeys.filter(
    key => key.tags?.environment === 'Production'
  );

  // バージョンごとにグループ化
  const keysByVersion = result.apiKeys.reduce((acc, key) => {
    const version = key.tags?.version || 'Unknown';
    if (!acc[version]) acc[version] = [];
    acc[version].push(key);
    return acc;
  }, {} as Record<string, typeof result.apiKeys>);

  console.log('Production APIキー:', productionKeys);
  console.log('バージョン別APIキー:', keysByVersion);
}
```

## タグの更新パターン

### パターン1: 既存のタグに新しいタグを追加

```typescript
// 既存のAPIキーを取得
const apiKeyResult = await getAPIKeyByIdAction('abc123');

if (apiKeyResult.success && apiKeyResult.apiKey) {
  // 既存のタグと新しいタグをマージ
  const updatedTags = {
    ...apiKeyResult.apiKey.tags,
    newTag: 'newValue'
  };

  // 更新
  await updateAPIKeyAction({
    'api-keysId': 'abc123',
    tags: updatedTags
  });
}
```

### パターン2: 特定のタグを削除

```typescript
// 既存のAPIキーを取得
const apiKeyResult = await getAPIKeyByIdAction('abc123');

if (apiKeyResult.success && apiKeyResult.apiKey) {
  // 特定のタグを除外
  const { environment, ...remainingTags } = apiKeyResult.apiKey.tags || {};

  // 更新（environmentタグが削除される）
  await updateAPIKeyAction({
    'api-keysId': 'abc123',
    tags: remainingTags
  });
}
```

### パターン3: 環境とバージョンを更新

```typescript
// 環境とバージョンのみを更新（Project, customerIdは変更不可）
await updateAPIKeyAction({
  'api-keysId': 'abc123',
  tags: {
    Project: 'siftbeam',        // 固定値（変更不可）
    customerId: 'cus_xxxxx',    // 固定値（変更不可）
    environment: 'Staging',     // 更新可能
    version: 'v2.0'             // 更新可能
  }
});
```

## ベストプラクティス

### 1. 一貫した命名規則
```typescript
// ✅ 良い例
tags: {
  environment: 'Production',  // 大文字始まり
  version: 'v1.0'
}

// ❌ 悪い例
tags: {
  env: 'prod',  // 略語
  Version: 'v1.0',  // 大文字小文字が不統一
  ver: '1.0'  // 略語、プレフィックスなし
}
```

### 2. 環境の値の制限
```typescript
const VALID_ENVIRONMENTS = ['Production', 'Staging', 'Development'];

function validateEnvironment(env: string): boolean {
  return VALID_ENVIRONMENTS.includes(env);
}

// 使用例
const environment = 'Production';
if (!validateEnvironment(environment)) {
  throw new Error('無効な環境が指定されました');
}
```

### 3. バージョンの形式チェック
```typescript
function validateVersion(version: string): boolean {
  // v1.0, v2.1, v3.0.1 などの形式をチェック
  return /^v\d+\.\d+(\.\d+)?$/.test(version);
}

// 使用例
const version = 'v1.0';
if (!validateVersion(version)) {
  throw new Error('バージョンは v1.0 の形式で指定してください');
}
```

## コスト管理への活用

### タグによるコスト追跡
```typescript
// 環境別にAPIキーを管理してコストを追跡
const tags = {
  environment: 'Production',
  version: 'v1.0'
};

// AWS Cost Explorerでこれらのタグを使用して、環境別やバージョン別のコストを追跡できます
// 例: Production環境のAPIキー使用量、v1.0とv2.0のコスト比較など
```

## トラブルシューティング

### 問題: タグが更新されない
```typescript
// 原因: API Gateway側でタグが更新されていない可能性
// 解決: getAPIKeyTagsActionで確認

const result = await getAPIKeyTagsAction('abc123');
console.log('API Gatewayのタグ:', result.tags);
```

### 問題: タグが多すぎる
```
エラー: Maximum number of tags exceeded
```

**解決方法**: AWS API Gatewayは最大50個のタグをサポートします。不要なタグを削除してください。

## まとめ

- **デフォルトタグ**: `Project`と`customerId`は自動的に追加される
- **カスタムタグ**: `environment`と`version`で環境とバージョンを管理
- **シンプル設計**: 必要最小限のタグで管理を簡素化
- **所有者識別**: `customerId`で所有者を識別（別途ownerタグは不要）
- **作成日時**: AWSコンソールで確認可能（タグには不要）
- **コスト追跡**: 環境別・バージョン別のコスト分析が可能

