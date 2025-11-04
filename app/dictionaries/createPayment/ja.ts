import type { CreatePaymentLocale } from './createPayment.d.ts';

const ja: CreatePaymentLocale = {
  label: {
    back: "戻る",
    submit: "送信",
    loading: "読み込み中...",
    
    paymentSetupTitle: "支払い方法の設定",
    
    cardInfoLabel: "カード情報",
    expiryLabel: "MM/YY",
    cvcLabel: "セキュリティコード",
    
    apply: "申し込み",
    processing: "処理中...",
    goToMyPage: "マイページへ",
    
    accountCreation: "アカウント作成",
    companyInfo: "会社情報入力",
    adminSetup: "管理者設定",
    paymentSetup: "支払い方法設定",
    
    paymentMethodSaved: "✓ 支払い方法の保存が完了しました",
    defaultPaymentMethodSet: "このカードがデフォルト支払い方法として設定されました。",
    subscriptionCreated: "✓ サブスクリプションが正常に作成されました",
    automaticBillingEnabled: "これで従量課金による自動請求が可能になりました。",
    
    saveInfoDescription: "情報を安全に保存して、次回以降の購入をワンクリックで行う",
    linkCompatibleStores: "デフォルトのサウンドボックスをはじめ、Linkに対応している店舗でスピーディに支払うことができます。",
    cardInfoEncrypted: "カード情報は暗号化されて安全に保存されます。",
    billingBasedOnUsage: "実際の請求は使用量に応じて後日行われます。",
    dataRetentionNotice: "処理後のデータは1年間無料で保管され、その後自動的に削除されます",
    
    authenticationFlowDescription: "セキュリティのため、カード認証が必要な場合があります。",
    authenticationFlowSteps: "認証が必要な場合は、銀行の認証画面が表示されます。認証を完了してください。",
    agreeNoticePrefix: "登録を完了すると、",
    and: "と",
    agreeNoticeSuffix: "に同意したものとみなされます。",
    terms: "利用規約",
    privacy: "プライバシーポリシー"
  },
  alert: {
    expiryRequired: "有効期限を正しく入力してください",
    cvcRequired: "セキュリティコードを正しく入力してください",
    cardInfoRequired: "カード情報が入力されていません",
    
    setupIntentFailed: "Setup Intent作成に失敗しました",
    paymentMethodFailed: "支払い方法の作成に失敗しました",
    unknownError: "不明なエラーが発生しました",
    customerInfoNotFound: "顧客情報が取得できませんでした。",
    defaultPaymentMethodFailed: "デフォルト支払い方法の設定に失敗しましたが、カード登録は完了しました",
    
    authenticationRequired: "カード認証が必要です。認証を完了してください。",
    authenticationFailed: "カード認証に失敗しました。もう一度お試しください。",
    authenticationCancelled: "カード認証がキャンセルされました。",
    authenticationIncomplete: "カード認証が完了していません。認証を完了してください。"
  }
};

export default ja;