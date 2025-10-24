# 子Step Functionテストセットアップガイド

テスト用の子Step Function (`TestCopyStateMachine`) を作成し、親Step Functionとの連携をテストするための完全ガイドです。

## 📋 目次

1. [概要](#概要)
2. [前提条件](#前提条件)
3. [セットアップ手順](#セットアップ手順)
4. [テスト実行](#テスト実行)
5. [トラブルシューティング](#トラブルシューティング)
6. [次のステップ](#次のステップ)

---

## 概要

### 🎯 目的

- 親子Step Function連携をテスト
- DynamoDBマッピングテーブルをテスト
- エラーハンドリングを検証
- 本番用の子Step Functionの雛形を作成

### 🏗️ アーキテクチャ

```
S3アップロード
  ↓
TriggerParentStepFunction (Lambda)
  ↓
ServiceProcessingOrchestrator (親Step Function)
  ↓
DynamoDB GetItem (policyId → stateMachineArn)
  ↓
TestCopyStateMachine (子Step Function) ← これを作成
  ↓
TestCopyFile (Lambda)
  ↓
S3コピー (input → output)
  ↓
親Step Functionに結果返却
  ↓
DynamoDB UpdateItem (processing-history)
```

### 📦 作成されるリソース

| リソース | 名前 | タイプ |
|---------|------|--------|
| Lambda関数 | `TestCopyFile` | ファイルコピー処理 |
| Step Function | `TestCopyStateMachine` | 子ステートマシン |
| IAMロール | `TestCopyFileRole` | Lambda実行ロール |
| IAMロール | `TestCopyStateMachineRole` | Step Function実行ロール |
| DynamoDBレコード | `test-policy-copy-001` | ポリシーマッピング |

---

## 前提条件

### ✅ 必須

- [x] AWS CLIがインストールされている
- [x] AWS認証情報が設定されている
- [x] 適切なIAM権限がある（Lambda, Step Functions, DynamoDB, IAM作成権限）
- [x] S3バケット `siftbeam` が存在する
- [x] DynamoDBテーブル `siftbeam-policy-stepfunction-mapping` が作成済み
- [x] DynamoDBテーブル `siftbeam-processing-history` が作成済み
- [x] 親Step Function `ServiceProcessingOrchestrator` が作成済み

### 🔧 推奨環境

- bash シェル（Linux/Mac/WSL）
- jq（JSON処理用）
- AWS CLI v2

---

## セットアップ手順

### ステップ1: Lambda関数をデプロイ

```bash
# リポジトリのルートディレクトリに移動
cd /path/to/siftbeam

# TestCopyFile Lambdaをデプロイ
cd lambda/test-copy-file
chmod +x deploy.sh
./deploy.sh

# デプロイ成功を確認
aws lambda get-function --function-name TestCopyFile --region ap-northeast-1
```

**期待される出力:**

```
[INFO] Deployment completed successfully!
[INFO] Function Name: TestCopyFile
[INFO] Region: ap-northeast-1
```

---

### ステップ2: Step Function用のIAMロールを作成

```bash
# IAMロール名
ROLE_NAME="TestCopyStateMachineRole"
REGION="ap-northeast-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Trust Policy作成
cat > trust-policy-stepfunctions.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "states.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# IAMロール作成
aws iam create-role \
  --role-name ${ROLE_NAME} \
  --assume-role-policy-document file://trust-policy-stepfunctions.json

# ポリシー作成
cat > stepfunction-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:${REGION}:${AWS_ACCOUNT_ID}:function:TestCopyFile"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# ポリシーをロールにアタッチ
aws iam put-role-policy \
  --role-name ${ROLE_NAME} \
  --policy-name TestCopyStateMachinePolicy \
  --policy-document file://stepfunction-policy.json

# クリーンアップ
rm trust-policy-stepfunctions.json stepfunction-policy.json

echo "IAM Role created: ${ROLE_NAME}"
```

---

### ステップ3: Step Functionを作成

```bash
cd /path/to/siftbeam/stepfunctions/child

# AWSアカウントIDを取得
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ASL定義のプレースホルダーを置換
sed "s/\${AWS::AccountId}/${AWS_ACCOUNT_ID}/g" TestCopyStateMachine.asl.json > TestCopyStateMachine-deploy.asl.json

# Step Function作成
aws stepfunctions create-state-machine \
  --name TestCopyStateMachine \
  --definition file://TestCopyStateMachine-deploy.asl.json \
  --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/TestCopyStateMachineRole \
  --type STANDARD \
  --region ap-northeast-1

# クリーンアップ
rm TestCopyStateMachine-deploy.asl.json

echo "Step Function created: TestCopyStateMachine"
```

**AWS コンソールで作成する場合:**

1. Step Functions → ステートマシン → **ステートマシンを作成**
2. **タイプ**: `標準`
3. **定義**: `TestCopyStateMachine.asl.json` をコピー&ペースト
4. `${AWS::AccountId}` を実際のアカウントIDに置き換え
5. **名前**: `TestCopyStateMachine`
6. **実行ロール**: `TestCopyStateMachineRole`
7. **作成**

---

### ステップ4: DynamoDBマッピングを追加

```bash
# 設定
POLICY_ID="test-policy-copy-001"
REGION="ap-northeast-1"

# Step Function ARN取得
STATE_MACHINE_ARN=$(aws stepfunctions list-state-machines \
  --query "stateMachines[?name=='TestCopyStateMachine'].stateMachineArn" \
  --output text \
  --region ${REGION})

echo "State Machine ARN: ${STATE_MACHINE_ARN}"

# 現在時刻取得（ISO8601形式）
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# DynamoDBにマッピングを追加
aws dynamodb put-item \
  --table-name siftbeam-policy-stepfunction-mapping \
  --item "{
    \"policyId\": {\"S\": \"${POLICY_ID}\"},
    \"stateMachineArn\": {\"S\": \"${STATE_MACHINE_ARN}\"},
    \"createdAt\": {\"S\": \"${TIMESTAMP}\"},
    \"updatedAt\": {\"S\": \"${TIMESTAMP}\"}
  }" \
  --region ${REGION}

echo "✅ Mapping created successfully!"
echo "Policy ID: ${POLICY_ID}"
echo "State Machine ARN: ${STATE_MACHINE_ARN}"

# マッピング確認
aws dynamodb get-item \
  --table-name siftbeam-policy-stepfunction-mapping \
  --key "{\"policyId\": {\"S\": \"${POLICY_ID}\"}}" \
  --region ${REGION}
```

---

### ステップ5: テスト用ポリシーを作成（オプション）

UIでテストする場合、`test-policy-copy-001` というポリシーを作成してください。

または、既存のポリシーIDを使用して、上記のステップ4でマッピングを作成します。

---

## テスト実行

### テスト1: Lambda単体テスト

```bash
# テスト用ファイルをS3にアップロード
echo "Hello, Test!" > test.txt
aws s3 cp test.txt s3://siftbeam/service/input/cus_TEST123/test-history-123/test.txt

# Lambda関数を直接テスト
aws lambda invoke \
  --function-name TestCopyFile \
  --payload '{
    "inputS3Bucket": "siftbeam",
    "inputS3Key": "service/input/cus_TEST123/test-history-123/test.txt",
    "outputS3Key": "service/output/cus_TEST123/test-history-123/test.txt",
    "processingHistoryId": "test-history-123",
    "customerId": "cus_TEST123",
    "userId": "user-456",
    "policyId": "test-policy-copy-001"
  }' \
  --region ap-northeast-1 \
  response.json

# 結果確認
cat response.json

# 出力ファイル確認
aws s3 ls s3://siftbeam/service/output/cus_TEST123/test-history-123/

# クリーンアップ
rm test.txt response.json
```

**期待される出力:**

```json
{
  "statusCode": 200,
  "outputS3Key": "service/output/cus_TEST123/test-history-123/test.txt",
  "fileSizeBytes": 13,
  "message": "ファイルコピー完了"
}
```

---

### テスト2: 子Step Function単体テスト

```bash
# テスト用入力データ
cat > test-child-input.json <<EOF
{
  "processingHistoryId": "test-history-456",
  "customerId": "cus_TEST123",
  "userId": "user-789",
  "userName": "テストユーザー",
  "policyId": "test-policy-copy-001",
  "policyName": "テストコピーポリシー",
  "inputS3Key": "service/input/cus_TEST123/test-history-456/test.txt",
  "inputS3Bucket": "siftbeam",
  "aiTrainingUsage": "allow",
  "uploadedFileKeys": ["test.txt"],
  "fileSizeBytes": 13,
  "usageAmountBytes": 13,
  "createdAt": "2025-10-16T12:00:00.000Z"
}
EOF

# テスト用ファイルをS3にアップロード
echo "Hello, Child Test!" > test.txt
aws s3 cp test.txt s3://siftbeam/service/input/cus_TEST123/test-history-456/test.txt

# Step Function実行
EXECUTION_ARN=$(aws stepfunctions start-execution \
  --state-machine-arn $(aws stepfunctions list-state-machines \
    --query "stateMachines[?name=='TestCopyStateMachine'].stateMachineArn" \
    --output text \
    --region ap-northeast-1) \
  --input file://test-child-input.json \
  --region ap-northeast-1 \
  --query executionArn \
  --output text)

echo "Execution ARN: ${EXECUTION_ARN}"

# 実行完了まで待機（最大60秒）
for i in {1..60}; do
  STATUS=$(aws stepfunctions describe-execution \
    --execution-arn ${EXECUTION_ARN} \
    --region ap-northeast-1 \
    --query status \
    --output text)
  
  echo "Status: ${STATUS}"
  
  if [ "${STATUS}" = "SUCCEEDED" ] || [ "${STATUS}" = "FAILED" ]; then
    break
  fi
  
  sleep 1
done

# 実行結果確認
aws stepfunctions describe-execution \
  --execution-arn ${EXECUTION_ARN} \
  --region ap-northeast-1

# 実行履歴確認
aws stepfunctions get-execution-history \
  --execution-arn ${EXECUTION_ARN} \
  --region ap-northeast-1 \
  --max-results 50

# 出力ファイル確認
aws s3 ls s3://siftbeam/service/output/cus_TEST123/test-history-456/

# クリーンアップ
rm test.txt test-child-input.json
```

**期待される出力:**

```json
{
  "status": "SUCCEEDED",
  "output": "{\"status\":\"success\",\"processingHistoryId\":\"test-history-456\",\"downloadS3Keys\":[\"service/output/cus_TEST123/test-history-456/test.txt\"],\"totalSizeBytes\":13,\"processedFileCount\":1}"
}
```

---

### テスト3: 統合テスト（親Step Function経由）

```bash
# 1. processing-historyレコードを作成（通常はUIから自動作成）
PROCESSING_HISTORY_ID="test-integration-789"
CUSTOMER_ID="cus_TEST123"
USER_ID="user-101112"
POLICY_ID="test-policy-copy-001"

aws dynamodb put-item \
  --table-name siftbeam-processing-history \
  --item "{
    \"processing-historyId\": {\"S\": \"${PROCESSING_HISTORY_ID}\"},
    \"customerId\": {\"S\": \"${CUSTOMER_ID}\"},
    \"userId\": {\"S\": \"${USER_ID}\"},
    \"userName\": {\"S\": \"統合テストユーザー\"},
    \"policyId\": {\"S\": \"${POLICY_ID}\"},
    \"policyName\": {\"S\": \"テストコピーポリシー\"},
    \"status\": {\"S\": \"in_progress\"},
    \"uploadedFileKeys\": {\"L\": [{\"S\": \"integration-test.txt\"}]},
    \"downloadS3Keys\": {\"L\": []},
    \"fileSizeBytes\": {\"N\": \"20\"},
    \"usageAmountBytes\": {\"N\": \"20\"},
    \"aiTrainingUsage\": {\"S\": \"allow\"},
    \"createdAt\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}
  }" \
  --region ap-northeast-1

# 2. テスト用ファイルをS3にアップロード（メタデータ付き）
echo "Integration Test File" > integration-test.txt

aws s3api put-object \
  --bucket siftbeam \
  --key "service/input/${CUSTOMER_ID}/${PROCESSING_HISTORY_ID}/integration-test.txt" \
  --body integration-test.txt \
  --metadata "customerId=${CUSTOMER_ID},userId=${USER_ID},policyId=${POLICY_ID},processingHistoryId=${PROCESSING_HISTORY_ID},fileType=input,triggerStepFunction=true,uploadedAt=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)" \
  --region ap-northeast-1

echo "✅ File uploaded with metadata"

# 3. S3イベントが自動的にLambda (TriggerParentStepFunction) をトリガー
# 4. Lambda が親Step Function を起動
# 5. 親Step Function が DynamoDB から stateMachineArn を取得
# 6. 親Step Function が子Step Function (TestCopyStateMachine) を起動
# 7. 子Step Function が処理を実行
# 8. 親Step Function が processing-history を更新

# 10秒待機
echo "Waiting for processing..."
sleep 10

# 結果確認
aws dynamodb get-item \
  --table-name siftbeam-processing-history \
  --key "{\"processing-historyId\": {\"S\": \"${PROCESSING_HISTORY_ID}\"}}" \
  --region ap-northeast-1

# 出力ファイル確認
aws s3 ls s3://siftbeam/service/output/${CUSTOMER_ID}/${PROCESSING_HISTORY_ID}/

# CloudWatch Logsで詳細確認
echo "Check CloudWatch Logs:"
echo "- /aws/lambda/TriggerParentStepFunction"
echo "- /aws/states/ServiceProcessingOrchestrator"
echo "- /aws/states/TestCopyStateMachine"
echo "- /aws/lambda/TestCopyFile"

# クリーンアップ
rm integration-test.txt
```

---

## トラブルシューティング

### エラー1: Lambda関数が見つからない

**症状:**
```
An error occurred (ResourceNotFoundException) when calling the Invoke operation
```

**解決策:**
```bash
# Lambda関数の存在確認
aws lambda list-functions --region ap-northeast-1 | grep TestCopyFile

# 存在しない場合は再デプロイ
cd lambda/test-copy-file
./deploy.sh
```

---

### エラー2: Step Functionの実行が失敗

**症状:**
```
"status": "FAILED",
"error": "Lambda.ResourceNotFoundException"
```

**解決策:**
```bash
# Step FunctionのASL定義でLambda ARNが正しいか確認
aws stepfunctions describe-state-machine \
  --state-machine-arn <state-machine-arn> \
  --region ap-northeast-1

# Lambda ARNを確認
aws lambda get-function --function-name TestCopyFile --region ap-northeast-1
```

---

### エラー3: DynamoDBマッピングが見つからない

**症状:**
```
"Error": "PolicyMappingNotFound"
```

**解決策:**
```bash
# マッピングテーブルの確認
aws dynamodb scan \
  --table-name siftbeam-policy-stepfunction-mapping \
  --region ap-northeast-1

# マッピングが存在しない場合は追加
# (ステップ4を再実行)
```

---

### エラー4: S3ファイルが見つからない

**症状:**
```
"errorMessage": "Input file not found: s3://siftbeam/service/input/..."
```

**解決策:**
```bash
# S3キーが正しいか確認
aws s3 ls s3://siftbeam/service/input/ --recursive

# パスの形式を確認
# 正: service/input/{customerId}/{processingHistoryId}/{filename}
```

---

### エラー5: IAM権限エラー

**症状:**
```
"errorMessage": "User: arn:aws:... is not authorized to perform: s3:GetObject"
```

**解決策:**
```bash
# Lambda実行ロールのポリシー確認
aws iam list-attached-role-policies --role-name TestCopyFileRole

# 必要に応じてポリシーを再アタッチ
cd lambda/test-copy-file
./deploy.sh
```

---

## 次のステップ

### ✅ 完了したこと

1. ✅ Lambda関数 (`TestCopyFile`) をデプロイ
2. ✅ 子Step Function (`TestCopyStateMachine`) を作成
3. ✅ DynamoDBマッピングを追加
4. ✅ テストを実行

### 📝 今後のタスク

1. **実際の処理用子Step Functionを作成**
   - 画像処理用Step Function
   - 表計算処理用Step Function
   - 動画処理用Step Function
   - など

2. **親Step Functionを完成させる**
   - 使用量チェック
   - 課金処理
   - 通知機能

3. **エラーハンドリングの強化**
   - より詳細なエラー分類
   - リトライ戦略の最適化
   - Dead Letter Queueの設定

4. **監視・アラート設定**
   - CloudWatch Alarms
   - SNS通知
   - ダッシュボード作成

5. **本番環境へのデプロイ**
   - CloudFormation/CDKでIaC化
   - CI/CDパイプライン構築

---

## 🔗 関連ドキュメント

- [親Step Function設計](./PARENT_STEPFUNCTION_DESIGN.md)
- [Policy Mapping Table設計](./POLICY_STEPFUNCTION_MAPPING_TABLE_DESIGN.md)
- [データ処理アーキテクチャ](./DATA_PROCESSING_ARCHITECTURE_REFINED.md)
- [Lambda デプロイガイド](./LAMBDA_DEPLOYMENT_GUIDE.md)
- [IAM ポリシー設定ガイド](./IAM_POLICY_SETUP_GUIDE.md)

---

## 📞 サポート

問題が発生した場合は、以下を確認してください:

1. CloudWatch Logsでエラーログを確認
2. IAM権限が正しく設定されているか確認
3. S3バケット名とリージョンが正しいか確認
4. DynamoDBテーブルが存在するか確認
5. Lambda関数とStep Functionが同じリージョンにあるか確認

---

**🎉 セットアップ完了おめでとうございます!**

これで親子Step Functionの連携テストが可能になりました。次は実際の処理ロジックを実装していきましょう!

