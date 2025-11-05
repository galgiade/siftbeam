export type ForgotPasswordLocale = {
  label: {
    // 共通
    back: string;
    submit: string;
    loading: string;
    
    // ページタイトル
    forgotPasswordTitle: string;
    
    // フォーム
    emailLabel: string;
    emailPlaceholder: string;
    codeLabel: string;
    codePlaceholder: string;
    newPasswordLabel: string;
    newPasswordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    passwordDescription: string;
    
    // ボタン
    sendCode: string;
    updatePassword: string;
    backToEmail: string;
    resendCode: string;
    
    // 説明文
    emailDescription: string;
    codeDescription: string;
    redirectingMessage: string;
    
    // 認証コード関連
    codeExpiryTitle: string;
    remainingTime: string;
    expiredMessage: string;
    timeLimitMessage: string;
    expiredResendMessage: string;
  };
  alert: {
    // バリデーション
    emailRequired: string;
    invalidEmailFormat: string;
    codeRequired: string;
    newPasswordRequired: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
    invalidPasswordFormat: string;
    
    // 成功メッセージ
    codeSent: string;
    passwordResetSuccess: string;
    passwordUpdated: string;
    
    // エラーメッセージ
    codeExpired: string;
    
    // 認証エラー
    authErrors: {
      notAuthorized: string;
      userNotConfirmed: string;
      userNotFound: string;
      passwordResetRequired: string;
      invalidParameter: string;
      tooManyRequests: string;
      signInFailed: string;
    };
    
    // パスワードリセットエラー
    passwordResetErrors: {
      codeMismatch: string;
      expiredCode: string;
      invalidPassword: string;
      limitExceeded: string;
      genericError: string;
    };
  };
};
