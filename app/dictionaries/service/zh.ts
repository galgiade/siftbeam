import type { ServiceLocale } from './ServiceLocale.d.ts';

const zh: ServiceLocale = {
  page: {
    title: "服务",
    description:
      "选择策略上传文件并执行处理。处理后的数据将免费保存一年。",
    loading: "加载中..."
  },
  error: {
    title: "发生错误",
    loginRequired: "需要登录。",
    processingHistoryFetchFailed: "获取处理历史失败。",
    policiesFetchFailed: "获取策略失败。",
    usageLimitsFetchFailed: "获取使用限制失败。",
    pageLoadFailed: "服务页面加载失败。",
    suggestion1: "请刷新页面。",
    suggestion2: "若问题仍然存在，请联系技术支持。"
  },
  limits: {
    notifyLimit: {
      title: "通知限制",
      limitValue: "限制值：",
      exceedAction: "超出时的动作：",
      currentUsage: "当前用量：",
      notSet: "尚未设置通知限制",
      currentUsageLabel: "当前用量：",
      settingsCount: "已设置的通知限制：{count} 个",
      dataLimit: "数据限制：{value} {unit} ({bytes})",
      amountLimit: "金额限制：${amount}",
      noLimitValue: "未设置限制值",
      amountConversionNote:
        "※ 金额限制已换算为数据用量显示（处理费用：$0.00001/Byte，含一年存储）。"
    },
    restrictLimit: {
      title: "停用限制",
      limitValue: "限制值：",
      exceedAction: "超出时的动作：",
      currentUsage: "当前用量：",
      notSet: "尚未设置停用限制",
      currentUsageLabel: "当前用量：",
      settingsCount: "已设置的停用限制：{count} 个",
      dataLimit: "数据限制：{value} {unit} ({bytes})",
      amountLimit: "金额限制：${amount}",
      noLimitValue: "未设置限制值",
      amountConversionNote:
        "※ 金额限制已换算为数据用量显示（处理费用：$0.00001/Byte，含一年存储）。"
    },
    perMonth: "/月",
    notifyAction: "通知",
    restrictAction: "停用"
  },
  policySelection: {
    title: "策略选择",
    label: "请选择处理策略",
    placeholder: "请选择策略",
    noPolicies: "暂无可用策略"
  },
  fileUpload: {
    title: "文件上传",
    selectPolicyFirst: "请先选择策略",
    noPoliciesAvailable: "暂无可用策略",
    dragAndDrop: "拖放文件",
    orClickToSelect: "或点击选择",
    maxFiles: "最多 {max} 个文件，每个不超过 100MB",
    supportedFormats: "支持的格式：请使用 {formats} 指定的格式",
    selectedFiles: "已选文件 ({count}/{max})",
    deleteAll: "全部删除",
    fileSizeLimit: "{name} 文件过大，请选择不超过 100MB 的文件。",
    pending: "等待中",
    uploading: "上传中",
    completed: "完成",
    error: "错误",
    startProcessing: "开始处理",
    processing: "正在启动处理...",
    uploadComplete: "上传完成",
    uploadCompletedMessage: "已上传 {count} 个文件并开始 AI 处理！",
    uploadNotAllowed: "禁止上传",
    notifyLimitReached: "已达到通知限制",
    notifyLimitReachedMessage: "已达到通知限制（{limit}）。已发送 {count} 封通知邮件。"
  },
  table: {
    id: "ID",
    userName: "用户名",
    policyName: "策略名称",
    usageAmountBytes: "使用量",
    status: "状态",
    errorDetail: "错误",
    createdAt: "开始时间",
    updatedAt: "更新时间",
    download: "下载",
    aiTraining: "AI 使用",
    delete: "删除",
    ariaLabel: "数据处理历史表格"
  },
  status: {
    in_progress: "进行中",
    success: "完成",
    failed: "失败",
    canceled: "已取消",
    deleted: "已删除",
    delete_failed: "删除失败"
  },
  notification: {
    uploadSuccess: "文件上传完成。数据处理即将开始。",
    uploadError: "上传失败。",
    uploadProcessingError: "上传处理过程中发生错误。",
    uploadFailed: "文件上传失败，请重试。",
    fetchFailed: "获取数据失败。",
    aiTrainingChanged: "AI 使用权限已更新。",
    deleteCompleted: "文件删除完成。",
    uploadCompleted: "上传完成。",
    uploadFailedGeneric: "上传失败。",
    dataFetchFailed: "获取数据失败。",
    notificationSent: "通知邮件已发送。",
    notificationFailed: "通知发送失败。",
    notificationError: "发送通知时出现错误。",
    dataUpdated: "数据已更新。"
  },
  filter: {
    userName: {
      placeholder: "按用户名搜索",
      ariaLabel: "用户名搜索"
    },
    policyName: {
      placeholder: "按策略名称搜索",
      ariaLabel: "策略名称搜索"
    },
    dateRange: {
      label: "日期范围",
      startDate: {
        placeholder: "开始日期",
        ariaLabel: "选择开始日期"
      },
      endDate: {
        placeholder: "结束日期",
        ariaLabel: "选择结束日期"
      },
      separator: "~"
    },
    minUsage: {
      label: "最小用量",
      placeholder: "最小",
      ariaLabel: "最小用量"
    },
    maxUsage: {
      label: "最大用量",
      placeholder: "最大",
      ariaLabel: "最大用量"
    },
    reset: "重置筛选",
    rangeSeparator: "~",
    refresh: "刷新数据",
    deleteSelected: "删除所选项"
  },
  policy: {
    select: "选择策略",
    none: "尚未创建策略。",
    create: "创建策略",
    noPolicies: "尚未创建策略。",
    createPolicy: "创建策略"
  },
  deleteDialog: {
    title: "删除确认",
    warn1: "选中的文件将被永久删除。",
    warn2: "删除后已处理的文件将无法下载。",
    warn3: "它们也无法再用于 AI 训练。",
    warn4: "此操作无法撤销，请谨慎操作。",
    confirm: "确定要删除吗？请输入 \"DELETE\"。",
    cancel: "取消",
    delete: "删除"
  },
  limitUsage: {
    title: "使用限制状况",
    status: {
      normal: "正常",
      warning: "警告",
      exceeded: "超出"
    },
    current: "当前：",
    limit: "限制：",
    noLimit: "无限制",
    exceedAction: {
      notify: "通知",
      restrict: "限制"
    },
    testNotification: "发送测试通知",
    limitTypes: {
      usage: "使用量限制",
      amount: "金额限制"
    },
    unknownCompany: "未知公司"
  },
  tableEmpty: "暂无数据处理记录。",
  pagination: {
    prev: "上一页",
    next: "下一页"
  },
  displayCount: "显示 {shown}/{total}（共 {all}）",
  processingHistory: {
    title: "处理记录",
    count: "（{count} 项）",
    refresh: "刷新",
    empty: "暂无处理记录。",
    emptyDescription: "上传文件并开始处理后，此处将显示记录。",
    noDownloadableFiles: "没有可下载的文件。",
    noOutputFiles: "没有可下载的输出文件。",
    downloadFailed: "下载失败。",
    aiTrainingUpdateFailed: "更新 AI 使用设置失败。",
    fileExpiredTooltip: "文件因超过存储期限（一年）而被删除。",
    unknownUser: "未知用户",
    allow: "允许",
    deny: "拒绝",
    columns: {
      policy: "策略",
      user: "用户",
      status: "状态",
      startTime: "开始时间",
      fileSize: "文件大小",
      aiTraining: "AI 使用",
      errorDetail: "错误详情",
      download: "下载"
    }
  }
};

export default zh;