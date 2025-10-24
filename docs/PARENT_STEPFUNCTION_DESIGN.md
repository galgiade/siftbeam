# 親Step Function設計: ServiceProcessingOrchestrator

## 概要

親Step Function名: **`ServiceProcessingOrchestrator`**

設計方針:
- ✅ DynamoDB直接統合を最大限活用（Lambda関数を削減）
- ✅ Lambda関数は複雑なロジックが必要な場合のみ使用
- ✅ コスト削減、レイテンシー削減、シンプル化

---

## ステート一覧

| # | ステート名 | タイプ | 実装方法 | 理由 |
|---|-----------|--------|---------|------|
| 1 | `ValidateInput` | Task | Lambda | S3ファイル存在確認など複雑なロジック |
| 2 | `DetermineChildStateMachine` | Choice | Native | 条件分岐（Lambda不要） |
| 3 | `SetImageProcessingSM` | Pass | Native | パラメータ設定（Lambda不要） |
| 4 | `SetSpreadsheetProcessingSM` | Pass | Native | パラメータ設定（Lambda不要） |
| 5 | `Set...ProcessingSM` | Pass | Native | パラメータ設定（Lambda不要） |
| 6 | `InvokeChildStateMachine` | Task | Native (.sync:2) | 子Step Function起動 |
| 7 | `ProcessChildResult` | Pass | Native | データ変換（Lambda不要） |
| 8 | `UpdateProcessingHistorySuccess` | Task | **DynamoDB直接** | 単純なDynamoDB更新 |
| 9 | `QueryMonthlyUsage` | Task | Lambda | 集計計算（現実的） |
| 10 | `CheckUsageLimit` | Task | Lambda | 複雑なロジックと判定 |
| 11 | `ShouldSendNotification` | Choice | Native | 条件分岐（Lambda不要） |
| 12 | `SendNotification` | Task | Lambda | SES連携 |
| 13 | `Success` | Succeed | Native | 終了 |
| 14 | `HandleError` | Task | **DynamoDB直接** | エラー情報をDynamoDBに保存 |
| 15 | `Fail` | Fail | Native | 失敗終了 |

**Lambda関数を使用: 4つのみ**
1. `ValidateInput`
2. `QueryMonthlyUsage`
3. `CheckUsageLimit`
4. `SendNotification`

**DynamoDB直接統合: 2つ**
1. `UpdateProcessingHistorySuccess`
2. `HandleError`（UpdateProcessingHistoryFailedも含む）

---

## 完全なASL定義

```json
{
  "Comment": "SiftBeam Service Processing Orchestrator - 汎用処理",
  "StartAt": "ValidateInput",
  "States": {
    "ValidateInput": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ValidateInput",
      "Parameters": {
        "processingHistoryId.$": "$.processingHistoryId",
        "customerId.$": "$.customerId",
        "inputS3Key.$": "$.inputS3Key",
        "inputS3Bucket.$": "$.inputS3Bucket",
        "policyId.$": "$.policyId",
        "userId.$": "$.userId"
      },
      "ResultPath": "$.validationResult",
      "Next": "DetermineChildStateMachine",
      "Retry": [
        {
          "ErrorEquals": ["States.ALL"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "HandleError"
        }
      ]
    },
    "DetermineChildStateMachine": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.policyId",
          "StringEquals": "policy-image-processing",
          "Next": "SetImageProcessingSM"
        },
        {
          "Variable": "$.policyId",
          "StringEquals": "policy-spreadsheet-processing",
          "Next": "SetSpreadsheetProcessingSM"
        },
        {
          "Variable": "$.policyId",
          "StringEquals": "policy-video-processing",
          "Next": "SetVideoProcessingSM"
        },
        {
          "Variable": "$.policyId",
          "StringEquals": "policy-audio-processing",
          "Next": "SetAudioProcessingSM"
        },
        {
          "Variable": "$.policyId",
          "StringEquals": "policy-text-processing",
          "Next": "SetTextProcessingSM"
        },
        {
          "Variable": "$.policyId",
          "StringEquals": "policy-pdf-processing",
          "Next": "SetPDFProcessingSM"
        }
      ],
      "Default": "UnsupportedPolicy"
    },
    "SetImageProcessingSM": {
      "Type": "Pass",
      "Parameters": {
        "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:ImageProcessingSM",
        "policyType": "image"
      },
      "ResultPath": "$.childSMInfo",
      "Next": "InvokeChildStateMachine"
    },
    "SetSpreadsheetProcessingSM": {
      "Type": "Pass",
      "Parameters": {
        "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:SpreadsheetProcessingSM",
        "policyType": "spreadsheet"
      },
      "ResultPath": "$.childSMInfo",
      "Next": "InvokeChildStateMachine"
    },
    "SetVideoProcessingSM": {
      "Type": "Pass",
      "Parameters": {
        "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:VideoProcessingSM",
        "policyType": "video"
      },
      "ResultPath": "$.childSMInfo",
      "Next": "InvokeChildStateMachine"
    },
    "SetAudioProcessingSM": {
      "Type": "Pass",
      "Parameters": {
        "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:AudioProcessingSM",
        "policyType": "audio"
      },
      "ResultPath": "$.childSMInfo",
      "Next": "InvokeChildStateMachine"
    },
    "SetTextProcessingSM": {
      "Type": "Pass",
      "Parameters": {
        "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:TextProcessingSM",
        "policyType": "text"
      },
      "ResultPath": "$.childSMInfo",
      "Next": "InvokeChildStateMachine"
    },
    "SetPDFProcessingSM": {
      "Type": "Pass",
      "Parameters": {
        "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:PDFProcessingSM",
        "policyType": "pdf"
      },
      "ResultPath": "$.childSMInfo",
      "Next": "InvokeChildStateMachine"
    },
    "InvokeChildStateMachine": {
      "Type": "Task",
      "Resource": "arn:aws:states:::states:startExecution.sync:2",
      "Parameters": {
        "StateMachineArn.$": "$.childSMInfo.childStateMachineArn",
        "Input": {
          "processingHistoryId.$": "$.processingHistoryId",
          "customerId.$": "$.customerId",
          "userId.$": "$.userId",
          "userName.$": "$.userName",
          "policyId.$": "$.policyId",
          "policyName.$": "$.policyName",
          "inputS3Key.$": "$.inputS3Key",
          "inputS3Bucket.$": "$.inputS3Bucket",
          "uploadedFileKeys.$": "$.uploadedFileKeys",
          "aiTrainingUsage.$": "$.aiTrainingUsage",
          "createdAt.$": "$.createdAt",
          "AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$": "$$.Execution.Id"
        }
      },
      "ResultPath": "$.childResult",
      "Next": "ProcessChildResult",
      "Retry": [
        {
          "ErrorEquals": ["States.ALL"],
          "IntervalSeconds": 5,
          "MaxAttempts": 2,
          "BackoffRate": 2
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "HandleChildError"
        }
      ]
    },
    "ProcessChildResult": {
      "Type": "Pass",
      "Parameters": {
        "outputS3Keys.$": "$.childResult.Output.outputS3Keys",
        "totalSizeBytes.$": "$.childResult.Output.totalSizeBytes",
        "processedCount.$": "$.childResult.Output.processedCount"
      },
      "ResultPath": "$.processingResult",
      "Next": "UpdateProcessingHistorySuccess"
    },
    "UpdateProcessingHistorySuccess": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": {
        "TableName": "siftbeam-processing-history",
        "Key": {
          "processing-historyId": {
            "S.$": "$.processingHistoryId"
          }
        },
        "UpdateExpression": "SET #status = :status, #downloadS3Keys = :downloadS3Keys, #usageAmountBytes = :usageAmountBytes, #completedAt = :completedAt",
        "ExpressionAttributeNames": {
          "#status": "status",
          "#downloadS3Keys": "downloadS3Keys",
          "#usageAmountBytes": "usageAmountBytes",
          "#completedAt": "completedAt"
        },
        "ExpressionAttributeValues": {
          ":status": {
            "S": "success"
          },
          ":downloadS3Keys": {
            "L.$": "States.Array($.processingResult.outputS3Keys[*])"
          },
          ":usageAmountBytes": {
            "N.$": "States.Format('{}', $.processingResult.totalSizeBytes)"
          },
          ":completedAt": {
            "S.$": "$$.State.EnteredTime"
          }
        }
      },
      "ResultPath": "$.updateResult",
      "Next": "QueryMonthlyUsage",
      "Retry": [
        {
          "ErrorEquals": [
            "DynamoDB.ProvisionedThroughputExceededException",
            "DynamoDB.ThrottlingException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "HandleError"
        }
      ]
    },
    "QueryMonthlyUsage": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:QueryMonthlyUsage",
      "Parameters": {
        "customerId.$": "$.customerId",
        "currentTimestamp.$": "$$.State.EnteredTime"
      },
      "ResultPath": "$.monthlyUsage",
      "Next": "CheckUsageLimit",
      "Retry": [
        {
          "ErrorEquals": ["States.ALL"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "Success"
        }
      ]
    },
    "CheckUsageLimit": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:CheckUsageLimit",
      "Parameters": {
        "customerId.$": "$.customerId",
        "currentUsageBytes.$": "$.monthlyUsage.totalUsageBytes",
        "newUsageBytes.$": "$.processingResult.totalSizeBytes"
      },
      "ResultPath": "$.usageLimitResult",
      "Next": "ShouldSendNotification",
      "Retry": [
        {
          "ErrorEquals": ["States.ALL"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "Success"
        }
      ]
    },
    "ShouldSendNotification": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.usageLimitResult.shouldNotify",
          "BooleanEquals": true,
          "Next": "SendNotification"
        }
      ],
      "Default": "Success"
    },
    "SendNotification": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:SendNotification",
      "Parameters": {
        "customerId.$": "$.customerId",
        "notifyEmails.$": "$.usageLimitResult.notifyEmails",
        "exceedingLimits.$": "$.usageLimitResult.exceedingLimits",
        "currentUsageBytes.$": "$.monthlyUsage.totalUsageBytes"
      },
      "ResultPath": "$.notificationResult",
      "Next": "Success",
      "Retry": [
        {
          "ErrorEquals": ["States.ALL"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "Success"
        }
      ]
    },
    "Success": {
      "Type": "Succeed"
    },
    "UnsupportedPolicy": {
      "Type": "Fail",
      "Error": "UnsupportedPolicy",
      "Cause": "The specified policyId is not supported"
    },
    "HandleChildError": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": {
        "TableName": "siftbeam-processing-history",
        "Key": {
          "processing-historyId": {
            "S.$": "$.processingHistoryId"
          }
        },
        "UpdateExpression": "SET #status = :status, #errorDetail = :errorDetail, #completedAt = :completedAt",
        "ExpressionAttributeNames": {
          "#status": "status",
          "#errorDetail": "errorDetail",
          "#completedAt": "completedAt"
        },
        "ExpressionAttributeValues": {
          ":status": {
            "S": "failed"
          },
          ":errorDetail": {
            "S.$": "States.Format('Child State Machine Error: {}', $.error.Cause)"
          },
          ":completedAt": {
            "S.$": "$$.State.EnteredTime"
          }
        }
      },
      "ResultPath": "$.errorHandlingResult",
      "Next": "Fail",
      "Retry": [
        {
          "ErrorEquals": [
            "DynamoDB.ProvisionedThroughputExceededException",
            "DynamoDB.ThrottlingException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ]
    },
    "HandleError": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": {
        "TableName": "siftbeam-processing-history",
        "Key": {
          "processing-historyId": {
            "S.$": "$.processingHistoryId"
          }
        },
        "UpdateExpression": "SET #status = :status, #errorDetail = :errorDetail, #completedAt = :completedAt",
        "ExpressionAttributeNames": {
          "#status": "status",
          "#errorDetail": "errorDetail",
          "#completedAt": "completedAt"
        },
        "ExpressionAttributeValues": {
          ":status": {
            "S": "failed"
          },
          ":errorDetail": {
            "S.$": "States.Format('Parent State Machine Error: {}', $.error.Cause)"
          },
          ":completedAt": {
            "S.$": "$$.State.EnteredTime"
          }
        }
      },
      "ResultPath": "$.errorHandlingResult",
      "Next": "Fail",
      "Retry": [
        {
          "ErrorEquals": [
            "DynamoDB.ProvisionedThroughputExceededException",
            "DynamoDB.ThrottlingException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ]
    },
    "Fail": {
      "Type": "Fail",
      "Error": "ProcessingFailed",
      "Cause": "An error occurred during processing"
    }
  }
}
```

---

## Lambda関数の実装

### 1. ValidateInput

```python
import boto3
import os

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

POLICIES_TABLE = os.environ['POLICIES_TABLE']

def lambda_handler(event, context):
    """
    入力を検証
    - S3ファイルの存在確認
    - ファイルサイズの取得
    - ポリシー設定の取得
    """
    try:
        processing_history_id = event['processingHistoryId']
        customer_id = event['customerId']
        input_s3_key = event['inputS3Key']
        input_s3_bucket = event['inputS3Bucket']
        policy_id = event['policyId']
        
        # S3ファイルの存在確認
        try:
            head_response = s3.head_object(Bucket=input_s3_bucket, Key=input_s3_key)
            file_size = head_response['ContentLength']
        except s3.exceptions.NoSuchKey:
            raise ValueError(f"Input file not found: s3://{input_s3_bucket}/{input_s3_key}")
        
        # ポリシー設定の取得
        policies_table = dynamodb.Table(POLICIES_TABLE)
        policy_response = policies_table.get_item(Key={'policyId': policy_id})
        
        if 'Item' not in policy_response:
            raise ValueError(f"Policy not found: {policy_id}")
        
        policy = policy_response['Item']
        
        return {
            'valid': True,
            'fileSize': file_size,
            'policyConfig': policy
        }
    
    except Exception as e:
        print(f"Validation error: {repr(e)}")
        raise
```

### 2. QueryMonthlyUsage

```python
import boto3
from datetime import datetime, timezone
import os

dynamodb = boto3.resource('dynamodb')

PROCESSING_HISTORY_TABLE = os.environ['PROCESSING_HISTORY_TABLE']

def lambda_handler(event, context):
    """
    今月の使用量を計算
    """
    try:
        customer_id = event['customerId']
        current_timestamp = event.get('currentTimestamp')
        
        # 今月の開始日時を計算
        if current_timestamp:
            now = datetime.fromisoformat(current_timestamp.replace('Z', '+00:00'))
        else:
            now = datetime.now(timezone.utc)
        
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_of_month_iso = start_of_month.isoformat()
        
        # DynamoDBクエリ
        table = dynamodb.Table(PROCESSING_HISTORY_TABLE)
        
        response = table.query(
            IndexName='customerId-createdAt-index',
            KeyConditionExpression='customerId = :customerId AND createdAt >= :startOfMonth',
            FilterExpression='#status = :status',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={
                ':customerId': customer_id,
                ':startOfMonth': start_of_month_iso,
                ':status': 'success'
            }
        )
        
        # 使用量を合計
        total_usage = sum(
            item.get('usageAmountBytes', 0) 
            for item in response.get('Items', [])
        )
        
        return {
            'totalUsageBytes': total_usage,
            'itemCount': len(response.get('Items', [])),
            'startOfMonth': start_of_month_iso
        }
    
    except Exception as e:
        print(f"Error calculating monthly usage: {repr(e)}")
        raise
```

### 3. CheckUsageLimit

```python
import boto3
import os

dynamodb = boto3.resource('dynamodb')

USAGE_LIMITS_TABLE = os.environ['USAGE_LIMITS_TABLE']

def lambda_handler(event, context):
    """
    使用量制限をチェック
    """
    try:
        customer_id = event['customerId']
        current_usage_bytes = event['currentUsageBytes']
        new_usage_bytes = event.get('newUsageBytes', 0)
        
        total_usage_bytes = current_usage_bytes + new_usage_bytes
        
        # 使用量制限を取得
        table = dynamodb.Table(USAGE_LIMITS_TABLE)
        
        response = table.query(
            KeyConditionExpression='customerId = :customerId',
            ExpressionAttributeValues={':customerId': customer_id}
        )
        
        usage_limits = response.get('Items', [])
        
        # 通知制限をチェック
        notify_limits = [
            limit for limit in usage_limits 
            if limit.get('exceedAction') == 'notify'
        ]
        
        exceeding_notify_limits = []
        notify_emails = set()
        
        for limit in notify_limits:
            limit_bytes = limit.get('calculatedBytes', float('inf'))
            
            if total_usage_bytes >= limit_bytes:
                exceeding_notify_limits.append({
                    'limitId': limit['usage-limitsId'],
                    'limitBytes': limit_bytes,
                    'limitValue': limit.get('amountLimitValue'),
                    'unit': limit.get('unit', 'GB')
                })
                
                # 通知先メールを追加
                if 'emails' in limit:
                    notify_emails.update(limit['emails'])
        
        should_notify = len(exceeding_notify_limits) > 0
        
        return {
            'shouldNotify': should_notify,
            'notifyEmails': list(notify_emails),
            'exceedingLimits': exceeding_notify_limits,
            'currentUsageBytes': total_usage_bytes
        }
    
    except Exception as e:
        print(f"Error checking usage limit: {repr(e)}")
        raise
```

### 4. SendNotification

```python
import boto3
import os

ses = boto3.client('ses')

SENDER_EMAIL = os.environ['SENDER_EMAIL']

def lambda_handler(event, context):
    """
    使用量超過の通知メールを送信
    """
    try:
        customer_id = event['customerId']
        notify_emails = event['notifyEmails']
        exceeding_limits = event['exceedingLimits']
        current_usage_bytes = event['currentUsageBytes']
        
        # メール本文を作成
        current_usage_gb = current_usage_bytes / (1024 ** 3)
        
        limit_details = '\n'.join([
            f"- {limit['limitValue']} {limit['unit']}"
            for limit in exceeding_limits
        ])
        
        subject = f"[SiftBeam] 使用量制限の通知"
        body = f"""
SiftBeamサービスをご利用いただき、ありがとうございます。

お客様のアカウント（{customer_id}）の使用量が以下の制限に達しました:

{limit_details}

現在の使用量: {current_usage_gb:.2f} GB

ご不明な点がございましたら、お気軽にお問い合わせください。

---
SiftBeam チーム
        """
        
        # SESでメール送信
        for email in notify_emails:
            ses.send_email(
                Source=SENDER_EMAIL,
                Destination={'ToAddresses': [email]},
                Message={
                    'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                    'Body': {
                        'Text': {'Data': body, 'Charset': 'UTF-8'}
                    }
                }
            )
        
        return {
            'sent': True,
            'recipientCount': len(notify_emails)
        }
    
    except Exception as e:
        print(f"Error sending notification: {repr(e)}")
        raise
```

---

## DynamoDB直接統合のメリット

### コスト比較

```
従来（Lambda使用）:
- Step Functions: $0.025 / 1000 state transitions
- Lambda: $0.20 / 1M requests + $0.0000166667 / GB-second
- DynamoDB: $1.25 / million write requests

DynamoDB直接統合:
- Step Functions: $0.025 / 1000 state transitions
- DynamoDB: $1.25 / million write requests

削減: Lambda実行コスト（約20-30%のコスト削減）
```

### レイテンシー比較

```
従来:
Step Functions → Lambda (Cold Start 100-200ms) → DynamoDB (10-20ms)
合計: 110-220ms

DynamoDB直接:
Step Functions → DynamoDB (10-20ms)
合計: 10-20ms

削減: 約90-200ms（約80-90%の削減）
```

---

## まとめ

### 親Step Function名
✅ **`ServiceProcessingOrchestrator`** を推奨

### DynamoDB直接統合
✅ **強く推奨します!**

#### メリット:
1. 💰 **コスト削減**: Lambda実行コストを削減
2. ⚡ **レイテンシー削減**: Lambda Cold Startを回避
3. 🎨 **シンプル化**: Lambda関数のコード管理不要
4. 🛡️ **信頼性向上**: Step FunctionsのRetry機能を直接活用

#### 適用箇所:
- ✅ `UpdateProcessingHistorySuccess`
- ✅ `UpdateProcessingHistoryFailed` (HandleErrorステート内)

#### Lambda関数が必要な箇所（4つのみ）:
- `ValidateInput`: 複雑なロジック
- `QueryMonthlyUsage`: 集計計算
- `CheckUsageLimit`: 複雑なロジックと判定
- `SendNotification`: SES連携

この設計で進めましょう!🚀

