import type { CompanyProfileLocale } from './company.d.ts';

const ja: CompanyProfileLocale = {
  alert: {
    updateSuccess: "会社情報を更新しました。",
    updateFail: "更新に失敗しました。",
    networkError: "通信エラー: {message}",
    required: "「{label}」は必須項目です。",
    fetchCustomerFailed: "顧客情報の取得に失敗しました",
    customerNotFound: "顧客情報が見つかりませんでした",
    customerDeleted: "この顧客アカウントは削除されています",
    adminOnlyEditMessage: "管理者のみが会社情報を編集できます。変更が必要な場合は管理者にお問い合わせください。",
    invalidEmail: "有効なメールアドレスを入力してください",
    invalidPhone: "有効な電話番号を入力してください",
    invalidPostalCode: "有効な郵便番号を入力してください",
    nameTooLong: "会社名は100文字以内で入力してください",
    addressTooLong: "住所は200文字以内で入力してください",
    validationError: "入力内容に問題があります。確認してください。",
    fieldUpdateSuccess: "{fieldName}が正常に更新されました。",
    fieldUpdateFail: "{fieldName}の更新に失敗しました。",
    updateError: "更新処理でエラーが発生しました。",
    fieldRequired: "{fieldLabel}は必須です。",
    invalidEmailFormat: "有効なメールアドレスを入力してください。",
    invalidPhoneFormat: "有効な電話番号を入力してください。",
    invalidPostalCodeFormat: "有効な郵便番号を入力してください。",
    invalidCountryFormat: "有効な国を選択してください。",
    countryRequired: "国は必須です。",
    errorTitle: "エラー",
    fetchError: "会社情報の取得中にエラーが発生しました。"
  },
  label: {
    title: "会社情報",
    country: "国",
    countryPlaceholder: "国を検索・選択してください",
    postal_code: "郵便番号",
    state: "都道府県",
    city: "市区町村",
    line2: "建物名",
    line1: "番地",
    name: "会社名",
    phone: "電話番号",
    email: "請求先メールアドレス",
    notSet: "未設定",
    generalUserPermission: "一般ユーザー権限",
    adminPermission: "管理者権限",
    adminPermissionDescription: "会社情報のすべてのフィールドを編集できます",
    selectPlaceholder: "{label}を選択してください"
  },
  placeholder: {
    postal_code: "例: 123-4567",
    state: "例: 東京都",
    city: "例: 渋谷区",
    line2: "例: ○○ビル 3F（任意）",
    line1: "例: 1-2-3",
    name: "例: 株式会社サンプル",
    phone: "例: 03-1234-5678",
    email: "例: contact@example.com",
    phoneExample: "例: 90-3706-7654"
  },
  button: {
    cancel: "キャンセル"
  }
};

export default ja;