# データ処理機構のアーキテクチャ設計（改訂版）

## 前提条件の確認

### ポリシーごとの処理の違い

各ポリシーは**全く異なる複雑な処理**を実行します:

- **画像データ処理**: リサイズ、フォーマット変換、圧縮、透かし追加、顔認識など
- **表計算データ処理**: データクレンジング、集計、グラフ生成、フォーマット変換など
- **動画データ処理**: トランスコーディング、サムネイル生成、字幕追加など
- **音声データ処理**: 文字起こし、ノイズ除去、フォーマット変換など
- **テキストデータ処理**: 自然言語処理、翻訳、要約、感情分析など
- **PDFデータ処理**: テキスト抽出、画像抽出、結合、分割など

これらの処理は、それぞれ**独自の複雑なワークフロー**を持ちます。

### 親子Step Function構造の必要性

#### 親Step Function（汎用処理）
```
- 入力検証
- 使用量チェック
- ポリシーに応じた子Step Function選択
- 課金メーター処理
- 完了/失敗の状態管理
- 通知処理
```

#### 子Step Function（ポリシー固有の処理）
```
- 画像処理用: 複数ステップの画像変換パイプライン
- 表計算処理用: データ解析・変換パイプライン
- 動画処理用: MediaConvert連携パイプライン
- など、ポリシーごとに完全に異なるワークフロー
```

**結論**: 親子構造は**必要かつ適切**です。

---

## 推奨アーキテクチャ（改訂版）

### 全体ワークフロー

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. クライアント (ServiceFileUploader.tsx)                         │
│    - ファイル選択                                                  │
│    - 利用制限チェック                                              │
│    - processing-history作成 (status: in_progress)                 │
│    - S3にアップロード (メタデータ付き)                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. S3イベント通知                                                  │
│    - バケット: siftbeam                                            │
│    - プレフィックス: service/input/                                │
│    - イベント: s3:ObjectCreated:*                                 │
│    - ターゲット: Lambda (TriggerParentStepFunction)                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Lambda: TriggerParentStepFunction                              │
│    - S3パスからprocessingHistoryIdを抽出                          │
│    - S3メタデータ確認 (triggerStepFunction == 'true')             │
│    - DynamoDBからprocessing-history取得                           │
│    - 親Step Functionを起動                                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌═════════════════════════════════════════════════════════════════┐
║ 4. 親Step Function: ParentProcessingWorkflow                     ║
║                                                                  ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 1: ValidateInput                        │            ║
║    │  - ファイル存在確認                            │            ║
║    │  - ファイルサイズ確認                          │            ║
║    │  - ポリシー情報取得                            │            ║
║    │  - 使用量制限チェック（事前確認）              │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 2: DetermineChildStateMachine           │            ║
║    │  - policyIdに基づいて子Step FunctionのARNを決定 │            ║
║    │                                               │            ║
║    │  Choice State:                                │            ║
║    │    policy-image       → ImageProcessingSM     │            ║
║    │    policy-spreadsheet → SpreadsheetSM         │            ║
║    │    policy-video       → VideoProcessingSM     │            ║
║    │    policy-audio       → AudioProcessingSM     │            ║
║    │    policy-text        → TextProcessingSM      │            ║
║    │    policy-pdf         → PDFProcessingSM       │            ║
║    │    unknown            → Fail                  │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 3: InvokeChildStateMachine              │            ║
║    │  - Task Type: Step Functions (StartExecution) │            ║
║    │  - 子Step Functionを起動                       │            ║
║    │  - 同期実行 (waitForTaskToken または .sync)    │            ║
║    │  - 子の完了を待機                              │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 4: ProcessChildResult                   │            ║
║    │  - 子Step Functionの結果を取得                 │            ║
║    │  - outputS3Keys, totalSizeBytesを抽出          │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 5: UpdateProcessingHistory              │            ║
║    │  - status: success                            │            ║
║    │  - downloadS3Keys: (子からの結果)              │            ║
║    │  - usageAmountBytes: (子からの結果)            │            ║
║    │  - completedAt: ISO8601                       │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 6: CalculateMonthlyUsage                │            ║
║    │  - 今月の合計使用量を計算                      │            ║
║    │  - DynamoDBのprocessing-historyから集計        │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 7: CheckUsageLimit                      │            ║
║    │  - usage-limitsテーブルから制限値取得           │            ║
║    │  - 通知制限を超えているか確認                  │            ║
║    │  - 通知が必要かどうか判定                      │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 8: ShouldSendNotification (Choice)      │            ║
║    │  - shouldNotify == true → SendNotification    │            ║
║    │  - shouldNotify == false → Success            │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 9: SendNotification (Conditional)       │            ║
║    │  - SESで通知メール送信                         │            ║
║    │  - 通知制限を超えたことを通知                  │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 10: Success                             │            ║
║    └───────────────────────────────────────────────┘            ║
║                                                                  ║
║    [エラーハンドリング]                                           ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ Catch: HandleError                            │            ║
║    │  - エラー詳細を記録                            │            ║
║    │  - processing-history更新 (status: failed)     │            ║
║    │  - errorDetail記録                            │            ║
║    │  - completedAt設定                            │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State: Fail                                   │            ║
║    └───────────────────────────────────────────────┘            ║
║                                                                  ║
╚═════════════════════════════════════════════════════════════════╝
                            ↓ (子Step Function起動)
┌═════════════════════════════════════════════════════════════════┐
║ 5. 子Step Function: 例) ImageProcessingStateMachine             ║
║                                                                  ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 1: DownloadFromS3                       │            ║
║    │  - 入力ファイルをS3からダウンロード            │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 2: ValidateImageFormat                  │            ║
║    │  - 画像フォーマット検証                        │            ║
║    │  - サポート形式: JPEG, PNG, GIF, WebP          │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 3: ResizeImage                          │            ║
║    │  - Lambda: 画像リサイズ処理                    │            ║
║    │  - 複数サイズ生成（サムネイル、中、大）        │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 4: OptimizeImage                        │            ║
║    │  - Lambda: 画像最適化（圧縮）                  │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 5: AddWatermark (Conditional)           │            ║
║    │  - Lambda: 透かし追加                          │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 6: ConvertFormat                        │            ║
║    │  - Lambda: フォーマット変換                    │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 7: UploadToS3                           │            ║
║    │  - 処理済み画像をS3にアップロード              │            ║
║    │  - パス: service/output/{customerId}/         │            ║
║    │         {processingHistoryId}/                │            ║
║    └───────────────────────────────────────────────┘            ║
║                     ↓                                            ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ State 8: ReturnResult                         │            ║
║    │  - 結果を返す:                                 │            ║
║    │    {                                          │            ║
║    │      "outputS3Keys": [...],                   │            ║
║    │      "totalSizeBytes": 1234567,               │            ║
║    │      "processedCount": 3                      │            ║
║    │    }                                          │            ║
║    └───────────────────────────────────────────────┘            ║
║                                                                  ║
║    [エラーハンドリング]                                           ║
║    ┌───────────────────────────────────────────────┐            ║
║    │ Catch: ChildHandleError                       │            ║
║    │  - エラー詳細を返す                            │            ║
║    │  - 親Step Functionに伝播                       │            ║
║    └───────────────────────────────────────────────┘            ║
║                                                                  ║
╚═════════════════════════════════════════════════════════════════╝
                            ↓ (結果を親に返す)
┌─────────────────────────────────────────────────────────────────┐
│ 6. クライアント (ProcessingHistoryList.tsx)                       │
│    - 定期的にprocessing-historyをポーリング                        │
│    - status: success → ダウンロードボタン表示                      │
│    - status: failed → エラー詳細表示                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 親Step Functionの詳細設計

### 親Step Function: ParentProcessingWorkflow

**ASL (Amazon States Language) 定義**

```json
{
  "Comment": "SiftBeam Parent Processing Workflow - 汎用処理",
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
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:UpdateProcessingHistory",
      "Parameters": {
        "processingHistoryId.$": "$.processingHistoryId",
        "status": "success",
        "downloadS3Keys.$": "$.processingResult.outputS3Keys",
        "usageAmountBytes.$": "$.processingResult.totalSizeBytes",
        "completedAt.$": "$$.State.EnteredTime"
      },
      "ResultPath": "$.updateResult",
      "Next": "CalculateMonthlyUsage",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "HandleError"
        }
      ]
    },
    "CalculateMonthlyUsage": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:CalculateMonthlyUsage",
      "Parameters": {
        "customerId.$": "$.customerId",
        "currentMonth.$": "$$.State.EnteredTime"
      },
      "ResultPath": "$.monthlyUsage",
      "Next": "CheckUsageLimit",
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
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:HandleError",
      "Parameters": {
        "processingHistoryId.$": "$.processingHistoryId",
        "errorType": "ChildStateMachineError",
        "error.$": "$.error",
        "childResult.$": "$.childResult"
      },
      "ResultPath": "$.errorHandlingResult",
      "Next": "Fail"
    },
    "HandleError": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:HandleError",
      "Parameters": {
        "processingHistoryId.$": "$.processingHistoryId",
        "errorType": "ParentStateMachineError",
        "error.$": "$.error",
        "input.$": "$"
      },
      "ResultPath": "$.errorHandlingResult",
      "Next": "Fail"
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

## 子Step Functionの例

### 子Step Function 1: ImageProcessingStateMachine

**ASL定義**

```json
{
  "Comment": "SiftBeam Image Processing Workflow - 画像処理専用",
  "StartAt": "DownloadFromS3",
  "States": {
    "DownloadFromS3": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:DownloadImageFromS3",
      "Parameters": {
        "inputS3Key.$": "$.inputS3Key",
        "inputS3Bucket.$": "$.inputS3Bucket"
      },
      "ResultPath": "$.downloadResult",
      "Next": "ValidateImageFormat",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "ValidateImageFormat": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ValidateImageFormat",
      "Parameters": {
        "imageData.$": "$.downloadResult.imageData",
        "fileName.$": "$.downloadResult.fileName"
      },
      "ResultPath": "$.validationResult",
      "Next": "ParallelImageProcessing",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "ParallelImageProcessing": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "ResizeThumbnail",
          "States": {
            "ResizeThumbnail": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ResizeImage",
              "Parameters": {
                "imageData.$": "$.downloadResult.imageData",
                "width": 200,
                "height": 200,
                "suffix": "thumbnail"
              },
              "End": true
            }
          }
        },
        {
          "StartAt": "ResizeMedium",
          "States": {
            "ResizeMedium": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ResizeImage",
              "Parameters": {
                "imageData.$": "$.downloadResult.imageData",
                "width": 800,
                "height": 600,
                "suffix": "medium"
              },
              "End": true
            }
          }
        },
        {
          "StartAt": "ResizeLarge",
          "States": {
            "ResizeLarge": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ResizeImage",
              "Parameters": {
                "imageData.$": "$.downloadResult.imageData",
                "width": 1920,
                "height": 1080,
                "suffix": "large"
              },
              "End": true
            }
          }
        }
      ],
      "ResultPath": "$.resizedImages",
      "Next": "OptimizeImages",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "OptimizeImages": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:OptimizeImages",
      "Parameters": {
        "images.$": "$.resizedImages"
      },
      "ResultPath": "$.optimizedImages",
      "Next": "ShouldAddWatermark",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "ShouldAddWatermark": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.aiTrainingUsage",
          "StringEquals": "deny",
          "Next": "AddWatermark"
        }
      ],
      "Default": "ConvertFormat"
    },
    "AddWatermark": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:AddWatermark",
      "Parameters": {
        "images.$": "$.optimizedImages",
        "watermarkText": "Internal Use Only"
      },
      "ResultPath": "$.watermarkedImages",
      "Next": "ConvertFormat",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "ConvertFormat": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ConvertImageFormat",
      "Parameters": {
        "images.$": "$.watermarkedImages",
        "targetFormat": "webp"
      },
      "ResultPath": "$.convertedImages",
      "Next": "UploadToS3",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "UploadToS3": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:UploadImagesToS3",
      "Parameters": {
        "images.$": "$.convertedImages",
        "customerId.$": "$.customerId",
        "processingHistoryId.$": "$.processingHistoryId"
      },
      "ResultPath": "$.uploadResult",
      "Next": "ReturnResult",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ChildFail"
        }
      ]
    },
    "ReturnResult": {
      "Type": "Pass",
      "Parameters": {
        "outputS3Keys.$": "$.uploadResult.s3Keys",
        "totalSizeBytes.$": "$.uploadResult.totalSizeBytes",
        "processedCount.$": "$.uploadResult.count"
      },
      "End": true
    },
    "ChildFail": {
      "Type": "Fail",
      "Error": "ImageProcessingFailed",
      "Cause": "An error occurred during image processing"
    }
  }
}
```

### 子Step Function 2: SpreadsheetProcessingStateMachine

**ASL定義（簡略版）**

```json
{
  "Comment": "SiftBeam Spreadsheet Processing Workflow - 表計算処理専用",
  "StartAt": "DownloadSpreadsheet",
  "States": {
    "DownloadSpreadsheet": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:DownloadSpreadsheetFromS3",
      "Next": "ParseSpreadsheet"
    },
    "ParseSpreadsheet": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ParseSpreadsheet",
      "Next": "DataCleansing"
    },
    "DataCleansing": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:DataCleansing",
      "Next": "PerformCalculations"
    },
    "PerformCalculations": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:PerformCalculations",
      "Next": "GenerateCharts"
    },
    "GenerateCharts": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:GenerateCharts",
      "Next": "ExportToMultipleFormats"
    },
    "ExportToMultipleFormats": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "ExportToExcel",
          "States": {
            "ExportToExcel": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ExportToExcel",
              "End": true
            }
          }
        },
        {
          "StartAt": "ExportToCSV",
          "States": {
            "ExportToCSV": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ExportToCSV",
              "End": true
            }
          }
        },
        {
          "StartAt": "ExportToPDF",
          "States": {
            "ExportToPDF": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:ExportToPDF",
              "End": true
            }
          }
        }
      ],
      "Next": "UploadResultsToS3"
    },
    "UploadResultsToS3": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:UploadSpreadsheetResultsToS3",
      "Next": "ReturnResult"
    },
    "ReturnResult": {
      "Type": "Pass",
      "End": true
    }
  }
}
```

---

## ポリシーごとの子Step Function一覧

| ポリシーID | 子Step Function名 | 主な処理内容 |
|-----------|------------------|-------------|
| `policy-image-processing` | ImageProcessingSM | リサイズ、最適化、透かし、形式変換 |
| `policy-spreadsheet-processing` | SpreadsheetProcessingSM | データクレンジング、計算、グラフ生成、エクスポート |
| `policy-video-processing` | VideoProcessingSM | トランスコーディング、サムネイル生成、字幕追加 |
| `policy-audio-processing` | AudioProcessingSM | 文字起こし、ノイズ除去、形式変換 |
| `policy-text-processing` | TextProcessingSM | NLP、翻訳、要約、感情分析 |
| `policy-pdf-processing` | PDFProcessingSM | テキスト抽出、画像抽出、結合、分割 |

---

## Lambda関数一覧

### 親Step Function用Lambda関数

| 関数名 | 役割 |
|--------|------|
| `TriggerParentStepFunction` | S3イベントから親Step Functionを起動 |
| `ValidateInput` | 入力検証、使用量事前チェック |
| `UpdateProcessingHistory` | processing-history更新 |
| `CalculateMonthlyUsage` | 月間使用量計算 |
| `CheckUsageLimit` | 使用量制限チェック |
| `SendNotification` | SESで通知メール送信 |
| `HandleError` | エラーハンドリング |

### 子Step Function用Lambda関数（画像処理の例）

| 関数名 | 役割 |
|--------|------|
| `DownloadImageFromS3` | S3から画像ダウンロード |
| `ValidateImageFormat` | 画像形式検証 |
| `ResizeImage` | 画像リサイズ |
| `OptimizeImages` | 画像最適化（圧縮） |
| `AddWatermark` | 透かし追加 |
| `ConvertImageFormat` | 画像形式変換 |
| `UploadImagesToS3` | 処理済み画像をS3にアップロード |

---

## S3イベント通知設定

### S3バケット設定

```json
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "TriggerServiceProcessing",
      "LambdaFunctionArn": "arn:aws:lambda:REGION:ACCOUNT_ID:function:TriggerParentStepFunction",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            {
              "Name": "prefix",
              "Value": "service/input/"
            }
          ]
        }
      }
    }
  ]
}
```

---

## 子Step Functionの登録・管理

### オプション1: 環境変数で管理（推奨）

**親Step FunctionのLambda関数（DetermineChildStateMachine相当）**

```python
import os

CHILD_STATE_MACHINES = {
    'policy-image-processing': os.environ.get('IMAGE_PROCESSING_SM_ARN'),
    'policy-spreadsheet-processing': os.environ.get('SPREADSHEET_PROCESSING_SM_ARN'),
    'policy-video-processing': os.environ.get('VIDEO_PROCESSING_SM_ARN'),
    'policy-audio-processing': os.environ.get('AUDIO_PROCESSING_SM_ARN'),
    'policy-text-processing': os.environ.get('TEXT_PROCESSING_SM_ARN'),
    'policy-pdf-processing': os.environ.get('PDF_PROCESSING_SM_ARN'),
}

def lambda_handler(event, context):
    policy_id = event['policyId']
    
    if policy_id not in CHILD_STATE_MACHINES:
        raise ValueError(f"Unsupported policyId: {policy_id}")
    
    child_sm_arn = CHILD_STATE_MACHINES[policy_id]
    
    if not child_sm_arn:
        raise ValueError(f"No State Machine ARN configured for policyId: {policy_id}")
    
    return {
        'childStateMachineArn': child_sm_arn,
        'policyType': policy_id.replace('policy-', '').replace('-processing', '')
    }
```

### オプション2: DynamoDBで管理（動的）

**DynamoDBテーブル: `policy-configurations`**

| policyId | stateMachineArn | description |
|----------|----------------|-------------|
| policy-image-processing | arn:aws:states:... | 画像処理用Step Function |
| policy-spreadsheet-processing | arn:aws:states:... | 表計算処理用Step Function |

**Lambda関数**

```python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('policy-configurations')

def lambda_handler(event, context):
    policy_id = event['policyId']
    
    response = table.get_item(Key={'policyId': policy_id})
    
    if 'Item' not in response:
        raise ValueError(f"Unsupported policyId: {policy_id}")
    
    policy_config = response['Item']
    
    return {
        'childStateMachineArn': policy_config['stateMachineArn'],
        'policyType': policy_config.get('policyType', 'generic')
    }
```

**推奨**: オプション1（環境変数）の方がシンプルで低レイテンシー

---

## 新しいポリシーの追加手順

### ステップ1: 子Step Functionを作成

1. 新しいポリシー用のLambda関数を実装
2. 子Step unctionのASL定義を作成
3. Step Functionsをデプロイ

### ステップ2: 親Step Functionに登録

#### 方法A: ASL定義を更新（Choice Stateに追加）

```json
{
  "DetermineChildStateMachine": {
    "Type": "Choice",
    "Choices": [
      // 既存のポリシー...
      {
        "Variable": "$.policyId",
        "StringEquals": "policy-new-processing",
        "Next": "SetNewProcessingSM"
      }
    ]
  },
  "SetNewProcessingSM": {
    "Type": "Pass",
    "Parameters": {
      "childStateMachineArn": "arn:aws:states:REGION:ACCOUNT_ID:stateMachine:NewProcessingSM",
      "policyType": "new"
    },
    "ResultPath": "$.childSMInfo",
    "Next": "InvokeChildStateMachine"
  }
}
```

#### 方法B: 環境変数を追加

```bash
aws lambda update-function-configuration \
  --function-name DetermineChildStateMachine \
  --environment Variables={NEW_PROCESSING_SM_ARN=arn:aws:states:...}
```

### ステップ3: テスト

1. ポリシーをDynamoDBに登録
2. テストファイルをアップロード
3. 処理が正常に完了することを確認

---

## 親子Step Functionの通信

### 親から子への入力

```json
{
  "processingHistoryId": "uuid-xxx",
  "customerId": "customer-123",
  "userId": "user-456",
  "userName": "山田太郎",
  "policyId": "policy-image-processing",
  "policyName": "画像処理サービス",
  "inputS3Key": "service/input/customer-123/uuid-xxx/file.jpg",
  "inputS3Bucket": "siftbeam",
  "uploadedFileKeys": ["service/input/..."],
  "aiTrainingUsage": "allow",
  "createdAt": "2025-10-15T12:00:00.000Z"
}
```

### 子から親への出力

```json
{
  "outputS3Keys": [
    "service/output/customer-123/uuid-xxx/file_thumbnail.webp",
    "service/output/customer-123/uuid-xxx/file_medium.webp",
    "service/output/customer-123/uuid-xxx/file_large.webp"
  ],
  "totalSizeBytes": 1234567,
  "processedCount": 3
}
```

---

## エラーハンドリング戦略

### 子Step Functionでのエラー

1. **子Step Function内でCatch**
   - エラーをログに記録
   - エラー詳細を含むレスポンスを返す
   - 親に伝播

2. **親Step FunctionでCatch**
   - `HandleChildError`ステートで処理
   - processing-historyを更新（status: failed）
   - エラー詳細を記録

### 親Step Functionでのエラー

1. **各ステートでCatch**
   - `HandleError`ステートで処理
   - processing-historyを更新
   - 失敗として記録

---

## まとめ

### 設計のポイント

1. **親子構造の明確な役割分担**
   - 親: 汎用処理（検証、課金、通知）
   - 子: ポリシー固有の複雑な処理

2. **子Step Functionの柔軟な追加**
   - 新しいポリシーは新しい子Step Functionを作成
   - 親Step FunctionのChoice Stateに追加するだけ

3. **S3イベント通知の活用**
   - EventBridgeではなく、シンプルで低コストなS3イベント通知

4. **同期実行の活用**
   - `.sync:2`を使って子の完了を待機
   - 親が子の結果を受け取って後続処理

5. **エラーハンドリングの階層化**
   - 子: 処理固有のエラー
   - 親: 全体的なエラーと状態管理

### 次のステップ

1. ✅ S3パス設計の確認 → 完了
2. ✅ アーキテクチャ設計 → 完了
3. ⬜ Lambda関数の実装
   - 親Step Function用Lambda関数
   - 子Step Function用Lambda関数（ポリシーごと）
4. ⬜ Step Functions定義の実装
   - 親Step Function ASL
   - 子Step Function ASL（ポリシーごと）
5. ⬜ S3イベント通知の設定
6. ⬜ IAM権限の設定
7. ⬜ テスト・デバッグ

どのポリシーから実装を始めますか？まずは画像処理から始めるのがおすすめです。🚀

