import type { APIKeyLocale } from './apiKey.d';

const zh: APIKeyLocale = {
  title: 'API密钥管理',
  actions: {
    create: '创建',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    back: '返回',
  },
  table: {
    apiName: 'API名称',
    description: '描述',
    createdAt: '创建时间',
    endpoint: '端点',
    actions: '操作',
  },
  modal: {
    title: '编辑API密钥',
    apiName: 'API名称',
    description: '描述',
  },
  messages: {
    noData: '无数据',
    updateFailed: '更新失败',
    deleteFailed: '删除失败',
    confirmDelete: '删除此API密钥？此操作无法撤销。',
    createFailed: '创建失败',
    idRequired: 'id是必需的',
    deleteSuccess: '删除成功',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME未设置',
    apiGatewayDeleteFailed: '删除API Gateway密钥失败',
    idAndApiNameRequired: 'id和apiName是必需的',
    updateSuccess: '更新成功',
  },
  alerts: {
    adminOnlyCreate: '仅管理员可以创建',
    adminOnlyEdit: '仅管理员可以编辑',
    adminOnlyDelete: '仅管理员可以删除',
  },
  create: {
    title: '颁发API密钥',
    fields: {
      apiName: 'API名称',
      apiDescription: 'API描述',
      policy: 'API类型（策略）',
    },
    submit: '颁发API密钥',
    issuedNote: '密钥仅显示一次。请安全保存。',
    endpointLabel: '上传端点',
    instructions: '在您的设备上配置以下内容。',
    apiKeyHeaderLabel: 'API密钥（头部x-api-key）',
    uploadExampleTitle: '上传示例（PowerShell / PNG）',
    csvNote: '对于CSV，将Content-Type设置为text/csv。根据其他文件类型进行调整。',
    filePathNote: '指定文件路径',
  },
};

export default zh;
