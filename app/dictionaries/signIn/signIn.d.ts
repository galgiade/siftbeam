export type SignInLocale = {
  label: {
    // 共通
    back: string;
    submit: string;
    loading: string;
    
    // ページタイトル
    signInTitle: string;
    signInSubtitle: string;
    
    // フォーム
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordDescription: string;
    showPassword: string;
    hidePassword: string;
    
    // ボタン
    signIn: string;
    signingIn: string;
    signUp: string;
    
    // リンク
    forgotPassword: string;
    noAccount: string;
    
    // 2段階認証
    twoFactorAuthTitle: string;
    twoFactorAuthDescription: string;
    verificationCodeLabel: string;
    verificationCodePlaceholder: string;
    verificationCodeDescription: string;
    verifyCode: string;
    verifyingCode: string;
    resendCode: string;
    resendingCode: string;
    codeExpired: string;
    enterVerificationCode: string;
    expirationTime: string;
    attemptCount: string;
    verificationSuccess: string;
    
    // その他
    orDivider: string;
    copyright: string;
  };
  alert: {
    // バリデーション
    emailRequired: string;
    passwordRequired: string;
    emailFormatInvalid: string;
    passwordFormatInvalid: string;
    emailAndPasswordRequired: string;
    
    // エラーメッセージ
    signInFailed: string;
    accountNotConfirmed: string;
    authCodeRequired: string;
    newPasswordRequired: string;
    passwordResetRequired: string;
    nextStepRequired: string;
    
    // 2段階認証エラー
    verificationCodeRequired: string;
    verificationCodeInvalid: string;
    verificationCodeExpired: string;
    resendCodeFailed: string;
    maxAttemptsReached: string;
    emailSendFailed: string;
    verificationCodeNotFound: string;
    remainingAttempts: string;
    
    // 認証エラー
    authErrors: {
      notAuthorized: string;
      userNotConfirmed: string;
      userNotFound: string;
      passwordResetRequired: string;
      invalidParameter: string;
      tooManyRequests: string;
    };
  };
};
