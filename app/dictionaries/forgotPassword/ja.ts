import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const ja: ForgotPasswordLocale = {
  label: {
    back: "戻る",
    submit: "送信",
    loading: "読み込み中...",
    forgotPasswordTitle: "パスワードの再設定",
    emailLabel: "メールアドレス",
    emailPlaceholder: "メールアドレスを入力してください",
    codeLabel: "確認コード",
    codePlaceholder: "確認コードを入力してください",
    newPasswordLabel: "新しいパスワード",
    newPasswordPlaceholder: "新しいパスワードを入力してください",
    confirmPasswordLabel: "パスワード確認",
    confirmPasswordPlaceholder: "パスワードを再入力してください",
    passwordDescription: "8文字以上で、英大文字・小文字・数字を含めてください",
    sendCode: "確認コードを送信",
    updatePassword: "パスワードを更新",
    backToEmail: "戻る",
    resendCode: "新しいコードを送信",
    emailDescription: "メールアドレスを入力してください。確認コードを送信します。",
    codeDescription: "メールに送信された確認コードと新しいパスワードを入力してください。",
    redirectingMessage: "サインインページに移動しています...",
    codeExpiryTitle: "認証コードの有効期限",
    remainingTime: "残り時間: {time}",
    expiredMessage: "期限切れです。新しいコードを再送信してください。",
    timeLimitMessage: "24時間以内に入力してください",
    expiredResendMessage: "コードの有効期限が切れました。新しいコードを送信してください。"
  },
  alert: {
    emailRequired: "メールアドレスを入力してください",
    invalidEmailFormat: "正しいメールアドレス形式で入力してください",
    codeRequired: "確認コードを入力してください",
    newPasswordRequired: "新しいパスワードを入力してください",
    confirmPasswordRequired: "パスワード確認を入力してください",
    passwordMismatch: "パスワードが一致しません",
    invalidPasswordFormat: "パスワードは8文字以上で、英大文字・小文字・数字を含めてください",
    codeSent: "確認コードをメールに送信しました",
    passwordResetSuccess: "パスワードが正常にリセットされました",
    passwordUpdated: "パスワードが正常に更新されました！",
    codeExpired: "期限切れ",
    authErrors: {
      notAuthorized: "メールアドレスまたはパスワードが正しくありません",
      userNotConfirmed: "アカウントが確認されていません。メール認証を完了してください",
      userNotFound: "ユーザーが見つかりません",
      passwordResetRequired: "パスワードのリセットが必要です",
      invalidParameter: "入力されたパラメータが無効です",
      tooManyRequests: "リクエストが多すぎます。しばらく後に再試行してください",
      signInFailed: "サインインに失敗しました"
    },
    passwordResetErrors: {
      codeMismatch: "認証コードが正しくありません。もう一度お試しください。",
      expiredCode: "認証コードの有効期限が切れています。新しいコードを再送信してください。",
      invalidPassword: "パスワードが無効です。パスワードの要件を確認してください。",
      limitExceeded: "リクエスト制限に達しました。しばらく後に再試行してください。",
      genericError: "エラーが発生しました。もう一度お試しください。"
    }
  }
};

export default ja;