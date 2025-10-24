export type CreatePaymentLocale = {
  label: {
    // 共通
    back: string;
    submit: string;
    loading: string;
    
    // ページタイトル
    paymentSetupTitle: string;
    
    // フォーム
    cardInfoLabel: string;
    expiryLabel: string;
    cvcLabel: string;
    
    // ボタン
    apply: string;
    processing: string;
    goToMyPage: string;
    
    // 進行状況
    accountCreation: string;
    companyInfo: string;
    adminSetup: string;
    paymentSetup: string;
    
    // 成功メッセージ
    paymentMethodSaved: string;
    defaultPaymentMethodSet: string;
    subscriptionCreated: string;
    automaticBillingEnabled: string;
    
    // 説明文
    saveInfoDescription: string;
    linkCompatibleStores: string;
    cardInfoEncrypted: string;
    billingBasedOnUsage: string;
    
    // 認証フロー説明
    authenticationFlowDescription: string;
    authenticationFlowSteps: string;

    // 同意文とリンク
    agreeNoticePrefix: string; // 例: "登録を完了すると、"
    and: string; // 例: "と" / "and"
    agreeNoticeSuffix: string; // 例: "に同意したものとみなされます。"
    terms: string; // 規約リンクの文言
    privacy: string; // プライバシーポリシーリンクの文言
  };
  alert: {
    // バリデーション
    expiryRequired: string;
    cvcRequired: string;
    cardInfoRequired: string;
    
    // エラーメッセージ
    setupIntentFailed: string;
    paymentMethodFailed: string;
    unknownError: string;
    customerInfoNotFound: string;
    defaultPaymentMethodFailed: string;
    
    // 認証エラー
    authenticationRequired: string;
    authenticationFailed: string;
    authenticationCancelled: string;
    authenticationIncomplete: string;
  };
};
