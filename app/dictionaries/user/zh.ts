import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const zh: UserProfileLocale = {
  alert: {
    updateSuccess: "用户信息更新成功。",
    updateFail: "更新用户信息失败。",
    updateError: "更新过程中发生错误。",
    fieldUpdateSuccess: "{field} 已成功更新。",
    fieldUpdateFail: "{field} 更新失败。",
    emailSent: "确认代码已发送到您的新邮箱地址。",
    emailUpdateSuccess: "邮箱地址更新成功。",
    emailUpdateFail: "更新邮箱地址失败。",
    dbUpdateFail: "更新数据库失败。",
    dbUpdateError: "数据库更新失败",
    confirmFail: "确认代码不正确或数据库更新失败。",
    invalidConfirmationCode: "确认代码不正确。请输入正确的6位数字代码。",
    expiredConfirmationCode: "确认代码已过期。请请求新代码。",
    noEmailChange: "邮箱地址无变化。",
    invalidEmailFormat: "邮箱格式无效。请输入有效的邮箱地址。",
    noChange: "用户名无变化。",
    invalidConfirmationCodeFormat: "请输入6位数字确认代码。",
    verificationCodeNotFound: "验证码未找到或已过期",
    remainingAttempts: "剩余尝试次数",
    verificationCodeStoreFailed: "验证码存储失败。请检查IAM权限。",
    codeStoreFailed: "代码保存失败。",
    adminOnlyEdit: "仅管理员可以编辑此字段。",
    validEmailRequired: "请输入有效的邮箱地址。"
  },
  label: {
    title: "用户信息",
    userName: "用户名",
    department: "部门",
    position: "职位",
    email: "邮箱地址",
    locale: "语言",
    role: "角色",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
    adminOnly: "(仅管理员)",
    readOnly: "(不可更改)",
    editableFields: "可编辑: 用户名、语言",
    adminOnlyFields: "仅管理员: 邮箱、部门、职位",
    allFieldsEditable: "所有字段均可编辑",
    newEmailSent: "验证码已发送至新邮箱 \"{email}\"。",
    roleAdmin: "管理员",
    roleUser: "用户",
    lastAdminRestriction: "如果您是最后一位管理员，则角色更改受限",
    lastAdminNote: "※ 如果组织中只有一位管理员，则无法将角色更改为普通用户。",
    generalUserPermission: "普通用户权限",
    adminPermission: "管理员权限",
    verifyAndUpdate: "验证并更新",
    verificationCodePlaceholder: "验证码（6位数字）"
  },
  modal: {
    modalTitle: "邮箱确认",
    description: "请输入发送到您新邮箱地址({email})的确认代码。",
    codeLabel: "确认代码",
    cancel: "取消",
    confirm: "确认",
    resend: "重发",
    verifying: "验证中..."
  }
}

export default zh;


