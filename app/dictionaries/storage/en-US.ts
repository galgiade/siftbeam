export default {
  "table": {
    "id": "ID",
    "userName": "User Name",
    "policyName": "Policy Name",
    "usageAmountBytes": "Usage",
    "status": "Status",
    "errorDetail": "Error",
    "createdAt": "Start Date",
    "updatedAt": "Update Date",
    "download": "Download",
    "aiTraining": "AI Training",
    "delete": "Delete",
    "ariaLabel": "Data processing history table"
  },
  "status": {
    "in_progress": "In Progress",
    "success": "Completed",
    "failed": "Failed",
    "canceled": "Canceled",
    "deleted": "Deleted",
    "delete_failed": "Delete Failed"
  },
  "notification": {
    "uploadSuccess": "File upload completed. Data processing will start.",
    "uploadError": "Upload failed.",
    "uploadProcessingError": "An error occurred during upload processing.",
    "uploadFailed": "File upload failed. Please try again.",
    "fetchFailed": "Failed to fetch data.",
    "aiTrainingChanged": "AI training permission has been changed.",
    "deleteCompleted": "File deletion completed.",
    "uploadCompleted": "Upload completed.",
    "uploadFailedGeneric": "Upload failed.",
    "dataFetchFailed": "Failed to fetch data.",
    "notificationSent": "Notification email sent successfully.",
    "notificationFailed": "Failed to send notification.",
    "notificationError": "An error occurred while sending notification.",
    "dataUpdated": "Data updated successfully."
  },
  "filter": {
    "userName": {
      "placeholder": "Search by user name",
      "ariaLabel": "User name search"
    },
    "policyName": {
      "placeholder": "Search by policy name",
      "ariaLabel": "Policy name search"
    },
    "dateRange": {
      "label": "Date range",
      "startDate": {
        "placeholder": "Start date",
        "ariaLabel": "Start date selection"
      },
      "endDate": {
        "placeholder": "End date",
        "ariaLabel": "End date selection"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "Min Usage",
      "placeholder": "Min",
      "ariaLabel": "Minimum usage"
    },
    "maxUsage": {
      "label": "Max Usage",
      "placeholder": "Max",
      "ariaLabel": "Maximum usage"
    },
    "reset": "Reset Filters",
    "rangeSeparator": "~",
    "refresh": "Refresh data",
    "deleteSelected": "Delete selected items"
  },
  "policy": {
    "select": "Select Policy",
    "none": "No policies have been created.",
    "create": "Create Policy",
    "noPolicies": "No policies have been created.",
    "createPolicy": "Create Policy"
  },
  "deleteDialog": {
    "title": "Delete Confirmation",
    "warn1": "The selected files will be permanently deleted.",
    "warn2": "Once deleted, processed files cannot be downloaded.",
    "warn3": "Also, they cannot be used for AI training.",
    "warn4": "This action cannot be undone. Please be careful.",
    "confirm": "Are you sure you want to delete? Please type 'DELETE'.",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "limitUsage": {
    "title": "Usage Limit Status",
    "status": {
      "normal": "Normal",
      "warning": "Warning",
      "exceeded": "Exceeded"
    },
    "current": "Current:",
    "limit": "Limit:",
    "noLimit": "No Limit",
    "exceedAction": {
      "notify": "Notify",
      "restrict": "Restrict"
    },
    "testNotification": "Send Test Notification",
    "limitTypes": {
      "usage": "Usage Limit",
      "amount": "Amount Limit"
    },
    "unknownCompany": "Unknown Company"
  },
  "tableEmpty": "No data processing history.",
  "pagination": {
    "prev": "Previous",
    "next": "Next"
  },
  "displayCount": "Showing {shown} of {total} (All {all})"
} as const;


