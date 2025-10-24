# DynamoDBテーブル設計: policy-stepfunction-mapping

## 概要

ポリシーIDと実行する子Step FunctionのARNを紐づけるテーブルです。親Step Functionが、ポリシーIDに基づいて適切な子Step Functionを動的に選択するために使用します。

---

## テーブル設計

### テーブル名
```
siftbeam-policy-stepfunction-mapping
```

### プライマリキー

| 属性名 | 型 | キータイプ | 説明 |
|--------|---|----------|------|
| `policyId` | String | PARTITION KEY | ポリシーの一意識別子 |

**理由**: 
- ポリシーIDで直接検索するため、パーティションキーとして最適
- ソートキーは不要（1つのポリシーIDに1つのStep Function ARNが対応）

---

## 属性（カラム）

### 必須属性

| 属性名 | 型 | 説明 | 例 |
|--------|---|------|-----|
| `policyId` | String | ポリシーの一意識別子（主キー） | `13add29f-d814-4457-912b-40aa9585cc24` |
| `stateMachineArn` | String | 子Step FunctionのARN | `arn:aws:states:ap-northeast-1:123456789012:stateMachine:ImageProcessingSM` |
| `createdAt` | String (ISO8601) | 作成日時 | `2025-10-16T12:00:00.000Z` |
| `updatedAt` | String (ISO8601) | 更新日時 | `2025-10-16T12:00:00.000Z` |

### オプション属性

なし（必要に応じてポリシーテーブルから取得）

---

## グローバルセカンダリインデックス (GSI)

なし（policyIdで直接GetItemするだけなので不要）

---

## テーブル設定

### キャパシティモード

**推奨**: オンデマンド

**理由**:
- 読み取り頻度: 高（ファイルアップロードのたびに参照）
- 書き込み頻度: 低（ポリシー追加・更新時のみ）
- トラフィックが予測しにくい

### 暗号化

**推奨**: AWS管理のキー（SSE-S3）

### ポイントインタイムリカバリ (PITR)

**推奨**: 有効化

**理由**: ポリシー設定の誤削除や変更から復旧できる

---

## データ例

### 例1: 画像処理ポリシー

```json
{
  "policyId": "13add29f-d814-4457-912b-40aa9585cc24",
  "stateMachineArn": "arn:aws:states:ap-northeast-1:123456789012:stateMachine:ImageProcessingSM-v1",
  "createdAt": "2025-10-16T12:00:00.000Z",
  "updatedAt": "2025-10-16T12:00:00.000Z"
}
```

### 例2: 表計算処理ポリシー

```json
{
  "policyId": "dab72b9a-56fc-4d27-888d-03e40ce978e5",
  "stateMachineArn": "arn:aws:states:ap-northeast-1:123456789012:stateMachine:SpreadsheetProcessingSM-v1",
  "createdAt": "2025-10-16T12:00:00.000Z",
  "updatedAt": "2025-10-16T12:00:00.000Z"
}
```

### 例3: 動画処理ポリシー（v2にアップデート済み）

```json
{
  "policyId": "a1b2c3d4-e5f6-4789-0123-456789abcdef",
  "stateMachineArn": "arn:aws:states:ap-northeast-1:123456789012:stateMachine:VideoProcessingSM-v2",
  "createdAt": "2025-10-15T10:00:00.000Z",
  "updatedAt": "2025-10-16T15:30:00.000Z"
}
```

**注意**: 例3では、不具合修正のため`VideoProcessingSM-v1`から`VideoProcessingSM-v2`に更新され、`updatedAt`が変更されています。

---

## 親Step Functionでの使用方法

### 修正が必要な部分

現在の親Step Function（`ServiceProcessingOrchestrator`）は、`policyId`に基づいてChoice Stateで分岐していますが、これをDynamoDBルックアップに変更します。

### 新しいアーキテクチャ

```
親Step Function
  ↓
State 1: ValidateInput (Lambda)
  ↓
State 2: GetStateMachineArn (Lambda) ← 新規追加
  - DynamoDBから policyId でマッピングを取得
  - stateMachineArn を返す
  ↓
State 3: InvokeChildStateMachine
  - 動的にARNを指定
  ↓
以下、既存の処理...
```

### Lambda関数: GetStateMachineArn

```python
import boto3
import os

dynamodb = boto3.resource('dynamodb')

MAPPING_TABLE = os.environ.get('POLICY_STEPFUNCTION_MAPPING_TABLE', 'siftbeam-policy-stepfunction-mapping')

def lambda_handler(event, context):
    """
    policyIdに基づいてStep Function ARNを取得
    """
    policy_id = event['policyId']
    
    try:
        table = dynamodb.Table(MAPPING_TABLE)
        
        response = table.get_item(
            Key={'policyId': policy_id}
        )
        
        if 'Item' not in response:
            raise ValueError(f"Policy mapping not found: {policy_id}")
        
        mapping = response['Item']
        
        return {
            'stateMachineArn': mapping['stateMachineArn']
        }
    
    except Exception as e:
        print(f"Error getting state machine ARN: {repr(e)}")
        raise
```

### 修正後の親Step Function ASL（抜粋）

```json
{
  "States": {
    "ValidateInput": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ValidateInput",
      "Next": "GetStateMachineArn"
    },
    "GetStateMachineArn": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:GetStateMachineArn",
      "Parameters": {
        "policyId.$": "$.policyId"
      },
      "ResultPath": "$.stateMachineInfo",
      "Next": "InvokeChildStateMachine"
    },
    "InvokeChildStateMachine": {
      "Type": "Task",
      "Resource": "arn:aws:states:::states:startExecution.sync:2",
      "Parameters": {
        "StateMachineArn.$": "$.stateMachineInfo.stateMachineArn",
        "Input": {
          "processingHistoryId.$": "$.processingHistoryId",
          "customerId.$": "$.customerId",
          "userId.$": "$.userId",
          "userName.$": "$.userName",
          "policyId.$": "$.policyId",
          "policyName.$": "$.policyName",
          "inputS3Key.$": "$.inputS3Key",
          "inputS3Bucket.$": "$.inputS3Bucket",
          "aiTrainingUsage.$": "$.aiTrainingUsage",
          "uploadedFileKeys.$": "$.uploadedFileKeys"
        }
      },
      "Next": "ProcessChildResult"
    }
  }
}
```

**注意**: `policyName`, `userName`などは既存のinputから取得（ポリシーテーブルからクエリ済み）

---

## 管理API（CRUD操作）

### Create: ポリシーマッピングを作成

```python
def create_policy_mapping(policy_id, state_machine_arn):
    """
    新規ポリシーマッピングを作成
    """
    table = dynamodb.Table('siftbeam-policy-stepfunction-mapping')
    
    now = datetime.now(timezone.utc).isoformat()
    
    item = {
        'policyId': policy_id,
        'stateMachineArn': state_machine_arn,
        'createdAt': now,
        'updatedAt': now
    }
    
    table.put_item(Item=item)
    return item
```

### Read: ポリシーマッピングを取得

```python
def get_policy_mapping(policy_id):
    """
    policyIdからStep Function ARNを取得
    """
    table = dynamodb.Table('siftbeam-policy-stepfunction-mapping')
    
    response = table.get_item(Key={'policyId': policy_id})
    return response.get('Item')
```

### Update: Step Function ARNを更新

```python
def update_state_machine_arn(policy_id, new_state_machine_arn):
    """
    既存ポリシーのStep Function ARNを更新（不具合修正時など）
    
    ユースケース:
    - 既存ポリシーで不具合が発生
    - 新しいバージョン（v2）のStep Functionを作成してテスト
    - テスト成功後、既存ポリシーのARNをv2に切り替え
    - 顧客のポリシー情報は引き継がれる
    """
    table = dynamodb.Table('siftbeam-policy-stepfunction-mapping')
    
    now = datetime.now(timezone.utc).isoformat()
    
    response = table.update_item(
        Key={'policyId': policy_id},
        UpdateExpression='SET stateMachineArn = :arn, updatedAt = :updated',
        ExpressionAttributeValues={
            ':arn': new_state_machine_arn,
            ':updated': now
        },
        ReturnValues='ALL_NEW'
    )
    
    return response['Attributes']
```

### Delete: ポリシーマッピングを削除

```python
def delete_policy_mapping(policy_id):
    """
    ポリシーマッピングを物理削除
    """
    table = dynamodb.Table('siftbeam-policy-stepfunction-mapping')
    
    table.delete_item(Key={'policyId': policy_id})
```

---

## テーブル作成のCloudFormation/CDK例

### AWS CLI

```bash
aws dynamodb create-table \
  --table-name siftbeam-policy-stepfunction-mapping \
  --attribute-definitions \
    AttributeName=policyId,AttributeType=S \
  --key-schema \
    AttributeName=policyId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-1
```

**シンプル!** GSI不要、属性はpolicyIdのみ定義（他の属性はスキーマレス）

---

## メリット

### 1. 動的な管理

- ポリシーと子Step Functionの紐づけをコードではなくデータで管理
- 新しいポリシーを追加する際、親Step Functionのデプロイ不要

### 2. 柔軟性

- ポリシーごとに異なるタイムアウト、同時実行数を設定可能
- A/Bテスト: 同じポリシータイプで異なるStep Functionを試せる

### 3. 運用性

- 管理画面でポリシーの有効/無効を切り替え可能
- バージョン管理により、段階的なロールアウトが可能

### 4. スケーラビリティ

- ポリシー数が増えてもパフォーマンスに影響しない
- GSIによる効率的な検索

---

## まとめ

### テーブル構造（最終案）

```
テーブル名: siftbeam-policy-stepfunction-mapping

プライマリキー:
  - policyId (String, PARTITION KEY)

必須属性:
  - stateMachineArn (String) - 子Step FunctionのARN
  - createdAt (String, ISO8601) - 作成日時
  - updatedAt (String, ISO8601) - 更新日時

GSI: なし

キャパシティモード: オンデマンド

特徴:
  - シンプル設計（policyId → stateMachineArn のマッピング）
  - ポリシー詳細はポリシーテーブルから取得
  - ARN更新可能（不具合修正時、v1→v2への切り替えなど）
  - 顧客のポリシー情報は引き継がれる（ポリシーIDは変わらない）
```

### 次のステップ

1. ✅ テーブル設計完了
2. ⬜ DynamoDBテーブル作成
3. ⬜ 初期データ投入
4. ⬜ Lambda関数 `GetStateMachineArn` 実装
5. ⬜ 親Step Functionの修正
6. ⬜ テスト

この設計で進めてよろしいですか?🚀

