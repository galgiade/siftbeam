export default {
  "label": {
    "policyList": "ポリシー一覧",
    "policyNotRegistered": "ポリシーが登録されていません",
    "policyName": "ポリシー名",
    "policyNamePlaceholder": "ポリシー名",
    "description": "ポリシーの説明",
    "descriptionPlaceholder": "ポリシーの説明",
    "allowedFileTypes": "許可ファイルタイプ:",
    "selectFileTypes": "ファイルタイプを選択（複数可）",
    "fileTypes": {
      "image/jpeg": "JPEG画像",
      "image/png": "PNG画像",
      "image/gif": "GIF画像",
      "image/webp": "WebP画像",
      "application/pdf": "PDFファイル",
      "text/csv": "CSVファイル",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excelファイル(.xlsx)",
      "application/vnd.ms-excel": "Excelファイル(.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Wordファイル(.docx)",
      "application/msword": "Wordファイル(.doc)",
      "text/plain": "テキストファイル",
      "application/json": "JSONファイル",
      "application/zip": "ZIPアーカイブ"
    }
  },
  "alert": {
    "required": "このフィールドは必須です",
    "invalidEmail": "有効なメールアドレスを入力してください",
    "fileTypeRequired": "ファイルタイプは1つ以上選択してください",
    "adminOnlyEditMessage": "管理者のユーザーのみ編集が可能です。権限がないため編集できません。",
    "adminOnlyCreateMessage": "ポリシーの作成は管理者のみ可能です。管理者にご連絡ください。",
    "updateSuccess": "ポリシーが正常に更新されました",
    "updateFailed": "ポリシーの更新に失敗しました",
    "validationError": "入力内容に問題があります。確認してください"
  },
  "analysis": {
    "title": "分析",
    "description": "モデル×データセットの評価結果",
    "noDataMessage": "分析データがありません",
    "noDataForPolicyMessage": "選択されたポリシーの分析データがありません",
    "paginationAriaLabel": "ページネーション",
    "displayCount": "表示",
    "columns": {
      "evaluationDate": "評価日時",
      "policy": "ポリシー",
      "accuracy": "精度",
      "defectDetectionRate": "不良検出率",
      "reliability": "信頼度",
      "responseTime": "応答速度",
      "stability": "安定性",
      "actions": "操作"
    },
    "actions": {
      "view": "閲覧"
    }
  }
} as const;


