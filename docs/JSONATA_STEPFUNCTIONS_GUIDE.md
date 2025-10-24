# JSONata in Step Functions 完全ガイド

## ⚠️ 重要な制約

### **`$states`でアクセスできるのは2つだけ**

```jsonata
$states.input   // ✅ 現在のステートへの入力
$states.context // ✅ 実行コンテキスト情報
```

**❌ 以下はエラーになります:**
```jsonata
$states.myVariable      // ❌ Assignで設定した変数
$states.fileIndex       // ❌ カスタム変数
$states.outputS3Keys    // ❌ 配列変数
```

---

## 🔧 正しい変数の扱い方

### **パターン1: `Output`フィールドを使う**

各ステートの`Output`が、次のステートの`$states.input`になります。

```json
{
  "StateA": {
    "Type": "Pass",
    "Output": {
      "myVariable": "{% $states.input.someValue %}",
      "counter": 0
    },
    "Next": "StateB"
  },
  
  "StateB": {
    "Type": "Pass",
    "Output": {
      "myVariable": "{% $states.input.myVariable %}",
      "counter": "{% $states.input.counter + 1 %}"
    },
    "Next": "StateC"
  }
}
```

**重要**: `Output`で設定した値は、次のステートで`$states.input.変数名`でアクセスします。

---

### **パターン2: `Assign`フィールドを使う (Task)**

`Assign`は`Task`ステートで使用でき、既存の入力に変数を**追加**します。

```json
{
  "CopyFile": {
    "Type": "Task",
    "Resource": "arn:aws:states:::aws-sdk:s3:copyObject",
    "Arguments": {
      "Bucket": "{% $states.input.bucketName %}",
      "Key": "output/file.png"
    },
    "Assign": {
      "resultKey": "output/file.png"
    },
    "Next": "NextState"
  }
}
```

**動作**:
- 入力: `{"bucketName": "my-bucket"}`
- 出力: `{"bucketName": "my-bucket", "resultKey": "output/file.png"}`
- 次のステートで: `$states.input.resultKey`でアクセス

---

## 📝 実際の実装例

### **複数ファイルのループ処理**

```json
{
  "Comment": "複数ファイル処理 (正しい実装)",
  "StartAt": "Initialize",
  "States": {
    "Initialize": {
      "Type": "Pass",
      "Comment": "すべての変数をOutputで定義",
      "Output": {
        "processingHistoryId": "{% $states.input.processingHistoryId %}",
        "uploadedFileKeys": "{% $states.input.uploadedFileKeys %}",
        "fileIndex": 0,
        "outputS3Keys": []
      },
      "Next": "CheckMoreFiles"
    },

    "CheckMoreFiles": {
      "Type": "Choice",
      "Choices": [
        {
          "Condition": "{% $states.input.fileIndex < $count($states.input.uploadedFileKeys) %}",
          "Next": "ProcessFile"
        }
      ],
      "Default": "Complete"
    },

    "ProcessFile": {
      "Type": "Task",
      "Resource": "...",
      "Arguments": {
        "currentFile": "{% $states.input.uploadedFileKeys[$states.input.fileIndex] %}"
      },
      "Output": {
        "processingHistoryId": "{% $states.input.processingHistoryId %}",
        "uploadedFileKeys": "{% $states.input.uploadedFileKeys %}",
        "fileIndex": "{% $states.input.fileIndex + 1 %}",
        "outputS3Keys": "{% $append($states.input.outputS3Keys, 'output/file.png') %}"
      },
      "Next": "CheckMoreFiles"
    },

    "Complete": {
      "Type": "Pass",
      "Output": {
        "status": "success",
        "downloadS3Keys": "{% $states.input.outputS3Keys %}"
      },
      "End": true
    }
  },
  "QueryLanguage": "JSONata"
}
```

---

## 🎯 重要なポイント

### **1. すべてのステートで変数を引き継ぐ**

各ステートの`Output`で、次のステートに必要なすべての変数を含めます。

```json
{
  "Output": {
    "processingHistoryId": "{% $states.input.processingHistoryId %}",
    "fileIndex": "{% $states.input.fileIndex + 1 %}",
    "outputS3Keys": "{% $append($states.input.outputS3Keys, $newKey) %}"
  }
}
```

**忘れると**: 次のステートでその変数にアクセスできなくなります。

---

### **2. `$states.input`から始める**

すべての変数アクセスは`$states.input.`から始まります。

```jsonata
// ✅ 正しい
$states.input.fileIndex
$states.input.uploadedFileKeys
$states.input.outputS3Keys

// ❌ 間違い
$states.fileIndex
$states.uploadedFileKeys
$states.outputS3Keys
```

---

### **3. 配列操作**

```jsonata
// 要素数
$count($states.input.uploadedFileKeys)

// 要素アクセス
$states.input.uploadedFileKeys[0]
$states.input.uploadedFileKeys[$states.input.fileIndex]

// 要素追加
$append($states.input.outputS3Keys, "new-value")

// マッピング
$map($states.input.outputS3Keys, function($v) { {'S': $v} })
```

---

## 📚 よくあるエラーと解決方法

### **エラー1: "Field '$states.myVariable' does not exist"**

```
❌ エラー原因:
"Condition": "{% $states.fileIndex < 10 %}"

✅ 修正:
"Condition": "{% $states.input.fileIndex < 10 %}"
```

---

### **エラー2: 次のステートで変数が消える**

```json
// ❌ 間違い: fileIndexだけ更新
{
  "Output": {
    "fileIndex": "{% $states.input.fileIndex + 1 %}"
  }
}
// 次のステートで outputS3Keys にアクセスできない!

// ✅ 正しい: すべての変数を引き継ぐ
{
  "Output": {
    "fileIndex": "{% $states.input.fileIndex + 1 %}",
    "outputS3Keys": "{% $states.input.outputS3Keys %}"
  }
}
```

---

### **エラー3: DynamoDB List型の変換**

```json
// ❌ 間違い
{
  "L": "{% $states.outputS3Keys %}"
}

// ✅ 正しい
{
  "L": "{% $map($states.input.outputS3Keys, function($v) { {'S': $v} }) %}"
}
```

---

## 🔄 フルサンプル: ファイルコピー

```json
{
  "Comment": "TestCopyStateMachine - 完全版",
  "StartAt": "PrepareFileList",
  "States": {
    "PrepareFileList": {
      "Type": "Pass",
      "Output": {
        "processingHistoryId": "{% $states.input.processingHistoryId %}",
        "customerId": "{% $states.input.customerId %}",
        "userId": "{% $states.input.userId %}",
        "policyId": "{% $states.input.policyId %}",
        "inputS3Bucket": "{% $states.input.inputS3Bucket %}",
        "uploadedFileKeys": "{% $states.input.uploadedFileKeys %}",
        "aiTrainingUsage": "{% $states.input.aiTrainingUsage %}",
        "usageAmountBytes": "{% $states.input.usageAmountBytes %}",
        "fileIndex": 0,
        "outputS3Keys": []
      },
      "Next": "CheckMoreFiles"
    },

    "CheckMoreFiles": {
      "Type": "Choice",
      "Choices": [
        {
          "Condition": "{% $states.input.fileIndex < $count($states.input.uploadedFileKeys) %}",
          "Next": "CopyFileToOutput"
        }
      ],
      "Default": "UpdateDownloadS3Keys"
    },

    "CopyFileToOutput": {
      "Type": "Task",
      "Resource": "arn:aws:states:::aws-sdk:s3:copyObject",
      "Arguments": {
        "Bucket": "{% $states.input.inputS3Bucket %}",
        "Key": "{% $replace($states.input.uploadedFileKeys[$states.input.fileIndex], '/input/', '/output/') %}",
        "CopySource": "{% $states.input.inputS3Bucket & '/' & $states.input.uploadedFileKeys[$states.input.fileIndex] %}"
      },
      "Output": {
        "processingHistoryId": "{% $states.input.processingHistoryId %}",
        "inputS3Bucket": "{% $states.input.inputS3Bucket %}",
        "uploadedFileKeys": "{% $states.input.uploadedFileKeys %}",
        "fileIndex": "{% $states.input.fileIndex + 1 %}",
        "outputS3Keys": "{% $append($states.input.outputS3Keys, $replace($states.input.uploadedFileKeys[$states.input.fileIndex], '/input/', '/output/')) %}"
      },
      "Next": "CheckMoreFiles"
    },

    "UpdateDownloadS3Keys": {
      "Type": "Task",
      "Resource": "arn:aws:states:::dynamodb:updateItem",
      "Parameters": {
        "TableName": "siftbeam-processing-history",
        "Key": {
          "processing-historyId": {
            "S": "{% $states.input.processingHistoryId %}"
          }
        },
        "UpdateExpression": "SET downloadS3Keys = :downloadKeys",
        "ExpressionAttributeValues": {
          ":downloadKeys": {
            "L": "{% $count($states.input.outputS3Keys) > 0 ? $map($states.input.outputS3Keys, function($v) { {'S': $v} }) : [] %}"
          }
        }
      },
      "Next": "ProcessingComplete"
    },

    "ProcessingComplete": {
      "Type": "Pass",
      "Output": {
        "status": "success",
        "downloadS3Keys": "{% $states.input.outputS3Keys %}"
      },
      "End": true
    }
  },
  "QueryLanguage": "JSONata"
}
```

---

## 📋 チェックリスト

- [ ] すべての変数アクセスで`$states.input.`を使用
- [ ] 各ステートの`Output`で必要な変数をすべて引き継ぐ
- [ ] DynamoDB更新で`$map()`を使用してList型に変換
- [ ] `$count()`, `$append()`, `$replace()`などの関数を正しく使用
- [ ] Choice条件で`$states.input.`を使用

---

## 🎯 まとめ

### **JSONata in Step Functionsの鉄則**

1. **`$states.input`のみアクセス可能**: カスタム変数は`$states.myVar`ではなく`$states.input.myVar`
2. **`Output`で変数を引き継ぐ**: 次のステートに必要なすべての変数を含める
3. **`Assign`は追加のみ**: 既存の入力に変数を追加する(上書きではない)
4. **DynamoDB型変換**: `$map()`で各要素を`{'S': $v}`でラップ

この規則に従えば、JSONataでの複雑な処理も正しく実装できます!✅

