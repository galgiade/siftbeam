# Stripe API バージョン更新情報

## 📌 最新APIバージョン

### **現在の最新バージョン**

- **APIバージョン**: `2024-10-28.acacia`
- **更新日**: 2024年10月28日
- **ステータス**: 安定版 (Production Ready)

---

## 🔄 主な変更点

### **1. Billing Meters API (変更なし)**

✅ 既存の実装は最新APIと互換性があります。

**エンドポイント**:
```
POST https://api.stripe.com/v1/billing/meter_events
```

**必須ヘッダー**:
```
Authorization: Bearer sk_test_...
Content-Type: application/x-www-form-urlencoded
Stripe-Version: 2024-10-28.acacia
```

**リクエストボディ形式** (application/x-www-form-urlencoded):
```
event_name=file_processed
identifier=unique_id_123
payload[stripe_customer_id]=cus_...
payload[value]=1024
timestamp=1760612775
```

### **2. 重要な仕様**

#### **タイムスタンプ制限**
- ✅ 過去35日以内
- ✅ 未来5分以内 (クロックドリフト対応)
- ❌ それ以外 → エラー

#### **Value制限**
- ✅ 整数のみ (`1024`, `2048`, etc.)
- ❌ 小数 (`1024.5`) → エラー
- ✅ 負の値可能 (キャンセル用)
- ℹ️ サイクル合計が負の場合は0として扱われる

#### **Identifier (べき等性キー)**
- ✅ 必須ではないが**強く推奨**
- ✅ 最大255文字
- ✅ 同じIdentifierの重複送信を自動的に防止
- ℹ️ 未指定の場合は自動生成

#### **レート制限**
- **API v1**: 1,000リクエスト/秒
- **API v2**: 10,000イベント/秒 (高スループット用)

---

## 🔧 実装の更新点

### **Step Function定義の変更**

#### **変更前**:
```json
{
  "Headers": {
    "Authorization": "Bearer ...",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  "RequestBody": {
    "event_name": "file_processed",
    "payload": {
      "stripe_customer_id": "cus_...",
      "value": 1024
    }
  }
}
```

#### **変更後** (推奨):
```json
{
  "Headers": {
    "Authorization": "Bearer ...",
    "Content-Type": "application/x-www-form-urlencoded",
    "Stripe-Version": "2024-10-28.acacia"
  },
  "RequestBody": {
    "event_name": "file_processed",
    "identifier": "processing_history_id_123",
    "payload[stripe_customer_id]": "cus_...",
    "payload[value]": "1024",
    "timestamp": "1760612775"
  }
}
```

**変更理由**:
1. **`Stripe-Version`ヘッダー追加**: APIバージョンを明示的に指定
2. **`payload[key]`形式**: application/x-www-form-urlencodedの正しい形式
3. **文字列化**: JSONataで`$string()`を使用して確実に文字列化

---

## 🚨 エラーハンドリング

### **新しいエラーイベント**

Stripeは非同期でエラーを通知します:

| イベント名 | 説明 |
|-----------|------|
| `v1.billing.meter.error_report_triggered` | 無効な使用量イベント |
| `v1.billing.meter.no_meter_found` | メーターが見つからない |

### **エラーコード一覧**

| コード | 説明 | 対処法 |
|--------|------|--------|
| `meter_event_customer_not_found` | 顧客が存在しない | カスタマーIDを確認 |
| `meter_event_no_customer_defined` | カスタマーIDが未指定 | `payload[stripe_customer_id]`を追加 |
| `timestamp_too_far_in_past` | タイムスタンプが古すぎる | 35日以内に修正 |
| `timestamp_in_future` | タイムスタンプが未来 | 現在時刻を使用 |
| `meter_event_invalid_value` | 値が無効 | 整数を使用 |
| `no_meter` | メーターが存在しない | メーター設定を確認 |

### **Webhook設定 (推奨)**

エラーを検知するため、Webhookを設定:

```bash
# Stripe CLI でテスト
stripe listen --forward-thin-to localhost:4242/webhooks --thin-events "v1.billing.meter.*"

# イベントをトリガー
stripe trigger v1.billing.meter.error_report_triggered
```

---

## 📊 API v2 (高スループット版)

### **いつ使うべきか?**

- ✅ 10,000イベント/秒以上必要な場合
- ✅ リアルタイム課金が必要な場合
- ❌ 通常のSaaS (API v1で十分)

### **使用方法**

1. **セッション作成** (有効期限15分):
```bash
POST https://api.stripe.com/v2/billing/meter_event_sessions
```

2. **イベント送信** (認証トークン使用):
```bash
POST https://api.stripe.com/v2/billing/meter_event_streams
Authorization: Bearer <session_token>
```

### **注意点**

- ℹ️ 本番環境のみ (テスト環境では使用不可)
- ℹ️ WorkbenchログにAPI v2リクエストは記録されない
- ℹ️ 200,000イベント/秒が必要な場合はStripe営業に連絡

---

## ✅ 互換性チェック

### **現在の実装**

| 項目 | ステータス | 備考 |
|------|-----------|------|
| エンドポイント | ✅ 互換 | `/v1/billing/meter_events` |
| 認証 | ✅ 互換 | Bearer token |
| Content-Type | ✅ 互換 | application/x-www-form-urlencoded |
| Stripe-Version | ⚠️ 推奨 | 明示的に指定するべき |
| Payload形式 | ✅ 修正済み | `payload[key]`形式に変更 |
| Identifier | ✅ 対応 | べき等性キーを使用 |
| Timestamp | ✅ 対応 | 35日制限に準拠 |

---

## 🔐 セキュリティ

### **APIキー管理**

- ✅ AWS Secrets Managerで管理
- ✅ テスト環境と本番環境でキーを分離
- ✅ 定期的なローテーション推奨

### **ベストプラクティス**

1. **Stripe-Versionヘッダーを常に指定**
   - アカウントのデフォルトバージョンに依存しない
   - 予期しない動作変更を防ぐ

2. **Identifierを必ず設定**
   - べき等性を確保
   - 重複課金を防止

3. **Webhookで異常を監視**
   - `v1.billing.meter.error_report_triggered`
   - `v1.billing.meter.no_meter_found`

4. **リトライロジック**
   - 429エラー: 指数バックオフ
   - 5xxエラー: 最大2回リトライ

---

## 📚 参考資料

### **公式ドキュメント**

- [Billing Meters API Reference](https://docs.stripe.com/api/billing/meter)
- [Meter Events API](https://docs.stripe.com/api/billing/meter-event)
- [Usage-based Billing Guide](https://docs.stripe.com/billing/subscriptions/usage-based)
- [API Changelog](https://docs.stripe.com/changelog)

### **Stripe CLI**

```bash
# CLIのインストール
brew install stripe/stripe-cli/stripe

# ログイン
stripe login

# Webhookのテスト
stripe listen --forward-to localhost:4242/webhooks

# イベントのトリガー
stripe trigger payment_intent.succeeded
```

---

## 🎯 次のアクション

### **必須**

- [x] `Stripe-Version`ヘッダーを追加
- [x] Payload形式を`application/x-www-form-urlencoded`に修正
- [x] `identifier`でべき等性を確保
- [ ] Step Functionを更新してデプロイ
- [ ] 実際のファイルアップロードでテスト

### **推奨**

- [ ] Webhook設定でエラー監視
- [ ] CloudWatch Alarmsで課金失敗を検知
- [ ] 定期的にStripe Changelogを確認
- [ ] APIバージョンの更新計画を策定

### **将来的に**

- [ ] API v2の評価 (高スループットが必要な場合)
- [ ] メーターのディメンション機能を検討 (セグメント別分析)
- [ ] 使用量アナリティクスの活用

---

## 📝 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2025-10-16 | `2024-10-28.acacia` | 最新APIバージョンに対応、Step Function更新 |

---

この情報は2025年10月16日時点のものです。最新情報は[Stripe Changelog](https://docs.stripe.com/changelog)を確認してください。

