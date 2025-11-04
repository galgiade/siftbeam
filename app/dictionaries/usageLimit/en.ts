import type { UsageLimitLocale } from './usage-limit.d.ts';

const en: UsageLimitLocale = {
  label: {
    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    add: "Add",
    create: "Create",
    creating: "Saving...",
    update: "Update",
    
    // Create page
    createUsageLimitTitle: "Create Usage Limit",
    createUsageLimitDescription: "Configure limits for data processing volume or spending, and select the action to take when exceeded.",
    usageLimitSettings: "Usage Limit Settings",
    exceedActionTitle: "Action on Exceed",
    selectAction: "Select action",
    notifyOnlyOption: "Notify Only",
    restrictOption: "Suspend Service",
    notifyOnlyDescription: "A notification email will be sent when the limit is exceeded. Service will continue to be available.",
    restrictDescription: "Service will be suspended when the limit is exceeded. A notification email will also be sent.",
    limitTypeTitle: "Limit Type",
    dataLimitOption: "Data Limit",
    amountLimitOption: "Amount Limit",
    dataLimitDescription: "Set limit based on data processing volume (MB/GB/TB).",
    amountLimitDescription: "Set limit based on processing cost (USD).",
    dataLimitTitle: "Data Limit Value",
    enterLimitValue: "Enter limit value (e.g., 100)",
    unit: "Unit",
    monthlyDataLimitDescription: "Action will be executed when monthly data processing volume exceeds this value.",
    amountLimitTitle: "Amount Limit Value",
    enterAmountValue: "Enter limit value (e.g., 50)",
    monthlyAmountLimitDescription: "Action will be executed when monthly processing cost exceeds this amount.",
    notificationSettingsTitle: "Notification Settings",
    enterEmailPlaceholder: "Enter email address (e.g., example@company.com)",
    notificationEmailList: "Notification Email Addresses",
    notificationEmailCount: "Notification Email Addresses ({count})",
    notifyOnlyEmailDescription: "When the limit is exceeded, a notification will be sent to the email addresses configured here.",
    restrictEmailDescription: "When the limit is exceeded, the service will be suspended and a notification will be sent to the email addresses configured here.",
    cancelButton: "Cancel",
    createNotifyLimit: "Create Notification Limit",
    createRestrictLimit: "Create Restriction Limit",
    processingFeeOnly: "processing fee only",
    conversionApproximate: "≈",

    // Main screen
    limitUsageTitle: "Usage Limits",
    usageLimitManagement: "Usage Limit Management",
    usageLimitDescription: "Configure limits for data usage and spending, and manage the actions taken when they are exceeded.",
    createLimit: "Create Limit",
    notificationTarget: "Notification Target",
    detail: "Details",
    createdAt: "Created At",
    updatedAt: "Updated At",
    limitValue: "Limit Value",
    notificationRecipients: "Notification Recipients",

    // Notification types
    notify: "Notify",
    restrict: "Suspend",
    exceedAction: "Action on Exceed",
    notifyOnly: "Notify Only",
    notifyLimit: "Notification Limit",
    restrictLimit: "Restriction Limit",
    notifyLimitDescription: "When set, a notification is sent once the usage exceeds the limit.",
    restrictLimitDescription: "When set, service access is suspended once the usage exceeds the limit.",
    noNotifyLimits: "No notification limits configured",
    noRestrictLimits: "No restriction limits configured",

    // Amount & usage
    amount: "Amount",
    usage: "Usage",
    editTarget: "Edit Target",
    limitType: "Limit Type",
    selectLimitType: "Select limit type",
    dataLimitValue: "Data limit value",
    amountLimitValue: "Amount limit value (USD)",
    dataLimitPlaceholder: "e.g., 100",
    amountLimitPlaceholder: "e.g., 50",
    orSeparator: "or",
    noLimit: "No limit",

    // Recipient management
    recipients: "Recipients",
    emailAddress: "Email address",
    emailPlaceholder: "Enter an email address",
    noRecipientsRegistered: "No notification recipients registered",
    addEmailAddress: "Notification email address",
    minOneEmailRequired: "At least one notification email address is required.",

    // Create / Edit
    usageNotification: "Usage notification",
    selectNotifyOrRestrict: "Choose notification or restriction",
    selectNotificationMethod: "Select a notification method",
    amountBasedNotification: "Amount-based notification",
    usageBasedNotification: "Usage-based notification",
    enterAmount: "Enter amount",
    enterUsage: "Enter usage",
    addNewRecipient: "Add new recipient",
    usageConversion: "Usage conversion",
    amountConversion: "Amount conversion",
    createNewLimit: "Create new usage limit",
    editLimit: "Edit usage limit",
    dataLimit: "Data limit",
    amountLimit: "Amount limit",

    // Units
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // Error screen
    errorOccurred: "An error occurred",
    contactSupport: "If the issue persists, please contact support."
  },
  alert: {
    // Validation
    amountRequired: "Please enter the usage amount",
    usageRequired: "Please enter the usage volume",
    emailRequired: "Please enter an email address",
    invalidEmail: "Please enter a valid email address.",
    enterPositiveAmount: "Enter a number greater than or equal to 0",
    enterValidUsage: "Enter a number greater than 0 and less than 1024",
    enterPositiveDataLimit: "Data limit must be greater than 0.",
    enterPositiveAmountLimit: "Amount limit must be greater than 0.",
    emailAlreadyAdded: "This email address has already been added.",
    minOneEmail: "At least one notification email address is required.",
    selectExceedAction: "Please select an action on exceed.",
    selectLimitType: "Please select a limit type.",
    dataLimitValueRequired: "Data limit value must be greater than 0.",
    dataLimitValueMax: "Data limit value must be 1,000,000 or less.",
    amountLimitValueRequired: "Amount limit value must be greater than 0.",
    amountLimitValueMax: "Amount limit value must be 100,000 or less.",
    minOneEmailRequired: "Please enter at least one notification email address.",
    notifyLimitCreated: "Notification limit was created successfully.",
    restrictLimitCreated: "Restriction limit was created successfully.",
    errorPrefix: "Error:",
    unexpectedError: "An unexpected error occurred:",

    // Operation results
    createFailed: "Failed to create usage limit.",
    updateFailed: "Failed to update usage limit.",
    sendingError: "An error occurred while sending.",
    savingInProgress: "Saving...",
    createSuccess: "Usage limit was created successfully.",
    updateSuccess: "Usage limit was updated successfully.",
    deleteSuccess: "Usage limit was deleted successfully.",
    deleteConfirm: "Delete this usage limit?",

    // Permissions
    adminOnlyCreateMessage: "Only administrators can create usage limits. Please contact your administrator.",
    adminOnlyEditMessage: "Only administrators can edit usage limits. You do not have permission.",
    adminOnlyDeleteMessage: "Only administrators can delete usage limits. You do not have permission.",

    // Errors
    loginRequired: "Login is required.",
    unknownError: "An unknown error occurred."
  }
};

export default en;