# Policies テーブルにインデックスを追加する手順

## 問題
`siftbeam-policies` テーブルに `customerId-policyName-index` が存在しないため、以下のエラーが発生しています:

```
The table does not have the specified index: customerId-policyName-index
```

## 解決方法

### 方法1: CloudFormationスタックを更新 (推奨)

1. **CloudFormationコンソールにアクセス**
   - AWSマネジメントコンソール → CloudFormation

2. **スタックを選択**
   - `siftbeam-dynamodb-refactored` スタックを選択

3. **スタックを更新**
   - 「更新」ボタンをクリック
   - 「既存テンプレートを置き換える」を選択
   - 「テンプレートファイルのアップロード」を選択
   - 更新された `dynamodb-tables.yaml` をアップロード

4. **変更セットを確認**
   - 変更内容: `siftbeam-policies` テーブルに新しいGSI `customerId-policyName-index` が追加されます
   - リソースの置き換え: なし (インデックスの追加のみ)

5. **スタックの更新を実行**
   - 「スタックの更新」をクリック

6. **完了を待つ**
   - ステータスが `UPDATE_COMPLETE` になるまで待ちます (通常5-10分)

### 方法2: AWS CLIで更新

```bash
aws cloudformation update-stack \
  --stack-name siftbeam-dynamodb-refactored \
  --template-body file://dynamodb-tables.yaml \
  --region ap-northeast-1
```

### 方法3: DynamoDBコンソールで手動追加

1. **DynamoDBコンソールにアクセス**
   - AWSマネジメントコンソール → DynamoDB → テーブル

2. **テーブルを選択**
   - `siftbeam-policies` を選択

3. **インデックスタブを選択**
   - 「インデックス」タブをクリック

4. **インデックスを作成**
   - 「インデックスの作成」をクリック
   - パーティションキー: `customerId` (文字列)
   - ソートキー: `policyName` (文字列)
   - インデックス名: `customerId-policyName-index`
   - 属性の射影: すべて
   - 「インデックスの作成」をクリック

5. **完了を待つ**
   - インデックスのステータスが「アクティブ」になるまで待ちます (通常5-10分)

## 更新内容

### 追加された属性定義
```yaml
- AttributeName: policyName
  AttributeType: S
```

### 追加されたGSI
```yaml
- IndexName: customerId-policyName-index
  KeySchema:
    - AttributeName: customerId
      KeyType: HASH
    - AttributeName: policyName
      KeyType: RANGE
  Projection:
    ProjectionType: ALL
```

## 動作確認

インデックス追加後、以下の操作が正常に動作することを確認してください:

```bash
# アプリケーションを再起動
npm run dev
```

ブラウザで以下のページにアクセス:
- ポリシー一覧ページ
- ポリシー検索機能

エラーが解消され、ポリシーが正常に表示されることを確認してください。

## トラブルシューティング

### インデックス作成が失敗する場合

1. **テーブルにデータが存在するか確認**
   - データが多い場合、インデックス作成に時間がかかります
   - 最大30分程度かかる場合があります

2. **policyName属性が存在するか確認**
   - すべてのポリシーレコードに `policyName` 属性が存在する必要があります
   - 存在しない場合、インデックス作成が失敗します

3. **CloudFormationスタックのエラーを確認**
   - CloudFormationコンソールで「イベント」タブを確認
   - エラーメッセージを確認して対処

### 既存データに policyName がない場合

すべてのポリシーレコードに `policyName` を追加する必要があります:

```typescript
// スクリプト例 (update-policy-names.ts)
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

async function addPolicyNames() {
  const scanResult = await dynamoDocClient.send(new ScanCommand({
    TableName: 'siftbeam-policies'
  }));
  
  for (const item of scanResult.Items || []) {
    if (!item.policyName) {
      await dynamoDocClient.send(new UpdateCommand({
        TableName: 'siftbeam-policies',
        Key: { policyId: item.policyId },
        UpdateExpression: 'SET policyName = :name',
        ExpressionAttributeValues: {
          ':name': item.policyId // デフォルト値として policyId を使用
        }
      }));
    }
  }
}
```

## 参考

- [DynamoDB Global Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)
- [CloudFormation スタックの更新](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html)

