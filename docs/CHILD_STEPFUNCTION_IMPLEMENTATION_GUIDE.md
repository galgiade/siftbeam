# 子Step Function 実装ガイド

## 🎯 概要

このガイドでは、子Step Functionの標準的な実装方法を説明します。すべての子Step Functionは、このパターンに従って実装してください。

---

## 📋 標準的な構造

すべての子Step Functionは以下の流れに従います:

```
1. PrepareFileList (変数初期化)
   ↓
2. CheckMoreFiles (ループ判定)
   ↓
3. 処理ロジック (ファイル処理)
   ↓
4. AddOutputKey (結果リストに追加)
   ↓
5. UpdateDownloadS3Keys (DynamoDB更新)
   ↓
6. ProcessingComplete (完了)
```

---

## 🔧 完全な実装例

### **TestCopyStateMachine (ファイルコピー)**

```json
{
  "Comment": "TestCopyStateMachine - テスト用子Step Function (複数ファイル対応)",
  "StartAt": "PrepareFileList",
  "States": {
    "PrepareFileList": {
      "Type": "Pass",
      "Comment": "アップロードされたファイルリストを準備",
      "Assign": {
        "processingHistoryId": "{% $states.input.processingHistoryId %}",
        "customerId": "{% $states.input.customerId %}",
        "userId": "{% $states.input.userId %}",
        "userName": "{% $states.input.userName %}",
        "policyId": "{% $states.input.policyId %}",
        "policyName": "{% $states.input.policyName %}",
        "inputS3Bucket": "{% $states.input.inputS3Bucket %}",
        "uploadedFileKeys": "{% $states.input.uploadedFileKeys %}",
        "aiTrainingUsage": "{% $states.input.aiTrainingUsage %}",
        "fileSizeBytes": "{% $states.input.fileSizeBytes %}",
        "usageAmountBytes": "{% $states.input.usageAmountBytes %}",
        "createdAt": "{% $states.input.createdAt %}",
        "fileIndex": 0,
        "outputS3Keys": []
      },
      "Next": "CheckMoreFiles"
    },

    "CheckMoreFiles": {
      "Type": "Choice",
      "Comment": "まだ処理するファイルがあるか確認",
      "Choices": [
        {
          "Condition": "{% $states.fileIndex < $count($states.uploadedFileKeys) %}",
          "Next": "CopyFileToOutput"
        }
      ],
      "Default": "UpdateDownloadS3Keys"
    },

    "CopyFileToOutput": {
      "Type": "Task",
      "Comment": "S3 SDKを直接呼び出してファイルをコピー",
      "Resource": "arn:aws:states:::aws-sdk:s3:copyObject",
      "Arguments": {
        "Bucket": "{% $states.inputS3Bucket %}",
        "Key": "{% $replace($states.uploadedFileKeys[$states.fileIndex], '/input/', '/output/') %}",
        "CopySource": "{% $states.inputS3Bucket & '/' & $states.uploadedFileKeys[$states.fileIndex] %}"
      },
      "Assign": {
        "currentOutputS3Key": "{% $replace($states.uploadedFileKeys[$states.fileIndex], '/input/', '/output/') %}"
      },
      "Next": "AddOutputKey",
      "Retry": [
        {
          "ErrorEquals": ["States.TaskFailed"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2.0
        }
      ],
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.error",
          "Next": "ProcessingFailed"
        }
      ]
    },

    "AddOutputKey": {
      "Type": "Pass",
      "Comment": "出力S3キーをリストに追加し、次のファイルへ",
      "Assign": {
        "outputS3Keys": "{% $append($states.outputS3Keys, $states.currentOutputS3Key) %}",
        "fileIndex": "{% $states.fileIndex + 1 %}"
      },
      "Next": "CheckMoreFiles"
    },

    "UpdateDownloadS3Keys": {
      "Type": "Task",
      "Comment": "DynamoDB: downloadS3Keysを更新 (List型として)",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": {
        "TableName": "siftbeam-processing-history",
        "Key": {
          "processing-historyId": {
            "S": "{% $states.processingHistoryId %}"
          }
        },
        "UpdateExpression": "SET downloadS3Keys = :downloadKeys",
        "ExpressionAttributeValues": {
          ":downloadKeys": {
            "L": "{% $count($states.outputS3Keys) > 0 ? $map($states.outputS3Keys, function($v) { {'S': $v} }) : [] %}"
          }
        }
      },
      "ResultPath": null,
      "Next": "ProcessingComplete",
      "Catch": [
        {
          "ErrorEquals": ["States.ALL"],
          "ResultPath": "$.dynamoError",
          "Comment": "DynamoDB更新失敗しても処理は続行",
          "Next": "ProcessingComplete"
        }
      ]
    },

    "ProcessingComplete": {
      "Type": "Pass",
      "Comment": "処理完了 - 親Step Functionに返す結果を準備",
      "Output": {
        "status": "success",
        "processingHistoryId": "{% $states.processingHistoryId %}",
        "customerId": "{% $states.customerId %}",
        "userId": "{% $states.userId %}",
        "policyId": "{% $states.policyId %}",
        "downloadS3Keys": "{% $states.outputS3Keys %}",
        "totalSizeBytes": "{% $states.usageAmountBytes %}",
        "processedFileCount": "{% $count($states.uploadedFileKeys) %}",
        "message": "ファイルコピーが正常に完了しました"
      },
      "End": true
    },

    "ProcessingFailed": {
      "Type": "Fail",
      "Comment": "失敗終了 - 親Step Functionにエラーを通知",
      "Error": "ProcessingError",
      "Cause": "ファイルコピー中にエラーが発生しました"
    }
  },
  "QueryLanguage": "JSONata"
}
```

---

## 📝 各ステートの詳細

### **1. PrepareFileList**

**目的**: 親から受け取った入力変数を初期化し、ループ用の変数を準備

**重要なポイント**:
- `fileIndex: 0`: ループカウンター
- `outputS3Keys: []`: 結果を格納する空配列
- すべての入力変数を`$states`スコープにコピー

```json
{
  "Assign": {
    "processingHistoryId": "{% $states.input.processingHistoryId %}",
    "uploadedFileKeys": "{% $states.input.uploadedFileKeys %}",
    "fileIndex": 0,
    "outputS3Keys": []
  }
}
```

---

### **2. CheckMoreFiles**

**目的**: まだ処理するファイルがあるか判定

**ループ条件**:
```jsonata
$states.fileIndex < $count($states.uploadedFileKeys)
```

- `true`: 次のファイルを処理 (`CopyFileToOutput`へ)
- `false`: すべて処理完了 (`UpdateDownloadS3Keys`へ)

---

### **3. 処理ロジック (例: CopyFileToOutput)**

**目的**: 実際のファイル処理を行う

**重要なポイント**:
- `Arguments`: S3コピー操作のパラメータ
- `Assign`: 処理結果を変数に保存
- `Retry`: 一時的なエラーのリトライ
- `Catch`: 致命的なエラーのハンドリング

```json
{
  "Arguments": {
    "Bucket": "{% $states.inputS3Bucket %}",
    "Key": "{% $replace($states.uploadedFileKeys[$states.fileIndex], '/input/', '/output/') %}",
    "CopySource": "{% $states.inputS3Bucket & '/' & $states.uploadedFileKeys[$states.fileIndex] %}"
  },
  "Assign": {
    "currentOutputS3Key": "{% $replace($states.uploadedFileKeys[$states.fileIndex], '/input/', '/output/') %}"
  }
}
```

**配列インデックス**:
```jsonata
$states.uploadedFileKeys[$states.fileIndex]
```
- 0番目のファイル → `uploadedFileKeys[0]`
- 1番目のファイル → `uploadedFileKeys[1]`

**S3パス変換**:
```jsonata
$replace($states.uploadedFileKeys[$states.fileIndex], '/input/', '/output/')
```
- 入力: `service/input/cus_123/abc/file.png`
- 出力: `service/output/cus_123/abc/file.png`

---

### **4. AddOutputKey**

**目的**: 処理結果をリストに追加し、次のファイルへ

**リストへの追加**:
```jsonata
$append($states.outputS3Keys, $states.currentOutputS3Key)
```

**カウンターのインクリメント**:
```jsonata
$states.fileIndex + 1
```

```json
{
  "Assign": {
    "outputS3Keys": "{% $append($states.outputS3Keys, $states.currentOutputS3Key) %}",
    "fileIndex": "{% $states.fileIndex + 1 %}"
  }
}
```

---

### **5. UpdateDownloadS3Keys**

**目的**: DynamoDBに結果を保存

**重要なポイント**:
- **List型 (`L`)**: DynamoDBの配列型
- **`$map()`**: 各要素を`{'S': value}`でラップ
- **条件分岐**: 要素があれば変換、なければ空配列

```json
{
  "ExpressionAttributeValues": {
    ":downloadKeys": {
      "L": "{% $count($states.outputS3Keys) > 0 ? $map($states.outputS3Keys, function($v) { {'S': $v} }) : [] %}"
    }
  }
}
```

**変換の詳細**:

```jsonata
// 入力 (普通のJavaScript配列)
$states.outputS3Keys = [
  "service/output/.../file1.png",
  "service/output/.../file2.png"
]

// 変換後 (DynamoDB List型)
[
  {"S": "service/output/.../file1.png"},
  {"S": "service/output/.../file2.png"}
]
```

---

### **6. ProcessingComplete**

**目的**: 処理完了を親に通知

**出力形式**:
```json
{
  "status": "success",
  "processingHistoryId": "...",
  "downloadS3Keys": ["service/output/..."],
  "processedFileCount": 2
}
```

---

## 🎯 カスタマイズポイント

### **ポイント1: 処理ロジックの変更**

`CopyFileToOutput`ステートを、あなたのポリシーに合わせて変更:

#### **例1: Lambda関数で画像リサイズ**

```json
{
  "ResizeImage": {
    "Type": "Task",
    "Resource": "arn:aws:lambda:...:function:ResizeImage",
    "Parameters": {
      "inputS3Key": "{% $states.uploadedFileKeys[$states.fileIndex] %}",
      "outputSize": "800x600"
    },
    "Assign": {
      "currentOutputS3Key": "{% $states.resizedImageKey %}"
    },
    "Next": "AddOutputKey"
  }
}
```

#### **例2: AI学習データ加工 (Void)**

```json
{
  "PreprocessData": {
    "Type": "Task",
    "Resource": "arn:aws:lambda:...:function:PreprocessData",
    "Parameters": {
      "inputS3Key": "{% $states.uploadedFileKeys[$states.fileIndex] %}"
    },
    "Next": "IncrementIndex"
  },
  
  "IncrementIndex": {
    "Type": "Pass",
    "Assign": {
      "fileIndex": "{% $states.fileIndex + 1 %}"
    },
    "Next": "CheckMoreFiles"
  }
}
```

**注意**: 結果ファイルがない場合、`AddOutputKey`は不要。`outputS3Keys`は空配列のまま。

---

### **ポイント2: エラーハンドリング**

```json
{
  "Retry": [
    {
      "ErrorEquals": ["States.TaskFailed"],
      "IntervalSeconds": 2,
      "MaxAttempts": 3,
      "BackoffRate": 2.0
    }
  ],
  "Catch": [
    {
      "ErrorEquals": ["States.ALL"],
      "ResultPath": "$.error",
      "Next": "ProcessingFailed"
    }
  ]
}
```

- **Retry**: 一時的なエラー (ネットワーク障害など)
- **Catch**: 致命的なエラー (ファイルが存在しない、Lambda失敗など)

---

### **ポイント3: 出力パスのカスタマイズ**

デフォルトは`/input/` → `/output/`変換:

```jsonata
$replace($states.uploadedFileKeys[$states.fileIndex], '/input/', '/output/')
```

カスタマイズ例:

#### **例1: ファイル名に接尾辞を追加**

```jsonata
$replace(
  $states.uploadedFileKeys[$states.fileIndex], 
  /\.([^.]+)$/, 
  '_resized.$1'
)

// 入力: file.png
// 出力: file_resized.png
```

#### **例2: 異なるフォルダに出力**

```jsonata
$replace(
  $states.uploadedFileKeys[$states.fileIndex], 
  'service/input/', 
  'service/processed/'
)
```

---

## 🧪 テストシナリオ

### **シナリオ1: 単一ファイル**

**入力**:
```json
{
  "processingHistoryId": "abc-123",
  "uploadedFileKeys": ["service/input/cus_123/abc/file.png"],
  "inputS3Bucket": "siftbeam"
}
```

**期待される出力**:
```json
{
  "status": "success",
  "downloadS3Keys": ["service/output/cus_123/abc/file.png"],
  "processedFileCount": 1
}
```

**DynamoDBの状態**:
```json
{
  "processing-historyId": "abc-123",
  "downloadS3Keys": ["service/output/cus_123/abc/file.png"]
}
```

---

### **シナリオ2: 複数ファイル**

**入力**:
```json
{
  "processingHistoryId": "def-456",
  "uploadedFileKeys": [
    "service/input/cus_123/def/file1.png",
    "service/input/cus_123/def/file2.png",
    "service/input/cus_123/def/file3.png"
  ]
}
```

**期待される出力**:
```json
{
  "status": "success",
  "downloadS3Keys": [
    "service/output/cus_123/def/file1.png",
    "service/output/cus_123/def/file2.png",
    "service/output/cus_123/def/file3.png"
  ],
  "processedFileCount": 3
}
```

---

### **シナリオ3: Void (結果なし)**

**入力**:
```json
{
  "processingHistoryId": "ghi-789",
  "uploadedFileKeys": ["service/input/cus_123/ghi/data.csv"]
}
```

**期待される出力**:
```json
{
  "status": "success",
  "downloadS3Keys": [],
  "processedFileCount": 1
}
```

**DynamoDBの状態**:
```json
{
  "processing-historyId": "ghi-789",
  "downloadS3Keys": []
}
```

---

## 📚 JSONata関数リファレンス

### **`$count(array)`**
配列の要素数を取得

```jsonata
$count(["a", "b", "c"])  // 結果: 3
```

### **`$append(array, value)`**
配列に要素を追加

```jsonata
$append([1, 2], 3)  // 結果: [1, 2, 3]
```

### **`$replace(string, pattern, replacement)`**
文字列を置換

```jsonata
$replace("hello world", "world", "JSONata")  // 結果: "hello JSONata"
```

### **`$map(array, function)`**
配列の各要素を変換

```jsonata
$map([1, 2, 3], function($v) { $v * 2 })  // 結果: [2, 4, 6]
```

### **三項演算子**
条件分岐

```jsonata
$count($states.outputS3Keys) > 0 ? "あり" : "なし"
```

---

## 🎯 チェックリスト

デプロイ前の確認:

- [ ] `PrepareFileList`で必要な変数をすべて初期化している
- [ ] `CheckMoreFiles`のループ条件が正しい
- [ ] 処理ロジックで`Retry`と`Catch`を設定している
- [ ] `UpdateDownloadS3Keys`で**List型 (`L`)**を使用している
- [ ] `$map()`で各要素を`{'S': $v}`でラップしている
- [ ] `ProcessingComplete`で必要な情報を返している
- [ ] エラー時は`ProcessingFailed`に遷移している
- [ ] 複数ファイルでテストしている
- [ ] Void (結果なし) のケースでテストしている

---

## 🚀 デプロイ手順

### **1. Step Functionsコンソールで作成**

1. https://ap-northeast-1.console.aws.amazon.com/states/
2. **Create state machine**
3. **Write your workflow in code**を選択
4. ASL定義をペースト
5. **Next**
6. 名前を入力 (例: `PolicyXXX-Processing`)
7. **Create state machine**

### **2. IAM権限の設定**

作成されたロールに以下の権限を追加:
- S3: `GetObject`, `PutObject`
- DynamoDB: `UpdateItem`
- CloudWatch Logs: ロギング

詳細: `docs/stepfunction-child-iam-policy.json`

### **3. マッピングテーブルに登録**

```bash
aws dynamodb put-item \
  --table-name siftbeam-policy-stepfunction-mapping \
  --item '{
    "policyId": {"S": "your-policy-id"},
    "stateMachineArn": {"S": "arn:aws:states:..."},
    "createdAt": {"S": "2025-10-16T12:00:00Z"}
  }'
```

### **4. テスト実行**

1. ファイルをアップロード
2. 親Step Functionが起動
3. 子Step Functionが実行される
4. DynamoDBとS3を確認

---

この実装ガイドに従うことで、**統一された、保守しやすい子Step Function**が作成できます!🎉

