export type LimitUsageLocale = {
  label: {
    // 共通
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    back: string;
    add: string;
    create: string;
    creating: string;
    
    // メイン画面
    limitUsageTitle: string;
    notificationTarget: string;
    detail: string;
    createdAt: string;
    updatedAt: string;
    
    // 通知タイプ
    notify: string;
    restrict: string;
    exceedAction: string;
    notifyOnly: string;
    
    // 金額・利用量
    amount: string;
    usage: string;
    editTarget: string;
    
    // 受信者管理
    recipients: string;
    emailAddress: string;
    emailPlaceholder: string;
    noRecipientsRegistered: string;
    
    // 新規作成
    usageNotification: string;
    selectNotifyOrRestrict: string;
    selectNotificationMethod: string;
    amountBasedNotification: string;
    usageBasedNotification: string;
    enterAmount: string;
    enterUsage: string;
    addNewRecipient: string;
    usageConversion: string;
    amountConversion: string;
    
    // 単位
    yen: string;
    unitKB: string;
    unitMB: string;
    unitGB: string;
    unitTB: string;
  };
  alert: {
    // バリデーション
    amountRequired: string;
    usageRequired: string;
    emailRequired: string;
    invalidEmail: string;
    enterPositiveAmount: string;
    enterValidUsage: string;
    
    // 操作結果
    createFailed: string;
    updateFailed: string;
    sendingError: string;
    savingInProgress: string;
    // 権限
    adminOnlyCreateMessage: string;
    adminOnlyEditMessage: string;
    adminOnlyDeleteMessage: string;
  };
};
