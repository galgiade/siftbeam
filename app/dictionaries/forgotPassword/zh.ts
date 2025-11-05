import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const zh: ForgotPasswordLocale = {
  label: {
    back: "返回",
    submit: "提交",
    loading: "加载中...",
    forgotPasswordTitle: "重置密码",
    emailLabel: "邮箱地址",
    emailPlaceholder: "请输入邮箱地址",
    codeLabel: "验证码",
    codePlaceholder: "请输入验证码",
    newPasswordLabel: "新密码",
    newPasswordPlaceholder: "请输入新密码",
    confirmPasswordLabel: "确认密码",
    confirmPasswordPlaceholder: "请再次输入密码",
    passwordDescription: "至少8个字符，包含大写、小写字母和数字",
    sendCode: "发送验证码",
    updatePassword: "更新密码",
    backToEmail: "返回",
    resendCode: "重新发送验证码",
    emailDescription: "请输入您的邮箱地址。我们会发送验证码。",
    codeDescription: "请输入发送到您邮箱的验证码和新密码。",
    redirectingMessage: "正在跳转到登录页面...",
    codeExpiryTitle: "验证码有效期",
    remainingTime: "剩余时间：{time}",
    expiredMessage: "已过期。请重新获取验证码。",
    timeLimitMessage: "请在 24 小时内输入",
    expiredResendMessage: "验证码已过期。请重新获取。"
  },
  alert: {
    emailRequired: "请输入邮箱地址",
    invalidEmailFormat: "请输入有效的邮箱地址",
    codeRequired: "请输入验证码",
    newPasswordRequired: "请输入新密码",
    confirmPasswordRequired: "请确认密码",
    passwordMismatch: "密码不匹配",
    invalidPasswordFormat: "密码必须至少8个字符，包含大写、小写字母和数字",
    codeSent: "验证码已发送到您的邮箱",
    passwordResetSuccess: "密码已成功重置",
    passwordUpdated: "密码已成功更新！",
    codeExpired: "已过期",
    authErrors: {
      notAuthorized: "邮箱或密码不正确",
      userNotConfirmed: "账户未确认。请完成邮箱验证",
      userNotFound: "未找到用户",
      passwordResetRequired: "需要重置密码",
      invalidParameter: "输入的参数无效",
      tooManyRequests: "请求过多。请稍后再试",
      signInFailed: "登录失败"
    },
    passwordResetErrors: {
      codeMismatch: "验证码不正确。请重试。",
      expiredCode: "验证码已过期。请重新获取。",
      invalidPassword: "密码无效。请检查密码要求。",
      limitExceeded: "请求次数已达上限。请稍后再试。",
      genericError: "发生错误。请重试。"
    }
  }
};

export default zh;