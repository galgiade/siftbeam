// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const zhCN = {
  alert: {
    updateSuccess: "用户信息更新成功。",
    updateFail: "更新用户信息失败。",
    emailSent: "确认代码已发送到您的新邮箱地址。",
    emailUpdateSuccess: "邮箱地址更新成功。",
    emailUpdateFail: "更新邮箱地址失败。",
    dbUpdateFail: "更新数据库失败。",
    dbUpdateError: "数据库更新失败",
    confirmFail: "确认代码不正确或数据库更新失败。",
    invalidConfirmationCode: "确认代码不正确。请输入正确的6位数字代码。",
    expiredConfirmationCode: "确认代码已过期。请请求新代码。",
    userAlreadyExists: "此邮箱地址已注册。请使用不同的邮箱地址。",
    usernameExists: "此用户名已被使用。请使用不同的用户名。",
    noEmailChange: "邮箱地址无变化。",
    invalidEmailFormat: "邮箱格式无效。请输入有效的邮箱地址。",
    emailChangeCancelled: "邮箱地址更改已取消。",
    emailChangeCancelFailed: "取消邮箱地址更改失败。",
    emailChangeReset: "未确认的邮箱地址更改已重置。",
    noChange: "用户名无变化。",
    resendLimitExceeded: "重发次数已达上限。请稍后再试。",
    resendFailed: "重发确认代码失败。请重试。",
    invalidConfirmationCodeFormat: "请输入6位数字确认代码。",
    confirmationAttemptLimitExceeded: "确认尝试次数已达上限。请稍后再试。",
    authenticationFailed: "身份验证失败。请重新登录并重试。",
    invalidUsernameFormat: "用户名格式无效。请输入有效的用户名。",
    usernameChangeLimitExceeded: "用户名更改次数已达上限。请稍后再试。",
    atLeastOneFieldRequired: "至少需要更新一个字段",
    verificationCodeNotFound: "验证码未找到或已过期",
    remainingAttempts: "剩余尝试次数",
    verificationCodeStoreFailed: "验证码存储失败。请检查IAM权限。"
  },
  label: {
    title: "用户信息",
    userName: "用户名",
    department: "部门",
    position: "职位",
    email: "邮箱地址"
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

export default zhCN;


