# EventBridge Connection テスト環境用セットアップガイド

## 🎯 概要

Stripe Test環境のAPIキーを使用するためのEventBridge Connection設定手順です。

---

## 📋 EventBridge Connection 作成手順

### **1. EventBridge Consoleを開く**

1. AWSコンソール → **Amazon EventBridge**
2. 左メニュー → **Connections**
3. **Create connection** をクリック

---

### **2. Connection詳細を入力**

| 項目 | 値 |
|------|-----|
| **Connection name** | `Stripe-Test-Connection` |
| **Description** | `Stripe Test API Connection for SiftBeam` |
| **Destination type** | `Other` |
| **Authorization type** | `API key` |

---

### **3. API key認証を設定**

| 項目 | 値 |
|------|-----|
| **API key name** | `Authorization` |
| **Value** | `Bearer sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

**重要**: 
- ✅ API key nameは **`Authorization`**（HTTPヘッダー名）
- ✅ Valueは **`Bearer `** + テストAPIキー
- ✅ `Bearer` の後に**スペース**が必要

---

### **4. 作成完了**

**Create** をクリックして完成です。

作成後、ConnectionのARNをメモしてください:
```
arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Test-Connection/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🔄 Step Function定義を更新

### **ConnectionArn を新しいものに変更**

```json
"Authentication": {
  "ConnectionArn": "arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Test-Connection/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

---

## ✅ 動作確認

### **1. テストイベントを送信**

```json
{
  "event_name": "data-usage",
  "payload": {
    "stripe_customer_id": "cus_test_xxxxxxxxxxxxx",
    "value": "100"
  }
}
```

### **2. Stripe Dashboardで確認**

1. Stripe Dashboard → **Billing** → **Meters**
2. `data-usage` メーターを確認
3. 最近のイベントに送信データが表示されているか確認

---

## 🔐 セキュリティベストプラクティス

### **本番環境と分離**

| 環境 | Connection名 | APIキー |
|------|------------|---------|
| **テスト** | `Stripe-Test-Connection` | `sk_test_xxx` |
| **本番** | `Stripe-subscriptions-Connection` | `sk_live_xxx` |

### **IAM権限を環境ごとに分離**

```json
{
  "Effect": "Allow",
  "Action": "events:RetrieveConnectionCredentials",
  "Resource": [
    "arn:aws:events:ap-northeast-1:002689294103:connection/Stripe-Test-Connection/*"
  ],
  "Condition": {
    "StringEquals": {
      "aws:RequestedRegion": "ap-northeast-1"
    }
  }
}
```

---

## 🎯 トラブルシューティング

### **問題: Bad Request (400)**

**原因**: API key形式が間違っている

**解決策**:
```
❌ 間違い: sk_test_xxxxx
✅ 正しい: Bearer sk_test_xxxxx
```

### **問題: Unauthorized (401)**

**原因**: APIキーが無効または期限切れ

**解決策**:
1. Stripe Dashboard → **Developers** → **API keys**
2. テストキーが有効か確認
3. 必要に応じて新しいキーを生成

### **問題: Connection not found**

**原因**: ConnectionARNが間違っている

**解決策**:
1. EventBridge Console → **Connections**
2. Connection詳細からARNをコピー
3. Step Function定義を更新

---

## 📝 まとめ

### **設定完了チェックリスト**

- [ ] EventBridge Connection作成完了
- [ ] API key形式正しい (`Bearer sk_test_xxx`)
- [ ] Step Function定義のConnectionArn更新
- [ ] IAM権限にConnection ARN追加
- [ ] テスト送信成功
- [ ] Stripe Dashboardで確認

---

## 🚀 次のステップ

1. ✅ テスト環境で動作確認
2. ✅ 本番環境用Connection作成
3. ✅ 環境変数で切り替え可能にする


