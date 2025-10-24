export default {
  "label": {
    "policyList": "Policy List",
    "policyNotRegistered": "No policies registered",
    "policyName": "Policy Name",
    "policyNamePlaceholder": "Policy Name",
    "description": "Policy Description",
    "descriptionPlaceholder": "Policy Description",
    "allowedFileTypes": "Allowed File Types:",
    "selectFileTypes": "Select File Types (Multiple)",
    "fileTypes": {
      "image/jpeg": "JPEG Image",
      "image/png": "PNG Image",
      "image/gif": "GIF Image",
      "image/webp": "WebP Image",
      "application/pdf": "PDF File",
      "text/csv": "CSV File",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel File (.xlsx)",
      "application/vnd.ms-excel": "Excel File (.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word File (.docx)",
      "application/msword": "Word File (.doc)",
      "text/plain": "Text File",
      "application/json": "JSON File",
      "application/zip": "ZIP Archive"
    }
  },
  "alert": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "fileTypeRequired": "Please select at least one file type",
    "adminOnlyEditMessage": "Only administrators can edit policies. You do not have permission to edit.",
    "adminOnlyCreateMessage": "Only administrators can create policies. Please contact your administrator.",
    "updateSuccess": "Policy updated successfully",
    "updateFailed": "Failed to update policy",
    "validationError": "Please check your input"
  },
  "analysis": {
    "title": "Analysis",
    "description": "Model × Dataset evaluation results",
    "noDataMessage": "No analysis data available",
    "noDataForPolicyMessage": "No analysis data available for the selected policy",
    "paginationAriaLabel": "Pagination",
    "displayCount": "Display",
    "columns": {
      "evaluationDate": "Evaluation Date",
      "policy": "Policy",
      "accuracy": "Accuracy",
      "defectDetectionRate": "Defect Detection Rate",
      "reliability": "Reliability",
      "responseTime": "Response Time",
      "stability": "Stability",
      "actions": "Actions"
    },
    "actions": {
      "view": "View"
    }
  }
} as const;


