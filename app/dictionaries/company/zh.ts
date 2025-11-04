import type { CompanyProfileLocale } from './company.d.ts';

const zh: CompanyProfileLocale = {
  alert: {
    updateSuccess: "公司信息已更新。",
    updateFail: "更新失败。",
    networkError: "网络错误：{message}",
    required: '"{label}"为必填项。',
    fetchCustomerFailed: "获取客户信息失败",
    customerNotFound: "未找到客户信息",
    customerDeleted: "此客户账户已被删除",
    adminOnlyEditMessage: "仅管理员可以编辑公司信息。如需更改，请联系管理员。",
    invalidEmail: "请输入有效的电子邮件地址",
    invalidPhone: "请输入有效的电话号码",
    invalidPostalCode: "请输入有效的邮政编码",
    nameTooLong: "公司名称必须为100个字符或更少",
    addressTooLong: "地址必须为200个字符或更少",
    validationError: "输入内容有问题。请检查。",
    fieldUpdateSuccess: "{fieldName}已成功更新。",
    fieldUpdateFail: "{fieldName}更新失败。",
    updateError: "更新过程中发生错误。",
    fieldRequired: "{fieldLabel}为必填项。",
    invalidEmailFormat: "请输入有效的电子邮件地址。",
    invalidPhoneFormat: "请输入有效的电话号码。",
    invalidPostalCodeFormat: "请输入有效的邮政编码。",
    invalidCountryFormat: "请选择有效的国家。",
    countryRequired: "国家为必填项。",
    errorTitle: "错误",
    fetchError: "获取公司信息时发生错误。"
  },
  label: {
    title: "公司信息",
    country: "国家",
    countryPlaceholder: "搜索并选择国家",
    postal_code: "邮政编码",
    state: "州/省",
    city: "城市",
    line2: "建筑名称",
    line1: "街道地址",
    name: "公司名称",
    phone: "电话号码",
    email: "账单邮箱地址",
    notSet: "未设置",
    generalUserPermission: "普通用户权限",
    adminPermission: "管理员权限",
    adminPermissionDescription: "您可以编辑公司信息的所有字段",
    selectPlaceholder: "选择{label}"
  },
  placeholder: {
    postal_code: "例：100000",
    state: "例：北京市",
    city: "例：北京市",
    line2: "例：10楼（可选）",
    line1: "例：朝阳区建国门外大街123号",
    name: "例：示例科技有限公司",
    phone: "例：+86-10-1234-5678",
    email: "例：contact@example.com.cn",
    phoneExample: "例：90-3706-7654"
  },
  button: {
    cancel: "取消"
  }
};

export default zh;