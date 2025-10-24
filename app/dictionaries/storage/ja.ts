export default {
  "table": {
    "id": "ID",
    "userName": "ユーザー名",
    "policyName": "ポリシー名",
    "usageAmountBytes": "使用量",
    "status": "ステータス",
    "errorDetail": "エラー",
    "createdAt": "開始日時",
    "updatedAt": "更新日時",
    "download": "ダウンロード",
    "aiTraining": "学習許可",
    "delete": "削除",
    "ariaLabel": "データ処理履歴テーブル"
  },
  "status": {
    "in_progress": "処理中",
    "success": "完了",
    "failed": "失敗",
    "canceled": "キャンセル",
    "deleted": "削除",
    "delete_failed": "削除失敗"
  },
  "notification": {
    "uploadSuccess": "ファイルのアップロードが完了しました。データ処理を開始します。",
    "uploadError": "アップロードに失敗しました",
    "uploadProcessingError": "アップロード処理中にエラーが発生しました",
    "uploadFailed": "ファイルのアップロードに失敗しました。再度お試しください。",
    "fetchFailed": "データの取得に失敗しました",
    "aiTrainingChanged": "学習許可が変更されました",
    "deleteCompleted": "ファイル削除が完了しました",
    "uploadCompleted": "アップロードが完了しました",
    "uploadFailedGeneric": "アップロードに失敗しました",
    "dataFetchFailed": "データの取得に失敗しました",
    "notificationSent": "通知メールを送信しました",
    "notificationFailed": "通知送信に失敗しました",
    "notificationError": "通知送信中にエラーが発生しました",
    "dataUpdated": "データを更新しました"
  },
  "filter": {
    "userName": {
      "placeholder": "ユーザー名で検索",
      "ariaLabel": "ユーザー名検索"
    },
    "policyName": {
      "placeholder": "ポリシー名で検索",
      "ariaLabel": "ポリシー名検索"
    },
    "dateRange": {
      "label": "日付範囲",
      "startDate": {
        "placeholder": "開始日",
        "ariaLabel": "開始日選択"
      },
      "endDate": {
        "placeholder": "終了日",
        "ariaLabel": "終了日選択"
      },
      "separator": "～"
    },
    "minUsage": {
      "label": "最小使用量",
      "placeholder": "最小",
      "ariaLabel": "最小使用量"
    },
    "maxUsage": {
      "label": "最大使用量",
      "placeholder": "最大",
      "ariaLabel": "最大使用量"
    },
    "reset": "フィルターをリセット",
    "rangeSeparator": "～",
    "refresh": "データを更新",
    "deleteSelected": "選択したアイテムを削除"
  },
  "policy": {
    "select": "ポリシーを選択",
    "none": "作成されているポリシーがありません",
    "create": "ポリシーを作成する",
    "noPolicies": "作成されているポリシーがありません",
    "createPolicy": "ポリシーを作成する"
  },
  "deleteDialog": {
    "title": "削除確認",
    "warn1": "選択されているファイルが完全に削除されます。",
    "warn2": "一度削除を実行すると、データ処理済みファイルのダウンロードができなくなります。",
    "warn3": "また、AIの学習にも利用できなくなります。",
    "warn4": "この操作は取り消すことができません。ご注意ください。",
    "confirm": "本当に削除しますか？「削除」と入力してください。",
    "cancel": "キャンセル",
    "delete": "削除"
  },
  "limitUsage": {
    "title": "利用制限状況",
    "status": {
      "normal": "正常",
      "warning": "警告",
      "exceeded": "制限超過"
    },
    "current": "現在:",
    "limit": "制限:",
    "noLimit": "制限なし",
    "exceedAction": {
      "notify": "通知",
      "restrict": "制限"
    },
    "testNotification": "テスト通知送信",
    "limitTypes": {
      "usage": "使用量制限",
      "amount": "金額制限"
    },
    "unknownCompany": "不明な会社"
  },
  "tableEmpty": "データ処理履歴がありません。",
  "pagination": {
    "prev": "前へ",
    "next": "次へ"
  },
  "displayCount": "{total}件中 {shown}件を表示（全{all}件）"
} as const;


