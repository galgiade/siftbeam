import type { UsageLimitLocale } from './usage-limit.d.ts';

const zh: UsageLimitLocale = {
  label: {
    // 通用
    save: "保存",
    cancel: "取消",
    edit: "编辑",
    delete: "删除",
    back: "返回",
    add: "添加",
    create: "创建",
    creating: "保存中...",
    update: "更新",
    
    // 创建页面
    createUsageLimitTitle: "创建使用限制",
    createUsageLimitDescription: "配置数据处理量或费用限制,并选择超出时要执行的操作。",
    usageLimitSettings: "使用限制设置",
    exceedActionTitle: "超出时的操作",
    selectAction: "选择操作",
    notifyOnlyOption: "仅通知",
    restrictOption: "暂停服务",
    notifyOnlyDescription: "超出限制时将发送通知邮件。服务将继续可用。",
    restrictDescription: "超出限制时将暂停服务。同时也会发送通知邮件。",
    limitTypeTitle: "限制类型",
    dataLimitOption: "数据限制",
    amountLimitOption: "金额限制",
    dataLimitDescription: "基于数据处理量(MB/GB/TB)设置限制。",
    amountLimitDescription: "基于处理费用(USD)设置限制。",
    dataLimitTitle: "数据限制值",
    enterLimitValue: "输入限制值(例:100)",
    unit: "单位",
    monthlyDataLimitDescription: "当月度数据处理量超过此值时将执行操作。",
    amountLimitTitle: "金额限制值",
    enterAmountValue: "输入限制值(例:50)",
    monthlyAmountLimitDescription: "当月度处理费用超过此金额时将执行操作。",
    notificationSettingsTitle: "通知设置",
    enterEmailPlaceholder: "输入电子邮件地址(例:example@company.com)",
    notificationEmailList: "通知电子邮件地址",
    notificationEmailCount: "通知电子邮件地址({count}个)",
    notifyOnlyEmailDescription: "超出限制时,将向此处配置的电子邮件地址发送通知。",
    restrictEmailDescription: "超出限制时,服务将暂停,并向此处配置的电子邮件地址发送通知。",
    cancelButton: "取消",
    createNotifyLimit: "创建通知限制",
    createRestrictLimit: "创建限制限制",
    processingFeeOnly: "仅处理费用",
    conversionApproximate: "≈",

    // 主屏幕
    limitUsageTitle: "使用限制",
    usageLimitManagement: "使用限制管理",
    usageLimitDescription: "设置数据使用和金额限制,并管理超出时的操作。",
    createLimit: "创建限制",
    notificationTarget: "通知接收者",
    detail: "详情",
    createdAt: "创建时间",
    updatedAt: "更新时间",
    limitValue: "限制值",
    notificationRecipients: "通知接收者",

    // 通知类型
    notify: "通知",
    restrict: "暂停",
    exceedAction: "超出时的操作",
    notifyOnly: "仅通知",
    notifyLimit: "通知限制",
    restrictLimit: "暂停限制",
    notifyLimitDescription: "设置限制后,超出时将发送通知。",
    restrictLimitDescription: "设置限制后,超出时将暂停服务。",
    noNotifyLimits: "未配置通知限制",
    noRestrictLimits: "未配置暂停限制",

    // 金额和使用量
    amount: "金额",
    usage: "使用量",
    editTarget: "编辑目标",
    limitType: "限制类型",
    selectLimitType: "选择限制类型",
    dataLimitValue: "数据限制值",
    amountLimitValue: "金额限制值(USD)",
    dataLimitPlaceholder: "例:100",
    amountLimitPlaceholder: "例:50",
    orSeparator: "或",
    noLimit: "无限制",

    // 接收者管理
    recipients: "接收者",
    emailAddress: "电子邮件地址",
    emailPlaceholder: "输入电子邮件地址",
    noRecipientsRegistered: "未注册接收者",
    addEmailAddress: "通知电子邮件地址",
    minOneEmailRequired: "至少需要一个通知电子邮件地址。",

    // 创建/编辑
    usageNotification: "使用通知",
    selectNotifyOrRestrict: "选择通知或限制",
    selectNotificationMethod: "选择通知方法",
    amountBasedNotification: "基于金额的通知",
    usageBasedNotification: "基于使用量的通知",
    enterAmount: "输入金额",
    enterUsage: "输入使用量",
    addNewRecipient: "添加新接收者",
    usageConversion: "使用量转换",
    amountConversion: "金额转换",
    createNewLimit: "创建新使用限制",
    editLimit: "编辑使用限制",
    dataLimit: "数据限制",
    amountLimit: "金额限制",

    // 单位
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // 错误屏幕
    errorOccurred: "发生错误",
    contactSupport: "如果问题持续存在,请联系支持。"
  },
  alert: {
    // 验证
    amountRequired: "请输入使用金额",
    usageRequired: "请输入使用量",
    emailRequired: "请输入电子邮件地址",
    invalidEmail: "请输入有效的电子邮件地址。",
    enterPositiveAmount: "请输入大于或等于0的数字",
    enterValidUsage: "请输入大于0且小于1024的数字",
    enterPositiveDataLimit: "数据限制值必须大于0。",
    enterPositiveAmountLimit: "金额限制值必须大于0。",
    emailAlreadyAdded: "此电子邮件地址已添加。",
    minOneEmail: "至少需要一个通知电子邮件地址。",
    selectExceedAction: "请选择超出时的操作。",
    selectLimitType: "请选择限制类型。",
    dataLimitValueRequired: "数据限制值必须大于0。",
    dataLimitValueMax: "数据限制值必须为1,000,000或更少。",
    amountLimitValueRequired: "金额限制值必须大于0。",
    amountLimitValueMax: "金额限制值必须为100,000或更少。",
    minOneEmailRequired: "请至少输入一个通知电子邮件地址。",
    notifyLimitCreated: "通知限制已成功创建。",
    restrictLimitCreated: "限制限制已成功创建。",
    errorPrefix: "错误:",
    unexpectedError: "发生意外错误:",

    // 操作结果
    createFailed: "创建使用限制失败。",
    updateFailed: "更新使用限制失败。",
    sendingError: "发送时发生错误。",
    savingInProgress: "保存中...",
    createSuccess: "使用限制已成功创建。",
    updateSuccess: "使用限制已成功更新。",
    deleteSuccess: "使用限制已成功删除。",
    deleteConfirm: "删除此使用限制?",

    // 权限
    adminOnlyCreateMessage: "只有管理员可以创建使用限制。请联系管理员。",
    adminOnlyEditMessage: "只有管理员可以编辑使用限制。您没有权限。",
    adminOnlyDeleteMessage: "只有管理员可以删除使用限制。您没有权限。",

    // 错误
    loginRequired: "需要登录。",
    unknownError: "发生未知错误。"
  }
};

export default zh;
