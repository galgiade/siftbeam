# 料金モデル変更まとめ

## 変更日
2025-10-18

---

## 📊 変更内容

### **変更前: 2段階料金**
```
データ処理料: $0.00001/Byte
データ保管料: $0.000001/Byte/月
```

### **変更後: シンプル料金（1年間保管込み）**
```
データ処理料: $0.00001/Byte（1年間保管込み）
```

---

## ✅ 完了した変更

### 1. **料金ページ（pricing）**
- ✅ `siftbeam/app/dictionaries/pricing/ja.ts` - 保管料削除、1年保管明記
- ✅ `siftbeam/app/dictionaries/pricing/en-US.ts` - 保管料削除、1年保管明記
- ✅ `siftbeam/app/dictionaries/pricing/pricing.d.ts` - 型定義から`storage`削除
- ⚠️ **残りの言語ファイル（ko, zh-CN, de, es, fr, id, pt）は未更新**

### 2. **特定商取引法（legalDisclosures）**
- ✅ `siftbeam/app/dictionaries/legalDisclosures/ja.ts` - 保管料削除、1年保管明記

### 3. **プライバシーポリシー（privacy）**
- ✅ `siftbeam/app/dictionaries/privacy/ja.ts` - 保管期間を1年に変更

### 4. **サインアップ（CreatePayment）**
- ✅ `siftbeam/app/_containers/SignUp/CreatePayment/CreatePaymentPresentation.tsx` - 1年保管の説明追加
- ✅ `siftbeam/app/lib/actions/create/createPaymentSubscription.ts` - ストレージサブスクリプション削除

### 5. **利用制限（UsageLimit）**
- ✅ `siftbeam/app/_containers/UsageLimit/UsageLimitPresentation.tsx` - 1年保管の説明追加

### 6. **サービスページ（Service）**
- ✅ `siftbeam/app/_containers/Service/ServicePresentation.tsx` - 料金計算コメント更新、1年保管の説明追加

---

## ⚠️ 残りのタスク

### 1. **多言語ファイルの更新**

以下のファイルを`ja.ts`と`en-US.ts`と同じパターンで更新する必要があります：

#### **料金ページ（pricing）**
- `siftbeam/app/dictionaries/pricing/ko.ts`
- `siftbeam/app/dictionaries/pricing/zh-CN.ts`
- `siftbeam/app/dictionaries/pricing/de.ts`
- `siftbeam/app/dictionaries/pricing/es.ts`
- `siftbeam/app/dictionaries/pricing/fr.ts`
- `siftbeam/app/dictionaries/pricing/id.ts`
- `siftbeam/app/dictionaries/pricing/pt.ts`

**変更内容**:
```typescript
// 削除
storage: {
  title: '...',
  subtitle: '...',
  price: '$0.000001 / B',
  info: '...',
  rate: 0.000001,
},

// processing.subtitleに追加
subtitle: '... (includes 1-year storage)' // または各言語の翻訳

// processing.infoに追加
info: '... Data is stored for 1 year after processing.' // または各言語の翻訳

// examples.small.storageFee を空文字列に
storageFee: '',

// examples.small.processingFee に追加
processingFee: '... (includes 1-year storage)' // または各言語の翻訳

// examples.small.total を更新
total: '$0.001', // $0.0011 から変更

// examples.large も同様に更新
```

#### **特定商取引法（legalDisclosures）**
- `siftbeam/app/dictionaries/legalDisclosures/en-US.ts`
- `siftbeam/app/dictionaries/legalDisclosures/ko.ts`
- `siftbeam/app/dictionaries/legalDisclosures/zh-CN.ts`
- その他の言語ファイル

#### **プライバシーポリシー（privacy）**
- `siftbeam/app/dictionaries/privacy/en-US.ts`
- `siftbeam/app/dictionaries/privacy/ko.ts`
- `siftbeam/app/dictionaries/privacy/zh-CN.ts`
- その他の言語ファイル

---

### 2. **Stripe設定の更新**

#### **環境変数**
```bash
# .env.local
STRIPE_PRICE_PROCESSING_ID=price_xxxxx  # 既存
STRIPE_PRICE_STORAGE_ID=price_xxxxx     # ← 削除または無効化
```

#### **Stripeダッシュボード**
1. ストレージ保管料のPrice（`STRIPE_PRICE_STORAGE_ID`）を非アクティブ化
2. 既存顧客のサブスクリプションからストレージアイテムを削除
   - Stripe Dashboard → Customers → Subscriptions → Edit
   - ストレージアイテムを削除

---

### 3. **S3ライフサイクルポリシーの設定**

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket siftbeam \
  --lifecycle-configuration file://docs/S3_LIFECYCLE_POLICY.json \
  --region ap-northeast-1
```

**ポリシー内容**:
- `service/input/`: 365日後に自動削除
- `service/output/`: 365日後に自動削除
- `support/input/`: 365日後に自動削除
- `support/output/`: 365日後に自動削除

---

### 4. **既存顧客への通知**

#### **通知内容（例）**
```
件名: 【重要】料金体系の変更のお知らせ

お客様各位

平素よりsiftbeamをご利用いただき、誠にありがとうございます。

この度、料金体系をよりシンプルで分かりやすいものに変更いたしました。

【変更内容】
- 変更前: データ処理料 + データ保管料（月額）
- 変更後: データ処理料のみ（1年間の保管込み）

【お客様へのメリット】
✅ 料金体系がシンプルに
✅ 処理後のデータは1年間無料で保管
✅ 月々の保管料請求がなくなります

【注意事項】
- 処理後のデータは1年間保管され、その後自動的に削除されます
- 1年以上の保管が必要な場合は、事前にダウンロードをお願いします

【適用日】
2025年11月1日より

ご不明な点がございましたら、サポートまでお問い合わせください。

今後ともsiftbeamをよろしくお願いいたします。
```

---

## 📝 テストチェックリスト

### **機能テスト**
- [ ] 新規サインアップ時にストレージサブスクリプションが作成されないことを確認
- [ ] 処理料金のみが請求されることを確認
- [ ] 利用制限が正しく機能することを確認
- [ ] サービスページで料金計算が正しいことを確認

### **UI/UXテスト**
- [ ] 料金ページの表示が正しいことを確認
- [ ] 特定商取引法ページの表示が正しいことを確認
- [ ] プライバシーポリシーページの表示が正しいことを確認
- [ ] サインアップフローが正常に動作することを確認

### **多言語テスト**
- [ ] 日本語（ja）
- [ ] 英語（en-US）
- [ ] 韓国語（ko）
- [ ] 中国語（zh-CN）
- [ ] その他の言語

---

## 🔄 ロールバック手順

万が一問題が発生した場合:

1. **Gitで前のバージョンに戻す**
   ```bash
   git revert <commit-hash>
   ```

2. **Stripeサブスクリプションを手動で修正**
   - ストレージアイテムを再追加

3. **環境変数を元に戻す**
   ```bash
   STRIPE_PRICE_STORAGE_ID=price_xxxxx
   ```

---

## 📚 関連ドキュメント

- [S3_LIFECYCLE_POLICY.json](./S3_LIFECYCLE_POLICY.json)
- [S3_LIFECYCLE_SETUP_GUIDE.md](./S3_LIFECYCLE_SETUP_GUIDE.md)
- [STORAGE_BILLING_ARCHITECTURE.md](./STORAGE_BILLING_ARCHITECTURE.md) ← **このドキュメントは削除または「未実装」とマーク**

---

**最終更新**: 2025-10-18
**担当者**: AI Assistant
**承認者**: ユーザー確認待ち

