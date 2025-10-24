# DynamoDB Data Usage テーブル設定

## テーブル基本情報

**テーブル名:** `siftbeam-data-usage`

**パーティションキー:** `data-usageId` (String)

**課金モード:** オンデマンド (PAY_PER_REQUEST)

## グローバルセカンダリインデックス (GSI)

### 1. customerId-createdAt-index
- **パーティションキー:** `customerId` (String)
- **ソートキー:** `createdAt` (String)
- **プロジェクションタイプ:** ALL
- **用途:** 企業ごとの月次使用量取得

### 2. userId-createdAt-index (オプション)
- **パーティションキー:** `userId` (String)
- **ソートキー:** `createdAt` (String)
- **プロジェクションタイプ:** ALL
- **用途:** ユーザーごとの月次使用量取得

## 属性

| 属性名 | 型 | 説明 | 必須 |
|--------|------|------|------|
| data-usageId | String | データ使用量ID (PK) | ✓ |
| customerId | String | 企業ID | ✓ |
| userId | String | ユーザーID | ✓ |
| userName | String | ユーザー名 | ✓ |
| processingHistoryId | String | 処理履歴ID | ✓ |
| policyId | String | ポリシーID | ✓ |
| policyName | String | ポリシー名 | ✓ |
| usageAmountBytes | Number | 使用量（バイト） | ✓ |
| usageType | String | 使用タイプ ('processing' or 'storage') | ✓ |
| createdAt | String | 作成日時 (ISO8601形式) | ✓ |
| updatedAt | String | 更新日時 (ISO8601形式) | ✓ |
| completedAt | String | 処理完了時刻 (ISO8601形式) | - |

### 設計思想

**なぜuserIdとuserNameの両方を保存するのか？**
- ユーザーが削除された後も履歴を正しく表示するため
- userIdだけでは削除されたユーザーの情報を表示できない
- リレーション関係によるエラーを防ぐ

**なぜpolicyIdとpolicyNameの両方を保存するのか？**
- ポリシーが削除された後も履歴を正しく表示するため
- policyIdだけでは削除されたポリシーの情報を表示できない
- 履歴の完全性を保つ

**completedAtフィールドの用途**
- 処理完了時刻を記録
- 処理時間を計算可能（`completedAt - createdAt`）
- 処理のパフォーマンス分析に使用

## AWSコンソールでの作成手順

1. **DynamoDBコンソールにアクセス**
   - https://console.aws.amazon.com/dynamodb/

2. **テーブルの作成**
   - 「テーブルの作成」をクリック
   - テーブル名: `siftbeam-data-usage`
   - パーティションキー: `data-usageId` (String)
   - テーブル設定: デフォルト設定を使用
   - 「テーブルの作成」をクリック

3. **GSIの作成**
   - テーブルが作成されたら、「インデックス」タブに移動
   - 「インデックスの作成」をクリック
   
   **GSI 1: customerId-createdAt-index**
   - パーティションキー: `customerId` (String)
   - ソートキー: `createdAt` (String)
   - インデックス名: `customerId-createdAt-index`
   - 属性のプロジェクション: すべて
   - 「インデックスの作成」をクリック

   **GSI 2: userId-createdAt-index (オプション)**
   - パーティションキー: `userId` (String)
   - ソートキー: `createdAt` (String)
   - インデックス名: `userId-createdAt-index`
   - 属性のプロジェクション: すべて
   - 「インデックスの作成」をクリック

## AWS CLIでの作成コマンド

```bash
# テーブル作成
aws dynamodb create-table \
  --table-name siftbeam-data-usage \
  --attribute-definitions \
    AttributeName=data-usageId,AttributeType=S \
    AttributeName=customerId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=data-usageId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"customerId-createdAt-index\",
        \"KeySchema\": [
          {\"AttributeName\":\"customerId\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"createdAt\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\":{\"ProjectionType\":\"ALL\"}
      },
      {
        \"IndexName\": \"userId-createdAt-index\",
        \"KeySchema\": [
          {\"AttributeName\":\"userId\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"createdAt\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\":{\"ProjectionType\":\"ALL\"}
      }
    ]" \
  --region ap-northeast-1
```

## CloudFormationテンプレート

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'DynamoDB Data Usage Table for SiftBeam'

Resources:
  DataUsageTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: siftbeam-data-usage
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: data-usageId
          AttributeType: S
        - AttributeName: customerId
          AttributeType: S
        - AttributeName: userId
          AttributeType: S
        - AttributeName: createdAt
          AttributeType: S
      KeySchema:
        - AttributeName: data-usageId
          KeyType: HASH
      GlobalSecondaryIndexes:
        - IndexName: customerId-createdAt-index
          KeySchema:
            - AttributeName: customerId
              KeyType: HASH
            - AttributeName: createdAt
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
        - IndexName: userId-createdAt-index
          KeySchema:
            - AttributeName: userId
              KeyType: HASH
            - AttributeName: createdAt
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
      Tags:
        - Key: Application
          Value: SiftBeam
        - Key: Environment
          Value: Production

Outputs:
  TableName:
    Description: Data Usage Table Name
    Value: !Ref DataUsageTable
  TableArn:
    Description: Data Usage Table ARN
    Value: !GetAtt DataUsageTable.Arn
```

## IAM権限

テーブルにアクセスするには、以下のIAM権限が必要です:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:GetItem",
    "dynamodb:Query",
    "dynamodb:UpdateItem"
  ],
  "Resource": [
    "arn:aws:dynamodb:ap-northeast-1:YOUR_ACCOUNT_ID:table/siftbeam-data-usage",
    "arn:aws:dynamodb:ap-northeast-1:YOUR_ACCOUNT_ID:table/siftbeam-data-usage/index/*"
  ]
}
```

**注意:** `docs/iam-policy-fixed.json` に既に追加済みです。

## 環境変数設定

`.env.local` に以下を追加:

```bash
DATA_USAGE_TABLE_NAME=siftbeam-data-usage
```

## 使用方法

### データ使用量を記録

```typescript
import { createDataUsage } from '@/app/lib/actions/data-usage-api';

const result = await createDataUsage({
  customerId: 'customer-123',
  userId: 'user-456',
  userName: '山田太郎',
  processingHistoryId: 'history-789',
  policyId: 'policy-abc',
  policyName: '画像分類ポリシー',
  usageAmountBytes: 1048576, // 1MB
  usageType: 'processing'
});
```

### 企業の月次使用量を取得

```typescript
import { getCustomerMonthlyUsage } from '@/app/lib/actions/data-usage-api';

const result = await getCustomerMonthlyUsage('customer-123');
console.log(`Total usage: ${result.data?.totalBytes} bytes`);
```

### ユーザーの月次使用量を取得

```typescript
import { getUserMonthlyUsage } from '@/app/lib/actions/data-usage-api';

const result = await getUserMonthlyUsage('user-456');
console.log(`Total usage: ${result.data?.totalBytes} bytes`);
```

### データ使用量を更新（処理完了時）

```typescript
import { updateDataUsage } from '@/app/lib/actions/data-usage-api';

const result = await updateDataUsage('data-usage-id', {
  completedAt: new Date().toISOString()
});
```

### data-usageIdでデータ使用量を取得

```typescript
import { getDataUsageById } from '@/app/lib/actions/data-usage-api';

// S3メタデータからdataUsageIdを取得して使用
const result = await getDataUsageById('data-usage-id');
if (result.data) {
  const processingTime = result.data.completedAt 
    ? new Date(result.data.completedAt).getTime() - new Date(result.data.createdAt).getTime()
    : null;
  console.log(`Processing time: ${processingTime}ms`);
}
```

### ワークフロー例

1. **ファイルアップロード時**
   ```typescript
   // data-usageIdを事前に生成
   const dataUsageId = crypto.randomUUID();
   
   // S3アップロード（メタデータにdataUsageIdを含める）
   await uploadServiceFileToS3({
     file,
     customerId,
     userId,
     policyId,
     processingHistoryId,
     dataUsageId, // ここで渡す
     fileType: 'input'
   });
   
   // データ使用量を記録
   await createDataUsage({
     'data-usageId': dataUsageId, // 同じIDを使用
     customerId,
     userId,
     userName,
     processingHistoryId,
     policyId,
     policyName,
     usageAmountBytes,
     usageType: 'processing'
   });
   ```

2. **処理完了時（Step Functionsから）**
   ```typescript
   // S3メタデータからdataUsageIdを取得
   const metadata = s3Object.metadata;
   const dataUsageId = metadata.dataUsageId;
   
   // completedAtを更新
   await updateDataUsage(dataUsageId, {
     completedAt: new Date().toISOString()
   });
   ```

## 注意事項

1. **createdAtの形式**: ISO 8601形式（例: `2025-10-14T12:00:00.000Z`）
2. **月次計算**: 現在の月の1日00:00:00以降のデータを取得
3. **課金**: オンデマンドモードのため、読み取り/書き込みごとに課金
4. **GSI**: GSIの作成には数分かかる場合があります

## トラブルシューティング

### エラー: "Table not found"
- テーブルが作成されているか確認
- 環境変数 `DATA_USAGE_TABLE_NAME` が正しく設定されているか確認

### エラー: "Index not found"
- GSI `customerId-createdAt-index` が作成されているか確認
- GSIのステータスが "ACTIVE" になっているか確認

### データが取得できない
- CloudWatch Logsでエラーログを確認
- IAM権限が正しく設定されているか確認
- リージョンが正しいか確認（ap-northeast-1）

