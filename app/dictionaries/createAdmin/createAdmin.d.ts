export interface CreateAdminLocale {
  label: {
    back: string;
    submit: string;
    loading: string;
    createAdminTitle: string;
    userNameLabel: string;
    userNamePlaceholder: string;
    userNameDescription: string;
    departmentLabel: string;
    departmentPlaceholder: string;
    positionLabel: string;
    positionPlaceholder: string;
    languageLabel: string;
    languagePlaceholder: string;
    japanese: string;
    english: string;
    spanish: string;
    french: string;
    german: string;
    korean: string;
    portuguese: string;
    indonesian: string;
    chinese: string;
    createAdmin: string;
    creating: string;
    accountCreation: string;
    companyInfo: string;
    adminSetup: string;
    paymentSetup: string;
  };
  alert: {
    userNameRequired: string;
    userNameMinLength: string;
    departmentRequired: string;
    positionRequired: string;
    invalidAuthInfo: string;
    adminCreationFailed: string;
    networkError: string;
  };
}
