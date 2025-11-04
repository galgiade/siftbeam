export type ServiceLocale = {
  page: {
    title: string;
    description: string;
    loading: string;
  };
  error: {
    title: string;
    loginRequired: string;
    processingHistoryFetchFailed: string;
    policiesFetchFailed: string;
    usageLimitsFetchFailed: string;
    pageLoadFailed: string;
    suggestion1: string;
    suggestion2: string;
  };
  limits: {
    notifyLimit: {
      title: string;
      limitValue: string;
      exceedAction: string;
      currentUsage: string;
      notSet: string;
      currentUsageLabel: string;
      settingsCount: string;
      dataLimit: string;
      amountLimit: string;
      noLimitValue: string;
      amountConversionNote: string;
    };
    restrictLimit: {
      title: string;
      limitValue: string;
      exceedAction: string;
      currentUsage: string;
      notSet: string;
      currentUsageLabel: string;
      settingsCount: string;
      dataLimit: string;
      amountLimit: string;
      noLimitValue: string;
      amountConversionNote: string;
    };
    perMonth: string;
    notifyAction: string;
    restrictAction: string;
  };
  policySelection: {
    title: string;
    label: string;
    placeholder: string;
    noPolicies: string;
  };
  fileUpload: {
    title: string;
    selectPolicyFirst: string;
    noPoliciesAvailable: string;
    dragAndDrop: string;
    orClickToSelect: string;
    maxFiles: string;
    supportedFormats: string;
    selectedFiles: string;
    deleteAll: string;
    fileSizeLimit: string;
    pending: string;
    uploading: string;
    completed: string;
    error: string;
    startProcessing: string;
    processing: string;
    uploadComplete: string;
    uploadCompletedMessage: string;
    uploadNotAllowed: string;
    notifyLimitReached: string;
    notifyLimitReachedMessage: string;
  };
  table: {
    id: string;
    userName: string;
    policyName: string;
    usageAmountBytes: string;
    status: string;
    errorDetail: string;
    createdAt: string;
    updatedAt: string;
    download: string;
    aiTraining: string;
    delete: string;
    ariaLabel: string;
  };
  status: {
    in_progress: string;
    success: string;
    failed: string;
    canceled: string;
    deleted: string;
    delete_failed: string;
  };
  notification: {
    uploadSuccess: string;
    uploadError: string;
    uploadProcessingError: string;
    uploadFailed: string;
    fetchFailed: string;
    aiTrainingChanged: string;
    deleteCompleted: string;
    uploadCompleted: string;
    uploadFailedGeneric: string;
    dataFetchFailed: string;
    notificationSent: string;
    notificationFailed: string;
    notificationError: string;
    dataUpdated: string;
  };
  filter: {
    userName: {
      placeholder: string;
      ariaLabel: string;
    };
    policyName: {
      placeholder: string;
      ariaLabel: string;
    };
    dateRange: {
      label: string;
      startDate: {
        placeholder: string;
        ariaLabel: string;
      };
      endDate: {
        placeholder: string;
        ariaLabel: string;
      };
      separator: string;
    };
    minUsage: {
      label: string;
      placeholder: string;
      ariaLabel: string;
    };
    maxUsage: {
      label: string;
      placeholder: string;
      ariaLabel: string;
    };
    reset: string;
    rangeSeparator: string;
    refresh: string;
    deleteSelected: string;
  };
  policy: {
    select: string;
    none: string;
    create: string;
    noPolicies: string;
    createPolicy: string;
  };
  deleteDialog: {
    title: string;
    warn1: string;
    warn2: string;
    warn3: string;
    warn4: string;
    confirm: string;
    cancel: string;
    delete: string;
  };
  limitUsage: {
    title: string;
    status: {
      normal: string;
      warning: string;
      exceeded: string;
    };
    current: string;
    limit: string;
    noLimit: string;
    exceedAction: {
      notify: string;
      restrict: string;
    };
    testNotification: string;
    limitTypes: {
      usage: string;
      amount: string;
    };
    unknownCompany: string;
  };
  tableEmpty: string;
  pagination: {
    prev: string;
    next: string;
  };
  displayCount: string;
  processingHistory: {
    title: string;
    count: string;
    refresh: string;
    empty: string;
    emptyDescription: string;
    noDownloadableFiles: string;
    noOutputFiles: string;
    downloadFailed: string;
    aiTrainingUpdateFailed: string;
    fileExpiredTooltip: string;
    unknownUser: string;
    allow: string;
    deny: string;
    columns: {
      policy: string;
      user: string;
      status: string;
      startTime: string;
      fileSize: string;
      aiTraining: string;
      errorDetail: string;
      download: string;
    };
  };
};
