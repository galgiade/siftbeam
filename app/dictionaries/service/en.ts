import type { ServiceLocale } from './ServiceLocale.d.ts';

const en: ServiceLocale = {
  page: {
    title: "Services",
    description:
      "Select a policy, upload files, and run processing. Processed data is stored for free for one year.",
    loading: "Loading..."
  },
  error: {
    title: "An error occurred",
    loginRequired: "Login is required.",
    processingHistoryFetchFailed: "Failed to fetch processing history.",
    policiesFetchFailed: "Failed to fetch policies.",
    usageLimitsFetchFailed: "Failed to fetch usage limits.",
    pageLoadFailed: "Failed to load the service page.",
    suggestion1: "Please reload the page.",
    suggestion2: "If the problem persists, contact support."
  },
  limits: {
    notifyLimit: {
      title: "Notification Limits",
      limitValue: "Limit value:",
      exceedAction: "Action when exceeded:",
      currentUsage: "Current usage:",
      notSet: "No notification limits configured",
      currentUsageLabel: "Current usage:",
      settingsCount: "Notification limits configured: {count}",
      dataLimit: "Data limit: {value} {unit} ({bytes})",
      amountLimit: "Amount limit: ${amount}",
      noLimitValue: "No limit value set",
      amountConversionNote:
        "Note: Amount limits are shown converted to data usage (processing fee: $0.00001/Byte, includes 1 year of storage)."
    },
    restrictLimit: {
      title: "Suspension Limits",
      limitValue: "Limit value:",
      exceedAction: "Action when exceeded:",
      currentUsage: "Current usage:",
      notSet: "No suspension limits configured",
      currentUsageLabel: "Current usage:",
      settingsCount: "Suspension limits configured: {count}",
      dataLimit: "Data limit: {value} {unit} ({bytes})",
      amountLimit: "Amount limit: ${amount}",
      noLimitValue: "No limit value set",
      amountConversionNote:
        "Note: Amount limits are shown converted to data usage (processing fee: $0.00001/Byte, includes 1 year of storage)."
    },
    perMonth: "/month",
    notifyAction: "Notify",
    restrictAction: "Suspend"
  },
  policySelection: {
    title: "Policy Selection",
    label: "Select a processing policy",
    placeholder: "Select a policy",
    noPolicies: "No policies available"
  },
  fileUpload: {
    title: "File Upload",
    selectPolicyFirst: "Select a policy first",
    noPoliciesAvailable: "No policies available",
    dragAndDrop: "Drag & drop files",
    orClickToSelect: "or click to select",
    maxFiles: "Up to {max} files, each up to 100 MB",
    supportedFormats: "Supported formats: use the formats specified in {formats}",
    selectedFiles: "Selected files ({count}/{max})",
    deleteAll: "Delete All",
    fileSizeLimit: "{name} is too large. Please select a file that is 100 MB or smaller.",
    pending: "Pending",
    uploading: "Uploading",
    completed: "Completed",
    error: "Error",
    startProcessing: "Start Processing",
    processing: "Starting processing...",
    uploadComplete: "Upload Complete",
    uploadCompletedMessage: "Finished uploading {count} files and started AI processing!",
    uploadNotAllowed: "Upload Not Allowed",
    notifyLimitReached: "Notification limit reached",
    notifyLimitReachedMessage: "Notification limit ({limit}) reached. Sent {count} notification emails."
  },
  table: {
    id: "ID",
    userName: "User Name",
    policyName: "Policy Name",
    usageAmountBytes: "Usage",
    status: "Status",
    errorDetail: "Error",
    createdAt: "Start Date",
    updatedAt: "Update Date",
    download: "Download",
    aiTraining: "AI Training",
    delete: "Delete",
    ariaLabel: "Data processing history table"
  },
  status: {
    in_progress: "In Progress",
    success: "Completed",
    failed: "Failed",
    canceled: "Canceled",
    deleted: "Deleted",
    delete_failed: "Delete Failed"
  },
  notification: {
    uploadSuccess: "File upload completed. Starting data processing.",
    uploadError: "Upload failed.",
    uploadProcessingError: "An error occurred during upload processing.",
    uploadFailed: "File upload failed. Please try again.",
    fetchFailed: "Failed to fetch data.",
    aiTrainingChanged: "AI training permission has been changed.",
    deleteCompleted: "File deletion completed.",
    uploadCompleted: "Upload completed.",
    uploadFailedGeneric: "Upload failed.",
    dataFetchFailed: "Failed to fetch data.",
    notificationSent: "Notification email sent.",
    notificationFailed: "Failed to send notification.",
    notificationError: "An error occurred while sending the notification.",
    dataUpdated: "Data updated."
  },
  filter: {
    userName: {
      placeholder: "Search by user name",
      ariaLabel: "User name search"
    },
    policyName: {
      placeholder: "Search by policy name",
      ariaLabel: "Policy name search"
    },
    dateRange: {
      label: "Date range",
      startDate: {
        placeholder: "Start date",
        ariaLabel: "Start date selection"
      },
      endDate: {
        placeholder: "End date",
        ariaLabel: "End date selection"
      },
      separator: "~"
    },
    minUsage: {
      label: "Minimum usage",
      placeholder: "Min",
      ariaLabel: "Minimum usage"
    },
    maxUsage: {
      label: "Maximum usage",
      placeholder: "Max",
      ariaLabel: "Maximum usage"
    },
    reset: "Reset Filters",
    rangeSeparator: "~",
    refresh: "Refresh data",
    deleteSelected: "Delete selected items"
  },
  policy: {
    select: "Select Policy",
    none: "No policies have been created.",
    create: "Create Policy",
    noPolicies: "No policies have been created.",
    createPolicy: "Create Policy"
  },
  deleteDialog: {
    title: "Delete Confirmation",
    warn1: "The selected files will be permanently deleted.",
    warn2: "Once deleted, processed files can no longer be downloaded.",
    warn3: "They also cannot be used for AI training.",
    warn4: "This action cannot be undone. Please be careful.",
    confirm: "Are you sure you want to delete? Type 'DELETE'.",
    cancel: "Cancel",
    delete: "Delete"
  },
  limitUsage: {
    title: "Usage Limit Status",
    status: {
      normal: "Normal",
      warning: "Warning",
      exceeded: "Exceeded"
    },
    current: "Current:",
    limit: "Limit:",
    noLimit: "No limit",
    exceedAction: {
      notify: "Notify",
      restrict: "Restrict"
    },
    testNotification: "Send test notification",
    limitTypes: {
      usage: "Usage limit",
      amount: "Amount limit"
    },
    unknownCompany: "Unknown Company"
  },
  tableEmpty: "No data processing history.",
  pagination: {
    prev: "Previous",
    next: "Next"
  },
  displayCount: "Showing {shown} of {total} (Total {all})",
  processingHistory: {
    title: "Processing History",
    count: "({count} items)",
    refresh: "Refresh",
    empty: "No processing history.",
    emptyDescription: "Upload files and start processing to display history here.",
    noDownloadableFiles: "No downloadable files.",
    noOutputFiles: "No downloadable output files.",
    downloadFailed: "Failed to download.",
    aiTrainingUpdateFailed: "Failed to update AI training usage.",
    fileExpiredTooltip: "File was deleted after exceeding the storage period (1 year).",
    unknownUser: "Unknown User",
    allow: "Allow",
    deny: "Deny",
    columns: {
      policy: "Policy",
      user: "User",
      status: "Status",
      startTime: "Start Time",
      fileSize: "File Size",
      aiTraining: "AI Training Usage",
      errorDetail: "Error Detail",
      download: "Download"
    }
  }
};

export default en;