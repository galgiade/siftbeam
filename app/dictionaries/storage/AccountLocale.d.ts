export type StorageLocale = {
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
};
