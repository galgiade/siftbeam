import type { CancelDeleteAccountLocale } from './cancelDeleteAccount.d.ts';

const zh: CancelDeleteAccountLocale = {
  label: {
    back: "返回",
    submit: "提交",
    loading: "加载中...",
    cancelDeleteTitle: "取消账户删除请求",
    signIn: "登录",
    supportEmail: "connectechceomatsui@gmail.com",
    supportContact: "如需支持，请通过以下邮箱与我们联系：",
    cancelDelete: "取消删除请求",
    accountDeleteRequested: "已提交账户删除请求",
    requestedUser: "请求用户",
    requestDate: "请求日期",
    userNameNotFound: "未找到用户名",
    confirmationMessage: "这将取消账户删除请求。\n确定要取消吗？"
  },
  alert: {
    authenticationFailed: "认证失败。",
    insufficientPermissions: "权限不足。",
    adminRequired: "请使用具有管理员权限的用户登录。",
    cancelSuccess: "删除请求取消已完成。",
    cancelError: "发生错误。请重试。"
  }
};

export default zh;