import type { SignInLocale } from './signIn.d.ts';

const ja: SignInLocale = {
  label: {
    back: "戻る",
    submit: "送信",
    loading: "読み込み中...",
    signInTitle: "サインイン",
    signInSubtitle: "アカウントにサインインしてください",
    emailLabel: "メールアドレス",
    emailPlaceholder: "example@email.com",
    passwordLabel: "パスワード",
    passwordPlaceholder: "パスワードを入力してください",
    passwordDescription: "8文字以上で、英大文字・小文字・数字・記号を含めてください",
    showPassword: "パスワードを表示",
    hidePassword: "パスワードを隠す",
    signIn: "サインイン",
    signingIn: "サインイン中...",
    signUp: "新規登録",
    forgotPassword: "パスワードを忘れた場合",
    noAccount: "アカウントをお持ちでない場合",
    
    // 2段階認証
    verificationCodeLabel: "認証コード",
    verificationCodePlaceholder: "6桁の認証コードを入力してください",
    verificationCodeDescription: "登録されたメールアドレスに送信された認証コードを入力してください",
    verifyCode: "認証コードを確認",
    verifyingCode: "認証中...",
    resendCode: "認証コードを再送信",
    resendingCode: "再送信中...",
    codeExpired: "認証コードの有効期限が切れました",
    enterVerificationCode: "認証コードを入力してください",
    twoFactorAuthTitle: "二段階認証",
    twoFactorAuthDescription: "{email} に送信された認証コードを入力してください",
    expirationTime: "有効期限",
    attemptCount: "試行回数",
    verificationSuccess: "✅ 認証に成功しました。リダイレクト中...",
    
    // その他
    orDivider: "または",
    copyright: "© 2024 All rights reserved."
  },
  alert: {
    emailRequired: "メールアドレスを入力してください",
    passwordRequired: "パスワードを入力してください",
    emailFormatInvalid: "正しいメールアドレス形式で入力してください",
    passwordFormatInvalid: "パスワードは8文字以上で、英大文字・小文字・数字・記号を含めてください",
    emailAndPasswordRequired: "メールアドレスとパスワードを入力してください",
    signInFailed: "サインインに失敗しました",
    accountNotConfirmed: "アカウントが確認されていません。メール認証を完了してください",
    authCodeRequired: "認証コードの入力が必要です",
    newPasswordRequired: "新しいパスワードの設定が必要です",
    passwordResetRequired: "パスワードのリセットが必要です",
    nextStepRequired: "次のステップが必要です: {step}",
    
    // 2段階認証エラー
    verificationCodeRequired: "認証コードを入力してください",
    verificationCodeInvalid: "認証コードが正しくありません",
    verificationCodeExpired: "認証コードの有効期限が切れました。再送信してください",
    resendCodeFailed: "認証コードの再送信に失敗しました",
    maxAttemptsReached: "認証試行回数が上限に達しました。新しいコードを再送信してください。",
    emailSendFailed: "メール送信に失敗しました",
    verificationCodeNotFound: "認証コードが見つからないか期限切れです",
    remainingAttempts: "残り試行回数",
    
    authErrors: {
      notAuthorized: "メールアドレスまたはパスワードが正しくありません",
      userNotConfirmed: "アカウントが確認されていません。メール認証を完了してください",
      userNotFound: "ユーザーが見つかりません",
      passwordResetRequired: "パスワードのリセットが必要です",
      invalidParameter: "入力されたパラメータが無効です",
      tooManyRequests: "リクエストが多すぎます。しばらく後に再試行してください"
    }
  }
};

export default ja;