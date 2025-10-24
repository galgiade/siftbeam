export default {
  "table": {
    "id": "ID",
    "userName": "用户名",
    "policyName": "策略名称",
    "usageAmountBytes": "使用量",
    "status": "状态",
    "errorDetail": "错误",
    "createdAt": "开始时间",
    "updatedAt": "更新时间",
    "download": "下载",
    "aiTraining": "AI训练",
    "delete": "删除",
    "ariaLabel": "数据处理历史表格"
  },
  "status": {
    "in_progress": "处理中",
    "success": "完成",
    "failed": "失败",
    "canceled": "已取消",
    "deleted": "已删除",
    "delete_failed": "删除失败"
  },
  "notification": {
    "uploadSuccess": "文件上传完成。数据处理将开始。",
    "uploadError": "上传失败。",
    "uploadProcessingError": "上传处理过程中发生错误。",
    "uploadFailed": "文件上传失败。请重试。",
    "fetchFailed": "获取数据失败。",
    "aiTrainingChanged": "AI训练权限已更改。",
    "deleteCompleted": "文件删除完成。",
    "uploadCompleted": "上传完成。",
    "uploadFailedGeneric": "上传失败。",
    "dataFetchFailed": "获取数据失败。",
    "notificationSent": "通知邮件发送成功。",
    "notificationFailed": "发送通知失败。",
    "notificationError": "发送通知时发生错误。",
    "dataUpdated": "数据更新成功。"
  },
  "filter": {
    "userName": {
      "placeholder": "按用户名搜索",
      "ariaLabel": "用户名搜索"
    },
    "policyName": {
      "placeholder": "按策略名称搜索",
      "ariaLabel": "策略名称搜索"
    },
    "dateRange": {
      "label": "日期范围",
      "startDate": {
        "placeholder": "开始日期",
        "ariaLabel": "开始日期选择"
      },
      "endDate": {
        "placeholder": "结束日期",
        "ariaLabel": "结束日期选择"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "最小使用量",
      "placeholder": "最小",
      "ariaLabel": "最小使用量"
    },
    "maxUsage": {
      "label": "最大使用量",
      "placeholder": "最大",
      "ariaLabel": "最大使用量"
    },
    "reset": "重置过滤器",
    "rangeSeparator": "~",
    "refresh": "刷新数据",
    "deleteSelected": "删除选中项"
  },
  "policy": {
    "select": "选择策略",
    "none": "尚未创建策略。",
    "create": "创建策略",
    "noPolicies": "尚未创建策略。",
    "createPolicy": "创建策略"
  },
  "deleteDialog": {
    "title": "删除确认",
    "warn1": "选中的文件将被永久删除。",
    "warn2": "删除后，已处理的文件将无法下载。",
    "warn3": "此外，它们也无法用于AI训练。",
    "warn4": "此操作无法撤销。请小心。",
    "confirm": "您确定要删除吗？请输入'删除'。",
    "cancel": "取消",
    "delete": "删除"
  },
  "limitUsage": {
    "title": "使用限制状态",
    "status": {
      "normal": "正常",
      "warning": "警告",
      "exceeded": "超出限制"
    },
    "current": "当前：",
    "limit": "限制：",
    "noLimit": "无限制",
    "exceedAction": {
      "notify": "通知",
      "restrict": "限制"
    },
    "testNotification": "发送测试通知",
    "limitTypes": {
      "usage": "使用量限制",
      "amount": "金额限制"
    },
    "unknownCompany": "未知公司"
  },
  "tableEmpty": "没有数据处理历史。",
  "pagination": {
    "prev": "上一页",
    "next": "下一页"
  },
  "displayCount": "显示 {shown} 条，共 {total} 条（总计 {all} 条）"
} as const;


