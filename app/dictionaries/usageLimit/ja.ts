import type { UsageLimitLocale } from './usage-limit.d.ts';

const ja: UsageLimitLocale = {
  label: {
    // 共通
    save: "保存",
    cancel: "キャンセル",
    edit: "編集",
    delete: "削除",
    back: "戻る",
    add: "追加",
    create: "作成",
    creating: "保存中...",
    update: "更新",
    
    // 作成ページ
    createUsageLimitTitle: "使用量制限作成",
    createUsageLimitDescription: "データ処理量や金額の制限を設定し、超過時のアクションを選択できます。",
    usageLimitSettings: "使用量制限設定",
    exceedActionTitle: "超過時のアクション",
    selectAction: "アクションを選択",
    notifyOnlyOption: "通知のみ",
    restrictOption: "利用停止",
    notifyOnlyDescription: "制限を超過した際に通知メールが送信されます。サービスは継続して利用できます。",
    restrictDescription: "制限を超過した際にサービスの利用が停止されます。通知メールも送信されます。",
    limitTypeTitle: "制限タイプ",
    dataLimitOption: "データ量制限",
    amountLimitOption: "金額制限",
    dataLimitDescription: "データ処理量（MB/GB/TB）で制限を設定します。",
    amountLimitDescription: "処理費用（USD）で制限を設定します。",
    dataLimitTitle: "データ量制限値",
    enterLimitValue: "制限値を入力（例: 100）",
    unit: "単位",
    monthlyDataLimitDescription: "月間のデータ処理量がこの値を超えた場合にアクションが実行されます。",
    amountLimitTitle: "金額制限値",
    enterAmountValue: "制限値を入力（例: 50）",
    monthlyAmountLimitDescription: "月間の処理費用がこの金額を超えた場合にアクションが実行されます。",
    notificationSettingsTitle: "通知先設定",
    enterEmailPlaceholder: "メールアドレスを入力（例: example@company.com）",
    notificationEmailList: "通知先メールアドレス",
    notificationEmailCount: "通知先メールアドレス ({count}件)",
    notifyOnlyEmailDescription: "制限を超過した際に、ここで設定したメールアドレスに通知が送信されます。",
    restrictEmailDescription: "制限を超過した際に、サービスが停止され、ここで設定したメールアドレスに通知が送信されます。",
    cancelButton: "キャンセル",
    createNotifyLimit: "通知制限を作成",
    createRestrictLimit: "利用停止制限を作成",
    processingFeeOnly: "処理料金のみ",
    conversionApproximate: "≈",
    
    // メイン画面
    limitUsageTitle: "利用制限",
    usageLimitManagement: "使用量制限管理",
    usageLimitDescription: "データ処理量と金額の制限を設定し、超過時のアクションを管理できます。",
    createLimit: "制限を作成",
    notificationTarget: "通知先",
    detail: "詳細",
    createdAt: "作成日時",
    updatedAt: "更新日時",
    limitValue: "制限値",
    notificationRecipients: "通知先",
    
    // 通知タイプ
    notify: "通知",
    restrict: "利用停止",
    exceedAction: "超過時のアクション",
    notifyOnly: "通知のみ",
    notifyLimit: "通知制限",
    restrictLimit: "利用停止制限",
    notifyLimitDescription: "制限を設定すると、超過時に通知が送信されます。",
    restrictLimitDescription: "制限を設定すると、超過時にサービスが停止されます。",
    noNotifyLimits: "通知制限が設定されていません",
    noRestrictLimits: "利用停止制限が設定されていません",
    
    // 金額・利用量
    amount: "利用額",
    usage: "利用量",
    editTarget: "編集対象",
    limitType: "制限タイプ",
    selectLimitType: "制限タイプを選択",
    dataLimitValue: "データ量制限値",
    amountLimitValue: "金額制限値 (USD)",
    dataLimitPlaceholder: "例: 100",
    amountLimitPlaceholder: "例: 50",
    orSeparator: "または",
    noLimit: "制限なし",
    
    // 受信者管理
    recipients: "通知先",
    emailAddress: "メールアドレス",
    emailPlaceholder: "メールアドレスを入力",
    noRecipientsRegistered: "通知先が登録されていません",
    addEmailAddress: "通知先メールアドレス",
    minOneEmailRequired: "※ 通知先メールアドレスは最低1つ必要です。",
    
    // 新規作成・編集
    usageNotification: "利用通知",
    selectNotifyOrRestrict: "通知または、制限を選択",
    selectNotificationMethod: "通知方法を選択",
    amountBasedNotification: "金額による通知",
    usageBasedNotification: "利用量による通知",
    enterAmount: "金額を入力",
    enterUsage: "利用量を入力",
    addNewRecipient: "新しい通知先を追加",
    usageConversion: "利用量換算",
    amountConversion: "利用額換算",
    createNewLimit: "新規使用量制限作成",
    editLimit: "使用量制限編集",
    dataLimit: "データ量制限",
    amountLimit: "金額制限",
    
    // 単位
    yen: "円",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",
    
    // エラー画面
    errorOccurred: "エラーが発生しました",
    errorDetails: "エラー詳細",
    reloadPage: "ページを再読み込み",
    backToAccount: "アカウントページに戻る",
    contactSupport: "問題が解決しない場合は、サポートにお問い合わせください。"
  },
  alert: {
    // バリデーション
    amountRequired: "利用額を入力してください",
    usageRequired: "使用量を入力してください",
    emailRequired: "メールアドレスを入力してください",
    invalidEmail: "有効なメールアドレスを入力してください。",
    enterPositiveAmount: "0以上の数値を入力してください",
    enterValidUsage: "0より大きく1024未満の数値を入力してください",
    enterPositiveDataLimit: "データ量制限値は0より大きい値を入力してください。",
    enterPositiveAmountLimit: "金額制限値は0より大きい値を入力してください。",
    emailAlreadyAdded: "このメールアドレスは既に追加されています。",
    minOneEmail: "通知先メールアドレスは最低1つ必要です。",
    selectExceedAction: "超過時のアクションを選択してください。",
    selectLimitType: "制限タイプを選択してください。",
    dataLimitValueRequired: "データ量制限値は0より大きい値を入力してください。",
    dataLimitValueMax: "データ量制限値は1,000,000以下で入力してください。",
    amountLimitValueRequired: "金額制限値は0より大きい値を入力してください。",
    amountLimitValueMax: "金額制限値は100,000以下で入力してください。",
    minOneEmailRequired: "通知先メールアドレスを1つ以上入力してください。",
    notifyLimitCreated: "通知制限が正常に作成されました。",
    restrictLimitCreated: "利用停止制限が正常に作成されました。",
    errorPrefix: "エラー:",
    unexpectedError: "予期しないエラーが発生しました:",
    
    // 操作結果
    createFailed: "作成に失敗しました",
    updateFailed: "更新に失敗しました",
    sendingError: "送信中にエラーが発生しました",
    savingInProgress: "保存中...",
    createSuccess: "使用量制限が正常に作成されました。",
    updateSuccess: "使用量制限が正常に更新されました。",
    deleteSuccess: "使用量制限が正常に削除されました。",
    deleteConfirm: "この使用量制限を削除しますか？",
    
    // 権限
    adminOnlyCreateMessage: "利用制限の作成は管理者のみ可能です。管理者にご連絡ください。",
    adminOnlyEditMessage: "管理者のユーザーのみ編集が可能です。権限がないため編集できません。",
    adminOnlyDeleteMessage: "管理者のユーザーのみ削除が可能です。権限がないため削除できません。",
    
    // エラー
    loginRequired: "ログインが必要です。",
    unknownError: "不明なエラーが発生しました。",
    accessDenied: "このページにアクセスする権限がありません。管理者のみアクセス可能です。",
    fetchFailed: "使用量制限データの取得に失敗しました。"
  }
};

export default ja;