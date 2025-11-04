import type { ServiceLocale } from './ServiceLocale.d.ts';

const ja: ServiceLocale = {
  page: {
    title: "サービス",
    description: "ポリシーを選択してファイルをアップロードし、処理を実行できます。処理後のデータは1年間無料で保管されます。",
    loading: "読み込み中..."
  },
  error: {
    title: "エラーが発生しました",
    loginRequired: "ログインが必要です。",
    processingHistoryFetchFailed: "処理履歴の取得に失敗しました。",
    policiesFetchFailed: "ポリシーの取得に失敗しました。",
    usageLimitsFetchFailed: "利用制限の取得に失敗しました。",
    pageLoadFailed: "サービスページの読み込みに失敗しました。",
    suggestion1: "ページを再読み込みしてください。",
    suggestion2: "問題が続く場合は、サポートにお問い合わせください。"
  },
  limits: {
    notifyLimit: {
      title: "通知制限",
      limitValue: "制限値:",
      exceedAction: "超過時のアクション:",
      currentUsage: "現在の利用量:",
      notSet: "通知制限が設定されていません",
      currentUsageLabel: "現在の利用量:",
      settingsCount: "設定済み通知制限: {count}件",
      dataLimit: "データ量制限: {value} {unit} ({bytes})",
      amountLimit: "金額制限: ${amount}",
      noLimitValue: "制限値が設定されていません",
      amountConversionNote: "※ 金額制限をデータ量に換算して表示しています（処理料金: $0.00001/Byte、1年間保管込み）"
    },
    restrictLimit: {
      title: "利用停止制限",
      limitValue: "制限値:",
      exceedAction: "超過時のアクション:",
      currentUsage: "現在の利用量:",
      notSet: "利用停止制限が設定されていません",
      currentUsageLabel: "現在の利用量:",
      settingsCount: "設定済み利用停止制限: {count}件",
      dataLimit: "データ量制限: {value} {unit} ({bytes})",
      amountLimit: "金額制限: ${amount}",
      noLimitValue: "制限値が設定されていません",
      amountConversionNote: "※ 金額制限をデータ量に換算して表示しています（処理料金: $0.00001/Byte、1年間保管込み）"
    },
    perMonth: "/月",
    notifyAction: "通知",
    restrictAction: "利用停止"
  },
  policySelection: {
    title: "ポリシー選択",
    label: "処理ポリシーを選択してください",
    placeholder: "ポリシーを選択してください",
    noPolicies: "使用できるポリシーがありません"
  },
  fileUpload: {
    title: "ファイルアップロード",
    selectPolicyFirst: "まずポリシーを選択してください",
    noPoliciesAvailable: "使用できるポリシーがありません",
    dragAndDrop: "ファイルをドラッグ&ドロップ",
    orClickToSelect: "または クリックして選択",
    maxFiles: "最大 {max} ファイル、各ファイル 100MB まで",
    supportedFormats: "対応形式: {formats} で指定された形式",
    selectedFiles: "選択されたファイル ({count}/{max})",
    deleteAll: "すべて削除",
    fileSizeLimit: "{name} のファイルサイズが大きすぎます。100MB以下のファイルを選択してください。",
    pending: "待機中",
    uploading: "アップロード中",
    completed: "完了",
    error: "エラー",
    startProcessing: "処理を開始",
    processing: "処理開始中...",
    uploadComplete: "アップロード完了",
    uploadCompletedMessage: "{count}個のファイルのアップロードが完了し、AI処理を開始しました！",
    uploadNotAllowed: "アップロード不可",
    notifyLimitReached: "通知制限に達しました",
    notifyLimitReachedMessage: "通知制限（{limit}）に達しました。{count}件の通知メールを送信しました。"
  },
  table: {
    id: "ID",
    userName: "ユーザー名",
    policyName: "ポリシー名",
    usageAmountBytes: "使用量",
    status: "ステータス",
    errorDetail: "エラー",
    createdAt: "開始日時",
    updatedAt: "更新日時",
    download: "ダウンロード",
    aiTraining: "学習許可",
    delete: "削除",
    ariaLabel: "データ処理履歴テーブル"
  },
  status: {
    in_progress: "処理中",
    success: "完了",
    failed: "失敗",
    canceled: "キャンセル",
    deleted: "削除",
    delete_failed: "削除失敗"
  },
  notification: {
    uploadSuccess: "ファイルのアップロードが完了しました。データ処理を開始します。",
    uploadError: "アップロードに失敗しました",
    uploadProcessingError: "アップロード処理中にエラーが発生しました",
    uploadFailed: "ファイルのアップロードに失敗しました。再度お試しください。",
    fetchFailed: "データの取得に失敗しました",
    aiTrainingChanged: "学習許可が変更されました",
    deleteCompleted: "ファイル削除が完了しました",
    uploadCompleted: "アップロードが完了しました",
    uploadFailedGeneric: "アップロードに失敗しました",
    dataFetchFailed: "データの取得に失敗しました",
    notificationSent: "通知メールを送信しました",
    notificationFailed: "通知送信に失敗しました",
    notificationError: "通知送信中にエラーが発生しました",
    dataUpdated: "データを更新しました"
  },
  filter: {
    userName: {
      placeholder: "ユーザー名で検索",
      ariaLabel: "ユーザー名検索"
    },
    policyName: {
      placeholder: "ポリシー名で検索",
      ariaLabel: "ポリシー名検索"
    },
    dateRange: {
      label: "日付範囲",
      startDate: {
        placeholder: "開始日",
        ariaLabel: "開始日選択"
      },
      endDate: {
        placeholder: "終了日",
        ariaLabel: "終了日選択"
      },
      separator: "～"
    },
    minUsage: {
      label: "最小使用量",
      placeholder: "最小",
      ariaLabel: "最小使用量"
    },
    maxUsage: {
      label: "最大使用量",
      placeholder: "最大",
      ariaLabel: "最大使用量"
    },
    reset: "フィルターをリセット",
    rangeSeparator: "～",
    refresh: "データを更新",
    deleteSelected: "選択したアイテムを削除"
  },
  policy: {
    select: "ポリシーを選択",
    none: "作成されているポリシーがありません",
    create: "ポリシーを作成する",
    noPolicies: "作成されているポリシーがありません",
    createPolicy: "ポリシーを作成する"
  },
  deleteDialog: {
    title: "削除確認",
    warn1: "選択されているファイルが完全に削除されます。",
    warn2: "一度削除を実行すると、データ処理済みファイルのダウンロードができなくなります。",
    warn3: "また、AIの学習にも利用できなくなります。",
    warn4: "この操作は取り消すことができません。ご注意ください。",
    confirm: "本当に削除しますか？「削除」と入力してください。",
    cancel: "キャンセル",
    delete: "削除"
  },
  limitUsage: {
    title: "利用制限状況",
    status: {
      normal: "正常",
      warning: "警告",
      exceeded: "制限超過"
    },
    current: "現在:",
    limit: "制限:",
    noLimit: "制限なし",
    exceedAction: {
      notify: "通知",
      restrict: "制限"
    },
    testNotification: "テスト通知送信",
    limitTypes: {
      usage: "使用量制限",
      amount: "金額制限"
    },
    unknownCompany: "不明な会社"
  },
  tableEmpty: "データ処理履歴がありません。",
  pagination: {
    prev: "前へ",
    next: "次へ"
  },
  displayCount: "{total}件中 {shown}件を表示（全{all}件）",
  processingHistory: {
    title: "処理履歴",
    count: "({count}件)",
    refresh: "更新",
    empty: "処理履歴がありません",
    emptyDescription: "ファイルをアップロードして処理を開始すると、ここに履歴が表示されます。",
    noDownloadableFiles: "ダウンロード可能なファイルがありません。",
    noOutputFiles: "ダウンロード可能な出力ファイルがありません。",
    downloadFailed: "ダウンロードに失敗しました。",
    aiTrainingUpdateFailed: "AI学習使用の更新に失敗しました",
    fileExpiredTooltip: "ファイルは保存期間（1年）を過ぎたため削除されました",
    unknownUser: "Unknown User",
    allow: "許可",
    deny: "拒否",
    columns: {
      policy: "ポリシー",
      user: "ユーザー",
      status: "ステータス",
      startTime: "開始時刻",
      fileSize: "ファイルサイズ",
      aiTraining: "AI学習使用",
      errorDetail: "エラー詳細",
      download: "ダウンロード"
    }
  }
};

export default ja;