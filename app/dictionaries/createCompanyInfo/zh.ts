import type { CreateCompanyInfoLocale } from './createCompanyInfo.d.ts';

const zh: CreateCompanyInfoLocale = {
  label: {
    back: "返回",
    submit: "提交",
    next: "下一步",
    submitting: "提交中...",
    loading: "加载中...",
    companyInfoTitle: "公司信息",
    countryLabel: "国家",
    countryPlaceholder: "搜索并选择国家",
    postalCodeLabel: "邮政编码",
    postalCodePlaceholder: "例如：100000",
    stateLabel: "州/省",
    statePlaceholder: "例如：北京市",
    cityLabel: "城市",
    cityPlaceholder: "例如：北京市",
    line1Label: "地址 1",
    line1Placeholder: "例如：朝阳区建国路123号",
    line2Label: "地址 2（建筑、房间）",
    line2Placeholder: "例如：A座101室",
    nameLabel: "公司名称",
    namePlaceholder: "例如：示例有限公司",
    emailLabel: "账单邮箱",
    emailPlaceholder: "例如：billing@company.com.cn",
    phoneLabel: "电话号码",
    phonePlaceholder: "例如：+86-10-1234-5678",
    accountCreation: "账户创建",
    companyInfo: "公司信息",
    adminSetup: "管理员设置",
    paymentSetup: "支付设置"
  },
  alert: {
    countryRequired: "国家为必填项",
    postalCodeRequired: "邮政编码为必填项",
    stateRequired: "州/省为必填项",
    cityRequired: "城市为必填项",
    line1Required: "地址 1 为必填项",
    nameRequired: "公司名称为必填项",
    emailRequired: "邮箱地址为必填项",
    phoneRequired: "电话号码为必填项",
    userAttributeUpdateFailed: "更新用户属性失败",
    stripeCustomerCreationFailed: "创建 Stripe 客户失败",
    communicationError: "发生通信错误"
  }
};

export default zh;