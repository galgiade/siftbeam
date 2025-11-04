import type { CreatePaymentLocale } from './createPayment.d.ts';

const zh: CreatePaymentLocale = {
  label: {
    back: "返回",
    submit: "提交",
    loading: "加载中...",
    paymentSetupTitle: "支付方式设置",
    cardInfoLabel: "卡片信息",
    expiryLabel: "月/年",
    cvcLabel: "安全码",
    apply: "申请",
    processing: "处理中...",
    goToMyPage: "前往我的页面",
    accountCreation: "账户创建",
    companyInfo: "公司信息",
    adminSetup: "管理员设置",
    paymentSetup: "支付设置",
    paymentMethodSaved: "✓ 支付方式保存成功",
    defaultPaymentMethodSet: "此卡片已设置为默认支付方式。",
    subscriptionCreated: "✓ 订阅创建成功",
    automaticBillingEnabled: "基于使用量的自动计费现已启用。",
    saveInfoDescription: "安全保存您的信息，以便将来一键购买",
    linkCompatibleStores: "在支持Link的商店中快速支付，包括默认Soundbox。",
    cardInfoEncrypted: "卡片信息已加密并安全存储。",
    billingBasedOnUsage: "实际计费将根据使用情况稍后进行。",
    dataRetentionNotice: "处理后的数据将免费存储1年，然后自动删除",
    authenticationFlowDescription: "出于安全原因，可能需要卡片认证。",
    authenticationFlowSteps: "如果需要认证，将显示您银行的认证屏幕。请完成认证。",
    agreeNoticePrefix: "完成注册即表示您同意",
    and: "和",
    agreeNoticeSuffix: "。",
    terms: "服务条款",
    privacy: "隐私政策"
  },
  alert: {
    expiryRequired: "请正确输入有效期",
    cvcRequired: "请正确输入安全码",
    cardInfoRequired: "未输入卡片信息",
    setupIntentFailed: "创建Setup Intent失败",
    paymentMethodFailed: "创建支付方式失败",
    unknownError: "发生未知错误",
    customerInfoNotFound: "无法获取客户信息。",
    defaultPaymentMethodFailed: "设置默认支付方式失败，但卡片注册已完成",
    authenticationRequired: "需要卡片认证。请完成认证。",
    authenticationFailed: "卡片认证失败。请重试。",
    authenticationCancelled: "卡片认证已取消。",
    authenticationIncomplete: "卡片认证未完成。请完成认证。"
  }
};

export default zh;