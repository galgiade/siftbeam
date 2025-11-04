import type { UserProfileLocale } from './user.d.ts';

const ja: UserProfileLocale = {
  alert: {
    updateSuccess: "ユーザー情報が正常に更新されました。",
    updateFail: "ユーザー情報の更新に失敗しました。",
    updateError: "更新処理でエラーが発生しました。",
    fieldUpdateSuccess: "{field}が正常に更新されました。",
    fieldUpdateFail: "{field}の更新に失敗しました。",
    emailSent: "新しいメールアドレスに確認コードを送信しました。",
    emailUpdateSuccess: "メールアドレスが正常に更新されました。",
    emailUpdateFail: "メール更新に失敗しました。",
    dbUpdateFail: "データベースの更新に失敗しました。",
    dbUpdateError: "データベース更新失敗",
    confirmFail: "確認コードが正しくないか、データベース更新に失敗しました。",
    invalidConfirmationCode: "確認コードが正しくありません。メールに記載された6桁のコードを正確に入力してください。",
    expiredConfirmationCode: "確認コードの有効期限が切れています。新しいコードを再送信してください。",
    noEmailChange: "メールアドレスに変更はありません。",
    invalidEmailFormat: "無効なメールアドレス形式です。正しい形式で入力してください。",
    noChange: "ユーザー名に変更はありません。",
    invalidConfirmationCodeFormat: "確認コードは6桁の数字を入力してください。",
    verificationCodeNotFound: "認証コードが見つからないか期限切れです",
    remainingAttempts: "残り試行回数",
    verificationCodeStoreFailed: "認証コードの保存に失敗しました。IAM権限を確認してください。",
    codeStoreFailed: "コードの保存に失敗しました。",
    adminOnlyEdit: "管理者のみがこのフィールドを編集できます。",
    validEmailRequired: "有効なメールアドレスを入力してください。"
  },
  label: {
    title: "ユーザー情報",
    userName: "ユーザー名",
    department: "部署",
    position: "役職",
    email: "メールアドレス",
    locale: "言語設定",
    role: "ロール",
    edit: "編集",
    save: "保存",
    cancel: "キャンセル",
    adminOnly: "(管理者のみ編集可能)",
    readOnly: "(変更不可)",
    editableFields: "編集可能: ユーザー名、言語設定",
    adminOnlyFields: "管理者のみ編集可能: メールアドレス、部署、役職",
    allFieldsEditable: "すべてのフィールドを編集できます",
    newEmailSent: "新しいメールアドレス「{email}」に認証コードを送信しました。",
    roleAdmin: "管理者",
    roleUser: "ユーザー",
    lastAdminRestriction: "最後の管理者の場合、ロール変更は制限されます",
    lastAdminNote: "※ 組織に管理者が1人しかいない場合、ロールを一般ユーザーに変更することはできません。",
    generalUserPermission: "一般ユーザー権限",
    adminPermission: "管理者権限",
    verifyAndUpdate: "認証して更新",
    verificationCodePlaceholder: "認証コード（6桁）"
  },
  modal: {
    modalTitle: "メールアドレス確認",
    description: "新しいメールアドレス（{email}）に送信された確認コードを入力してください。",
    codeLabel: "確認コード",
    cancel: "キャンセル",
    confirm: "確認",
    resend: "再送信",
    verifying: "検証中..."
  }
};

export default ja;