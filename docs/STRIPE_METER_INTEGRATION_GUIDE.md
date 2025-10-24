# Stripe Billing Meters 統合ガイド

## 概要
Step FunctionからStripe Billing Meters APIを呼び出して、ファイル処理のバイト数を課金メーターに送信します。

## 🎯 Stripe Billing Metersとは?

Stripe Billing Metersは、使用量ベースの課金を実現するための機能です。

### **主要概念**

1. **Meter (メーター)**
   - 使用量を測定する単位
   - 例: `file_processing_bytes`

2. **Meter Event (メーターイベント)**
   - 実際の使用量データ
   - 例: `{"value": 1024, "timestamp": "2025-10-16T10:00:00Z"}`

3. **Price (価格)**
   - メーターに紐づく単価
   - 例: `$0.001 per KB`

## 📋 前提条件

### **1. Stripeでメーターを作成**

Stripeダッシュボードで以下を作成:

```bash
# 1. Billing Meterの作成
メーター名: file_processing_bytes
イベント名: file_processed
集計方法: sum (合計)
値のキー: bytes
```

### **2. Priceの作成**

```bash
# 2. 価格の作成
Product: File Processing
Price: Usage-based
Meter: file_processing_bytes
Unit Amount: $0.00001 per byte (または適切な単価)
```

### **3. Stripe API Keyの取得**

```bash
# Stripe Dashboard → Developers → API keys
Secret Key: sk_test_... (テスト環境)
Secret Key: sk_live_... (本番環境)
```

## 🔐 AWS Secrets Managerにシークレットを保存

Step FunctionからStripe APIキーを安全に利用するため、Secrets Managerに保存します。

### **1. シークレットの作成**

```bash
# AWS CLIで作成
aws secretsmanager create-secret \
  --name siftbeam/stripe/api-key \
  --description "Stripe Secret Key for Billing Meters" \
  --secret-string '{"STRIPE_SECRET_KEY":"sk_test_your_actual_secret_key"}' \
  --region ap-northeast-1
```

または、AWS コンソール:

1. Secrets Manager → Store a new secret
2. Secret type: **Other type of secret**
3. Key/value pairs:
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...`
4. Secret name: `siftbeam/stripe/api-key`
5. Create secret

### **2. シークレットARNの確認**

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
  ...
}
```

## 🔧 親Step Functionの更新

### **Stripe Meter送信ステートの追加**

`UpdateStatusToCompleted`の後に、Stripe APIを呼び出すステートを追加します。

#### **重要なポイント**

1. **HTTP Taskを使用**
   - `arn:aws:states:::http:invoke`

2. **認証ヘッダー**
   - `Authorization: Bearer sk_test_...`
   - Secrets Managerから動的に取得

3. **エラーハンドリング**
   - API呼び出し失敗しても処理は成功扱い
   - エラーログを記録

## 📝 Stripe Billing Meters API仕様

### **APIバージョン**

- **最新バージョン**: `2024-10-28.acacia`
- **エンドポイント**: `POST https://api.stripe.com/v1/billing/meter_events`
- **レート制限**: 
  - API v1: 1,000リクエスト/秒
  - API v2 (高スループット): 10,000イベント/秒

### **リクエストヘッダー**

```
Authorization: Bearer sk_test_...
Content-Type: application/x-www-form-urlencoded
Stripe-Version: 2024-10-28.acacia
```

### **リクエストボディ (application/x-www-form-urlencoded)**

```
event_name=file_processed&
identifier=processing_history_id_123&
payload[stripe_customer_id]=cus_TB7TNGpqOEFcst&
payload[value]=1024&
timestamp=1760612775
```

**重要**: 
- `payload[stripe_customer_id]`と`payload[value]`の形式に注意
- `value`は**整数のみ**対応 (小数不可)
- `timestamp`は過去35日以内、未来5分以内

### **レスポンス**

```json
{
  "id": "bme_1PxyzAbc123",
  "object": "billing.meter_event",
  "created": 1760612775,
  "event_name": "file_processed",
  "payload": {
    "stripe_customer_id": "cus_TB7TNGpqOEFcst",
    "value": 1024
  }
}
```

## 🚀 実装手順

### **Step 1: Stripe Meterの作成**

Stripeダッシュボード:

1. **Billing → Meters**
2. **Create meter**
3. 設定:
   - Display name: `File Processing (Bytes)`
   - Event name: `file_processed`
   - Aggregation: `Sum`
   - Value key: `value`
   - Customer ID field: `stripe_customer_id`
4. **Save**

### **Step 2: Priceの作成**

1. **Products → Create product**
2. Product name: `File Processing`
3. **Add price**:
   - Pricing model: `Usage-based`
   - Billing period: `Monthly`
   - Meter: `File Processing (Bytes)`
   - Price: `$0.00001` per unit (例: 1バイトあたり0.00001ドル)
4. **Save**

### **Step 3: Secrets Managerにキー保存**

```bash
aws secretsmanager create-secret \
  --name siftbeam/stripe/api-key \
  --secret-string '{"STRIPE_SECRET_KEY":"sk_test_your_key"}' \
  --region ap-northeast-1
```

### **Step 4: 親Step Functionの更新**

`ServiceProcessingOrchestrator.asl.json`を更新します。

### **Step 5: IAM権限の追加**

親Step Functionのロールに以下の権限を追加:

```json
{
  "Effect": "Allow",
  "Action": [
    "secretsmanager:GetSecretValue"
  ],
  "Resource": [
    "arn:aws:secretsmanager:ap-northeast-1:002689294103:secret:siftbeam/stripe/api-key-*"
  ]
}
```

### **Step 6: テスト**

1. ファイルをアップロード
2. 親Step Function実行
3. Stripeダッシュボードで確認:
   - **Billing → Meters → File Processing (Bytes)**
   - 最近のイベントを確認

## 🧪 テストシナリオ

### **1. 正常ケース: 単一ファイル**

```
入力: 1ファイル (1024 bytes)
期待結果:
  - Stripe Meter Event作成成功
  - DynamoDB: status = completed
```

### **2. 正常ケース: 複数ファイル**

```
入力: 3ファイル (合計 5120 bytes)
期待結果:
  - Stripe Meter Event: value = 5120
  - DynamoDB: status = completed
```

### **3. エラーケース: Stripe API失敗**

```
入力: 1ファイル (1024 bytes)
Stripe API: 500 エラー
期待結果:
  - DynamoDB: status = completed (処理自体は成功)
  - errorMessage に Stripe エラー情報記録
```

### **4. エラーケース: 無効なカスタマーID**

```
入力: 無効な customerId
Stripe API: 404 エラー
期待結果:
  - DynamoDB: status = completed
  - エラーログに記録
```

## 🔍 トラブルシューティング

### **エラー: `Invalid API Key`**

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

### **エラー: `Customer not found`**

**原因**: Stripeに存在しないカスタマーID

**解決**:
1. DynamoDBの`siftbeam-processing-history`でカスタマーIDを確認
2. Stripeダッシュボードで顧客を検索
3. カスタマーIDが正しいか確認

### **エラー: `Meter event not found in dashboard`**

**原因**: メーター名やイベント名が不一致

**解決**:
1. Stripe → Billing → Meters で設定確認
2. `event_name`が一致するか確認
3. `value`キーが正しいか確認

## 📊 モニタリング

### **CloudWatch Logs**

Step Functionのログで確認:

```
# Stripe API呼び出し成功
"StripeAPI": {
  "StatusCode": 200,
  "Body": {
    "id": "bme_1PxyzAbc123",
    "event_name": "file_processed",
    "payload": { "value": 1024 }
  }
}

# Stripe API呼び出し失敗
"StripeAPI": {
  "StatusCode": 401,
  "Error": "Invalid API Key"
}
```

### **Stripeダッシュボード**

1. **Billing → Meters**
2. メーターを選択
3. **Events**タブで最近のイベントを確認

## 💡 ベストプラクティス

### **1. べき等性の確保**

Stripe Meter Eventには`identifier`を設定して重複を防ぐ:

```json
{
  "event_name": "file_processed",
  "identifier": "processing_history_id_123",
  "payload": {
    "stripe_customer_id": "cus_...",
    "value": 1024
  }
}
```

### **2. タイムスタンプの正確性**

```jsonata
"timestamp": "{% $toMillis($now()) / 1000 %}"
```

### **3. エラーハンドリング**

- Stripe API失敗しても処理は成功扱い
- 別途リトライ機構を用意 (例: DLQ)

### **4. セキュリティ**

- ✅ Secrets Managerでキー管理
- ✅ IAM権限を最小限に
- ✅ 本番とテストでキーを分離

## 📋 チェックリスト

デプロイ前の確認:

- [ ] Stripe Meterが作成されている
- [ ] Stripe Priceが作成されている
- [ ] Secrets Managerにキーが保存されている
- [ ] Step FunctionのIAM権限が設定されている
- [ ] 親Step Functionが更新されている
- [ ] テストファイルでエンドツーエンドテスト済み
- [ ] Stripeダッシュボードでイベントを確認済み

## 📚 参考資料

- [Stripe Billing Meters API](https://docs.stripe.com/api/billing/meter-event)
- [AWS Step Functions HTTP Task](https://docs.aws.amazon.com/step-functions/latest/dg/connect-http.html)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)

---

この設計により、**Lambda不要でコスト効率の高いStripe課金連携**が実現できます!🎉

