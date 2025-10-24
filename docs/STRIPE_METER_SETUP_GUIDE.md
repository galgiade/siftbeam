# Stripe Meter セットアップ完全ガイド

## 📋 目次

1. [Stripe側の設定](#stripe側の設定)
2. [AWS Secrets Managerの設定](#aws-secrets-managerの設定)
3. [親Step FunctionのIAM権限追加](#親step-functionのiam権限追加)
4. [親Step Functionの更新](#親step-functionの更新)
5. [動作確認](#動作確認)
6. [トラブルシューティング](#トラブルシューティング)

---

## 1. Stripe側の設定

### **Step 1-1: Billing Meterの作成**

1. **Stripeダッシュボードにログイン**
   - https://dashboard.stripe.com/

2. **Billing → Meters**に移動
   - 左メニュー: **Billing**
   - サブメニュー: **Meters**

3. **Create meter**をクリック

4. **メーターの設定**:
   ```
   Display name: File Processing (Bytes)
   Event name: file_processed
   Aggregation: Sum
   Value key: value
   Customer ID field: stripe_customer_id
   ```

5. **Save**をクリック

6. **Meter IDをメモ**:
   - 例: `meter_1PxyzAbc123...`

### **Step 1-2: Productの作成**

1. **Products → Create product**

2. **Product情報**:
   ```
   Name: File Processing
   Description: ファイル処理使用量課金 (バイト単位)
   ```

3. **Save**

### **Step 1-3: Priceの作成**

1. 作成したProductページで **Add price**

2. **価格設定**:
   ```
   Pricing model: Usage-based
   Billing period: Monthly
   Meter: File Processing (Bytes)
   Price: $0.00001 per unit
   Currency: USD (または JPY)
   ```

   **参考価格例**:
   - `$0.00001/byte` = 1MBあたり約$10
   - `¥0.001/byte` = 1MBあたり約¥1,000

3. **Save**

4. **Price IDをメモ**:
   - 例: `price_1PxyzAbc123...`

### **Step 1-4: API Keyの取得**

1. **Developers → API keys**

2. **Secret key**をコピー:
   - テスト環境: `sk_test_...`
   - 本番環境: `sk_live_...`

3. **安全に保管** (次のステップで使用)

---

## 2. AWS Secrets Managerの設定

### **Step 2-1: シークレットの作成**

#### **方法A: AWS CLIで作成**

```bash
aws secretsmanager create-secret \
  --name siftbeam/stripe/api-key \
  --description "Stripe Secret Key for Billing Meters" \
  --secret-string '{"STRIPE_SECRET_KEY":"sk_test_your_actual_secret_key_here"}' \
  --region ap-northeast-1
```

#### **方法B: AWS コンソールで作成**

1. **Secrets Managerコンソールにアクセス**
   - https://ap-northeast-1.console.aws.amazon.com/secretsmanager/

2. **Store a new secret**をクリック

3. **Secret type**:
   - **Other type of secret**を選択

4. **Key/value pairs**:
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...` (Step 1-4でコピーしたキー)

5. **Encryption key**:
   - `aws/secretsmanager` (デフォルト)

6. **Next**

7. **Secret name**:
   ```
   siftbeam/stripe/api-key
   ```

8. **Description**:
   ```
   Stripe Secret Key for Billing Meters
   ```

9. **Next** → **Next** → **Store**

### **Step 2-2: シークレットARNの確認**

```bash
aws secretsmanager describe-secret \
  --secret-id siftbeam/stripe/api-key \
  --region ap-northeast-1
```

出力例:
```json
{
  "ARN": "arn:aws:secretsmanager:ap-northeast-1:002689294103:secret:siftbeam/stripe/api-key-AbCdEf",
  "Name": "siftbeam/stripe/api-key",
  "LastChangedDate": "2025-10-16T10:00:00.000Z",
  "VersionIdsToStages": {
    "abc123-def456": ["AWSCURRENT"]
  }
}
```

**ARNをメモ**: 次のステップで使用

---

## 3. 親Step FunctionのIAM権限追加

### **Step 3-1: 現在のロールを確認**

1. **Step Functionsコンソール**
   - https://ap-northeast-1.console.aws.amazon.com/states/

2. **ServiceProcessingOrchestrator**を選択

3. **Details**タブ → **Permissions**
   - ロール名をメモ (例: `StepFunctions-ServiceProcessingOrchestrator-role-abc123`)

### **Step 3-2: IAMポリシーの追加**

#### **方法A: インラインポリシーで追加**

1. **IAMコンソール**
   - https://console.aws.amazon.com/iam/

2. **Roles** → ロール名で検索

3. **Add permissions** → **Create inline policy**

4. **JSON**タブを選択

5. 以下をペースト:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SecretsManagerReadAccess",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:ap-northeast-1:002689294103:secret:siftbeam/stripe/api-key-*"
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
    }
  ]
}
```

6. **Review policy**

7. **Name**: `StripeMeterIntegrationPolicy`

8. **Create policy**

#### **方法B: AWS CLIで追加**

```bash
aws iam put-role-policy \
  --role-name StepFunctions-ServiceProcessingOrchestrator-role-abc123 \
  --policy-name StripeMeterIntegrationPolicy \
  --policy-document file://docs/stepfunction-orchestrator-iam-policy.json \
  --region ap-northeast-1
```

### **Step 3-3: 権限の確認**

```bash
aws iam list-role-policies \
  --role-name StepFunctions-ServiceProcessingOrchestrator-role-abc123
```

出力に`StripeMeterIntegrationPolicy`が含まれていればOK。

---

## 4. 親Step Functionの更新

### **Step 4-1: 新しい定義を取得**

```bash
# GitHubまたはローカルから最新版を取得
cd c:\Users\81903\react\siftbeam
git pull origin main
```

### **Step 4-2: Step Function定義の確認**

ファイル: `stepfunctions/parent/ServiceProcessingOrchestrator.asl.json`

主要な追加ステート:
- `GetStripeAPIKey`: Secrets Managerからキー取得
- `SendStripeMeterEvent`: Stripe APIにイベント送信
- `LogStripeMeterError`: エラーログ記録

### **Step 4-3: Step Functionの更新**

#### **方法A: コンソールで更新**

1. **Step Functionsコンソール**
   - `ServiceProcessingOrchestrator`を選択

2. **Edit**をクリック

3. **Definition**タブ

4. 内容を全て削除し、`ServiceProcessingOrchestrator.asl.json`の内容をペースト

5. **Save**

6. **Update state machine**

#### **方法B: AWS CLIで更新**

```bash
aws stepfunctions update-state-machine \
  --state-machine-arn arn:aws:states:ap-northeast-1:002689294103:stateMachine:ServiceProcessingOrchestrator \
  --definition file://stepfunctions/parent/ServiceProcessingOrchestrator.asl.json \
  --region ap-northeast-1
```

### **Step 4-4: 更新の確認**

```bash
aws stepfunctions describe-state-machine \
  --state-machine-arn arn:aws:states:ap-northeast-1:002689294103:stateMachine:ServiceProcessingOrchestrator \
  --region ap-northeast-1
```

出力の`lastUpdateDate`が更新されていることを確認。

---

## 5. 動作確認

### **Step 5-1: テストファイルのアップロード**

1. **Siftbeamアプリにログイン**

2. **サービス → ファイルアップロード**

3. **テストファイルをアップロード**:
   - 小さめのファイル (例: 1KB の icon.png)

4. **処理開始**

### **Step 5-2: Step Function実行の確認**

1. **Step Functionsコンソール**
   - `ServiceProcessingOrchestrator`を選択

2. **最新の実行を確認**

3. **実行グラフ**:
   ```
   InitializeVariables
     ↓
   UpdateStatusToProcessing
     ↓
   GetPolicyMapping
     ↓
   CheckMappingExists
     ↓
   StartChildStepFunction
     ↓
   UpdateStatusToCompleted
     ↓
   GetStripeAPIKey ← 新規
     ↓
   SendStripeMeterEvent ← 新規
     ↓
   ProcessingSuccess
   ```

4. **SendStripeMeterEvent**をクリックして詳細を確認:

```json
{
  "statusCode": 200,
  "body": {
    "id": "bme_1PxyzAbc123",
    "object": "billing.meter_event",
    "created": 1760612775,
    "event_name": "file_processed",
    "payload": {
      "stripe_customer_id": "cus_TB7TNGpqOEFcst",
      "value": 1024
    }
  }
}
```

### **Step 5-3: Stripeダッシュボードで確認**

1. **Billing → Meters**

2. **File Processing (Bytes)**を選択

3. **Events**タブ

4. **最新のイベント**を確認:
   ```
   Customer: cus_TB7TNGpqOEFcst
   Value: 1024
   Timestamp: 2025-10-16 10:00:00
   Identifier: 912c4f9d-b33a-48de-b160-35b62119a227
   ```

### **Step 5-4: DynamoDBで確認**

```bash
aws dynamodb get-item \
  --table-name siftbeam-processing-history \
  --key '{"processing-historyId": {"S": "912c4f9d-b33a-48de-b160-35b62119a227"}}' \
  --region ap-northeast-1
```

確認項目:
- `status`: `completed`
- `downloadS3Keys`: 出力ファイルキー
- `stripeMeterError`: 存在しない (エラーがない場合)

---

## 6. トラブルシューティング

### **エラー 1: `AccessDeniedException` (Secrets Manager)**

**エラーメッセージ**:
```
User: arn:aws:sts::002689294103:assumed-role/StepFunctions-... is not authorized to perform: secretsmanager:GetSecretValue
```

**原因**: IAM権限が不足

**解決**:
1. Step 3の権限設定を再確認
2. ロールに`secretsmanager:GetSecretValue`権限を追加
3. リソースARNが正しいか確認

### **エラー 2: `Invalid API Key` (Stripe)**

**エラーメッセージ**:
```
{
  "statusCode": 401,
  "body": {
    "error": {
      "message": "Invalid API Key provided"
    }
  }
}
```

**原因**: Secrets Managerのキーが間違っている

**解決**:
```bash
# シークレットを確認
aws secretsmanager get-secret-value \
  --secret-id siftbeam/stripe/api-key \
  --region ap-northeast-1

# シークレットを更新
aws secretsmanager update-secret \
  --secret-id siftbeam/stripe/api-key \
  --secret-string '{"STRIPE_SECRET_KEY":"sk_test_correct_key"}' \
  --region ap-northeast-1
```

### **エラー 3: `Customer not found` (Stripe)**

**エラーメッセージ**:
```
{
  "statusCode": 404,
  "body": {
    "error": {
      "message": "No such customer: 'cus_invalid'"
    }
  }
}
```

**原因**: DynamoDBの`customerId`がStripeに存在しない

**解決**:
1. Stripeダッシュボードで顧客を検索
2. DynamoDBの`customerId`を確認
3. 必要に応じてStripeで顧客を作成

### **エラー 4: Meter Eventが表示されない**

**症状**: Stripeダッシュボードでイベントが見つからない

**原因**:
- イベント名が不一致
- メーターの設定が間違っている
- タイムスタンプが未来または過去すぎる

**解決**:
1. Step Function実行ログで送信データを確認
2. Stripeメーター設定を確認:
   - Event name: `file_processed`
   - Customer ID field: `stripe_customer_id`
   - Value key: `value`
3. タイムスタンプが現在時刻から±30日以内か確認

### **エラー 5: HTTP Task実行権限エラー**

**エラーメッセージ**:
```
User is not authorized to perform: states:InvokeHTTPEndpoint
```

**原因**: HTTP Task実行権限が不足

**解決**:
1. Step 3-2の権限を再確認
2. `states:InvokeHTTPEndpoint`権限を追加
3. Conditionで`https://api.stripe.com/*`が許可されているか確認

---

## 📊 監視とアラート

### **CloudWatch Logs**

Step Function実行ログの確認:

```bash
aws logs tail /aws/vendedlogs/states/ServiceProcessingOrchestrator --follow
```

### **CloudWatch Alarms**

Stripe送信失敗を監視:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name StripeMeterSendFailure \
  --alarm-description "Stripe Meter Event送信失敗を検知" \
  --metric-name ExecutionsFailed \
  --namespace AWS/States \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions Name=StateMachineArn,Value=arn:aws:states:ap-northeast-1:002689294103:stateMachine:ServiceProcessingOrchestrator
```

---

## ✅ セットアップ完了チェックリスト

デプロイ前の最終確認:

- [ ] Stripe Meterが作成され、テスト済み
- [ ] Stripe Priceが作成され、Productに紐付いている
- [ ] Stripe API Keyが正しく取得できている
- [ ] AWS Secrets Managerにキーが保存されている
- [ ] Secrets ManagerのARNが正しい
- [ ] 親Step FunctionのIAM権限が追加されている
- [ ] 親Step Functionが最新版に更新されている
- [ ] テストファイルでエンドツーエンドテスト済み
- [ ] Stripeダッシュボードでイベントが確認できた
- [ ] DynamoDBで`status: completed`が確認できた
- [ ] エラーハンドリングが正しく動作している

---

## 🎉 完了!

これで、**Step FunctionからStripe Billing Metersへのファイルサイズ送信**が完成しました!

### **処理フロー (最終版)**

```
1. ファイルアップロード
   ↓
2. S3イベント通知
   ↓
3. Lambda (TriggerParentStepFunction)
   ↓
4. 親Step Function
   ├─ DynamoDB更新 (in_progress)
   ├─ ポリシーマッピング取得
   ├─ 子Step Function実行
   ├─ DynamoDB更新 (completed)
   ├─ Secrets Managerからキー取得 ← NEW
   ├─ Stripe Meter Event送信 ← NEW
   └─ 完了
```

### **コスト削減効果**

- ✅ Lambda不要 (HTTP Taskで直接API呼び出し)
- ✅ べき等性確保 (`identifier`で重複防止)
- ✅ エラーハンドリング (Stripe失敗時も処理は成功)

次回のタスク:
- 本番環境でのテスト
- 実際の課金確認
- モニタリング設定

お疲れ様でした!🎉

