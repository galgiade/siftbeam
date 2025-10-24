export type CreateCompanyInfoLocale = {
  label: {
    // 共通
    back: string;
    submit: string;
    next: string;
    loading: string;
    
    // ページタイトル
    companyInfoTitle: string;
    
    // フォーム
    countryLabel: string;
    countryPlaceholder: string;
    postalCodeLabel: string;
    postalCodePlaceholder: string;
    stateLabel: string;
    statePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    line1Label: string;
    line1Placeholder: string;
    line2Label: string;
    line2Placeholder: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    
    // 進行状況
    accountCreation: string;
    companyInfo: string;
    adminSetup: string;
    paymentSetup: string;
  };
  alert: {
    // バリデーション
    countryRequired: string;
    postalCodeRequired: string;
    stateRequired: string;
    cityRequired: string;
    line1Required: string;
    nameRequired: string;
    emailRequired: string;
    phoneRequired: string;
    
    // エラーメッセージ
    userAttributeUpdateFailed: string;
    stripeCustomerCreationFailed: string;
    communicationError: string;
  };
};
