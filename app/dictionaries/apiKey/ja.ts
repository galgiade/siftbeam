import type { APIKeyLocale } from './apiKey.d';

const ja: APIKeyLocale = {
  title: 'APIキー管理',
  actions: {
    create: '新規作成',
    edit: '編集',
    delete: '削除',
    save: '保存',
    cancel: 'キャンセル',
    back: '戻る',
  },
  table: {
    apiName: 'API名',
    description: '説明',
    createdAt: '作成日',
    endpoint: 'エンドポイント',
    actions: '操作',
  },
  modal: {
    title: 'APIキーの編集',
    apiName: 'API名',
    description: '説明',
  },
  messages: {
    noData: 'データがありません',
    updateFailed: '更新に失敗しました',
    deleteFailed: '削除に失敗しました',
    confirmDelete: 'このAPIキーを削除しますか？この操作は取り消せません。',
    createFailed: '作成に失敗しました',
    idRequired: 'id は必須です',
    deleteSuccess: '削除しました',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME が未設定です',
    apiGatewayDeleteFailed: 'API Gatewayキーの削除に失敗しました',
    idAndApiNameRequired: 'id と apiName は必須です',
    updateSuccess: '更新しました',
  },
  alerts: {
    adminOnlyCreate: '管理者のみ作成可能です',
    adminOnlyEdit: '管理者のみ編集可能です',
    adminOnlyDelete: '管理者のみ削除可能です',
  },
  create: {
    title: 'APIキーの発行',
    fields: {
      apiName: 'API Name',
      apiDescription: 'API Description',
      policy: 'API Type (Policy)',
    },
    submit: 'APIキーを発行',
    issuedNote: 'このキーは作成時にのみ表示されます。必ず安全な場所に保存してください。',
    endpointLabel: 'アップロード先エンドポイント',
    instructions: '以下をデバイスに設定してください。',
    apiKeyHeaderLabel: 'API Key (ヘッダー x-api-key)',
    uploadExampleTitle: 'アップロード例（PowerShell / 画像PNG）',
    csvNote: 'CSV の場合は Content-Type を text/csv に、その他のファイルは実際の種類に合わせて変更してください。',
    filePathNote: 'あなたのファイルへのパスを指定',
  },
};

export default ja;


