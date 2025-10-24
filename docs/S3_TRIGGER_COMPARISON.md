# S3イベントトリガーの比較: Lambda vs EventBridge

## 概要

S3にオブジェクトがアップロードされた際に親Step Function（`ServiceProcessingOrchestrator`）を起動する方法は2つあります:

1. **S3イベント通知 → Lambda → Step Functions**
2. **S3 → EventBridge → Step Functions**

このドキュメントでは、両方の方法を詳しく比較し、推奨アプローチを提案します。

---

## 方法1: S3イベント通知 → Lambda → Step Functions

### アーキテクチャ

```
S3バケット (siftbeam)
  └─ service/input/{customerId}/{processingHistoryId}/file.jpg
         ↓ (S3イベント通知)
Lambda関数 (TriggerParentStepFunction)
  - S3パスを解析
  - processingHistoryIdを抽出
  - DynamoDBからprocessing-historyを取得
  - メタデータを検証
  - Step Functionsを起動
         ↓
Step Functions (ServiceProcessingOrchestrator)
```

### 設定方法

#### S3バケット設定（イベント通知）

S3コンソールで:
1. バケット → プロパティ → イベント通知
2. **「イベント通知を作成」** をクリック
3. 設定:
   - **名前**: `TriggerServiceProcessing`
   - **イベントタイプ**: `すべてのオブジェクト作成イベント`
   - **プレフィックス**: `service/input/`
   - **送信先タイプ**: `Lambda 関数`
   - **送信先**: `TriggerParentStepFunction`

#### Lambda関数

```python
import json
import boto3
import os

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
sfn = boto3.client('stepfunctions')

PROCESSING_HISTORY_TABLE = os.environ['PROCESSING_HISTORY_TABLE']
PARENT_STATE_MACHINE_ARN = os.environ['PARENT_STATE_MACHINE_ARN']

def lambda_handler(event, context):
    """
    S3イベントから親Step Functionsを起動
    """
    try:
        for record in event.get('Records', []):
            # S3情報を取得
            bucket_name = record['s3']['bucket']['name']
            s3_key = record['s3']['object']['key']
            
            print(f"Processing S3 event: s3://{bucket_name}/{s3_key}")
            
            # S3パスを検証
            validation = validate_s3_key(s3_key)
            if not validation['valid']:
                print(f"Invalid S3 key: {validation['error']}")
                continue
            
            customer_id = validation['customerId']
            processing_history_id = validation['processingHistoryId']
            file_type = validation['fileType']
            
            # inputファイルのみ処理（outputやtempは無視）
            if file_type != 'input':
                print(f"Skipping non-input file: {file_type}")
                continue
            
            # S3メタデータを取得
            metadata = get_s3_metadata(bucket_name, s3_key)
            
            # triggerStepFunctionフラグを確認
            if metadata.get('triggerstepfunction') != 'true':
                print(f"Skipping: triggerStepFunction={metadata.get('triggerstepfunction')}")
                continue
            
            # DynamoDBからprocessing-historyを取得
            history = get_processing_history(processing_history_id)
            if not history:
                print(f"Processing history not found: {processing_history_id}")
                continue
            
            # customerIdの整合性チェック
            if history['customerId'] != customer_id:
                print(f"CustomerID mismatch: path={customer_id}, db={history['customerId']}")
                continue
            
            # Step Functionsを起動
            execution_input = {
                'processingHistoryId': processing_history_id,
                'customerId': customer_id,
                'userId': history['userId'],
                'userName': history['userName'],
                'policyId': history['policyId'],
                'policyName': history['policyName'],
                'inputS3Key': s3_key,
                'inputS3Bucket': bucket_name,
                'uploadedFileKeys': history['uploadedFileKeys'],
                'aiTrainingUsage': history.get('aiTrainingUsage', 'allow'),
                'fileSizeBytes': history.get('fileSizeBytes', 0),
                'usageAmountBytes': history.get('usageAmountBytes', 0),
                'createdAt': history['createdAt']
            }
            
            execution_name = f"{processing_history_id}-{int(context.get_remaining_time_in_millis())}"
            
            response = sfn.start_execution(
                stateMachineArn=PARENT_STATE_MACHINE_ARN,
                name=execution_name,
                input=json.dumps(execution_input)
            )
            
            print(f"Started Step Functions execution: {response['executionArn']}")
        
        return {'statusCode': 200}
    
    except Exception as e:
        print(f"Error in TriggerParentStepFunction: {repr(e)}")
        return {'statusCode': 500, 'error': str(e)}


def validate_s3_key(s3_key):
    """S3キーを検証"""
    parts = s3_key.split('/')
    
    if len(parts) < 5:
        return {'valid': False, 'error': 'Invalid path structure'}
    
    if parts[0] != 'service':
        return {'valid': False, 'error': 'Not a service path'}
    
    file_type = parts[1]
    if file_type not in ['input', 'output', 'temp']:
        return {'valid': False, 'error': f'Invalid file type: {file_type}'}
    
    return {
        'valid': True,
        'customerId': parts[2],
        'processingHistoryId': parts[3],
        'fileType': file_type
    }


def get_s3_metadata(bucket_name, s3_key):
    """S3メタデータを取得"""
    try:
        response = s3.head_object(Bucket=bucket_name, Key=s3_key)
        return response.get('Metadata', {})
    except Exception as e:
        print(f"Error getting S3 metadata: {repr(e)}")
        return {}


def get_processing_history(processing_history_id):
    """DynamoDBからprocessing-historyを取得"""
    try:
        table = dynamodb.Table(PROCESSING_HISTORY_TABLE)
        response = table.get_item(
            Key={'processing-historyId': processing_history_id}
        )
        return response.get('Item')
    except Exception as e:
        print(f"Error getting processing history: {repr(e)}")
        return None
```

#### IAM権限（Lambda実行ロール）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::siftbeam/service/input/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/siftbeam-processing-history"
    },
    {
      "Effect": "Allow",
      "Action": [
        "states:StartExecution"
      ],
      "Resource": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:ServiceProcessingOrchestrator"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

---

## 方法2: S3 → EventBridge → Step Functions

### アーキテクチャ

```
S3バケット (siftbeam)
  └─ service/input/{customerId}/{processingHistoryId}/file.jpg
         ↓ (EventBridge統合)
Amazon EventBridge
  - イベントルール: S3オブジェクト作成
  - フィルター: プレフィックス、メタデータ
  - Input Transformer: データ変換
         ↓
Step Functions (ServiceProcessingOrchestrator)
  または
Lambda関数 (データ取得・変換) → Step Functions
```

### 設定方法

#### S3バケット設定（EventBridge統合）

S3コンソールで:
1. バケット → プロパティ → Amazon EventBridge
2. **「オン」** に切り替え

これだけで、S3のすべてのイベントがEventBridgeに送信されます。

#### EventBridgeルール

##### オプションA: EventBridge → Lambda → Step Functions

**EventBridgeルール設定:**

```json
{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["siftbeam"]
    },
    "object": {
      "key": [{
        "prefix": "service/input/"
      }]
    }
  }
}
```

**ターゲット:** Lambda関数（方法1と同じ）

##### オプションB: EventBridge → Step Functions（直接）

**問題点:** EventBridgeから直接Step Functionsを起動する場合、DynamoDBからprocessing-historyを取得できません。

**解決策:** Step FunctionsのValidateInputステートでDynamoDBから取得。

**EventBridgeルール設定:**

```json
{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["siftbeam"]
    },
    "object": {
      "key": [{
        "prefix": "service/input/"
      }]
    }
  }
}
```

**Input Transformer:**

```json
{
  "inputPathsMap": {
    "bucket": "$.detail.bucket.name",
    "key": "$.detail.object.key"
  },
  "inputTemplate": "{\"inputS3Bucket\": \"<bucket>\", \"inputS3Key\": \"<key>\"}"
}
```

**Step Functionsの修正:**

ValidateInputステートで:
1. S3パスからprocessingHistoryIdを抽出
2. DynamoDBからprocessing-historyを取得
3. 必要な情報を取得

**ValidateInput Lambda関数（修正版）:**

```python
def lambda_handler(event, context):
    """
    EventBridge経由の場合、processing-historyを取得
    """
    input_s3_key = event['inputS3Key']
    input_s3_bucket = event['inputS3Bucket']
    
    # S3パスを解析
    parts = input_s3_key.split('/')
    customer_id = parts[2]
    processing_history_id = parts[3]
    
    # DynamoDBからprocessing-historyを取得
    table = dynamodb.Table(PROCESSING_HISTORY_TABLE)
    response = table.get_item(
        Key={'processing-historyId': processing_history_id}
    )
    
    if 'Item' not in response:
        raise ValueError(f"Processing history not found: {processing_history_id}")
    
    history = response['Item']
    
    # S3メタデータを確認
    metadata = s3.head_object(Bucket=input_s3_bucket, Key=input_s3_key)['Metadata']
    
    if metadata.get('triggerstepfunction') != 'true':
        raise ValueError("triggerStepFunction is not true")
    
    # 必要な情報を返す（Step Functionsの後続ステートで使用）
    return {
        'processingHistoryId': processing_history_id,
        'customerId': customer_id,
        'userId': history['userId'],
        'userName': history['userName'],
        'policyId': history['policyId'],
        'policyName': history['policyName'],
        'uploadedFileKeys': history['uploadedFileKeys'],
        'aiTrainingUsage': history.get('aiTrainingUsage', 'allow'),
        'createdAt': history['createdAt']
    }
```

---

## 詳細比較

### 1. コスト

| 項目 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **S3イベント通知** | 無料 | 無料 |
| **EventBridge** | - | $1.00 / 100万イベント |
| **Lambda実行** | $0.20 / 100万リクエスト<br>+ 実行時間課金 | $0.20 / 100万リクエスト<br>+ 実行時間課金 |
| **Step Functions** | $0.025 / 1000 state transitions | $0.025 / 1000 state transitions |
| **合計（100万ファイル）** | ~$0.20 + Lambda実行時間 | ~$1.20 + Lambda実行時間 |

**コスト差:** EventBridgeは追加で約$1.00 / 100万イベントかかる

### 2. レイテンシー

| 項目 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **S3 → トリガー** | ~100-200ms | ~1-3秒 |
| **Lambda Cold Start** | 100-200ms | 100-200ms |
| **Lambda実行時間** | 50-100ms | 50-100ms |
| **Step Functions起動** | ~50ms | ~50ms |
| **合計** | **300-550ms** | **1.2-3.4秒** |

**レイテンシー差:** EventBridgeは約1-3秒遅い

### 3. 柔軟性

| 機能 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **プレフィックスフィルター** | ✅ | ✅ |
| **サフィックスフィルター** | ✅ | ✅ |
| **メタデータフィルター** | ✅（Lambda内） | ✅（EventBridgeルール） |
| **複雑なロジック** | ✅（Lambda内で自由） | ⚠️（Input Transformerの制約） |
| **複数ターゲット** | ❌（1つのLambda） | ✅（複数ターゲット可能） |
| **イベントアーカイブ** | ❌ | ✅ |
| **イベントリプレイ** | ❌ | ✅ |
| **クロスアカウント** | ❌ | ✅ |

### 4. 設定の複雑さ

| 項目 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **S3設定** | イベント通知を作成 | EventBridgeをオンに切り替え |
| **追加リソース** | Lambda関数 | EventBridgeルール |
| **IAM権限** | Lambda実行ロール | EventBridgeロール |
| **デバッグ** | CloudWatch Logsで容易 | EventBridge + CloudWatch Logs |

### 5. 信頼性

| 項目 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **再試行** | Lambda自動リトライ（2回） | EventBridgeルールでリトライ設定可能 |
| **エラーハンドリング** | Lambda内で自由に実装 | DLQ（デッドレターキュー）設定可能 |
| **モニタリング** | CloudWatch Logs/Metrics | CloudWatch + EventBridge Metrics |
| **保証** | At-least-once delivery | At-least-once delivery |

### 6. スケーラビリティ

| 項目 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **同時実行数** | Lambda制限（1000、拡張可能） | EventBridge制限なし |
| **スループット** | 非常に高い | 非常に高い |
| **制約** | Lambda同時実行数制限 | EventBridgeルール数制限（300） |

### 7. 将来の拡張性

| 機能 | Lambda経由 | EventBridge経由 |
|------|-----------|----------------|
| **新しいターゲット追加** | ❌（Lambda変更が必要） | ✅（新しいルールを追加するだけ） |
| **イベント分析** | ❌（自分で実装） | ✅（EventBridge Insightsなど） |
| **サードパーティ連携** | ❌（Lambda内で実装） | ✅（EventBridge API Destinations） |
| **条件分岐** | ✅（Lambda内で自由） | ✅（複数ルール） |

---

## ユースケース別の推奨

### ✅ Lambda経由を推奨する場合

1. **シンプルなワークフロー**
   - S3 → 処理 → Step Functionsの単純な流れ
   - 1つのターゲットのみ

2. **コスト最適化が重要**
   - 大量のファイル処理（100万件以上/月）
   - EventBridgeの$1/100万イベントが気になる

3. **低レイテンシーが重要**
   - リアルタイム処理が必要
   - 数秒の遅延も許容できない

4. **複雑なロジック**
   - DynamoDBからデータ取得
   - S3メタデータの検証
   - 複雑な条件分岐

### ✅ EventBridge経由を推奨する場合

1. **複数のターゲット**
   - S3イベントを複数のサービスに通知
   - 例: Step Functions + SNS + Lambda

2. **イベント駆動アーキテクチャ**
   - イベントアーカイブ・リプレイが必要
   - イベント分析が必要

3. **将来の拡張性**
   - 新しいターゲットを追加する可能性が高い
   - サードパーティとの連携予定

4. **クロスアカウント/リージョン**
   - 複数のAWSアカウント間でイベントを共有
   - 複数のリージョンに配信

5. **監査・コンプライアンス**
   - イベントの完全な履歴が必要
   - イベントの追跡が重要

---

## SiftBeamでの推奨: Lambda経由

### 推奨理由

1. ✅ **コスト最適化**
   - EventBridgeの追加コスト（$1/100万イベント）が不要
   - 大量のファイル処理を想定すると、コスト差が大きい

2. ✅ **低レイテンシー**
   - S3イベント通知は~100-200msで即座にLambdaを起動
   - EventBridgeは1-3秒の遅延がある

3. ✅ **シンプルな設計**
   - S3 → Lambda → Step Functionsの単純な流れ
   - 複数ターゲットの必要性がない

4. ✅ **複雑なロジックが必要**
   - DynamoDBからprocessing-historyを取得
   - S3メタデータの検証
   - customerIdの整合性チェック
   - Lambda内で柔軟に実装可能

5. ✅ **デバッグが容易**
   - CloudWatch Logsで詳細なログを確認
   - Lambda関数のコードを自由に変更可能

### 将来的にEventBridgeに移行する場合

もし将来的に以下の要件が出てきた場合、EventBridgeに移行することも可能:

- S3イベントを他のサービス（SNS、別のLambdaなど）にも通知したい
- イベントアーカイブ・リプレイ機能が必要
- クロスアカウント連携が必要

移行は比較的簡単:
1. S3でEventBridgeをオンにする
2. EventBridgeルールを作成
3. Lambda関数はそのまま使用（ターゲットをLambdaに設定）

---

## 実装例: Lambda経由（推奨）

### S3バケット設定

S3コンソール → プロパティ → イベント通知:

```
名前: TriggerServiceProcessing
イベントタイプ: すべてのオブジェクト作成イベント
プレフィックス: service/input/
送信先タイプ: Lambda 関数
送信先: TriggerParentStepFunction
```

### Lambda関数デプロイ

```bash
# Lambda関数を作成
aws lambda create-function \
  --function-name TriggerParentStepFunction \
  --runtime python3.12 \
  --role arn:aws:iam::ACCOUNT_ID:role/LambdaS3StepFunctionsRole \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --environment Variables="{
    PROCESSING_HISTORY_TABLE=siftbeam-processing-history,
    PARENT_STATE_MACHINE_ARN=arn:aws:states:REGION:ACCOUNT_ID:stateMachine:ServiceProcessingOrchestrator
  }"

# S3バケットにLambda呼び出し権限を付与
aws lambda add-permission \
  --function-name TriggerParentStepFunction \
  --statement-id S3InvokeFunction \
  --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::siftbeam
```

---

## まとめ

### 推奨: **Lambda経由（S3イベント通知 → Lambda → Step Functions）**

#### 理由:
- 💰 **コスト削減**: EventBridgeの追加コスト不要
- ⚡ **低レイテンシー**: 300-550ms vs 1.2-3.4秒
- 🎨 **シンプル**: 設定が簡単、デバッグが容易
- 🔧 **柔軟性**: Lambda内で複雑なロジックを自由に実装

#### 実装手順:
1. Lambda関数を作成（上記のPythonコード）
2. IAM権限を設定
3. S3イベント通知を設定
4. テスト

#### 移行の余地:
将来的に複数ターゲットやイベントアーカイブが必要になった場合、EventBridgeに移行可能。

---

## 参考: S3コンソールでの設定画面

### 現在の画面（質問にあった画面）

```
イベント通知 (0)
├── 編集
├── 削除
└── イベント通知を作成  ← これを選択

Amazon EventBridge
└── このバケット内のすべてのイベントについて Amazon EventBridge に通知を送信する
    └── オフ  ← これはオフのままでOK
```

### 設定する項目:

**「イベント通知を作成」** を選択して:

```
名前: TriggerServiceProcessing
イベントタイプ: 
  ☑ すべてのオブジェクト作成イベント
プレフィックス: service/input/
サフィックス: （空白）
送信先:
  ⚪ Lambda 関数  ← これを選択
  ⚪ SNS トピック
  ⚪ SQS キュー
Lambda 関数: TriggerParentStepFunction
```

**「Amazon EventBridge」の「オフ」は変更しない**（Lambda経由の場合）

---

この設計で進めましょう!🚀

