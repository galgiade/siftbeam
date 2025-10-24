# ストレージ課金アーキテクチャ設計

## 概要

SiftBeamのストレージ使用量を日次で集計し、月次でStripe Billing Metersに課金する仕組みの設計ドキュメント。

---

## 📊 データフロー

```
┌─────────────────────────────────────────────────────────────┐
│                     日次集計（毎日実行）                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
    EventBridge Rule (cron: 0 1 * * ? *)
                            ↓
    Step Functions: DailyStorageAggregator
                            ↓
    ┌──────────────────────────────────────────┐
    │ 1. 全顧客リストを取得                      │
    │    - DynamoDB Scan または                │
    │    - Stripe API: List Customers          │
    └──────────────────────────────────────────┘
                            ↓
    ┌──────────────────────────────────────────┐
    │ 2. Map State: 各顧客を並列処理            │
    │    ├─ S3 ListObjectsV2 (input/)         │
    │    ├─ S3 ListObjectsV2 (output/)        │
    │    ├─ ファイルサイズを合計                │
    │    └─ DynamoDB PutItem                  │
    │       (storage-usage-daily)             │
    └──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   月次請求（毎月1日実行）                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
    EventBridge Rule (cron: 0 2 1 * ? *)
                            ↓
    Step Functions: MonthlyStorageBilling
                            ↓
    ┌──────────────────────────────────────────┐
    │ 1. 前月の日次集計データを取得              │
    │    - DynamoDB Query                     │
    │      (billingMonth-index)               │
    └──────────────────────────────────────────┘
                            ↓
    ┌──────────────────────────────────────────┐
    │ 2. Map State: 各顧客を処理                │
    │    ├─ 日次データを合計                    │
    │    ├─ 月平均を計算                        │
    │    ├─ Stripe Meter API 送信              │
    │    ├─ DynamoDB PutItem                  │
    │    │  (storage-usage-monthly)           │
    │    └─ DynamoDB UpdateItem               │
    │       (日次レコードを "billed" に更新)     │
    └──────────────────────────────────────────┘
```

---

## 🗂️ DynamoDBテーブル設計

### **1. 日次集計テーブル**

**テーブル名**: `siftbeam-storage-usage-daily`

#### **スキーマ**

```typescript
interface StorageUsageDaily {
  // キー
  customerId: string;              // パーティションキー
  date: string;                    // ソートキー (YYYY-MM-DD)
  
  // ストレージ使用量
  totalStorageBytesInput: number;  // input配下の合計バイト数
  totalStorageBytesOutput: number; // output配下の合計バイト数
  totalStorageBytes: number;       // 合計バイト数
  
  // ファイル数
  fileCountInput: number;          // inputファイル数
  fileCountOutput: number;         // outputファイル数
  totalFileCount: number;          // 総ファイル数
  
  // 請求情報
  billingMonth: string;            // 請求月 (YYYY-MM)
  billingStatus: 'pending' | 'billed' | 'failed';
  
  // Stripe連携
  stripeMeterEventId?: string;     // Stripe送信後のイベントID
  stripeMeterSentAt?: string;      // Stripe送信日時
  
  // メタデータ
  calculatedAt: string;            // 集計実行日時
  ttl?: number;                    // TTL（2年後に自動削除）
}
```

#### **インデックス**

```typescript
// GSI1: 請求月で検索
{
  "IndexName": "billingMonth-index",
  "KeySchema": [
    { "AttributeName": "billingMonth", "KeyType": "HASH" },
    { "AttributeName": "customerId", "KeyType": "RANGE" }
  ],
  "Projection": { "ProjectionType": "ALL" }
}

// GSI2: 請求ステータスで検索
{
  "IndexName": "billingStatus-date-index",
  "KeySchema": [
    { "AttributeName": "billingStatus", "KeyType": "HASH" },
    { "AttributeName": "date", "KeyType": "RANGE" }
  ],
  "Projection": { "ProjectionType": "ALL" }
}
```

#### **サンプルデータ**

```json
{
  "customerId": "cus_TB7TNGpqOEFcst",
  "date": "2025-10-18",
  "totalStorageBytesInput": 1234567890,
  "totalStorageBytesOutput": 9876543210,
  "totalStorageBytes": 11111111100,
  "fileCountInput": 150,
  "fileCountOutput": 150,
  "totalFileCount": 300,
  "billingMonth": "2025-10",
  "billingStatus": "pending",
  "calculatedAt": "2025-10-18T01:05:00Z",
  "ttl": 1792281600
}
```

---

### **2. 月次集計テーブル**

**テーブル名**: `siftbeam-storage-usage-monthly`

#### **スキーマ**

```typescript
interface StorageUsageMonthly {
  // キー
  customerId: string;              // パーティションキー
  billingMonth: string;            // ソートキー (YYYY-MM)
  
  // ストレージ使用量
  averageStorageBytes: number;     // 月平均ストレージ使用量
  peakStorageBytes: number;        // 月最大使用量
  totalStorageDays: number;        // 集計日数
  dailyUsageSum: number;           // 日次使用量の合計
  
  // Stripe連携
  stripeMeterEventId?: string;     // Stripe送信後のイベントID
  stripeMeterSentAt?: string;      // Stripe送信日時
  stripeMeterStatus: 'success' | 'failed' | 'pending';
  stripeMeterAmount: number;       // 送信した値（バイト数）
  
  // メタデータ
  calculatedAt: string;            // 集計実行日時
  billingStatus: 'pending' | 'billed' | 'failed';
  notes?: string;                  // 備考
  ttl?: number;                    // TTL（5年後に自動削除）
}
```

#### **インデックス**

```typescript
// GSI1: 請求ステータスで検索
{
  "IndexName": "billingStatus-month-index",
  "KeySchema": [
    { "AttributeName": "billingStatus", "KeyType": "HASH" },
    { "AttributeName": "billingMonth", "KeyType": "RANGE" }
  ],
  "Projection": { "ProjectionType": "ALL" }
}
```

#### **サンプルデータ**

```json
{
  "customerId": "cus_TB7TNGpqOEFcst",
  "billingMonth": "2025-10",
  "averageStorageBytes": 10000000000,
  "peakStorageBytes": 15000000000,
  "totalStorageDays": 31,
  "dailyUsageSum": 310000000000,
  "stripeMeterEventId": "evt_1234567890",
  "stripeMeterSentAt": "2025-11-01T02:30:00Z",
  "stripeMeterStatus": "success",
  "stripeMeterAmount": 10000000000,
  "calculatedAt": "2025-11-01T02:05:00Z",
  "billingStatus": "billed",
  "notes": "Regular monthly billing",
  "ttl": 1919462400
}
```

---

## 🔧 Step Functions定義

### **1. 日次集計 Step Function**

**ステートマシン名**: `DailyStorageAggregator`

```json
{
  "Comment": "日次ストレージ使用量集計",
  "StartAt": "GetAllCustomers",
  "States": {
    "GetAllCustomers": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:scan",
      "Parameters": {
        "TableName": "siftbeam-customers",
        "ProjectionExpression": "customerId"
      },
      "ResultPath": "$.customers",
      "Next": "PrepareCustomerList"
    },
    
    "PrepareCustomerList": {
      "Type": "Pass",
      "Parameters": {
        "customerIds": "{% $customers.Items[].customerId.S %}",
        "currentDate": "{% $now() %}"
      },
      "Next": "ProcessEachCustomer"
    },
    
    "ProcessEachCustomer": {
      "Type": "Map",
      "ItemsPath": "{% $.customerIds %}",
      "MaxConcurrency": 10,
      "ItemProcessor": {
        "ProcessorConfig": {
          "Mode": "DISTRIBUTED",
          "ExecutionType": "EXPRESS"
        },
        "StartAt": "CalculateInputStorage",
        "States": {
          "CalculateInputStorage": {
            "Type": "Task",
            "Resource": "arn:aws:states:::aws-sdk:s3:listObjectsV2",
            "Parameters": {
              "Bucket": "siftbeam",
              "Prefix": "{% 'service/input/' & $ & '/' %}"
            },
            "ResultPath": "$.inputObjects",
            "Next": "CalculateOutputStorage"
          },
          
          "CalculateOutputStorage": {
            "Type": "Task",
            "Resource": "arn:aws:states:::aws-sdk:s3:listObjectsV2",
            "Parameters": {
              "Bucket": "siftbeam",
              "Prefix": "{% 'service/output/' & $ & '/' %}"
            },
            "ResultPath": "$.outputObjects",
            "Next": "AggregateStorageData"
          },
          
          "AggregateStorageData": {
            "Type": "Pass",
            "Parameters": {
              "customerId": "{% $ %}",
              "date": "{% $substring($now(), 0, 10) %}",
              "totalStorageBytesInput": "{% $sum($.inputObjects.Contents[].Size) %}",
              "totalStorageBytesOutput": "{% $sum($.outputObjects.Contents[].Size) %}",
              "totalStorageBytes": "{% $sum($.inputObjects.Contents[].Size) + $sum($.outputObjects.Contents[].Size) %}",
              "fileCountInput": "{% $count($.inputObjects.Contents) %}",
              "fileCountOutput": "{% $count($.outputObjects.Contents) %}",
              "totalFileCount": "{% $count($.inputObjects.Contents) + $count($.outputObjects.Contents) %}",
              "billingMonth": "{% $substring($now(), 0, 7) %}",
              "billingStatus": "pending",
              "calculatedAt": "{% $now() %}"
            },
            "Next": "SaveToDynamoDB"
          },
          
          "SaveToDynamoDB": {
            "Type": "Task",
            "Resource": "arn:aws:states:::dynamodb:putItem",
            "Parameters": {
              "TableName": "siftbeam-storage-usage-daily",
              "Item": {
                "customerId": { "S": "{% $.customerId %}" },
                "date": { "S": "{% $.date %}" },
                "totalStorageBytesInput": { "N": "{% $string($.totalStorageBytesInput) %}" },
                "totalStorageBytesOutput": { "N": "{% $string($.totalStorageBytesOutput) %}" },
                "totalStorageBytes": { "N": "{% $string($.totalStorageBytes) %}" },
                "fileCountInput": { "N": "{% $string($.fileCountInput) %}" },
                "fileCountOutput": { "N": "{% $string($.fileCountOutput) %}" },
                "totalFileCount": { "N": "{% $string($.totalFileCount) %}" },
                "billingMonth": { "S": "{% $.billingMonth %}" },
                "billingStatus": { "S": "{% $.billingStatus %}" },
                "calculatedAt": { "S": "{% $.calculatedAt %}" }
              }
            },
            "End": true
          }
        }
      },
      "End": true
    }
  },
  "QueryLanguage": "JSONata"
}
```

---

### **2. 月次請求 Step Function**

**ステートマシン名**: `MonthlyStorageBilling`

```json
{
  "Comment": "月次ストレージ使用量請求",
  "StartAt": "CalculatePreviousMonth",
  "States": {
    "CalculatePreviousMonth": {
      "Type": "Pass",
      "Parameters": {
        "previousMonth": "{% $substring($now(), 0, 7) %}",
        "currentDate": "{% $now() %}"
      },
      "Next": "GetDailyUsageData"
    },
    
    "GetDailyUsageData": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:query",
      "Parameters": {
        "TableName": "siftbeam-storage-usage-daily",
        "IndexName": "billingMonth-index",
        "KeyConditionExpression": "billingMonth = :month",
        "ExpressionAttributeValues": {
          ":month": { "S": "{% $.previousMonth %}" }
        }
      },
      "ResultPath": "$.dailyData",
      "Next": "GroupByCustomer"
    },
    
    "GroupByCustomer": {
      "Type": "Pass",
      "Parameters": {
        "customerGroups": "{% $dailyData.Items ~> $group('customerId.S') %}"
      },
      "Next": "ProcessEachCustomer"
    },
    
    "ProcessEachCustomer": {
      "Type": "Map",
      "ItemsPath": "{% $.customerGroups %}",
      "MaxConcurrency": 10,
      "ItemProcessor": {
        "ProcessorConfig": {
          "Mode": "INLINE"
        },
        "StartAt": "CalculateMonthlyAverage",
        "States": {
          "CalculateMonthlyAverage": {
            "Type": "Pass",
            "Parameters": {
              "customerId": "{% $[0].customerId.S %}",
              "billingMonth": "{% $[0].billingMonth.S %}",
              "dailyUsageSum": "{% $sum($[].totalStorageBytes.N ~> $number()) %}",
              "totalStorageDays": "{% $count($) %}",
              "averageStorageBytes": "{% $round($sum($[].totalStorageBytes.N ~> $number()) / $count($)) %}",
              "peakStorageBytes": "{% $max($[].totalStorageBytes.N ~> $number()) %}"
            },
            "Next": "SendToStripeMeter"
          },
          
          "SendToStripeMeter": {
            "Type": "Task",
            "Resource": "arn:aws:states:::http:invoke",
            "Parameters": {
              "ApiEndpoint": "https://api.stripe.com/v1/billing/meter_events",
              "Method": "POST",
              "Authentication": {
                "ConnectionArn": "arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Production-Connection/b711004d-52d7-4b35-8b29-9f33e9e3a054"
              },
              "RequestBody": {
                "event_name": "storage-usage",
                "payload": {
                  "stripe_customer_id": "{% $.customerId %}",
                  "value": "{% $string($.averageStorageBytes) %}"
                }
              },
              "Headers": {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            },
            "ResultPath": "$.stripeResponse",
            "Next": "SaveMonthlyRecord",
            "Retry": [
              {
                "ErrorEquals": ["States.Http.StatusCode.429"],
                "BackoffRate": 2,
                "IntervalSeconds": 1,
                "MaxAttempts": 3
              }
            ],
            "Catch": [
              {
                "ErrorEquals": ["States.ALL"],
                "ResultPath": "$.stripeError",
                "Next": "SaveMonthlyRecordWithError"
              }
            ]
          },
          
          "SaveMonthlyRecord": {
            "Type": "Task",
            "Resource": "arn:aws:states:::dynamodb:putItem",
            "Parameters": {
              "TableName": "siftbeam-storage-usage-monthly",
              "Item": {
                "customerId": { "S": "{% $.customerId %}" },
                "billingMonth": { "S": "{% $.billingMonth %}" },
                "averageStorageBytes": { "N": "{% $string($.averageStorageBytes) %}" },
                "peakStorageBytes": { "N": "{% $string($.peakStorageBytes) %}" },
                "totalStorageDays": { "N": "{% $string($.totalStorageDays) %}" },
                "dailyUsageSum": { "N": "{% $string($.dailyUsageSum) %}" },
                "stripeMeterStatus": { "S": "success" },
                "stripeMeterAmount": { "N": "{% $string($.averageStorageBytes) %}" },
                "stripeMeterSentAt": { "S": "{% $now() %}" },
                "calculatedAt": { "S": "{% $now() %}" },
                "billingStatus": { "S": "billed" }
              }
            },
            "Next": "UpdateDailyRecords"
          },
          
          "SaveMonthlyRecordWithError": {
            "Type": "Task",
            "Resource": "arn:aws:states:::dynamodb:putItem",
            "Parameters": {
              "TableName": "siftbeam-storage-usage-monthly",
              "Item": {
                "customerId": { "S": "{% $.customerId %}" },
                "billingMonth": { "S": "{% $.billingMonth %}" },
                "averageStorageBytes": { "N": "{% $string($.averageStorageBytes) %}" },
                "stripeMeterStatus": { "S": "failed" },
                "calculatedAt": { "S": "{% $now() %}" },
                "billingStatus": { "S": "failed" },
                "notes": { "S": "{% $string($.stripeError) %}" }
              }
            },
            "End": true
          },
          
          "UpdateDailyRecords": {
            "Type": "Task",
            "Resource": "arn:aws:states:::dynamodb:updateItem",
            "Parameters": {
              "TableName": "siftbeam-storage-usage-daily",
              "Key": {
                "customerId": { "S": "{% $.customerId %}" },
                "date": { "S": "{% $.date %}" }
              },
              "UpdateExpression": "SET billingStatus = :status",
              "ExpressionAttributeValues": {
                ":status": { "S": "billed" }
              }
            },
            "End": true
          }
        }
      },
      "End": true
    }
  },
  "QueryLanguage": "JSONata"
}
```

---

## ⏰ EventBridge Rules

### **1. 日次集計スケジュール**

```json
{
  "Name": "DailyStorageAggregation",
  "Description": "毎日午前1時（UTC）にストレージ使用量を集計",
  "ScheduleExpression": "cron(0 1 * * ? *)",
  "State": "ENABLED",
  "Targets": [
    {
      "Arn": "arn:aws:states:ap-northeast-1:002689294103:stateMachine:DailyStorageAggregator",
      "RoleArn": "arn:aws:iam::002689294103:role/EventBridge-StepFunctions-Role",
      "Input": "{}"
    }
  ]
}
```

### **2. 月次請求スケジュール**

```json
{
  "Name": "MonthlyStorageBilling",
  "Description": "毎月1日午前2時（UTC）にストレージ使用料を請求",
  "ScheduleExpression": "cron(0 2 1 * ? *)",
  "State": "ENABLED",
  "Targets": [
    {
      "Arn": "arn:aws:states:ap-northeast-1:002689294103:stateMachine:MonthlyStorageBilling",
      "RoleArn": "arn:aws:iam::002689294103:role/EventBridge-StepFunctions-Role",
      "Input": "{}"
    }
  ]
}
```

---

## 💰 Stripe Billing Meter設定

### **新しいメーター: storage-usage**

```
Meter Name: storage-usage
Event Name: storage-usage
Aggregation: sum
Value Settings:
  - Type: Numeric
  - Unit: bytes
```

### **価格設定例**

```
1GB = 1,073,741,824 bytes
月額料金: $0.10 per GB

Stripe Price設定:
  - Billing Meter: storage-usage
  - Unit Amount: $0.10
  - Transform Quantity: divide by 1073741824
```

---

## 🔐 IAM権限

### **日次集計 Step Function用**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-customers",
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-storage-usage-daily"
      ]
    },
    {
      "Sid": "S3ListAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::siftbeam"
      ],
      "Condition": {
        "StringLike": {
          "s3:prefix": [
            "service/input/*",
            "service/output/*"
          ]
        }
      }
    }
  ]
}
```

### **月次請求 Step Function用**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-storage-usage-daily",
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-storage-usage-daily/index/*",
        "arn:aws:dynamodb:ap-northeast-1:002689294103:table/siftbeam-storage-usage-monthly"
      ]
    },
    {
      "Sid": "InvokeHTTPEndpoint",
      "Effect": "Allow",
      "Action": [
        "states:InvokeHTTPEndpoint"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "states:HTTPMethod": "POST"
        },
        "StringLike": {
          "states:HTTPEndpoint": "https://api.stripe.com/*"
        }
      }
    },
    {
      "Sid": "EventBridgeConnectionAccess",
      "Effect": "Allow",
      "Action": [
        "events:RetrieveConnectionCredentials",
        "events:DescribeConnection"
      ],
      "Resource": [
        "arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Production-Connection/*"
      ]
    }
  ]
}
```

---

## 📊 コスト試算

### **DynamoDB**

| テーブル | 月間書き込み | 月間読み取り | ストレージ | 月額コスト |
|---------|------------|------------|----------|----------|
| storage-usage-daily | 3,000件（100顧客×30日） | 100件 | 1MB | $0.30 |
| storage-usage-monthly | 100件（100顧客×1回） | 100件 | 0.1MB | $0.10 |

### **Step Functions**

| ステートマシン | 実行回数/月 | 状態遷移数 | 月額コスト |
|-------------|-----------|----------|----------|
| DailyStorageAggregator | 30回 | 300回（100顧客×3ステート） | $0.75 |
| MonthlyStorageBilling | 1回 | 100回（100顧客×1ステート） | $0.03 |

### **S3 API**

| API | 呼び出し回数/月 | 月額コスト |
|-----|--------------|----------|
| ListObjectsV2 | 6,000回（100顧客×30日×2パス） | $0.03 |

**合計月額コスト**: 約 **$1.21**（100顧客の場合）

---

## 🎯 実装手順

1. ✅ DynamoDBテーブルを作成
   - `siftbeam-storage-usage-daily`
   - `siftbeam-storage-usage-monthly`

2. ✅ Step Functionsを作成
   - `DailyStorageAggregator`
   - `MonthlyStorageBilling`

3. ✅ IAMロールを作成・権限付与

4. ✅ EventBridge Rulesを作成
   - 日次集計スケジュール
   - 月次請求スケジュール

5. ✅ Stripe Billing Meterを作成
   - `storage-usage` メーター

6. ✅ テスト実行
   - 手動でStep Functionsを実行
   - 結果をDynamoDBで確認
   - Stripe Dashboardで確認

---

## 📚 関連ドキュメント

- [Stripe Billing Meters API](https://stripe.com/docs/api/billing/meter)
- [DynamoDB Query](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html)
- [S3 ListObjectsV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
- [EventBridge Scheduled Rules](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html)

---

**最終更新**: 2025-10-18

