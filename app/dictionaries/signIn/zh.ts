import type { SignInLocale } from './signIn.d.ts';

const zh: SignInLocale = {
  label: {
    back: "返回",
    submit: "提交",
    loading: "加载中...",
    signInTitle: "登录",
    signInSubtitle: "请登录您的账户",
    emailLabel: "邮箱地址",
    emailPlaceholder: "example@email.com",
    passwordLabel: "密码",
    passwordPlaceholder: "请输入密码",
    passwordDescription: "至少 8 个字符，包含大写、小写、数字和符号",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    signIn: "登录",
    signingIn: "登录中...",
    signUp: "注册",
    forgotPassword: "忘记密码？",
    noAccount: "还没有账户？",

    // 2FA
    verificationCodeLabel: "验证码",
    verificationCodePlaceholder: "输入6位验证码",
    verificationCodeDescription: "请输入发送到您注册邮箱的验证码",
    verifyCode: "验证验证码",
    verifyingCode: "验证中...",
    resendCode: "重新发送验证码",
    resendingCode: "正在重新发送...",
    codeExpired: "验证码已过期",
    enterVerificationCode: "请输入验证码",
    twoFactorAuthTitle: "双因素认证",
    twoFactorAuthDescription: "请输入发送到 {email} 的验证码",
    expirationTime: "过期时间",
    attemptCount: "尝试次数",
    verificationSuccess: "✅ 认证成功。正在重定向...",

    // 其他
    orDivider: "或",
    copyright: "© 2024 版权所有。"
  },
  alert: {
    emailRequired: "请输入邮箱地址",
    passwordRequired: "请输入密码",
    emailFormatInvalid: "请输入有效的邮箱格式",
    passwordFormatInvalid: "密码至少 8 个字符，且包含大写、小写和数字",
    emailAndPasswordRequired: "请输入邮箱地址和密码",
    signInFailed: "登录失败",
    accountNotConfirmed: "账户未确认。请完成邮箱验证",
    authCodeRequired: "需要输入认证代码",
    newPasswordRequired: "需要设置新密码",
    passwordResetRequired: "需要重置密码",
    nextStepRequired: "需要下一步：{step}",
    
    // 2FA errors
    verificationCodeRequired: "请输入验证码",
    verificationCodeInvalid: "验证码不正确",
    verificationCodeExpired: "验证码已过期。请重新发送",
    resendCodeFailed: "重新发送验证码失败",
    maxAttemptsReached: "已达到最大尝试次数。请请求新验证码。",
    emailSendFailed: "邮件发送失败",
    verificationCodeNotFound: "验证码未找到或已过期",
    remainingAttempts: "剩余尝试次数",
    authErrors: {
      notAuthorized: "邮箱或密码不正确",
      userNotConfirmed: "账户未确认。请完成邮箱验证",
      userNotFound: "未找到用户",
      passwordResetRequired: "需要重置密码",
      invalidParameter: "输入的参数无效",
      tooManyRequests: "请求过多。请稍后再试"
    }
  }
};

export default zh;