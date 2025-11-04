import type { CreateAdminLocale } from './createAdmin.d.ts';

const ja: CreateAdminLocale = {
  label: {
    back: "戻る",
    submit: "送信",
    loading: "読み込み中...",
    createAdminTitle: "管理者アカウント作成",
    userNameLabel: "ユーザー名",
    userNamePlaceholder: "山田太郎",
    userNameDescription: "2文字以上で入力してください",
    departmentLabel: "部署",
    departmentPlaceholder: "営業部",
    positionLabel: "役職",
    positionPlaceholder: "部長",
    languageLabel: "言語",
    languagePlaceholder: "言語を選択してください",
    japanese: "日本語",
    english: "English",
    spanish: "Español",
    french: "Français",
    german: "Deutsch",
    korean: "한국어",
    portuguese: "Português",
    indonesian: "Bahasa Indonesia",
    chinese: "中文",
    createAdmin: "管理者アカウント作成",
    creating: "作成中...",
    accountCreation: "アカウント作成",
    companyInfo: "会社情報入力",
    adminSetup: "管理者設定",
    paymentSetup: "支払い方法設定"
  },
  alert: {
    userNameRequired: "ユーザー名を入力してください",
    userNameMinLength: "ユーザー名は2文字以上必要です",
    departmentRequired: "部署を入力してください",
    positionRequired: "役職を入力してください",
    invalidAuthInfo: "認証情報が不正です。再度ログインしてください。",
    adminCreationFailed: "管理者アカウントの作成に失敗しました",
    networkError: "ネットワークエラーが発生しました"
  }
};

export default ja;