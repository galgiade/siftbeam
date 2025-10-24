# TestCopyStateMachine - テスト用子Step Function

入力ファイルを出力パスにコピーするテスト用の子Step Functionです。

## 📋 概要

この子Step Functionは、親Step Function (`ServiceProcessingOrchestrator`) から呼び出され、以下の処理を実行します:

1. 親から受け取ったパラメータを検証
2. アップロードされた全ファイルをループ処理
3. 各ファイルを入力パスから出力パスにコピー
4. 処理結果を親Step Functionに返す

## 🎯 用途

- 親子Step Function連携のテスト
- DynamoDBマッピングテーブルのテスト
- エラーハンドリングのテスト
- 本番環境の子Step Functionの雛形

## 📂 ファイル構成

```
stepfunctions/child/
├── TestCopyStateMachine.asl.json    # Step Function定義
└── README.md                         # このファイル
```

## 🚀 作成手順

### 1. Lambda関数をデプロイ

まず、`TestCopyFile` Lambda関数をデプロイします:

```bash
cd lambda/test-copy-file
chmod +x deploy.sh
./deploy.sh
```

### 2. Step Functionを作成

#### AWS CLIで作成

```bash
# AWSアカウントIDを取得
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ASL定義のプレースホルダーを置換
sed "s/\${AWS::AccountId}/${AWS_ACCOUNT_ID}/g" TestCopyStateMachine.asl.json > TestCopyStateMachine-deploy.asl.json

# Step Function作成
aws stepfunctions create-state-machine \
  --name TestCopyStateMachine \
  --definition file://TestCopyStateMachine-deploy.asl.json \
  --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/StepFunctionsExecutionRole \
  --region ap-northeast-1

# クリーンアップ
rm TestCopyStateMachine-deploy.asl.json
```

#### AWS コンソールで作成

1. **Step Functions** → **ステートマシン** → **ステートマシンを作成**
2. **タイプ**: `標準`
3. **定義方法**: `コードで作成者を定義`
4. **定義**: `TestCopyStateMachine.asl.json` の内容をコピー&ペースト
5. **`${AWS::AccountId}`** を実際のAWSアカウントIDに置き換え
6. **ステートマシン名**: `TestCopyStateMachine`
7. **実行ロール**: 新しいロールを作成 or 既存のロールを選択
8. **作成**

### 3. IAM権限を設定

Step Functionsの実行ロールに以下の権限を追加:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:ap-northeast-1:*:function:TestCopyFile"
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

### 4. DynamoDBマッピングを追加

テスト用のポリシーマッピングを作成:

```bash
# AWSアカウントID取得
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# テスト用のポリシーID（既存のポリシーIDを使用）
POLICY_ID="test-policy-copy-001"

# Step Function ARN取得
STATE_MACHINE_ARN=$(aws stepfunctions list-state-machines \
  --query "stateMachines[?name=='TestCopyStateMachine'].stateMachineArn" \
  --output text \
  --region ap-northeast-1)

# DynamoDBにマッピングを追加
aws dynamodb put-item \
  --table-name siftbeam-policy-stepfunction-mapping \
  --item "{
    \"policyId\": {\"S\": \"${POLICY_ID}\"},
    \"stateMachineArn\": {\"S\": \"${STATE_MACHINE_ARN}\"},
    \"createdAt\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"},
    \"updatedAt\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}
  }" \
  --region ap-northeast-1

echo "Mapping created successfully!"
echo "Policy ID: ${POLICY_ID}"
echo "State Machine ARN: ${STATE_MACHINE_ARN}"
```

## 📥 入力形式

親Step Functionから以下の形式で呼び出されます:

```json
{
  "processingHistoryId": "test-history-123",
  "customerId": "cus_TEST123",
  "userId": "user-456",
  "userName": "テストユーザー",
  "policyId": "test-policy-copy-001",
  "policyName": "テストコピーポリシー",
  "inputS3Key": "service/input/cus_TEST123/test-history-123/20251016_120000_test.png",
  "inputS3Bucket": "siftbeam",
  "aiTrainingUsage": "allow",
  "uploadedFileKeys": ["20251016_120000_test.png", "20251016_120001_test2.png"],
  "fileSizeBytes": 2048,
  "usageAmountBytes": 2048,
  "createdAt": "2025-10-16T12:00:00.000Z"
}
```

## 📤 出力形式

### 成功時

```json
{
  "status": "success",
  "processingHistoryId": "test-history-123",
  "customerId": "cus_TEST123",
  "userId": "user-456",
  "policyId": "test-policy-copy-001",
  "downloadS3Keys": [
    "service/output/cus_TEST123/test-history-123/20251016_120000_test.png",
    "service/output/cus_TEST123/test-history-123/20251016_120001_test2.png"
  ],
  "totalSizeBytes": 2048,
  "processedFileCount": 2,
  "message": "ファイルコピーが正常に完了しました"
}
```

### 失敗時

```json
{
  "status": "failed",
  "processingHistoryId": "test-history-123",
  "customerId": "cus_TEST123",
  "userId": "user-456",
  "policyId": "test-policy-copy-001",
  "errorMessage": "Input file not found: s3://siftbeam/service/input/...",
  "errorType": "FileNotFoundError",
  "failedAtFile": "20251016_120000_test.png",
  "message": "ファイルコピー中にエラーが発生しました"
}
```

## 🔄 処理フロー

```
1. ValidateChildInput
   ↓ 親から受け取ったパラメータを検証
2. PrepareFileList
   ↓ ファイルリストを準備、インデックスを0に初期化
3. CheckMoreFiles (Choice)
   ↓ まだ処理するファイルがあるか確認
4. CopyFileToOutput (Lambda)
   ↓ TestCopyFile Lambdaを呼び出してファイルコピー
5. AddOutputKey
   ↓ 出力S3キーをリストに追加、インデックスを+1
6. CheckMoreFiles (ループ)
   ↓ 3に戻る（全ファイル処理完了まで）
7. ProcessingComplete
   ↓ 成功結果を準備
8. SuccessOutput (Succeed)
   ↓ 親Step Functionに成功を通知

エラー発生時:
4. CopyFileToOutput (エラー)
   ↓
9. ProcessingFailed
   ↓ エラー情報を準備
10. FailureOutput (Fail)
    ↓ 親Step Functionにエラーを通知
```

## 🧪 テスト方法

### 1. 単体テスト（子Step Functionのみ）

```bash
# テスト用入力データ
cat > test-input.json <<EOF
{
  "processingHistoryId": "test-history-123",
  "customerId": "cus_TEST123",
  "userId": "user-456",
  "userName": "テストユーザー",
  "policyId": "test-policy-copy-001",
  "policyName": "テストコピーポリシー",
  "inputS3Key": "service/input/cus_TEST123/test-history-123/20251016_120000_test.png",
  "inputS3Bucket": "siftbeam",
  "aiTrainingUsage": "allow",
  "uploadedFileKeys": ["20251016_120000_test.png"],
  "fileSizeBytes": 1024,
  "usageAmountBytes": 1024,
  "createdAt": "2025-10-16T12:00:00.000Z"
}
EOF

# Step Function実行
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:ap-northeast-1:ACCOUNT_ID:stateMachine:TestCopyStateMachine \
  --input file://test-input.json \
  --region ap-northeast-1

# クリーンアップ
rm test-input.json
```

### 2. 統合テスト（親Step Function経由）

1. 実際にファイルをアップロード（UIから）
2. ポリシーとして `test-policy-copy-001` を選択
3. S3イベント → Lambda → 親Step Function → 子Step Function の流れをテスト

### 3. CloudWatch Logsで確認

```bash
# Step Function実行履歴を確認
aws stepfunctions get-execution-history \
  --execution-arn <execution-arn> \
  --region ap-northeast-1

# Lambda関数のログを確認
aws logs tail /aws/lambda/TestCopyFile --follow
```

## 📊 主要なState

### 1. ValidateChildInput (Pass)

親から受け取ったパラメータを検証・整形します。

### 2. PrepareFileList (Pass)

ファイル処理のためのループ変数を初期化:
- `fileIndex`: 0
- `outputS3Keys`: []

### 3. CheckMoreFiles (Choice)

まだ処理するファイルがあるか確認:
- `$.fileIndex < len($.uploadedFileKeys)` → 次のファイルを処理
- それ以外 → 処理完了

### 4. CopyFileToOutput (Task - Lambda)

`TestCopyFile` Lambda関数を呼び出してファイルコピー。

**リトライ戦略**:
- エラータイプ: Lambda関連エラー
- 最大試行回数: 3回
- 間隔: 2秒（倍率: 2）

### 5. AddOutputKey (Pass)

- 出力S3キーをリストに追加
- `fileIndex` を +1
- ループを継続

### 6. ProcessingComplete (Pass)

成功結果を準備:
- `status`: `"success"`
- `downloadS3Keys`: 出力ファイルリスト
- `totalSizeBytes`: 合計サイズ
- `processedFileCount`: 処理ファイル数

### 7. SuccessOutput (Succeed)

親Step Functionに成功を通知。

### 8. ProcessingFailed (Pass)

エラー情報を準備:
- `status`: `"failed"`
- `errorMessage`: エラーメッセージ
- `errorType`: エラータイプ
- `failedAtFile`: 失敗したファイル名

### 9. FailureOutput (Fail)

親Step Functionにエラーを通知。

## ⚠️ エラーハンドリング

### Lambda実行エラー

```json
{
  "Catch": [
    {
      "ErrorEquals": ["States.ALL"],
      "ResultPath": "$.error",
      "Next": "ProcessingFailed"
    }
  ]
}
```

- すべてのエラーをキャッチ
- エラー情報を `$.error` に保存
- `ProcessingFailed` に遷移

### 親Step Functionへの通知

失敗時は `Fail` Stateで親に通知:

```json
{
  "Type": "Fail",
  "ErrorPath": "$.result.errorType",
  "CausePath": "$.result.errorMessage"
}
```

親Step Functionは `Catch` ブロックでこのエラーを処理します。

## 🔧 カスタマイズポイント

### 実際の処理を実装する場合

1. **Lambda関数の変更**:
   - `TestCopyFile` を実際の処理に変更
   - 例: 画像処理、データ変換、AI推論など

2. **State の追加**:
   - 前処理、後処理のStateを追加
   - 例: バリデーション、データ変換、通知など

3. **並列処理**:
   - `Map` Stateで並列処理を実装
   - 大量ファイルの高速処理

4. **エラーハンドリング**:
   - より詳細なエラー分類
   - リトライ戦略の最適化

## 🔗 関連リソース

- [TestCopyFile Lambda](../../lambda/test-copy-file/)
- [親Step Function設計](../../docs/PARENT_STEPFUNCTION_DESIGN.md)
- [Policy Mapping Table](../../docs/POLICY_STEPFUNCTION_MAPPING_TABLE_DESIGN.md)
- [データ処理アーキテクチャ](../../docs/DATA_PROCESSING_ARCHITECTURE_REFINED.md)

## 📝 次のステップ

1. ✅ Lambda関数デプロイ
2. ✅ Step Function作成
3. ✅ IAM権限設定
4. ✅ DynamoDBマッピング追加
5. ⬜ 単体テスト実行
6. ⬜ 統合テスト実行（親Step Function経由）
7. ⬜ 実際の処理用の子Step Functionを作成

