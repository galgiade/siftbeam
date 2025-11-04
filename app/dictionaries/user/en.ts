import type { UserProfileLocale } from './user.d.ts';

const en: UserProfileLocale = {
  alert: {
    updateSuccess: "User information updated successfully.",
    updateFail: "Failed to update user information.",
    updateError: "An error occurred during the update process.",
    fieldUpdateSuccess: "{field} has been successfully updated.",
    fieldUpdateFail: "Failed to update {field}.",
    emailSent: "A confirmation code has been sent to your new email address.",
    emailUpdateSuccess: "Email address updated successfully.",
    emailUpdateFail: "Failed to update email address.",
    dbUpdateFail: "Failed to update database.",
    dbUpdateError: "Database update failed",
    confirmFail: "The confirmation code is incorrect or database update failed.",
    invalidConfirmationCode: "The confirmation code is incorrect. Please enter the correct 6-digit code.",
    expiredConfirmationCode: "The confirmation code has expired. Please request a new code.",
    noEmailChange: "No changes to email address.",
    invalidEmailFormat: "Invalid email format. Please enter a valid email address.",
    noChange: "No changes to username.",
    invalidConfirmationCodeFormat: "Please enter a 6-digit confirmation code.",
    verificationCodeNotFound: "Verification code not found or expired",
    remainingAttempts: "Remaining attempts",
    verificationCodeStoreFailed: "Failed to store verification code. Please check IAM permissions.",
    codeStoreFailed: "Failed to save code.",
    adminOnlyEdit: "Only administrators can edit this field.",
    validEmailRequired: "Please enter a valid email address."
  },
  label: {
    title: "User Information",
    userName: "User Name",
    department: "Department",
    position: "Position",
    email: "Email Address",
    locale: "Language",
    role: "Role",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    adminOnly: "(Admin only)",
    readOnly: "(Read-only)",
    editableFields: "Editable: Username, Language",
    adminOnlyFields: "Admin only: Email, Department, Position",
    allFieldsEditable: "All fields are editable",
    newEmailSent: "Verification code sent to new email \"{email}\".",
    roleAdmin: "Administrator",
    roleUser: "User",
    lastAdminRestriction: "Role change is restricted if you are the last administrator",
    lastAdminNote: "※ If there is only one administrator in the organization, the role cannot be changed to a regular user.",
    generalUserPermission: "General User Permission",
    adminPermission: "Administrator Permission",
    verifyAndUpdate: "Verify and Update",
    verificationCodePlaceholder: "Verification Code (6 digits)"
  },
  modal: {
    modalTitle: "Email Confirmation",
    description: "Please enter the confirmation code sent to your new email address ({email}).",
    codeLabel: "Confirmation Code",
    cancel: "Cancel",
    confirm: "Confirm",
    resend: "Resend",
    verifying: "Verifying..."
  }
} 

export default en;