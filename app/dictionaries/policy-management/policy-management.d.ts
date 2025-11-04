export type PolicyManagementLocale = {
  label: {
    policyList: string;
    policyNotRegistered: string;
    policyName: string;
    policyNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    allowedFileTypes: string;
    selectFileTypes: string;
    fileTypes: {
      [key: string]: string;
    };
    policyManagement: string;
    errorOccurred: string;
    contactAdmin: string;
    reloadPage: string;
    goBack: string;
    createNewPolicy: string;
    requiredField: string;
    allowedFileTypesLabel: string;
    selectFileTypesPlaceholder: string;
    cancel: string;
    createPolicy: string;
    detailedError: string;
    debugInfo: string;
    policyCount: string; // {count}
    searchPlaceholder: string;
    noPoliciesFound: string;
    fileTypeCount: string; // {count}
    editingPolicy: string; // {policyName}
    selectPolicy: string;
    selectPolicyPrompt: string;
    readOnly: string;
    notSet: string;
    policyInfo: string;
    createdAt: string;
    updatedAt: string;
    policyId: string;
    fileTypeRestriction: string;
    performanceAnalysisTitle: string; // {policyName}
    analysisCount: string; // {count}
    error: string;
    success: string;
    aiPerformanceAnalysis: string;
    noAnalysisResults: string;
    noAnalysisYet: string;
    startAnalysisPrompt: string;
    analysisDate: string;
    modelUsed: string;
    status: string;
    top1Accuracy: string;
    defectDetectionRate: string;
    f1Score: string;
    latencyP95: string;
    errorRate: string;
    report: string;
    usageStatus: string;
    viewReport: string;
    inUse: string;
    select: string;
    deletePolicy: string;
    confirmDelete: string; // {policyName}
    cannotUndo: string;
    delete: string;
    statusPending: string;
    statusRunning: string;
    statusCompleted: string;
    statusFailed: string;
    statusCancelled: string;
    analysisStarted: string;
    analysisStartFailed: string;
    analysisStartError: string;
    analysisSwitched: string;
    analysisSwitchFailed: string;
    analysisSwitchError: string;
  };
  alert: {
    required: string;
    invalidEmail: string;
    fileTypeRequired: string;
    adminOnlyEditMessage: string;
    adminOnlyCreateMessage: string;
    updateSuccess: string;
    updateFailed: string;
    validationError: string;
    fieldUpdateSuccess: string; // {fieldName}
    fieldUpdateFail: string; // {fieldName}
    updateError: string;
    fieldRequired: string; // {fieldLabel}
    policyNotSelected: string;
    selectPolicyAndModel: string;
    accessDenied: string;
    fetchPoliciesFailed: string;
    errorLabel: string;
    customerIdLabel: string;
    timestampLabel: string;
    detailedErrorLabel: string;
    authError: string;
    errorType: string;
    localeLabel: string;
    stackTrace: string;
    unknownError: string;
    noStackTrace: string;
    policyNameRequired: string;
    descriptionRequired: string;
    fileTypeSelectionRequired: string;
    formSubmissionError: string;
  };
  analysis: {
    title: string;
    description: string;
    noDataMessage: string;
    noDataForPolicyMessage: string;
    paginationAriaLabel: string;
    displayCount: string;
    columns: {
      evaluationDate: string;
      policy: string;
      accuracy: string;
      defectDetectionRate: string;
      reliability: string;
      responseTime: string;
      stability: string;
      actions: string;
    };
    actions: {
      view: string;
    };
  };
};
