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
