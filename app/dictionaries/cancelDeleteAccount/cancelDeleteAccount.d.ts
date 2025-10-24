export type CancelDeleteAccountLocale = {
  label: {
    // 共通
    back: string;
    submit: string;
    loading: string;
    
    // ページタイトル
    cancelDeleteTitle: string;
    
    // フォーム
    signIn: string;
    supportEmail: string;
    supportContact: string;
    
    // ボタン
    cancelDelete: string;
    
    // 情報表示
    accountDeleteRequested: string;
    requestedUser: string;
    requestDate: string;
    userNameNotFound: string;
    confirmationMessage: string;
  };
  alert: {
    // 認証エラー
    authenticationFailed: string;
    insufficientPermissions: string;
    adminRequired: string;
    
    // 成功・エラーメッセージ
    cancelSuccess: string;
    cancelError: string;
  };
};
