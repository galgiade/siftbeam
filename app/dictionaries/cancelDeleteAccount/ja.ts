import type { CancelDeleteAccountLocale } from './cancelDeleteAccount.d.ts';

const ja: CancelDeleteAccountLocale = {
  label: {
    back: "戻る",
    submit: "送信",
    loading: "読み込み中...",
    
    cancelDeleteTitle: "アカウント削除申請の取り消し",
    
    signIn: "サインイン",
    supportEmail: "connectechceomatsui@gmail.com",
    supportContact: "サポートが必要な場合以下のメールにご連絡ください。",
    
    cancelDelete: "削除申請を取り消す",
    
    accountDeleteRequested: "アカウントを削除申請されています",
    requestedUser: "申請したユーザー",
    requestDate: "申請日時",
    userNameNotFound: "ユーザー名が見つかりません",
    confirmationMessage: "アカウント削除申請を取り消します。\n本当に取り消してもよろしいですか？"
  },
  alert: {
    authenticationFailed: "認証できませんでした。",
    insufficientPermissions: "権限がありません。",
    adminRequired: "管理者権限を持つユーザーでサインインしてください。",
    
    cancelSuccess: "削除申請の取り消しが完了しました。",
    cancelError: "エラーが発生しました。再度お試しください。"
  }
};

export default ja;