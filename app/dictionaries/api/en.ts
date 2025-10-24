const en = {
  "errors": {
    "general": {
      "serverError": "A server error occurred",
      "networkError": "A network error occurred",
      "unauthorized": "Authentication required",
      "forbidden": "Access denied",
      "notFound": "Resource not found",
      "validationError": "Invalid input data",
      "conflict": "Data conflict occurred",
      "unexpectedError": "An unexpected error occurred",
      "unknownError": "An unknown error occurred",
      "targetNotFound": "Target for update not found",
      "operationFailed": "Operation execution failed",
      "processingError": "An error occurred during processing",
      "relatedResourceDeleteError": "An error occurred while deleting related resources",
      "partialOperationFailed": "Some operations failed",
      "rollbackFailed": "Rollback process failed"
    },
    "auth": {
      "notAuthenticated": "Not authenticated",
      "insufficientPermissions": "Insufficient permissions",
      "accessDenied": "Access denied",
      "companyNotSet": "Company information not set",
      "adminRightsRequired": "Administrator rights required",
      "adminPermissionRequired": "Administrator permission required",
      "codeIncorrect": "Verification code is incorrect",
      "codeExpired": "Verification code has expired",
      "userNotFound": "User not found",
      "signInFailed": "Sign in failed",
      "credentialsIncorrect": "Email address or password is incorrect",
      "accountNotConfirmed": "Account not confirmed. Please complete email verification",
      "passwordResetRequired": "Password reset required",
      "userNotAuthenticated": "User not authenticated",
      "getCurrentUserFailed": "Failed to get current user",
      "missingParameters": "Missing required parameters: userId, email",
      "check2FAStatusFailed": "Failed to check 2FA status",
      "missingEmailParameters": "Missing required parameters: userId, newEmail, userPoolId",
      "invalidEmailFormat": "Invalid email format",
      "cognitoEmailUpdateSuccess": "Cognito email updated successfully",
      "cognitoEmailUpdateFailed": "Failed to update Cognito email",
      "userNotFoundInCognito": "User not found in Cognito",
      "invalidEmailOrUserId": "Invalid email format or user ID",
      "notAuthorizedToUpdateUser": "Not authorized to update user",
      "missingUsernameParameters": "Missing required parameters: userId, newUsername, userPoolId",
      "invalidUsernameFormat": "Invalid username format",
      "cognitoUsernameUpdateSuccess": "Cognito username updated successfully",
      "cognitoUsernameUpdateFailed": "Failed to update Cognito username",
      "invalidUsernameOrUserId": "Invalid username format or user ID",
      "usernameAlreadyExists": "Username already exists",
      "missingVerificationParameters": "Missing required parameters: userId, email, code, userPoolId",
      "verificationCodeNotFound": "Verification code not found or expired",
      "verificationCodeExpired": "Verification code has expired",
      "tooManyFailedAttempts": "Too many failed attempts",
      "invalidVerificationCode": "Invalid verification code",
      "emailVerificationSuccess": "Email verification successful and Cognito updated",
      "emailVerificationFailed": "Failed to verify email code",
      "missingStoreParameters": "Missing required parameters: userId, email, code, userType",
      "verificationCodeStoredSuccess": "Verification code stored successfully",
      "verificationCodeStoreFailed": "Failed to store verification code"
    },
    "validation": {
      "userIdRequired": "User ID is required",
      "customerIdRequired": "Customer ID is required",
      "groupIdRequired": "Group ID is required",
      "policyIdRequired": "Policy ID is required",
      "supportRequestIdRequired": "Support request ID is required",
      "newOrderRequestIdRequired": "New order request ID is required",
      "statusRequired": "Status is required",
      "userGroupIdRequired": "User group ID is required",
      "groupIdRequiredForValidation": "Group ID is required",
      "userIdRequiredForValidation": "User ID is required",
      "fieldRequired": "This field is required",
      "validEmailRequired": "Please enter a valid email address",
      "minLength": "Minimum {count} characters required",
      "maxLength": "Maximum {count} characters allowed",
      "passwordMinLength": "Password must be at least 8 characters",
      "passwordUppercase": "Must include uppercase letters",
      "passwordLowercase": "Must include lowercase letters",
      "passwordNumber": "Must include numbers",
      "passwordSpecialChar": "Must include special characters",
      "passwordMismatch": "Passwords do not match",
      "userNameRequired": "User name is required",
      "emailRequired": "Email is required",
      "companyIdRequired": "Company ID is required",
      "departmentRequired": "Department is required",
      "positionRequired": "Position is required",
      "roleRequired": "Role is required",
      "usageMinZero": "Usage must be 0 or greater",
      "positiveNumber": "Must be a positive value",
      "nonNegativeNumber": "Must be 0 or greater",
      "invalidEmail": "Please enter a valid email address",
      "required": "This field is required",
      // 配列バリデーション
      "policyIdsMinOne": "Please select at least one policy",
      "userIdsMinOne": "Please select at least one user",
      "emailsMinOne": "Please specify at least one email address",
      "emailsValid": "Please enter a valid email address",
      // Enum バリデーション
      "invalidExceedAction": "Please select notify or restrict for exceed action",
      "invalidNotifyType": "Please select amount or usage for notification method",
      "invalidUnit": "Please select KB, MB, GB, or TB for unit",
      "invalidAiTrainingUsage": "Please select allow or deny for AI training usage",
      "invalidStatus": "Please select OPEN, IN_PROGRESS, or CLOSED for status",
      "invalidIssueType": "Please select technical, account, billing, or other for issue type",
      "invalidAction": "Please select READ, CREATE, UPDATE, DELETE, ATTACH, or DETACH for action",
      "invalidResource": "Invalid resource type",
      "invalidDataType": "Please select table, image, or text for data type",
      "invalidModelType": "Please select clustering, prediction, or classification for model type",
      // Refine バリデーション
      "notifyTypeAmountRequired": "Please enter amount or usage according to notification method",
      "notifyTypeUsageRequired": "Unit selection (KB, MB, GB, TB) is required when selecting usage notification",
      "usageUnitRequired": "Unit selection (KB, MB, GB, TB) is required when selecting usage notification",
      // フィールド固有バリデーション
      "companyNameRequired": "Company name is required",
      "stateRequired": "State is required",
      "cityRequired": "City is required",
      "streetAddressRequired": "Street address is required",
      "groupNameRequired": "Group name is required",
      "policyNameRequired": "Policy name is required",
      "subjectRequired": "Subject is required",
      "descriptionRequired": "Description is required",
      "messageRequired": "Message is required",
      "resourceNameRequired": "Resource name is required",
      "preferredUsernameRequired": "Username is required",
      "localeRequired": "Locale is required",
      "confirmationCodeRequired": "Confirmation code is required",
      "challengeResponseRequired": "Challenge response is required",
      "limitUsageIdRequired": "Limit usage ID is required",
      "isStaffInvalid": "Staff flag must be a boolean value"
    },
    "user": {
      "fetchFailed": "Failed to fetch user information",
      "accessDenied": "Access denied to this user information",
      "notFound": "User not found",
      "companyAccessDenied": "Access denied to this company's user information",
      "batchFetchFailed": "Error occurred while fetching multiple user information",
      "updateFailed": "Failed to update user information",
      "createFailed": "Failed to create user",
      "deleteFailed": "Failed to delete user",
      "userGroupFetchFailed": "Failed to fetch user group information",
      "userGroupDeleteFailed": "Failed to delete user group",
      "rollbackFailed": "Failed to rollback deletion process",
      "noUpdateFields": "No update fields specified",
      "updateError": "An error occurred while updating user",
      "userNameEmpty": "Username cannot be empty",
      "emailEmpty": "Email cannot be empty",
      "departmentEmpty": "Department cannot be empty",
      "positionEmpty": "Position cannot be empty",
      "roleEmpty": "Role cannot be empty",
      "fieldRequired": "{field} is required"
    },
    "policy": {
      "fetchFailed": "Failed to fetch policy information",
      "accessDenied": "Access denied to this policy information",
      "batchFetchFailed": "Error occurred while fetching multiple customer policy information",
      "createFailed": "Failed to create policy",
      "updateFailed": "Failed to update policy",
      "deleteFailed": "Failed to delete policy",
      "idRequired": "Valid policy ID is required",
      "notFound": "Specified policy not found",
      "noUpdateFields": "No update fields specified",
      "updateError": "An error occurred while updating policy"
    },
    "group": {
      "fetchFailed": "Failed to fetch group",
      "accessDenied": "Access denied",
      "listFetchFailed": "Failed to fetch group list",
      "updateFailed": "Failed to update group",
      "createFailed": "Failed to create group",
      "deleteFailed": "Failed to delete group",
      "userGroupDeleteFailed": "Failed to delete user group",
      "groupPolicyDeleteFailed": "Failed to delete group policy",
      "rollbackFailed": "Failed to rollback deletion process"
    },
    "userGroup": {
      "fetchFailed": "Failed to fetch user group information",
      "accessDenied": "Access denied to this user group information",
      "batchFetchFailed": "Error occurred while fetching multiple user group information",
      "companyFetchFailed": "Failed to fetch user group information based on customer ID",
      "groupFetchFailed": "Failed to fetch user group information based on group ID",
      "userFetchFailed": "Failed to fetch user group information based on user ID",
      "membershipCheckFailed": "Failed to check user group membership",
      "createFailed": "Failed to create user group",
      "updateFailed": "Failed to update user group",
      "deleteFailed": "Failed to delete user group",
      "noUpdateFields": "No update fields specified",
      "updateError": "An error occurred while updating user group"
    },
    "groupPolicy": {
      "fetchFailed": "Failed to fetch group policy information",
      "accessDenied": "Access denied to this group policy information",
      "batchFetchFailed": "Error occurred while fetching multiple group policy information",
      "policyFetchFailed": "Failed to fetch group policy information based on policy ID",
      "groupFetchFailed": "Failed to fetch group policy information based on group ID",
      "createFailed": "Failed to create group policy",
      "deleteFailed": "Failed to delete group policy"
    },
    "supportRequest": {
      "fetchFailed": "Failed to fetch support request information",
      "accessDenied": "Access denied to this support request information",
      "notFound": "Support request with specified ID not found",
      "otherCompanyAccessDenied": "Access denied to other company's support request information",
      "userAccessDenied": "Access denied to this user's support request information",
      "batchFetchFailed": "Error occurred while fetching multiple support request information",
      "statusBatchFetchFailed": "Error occurred while fetching multiple status support request information",
      "userBatchFetchFailed": "Error occurred while fetching multiple user support request information",
      "customerBatchFetchFailed": "Error occurred while fetching multiple customer support request information",
      "createFailed": "Failed to create support request",
      "updateFailed": "Failed to update support request",
      "deleteFailed": "Failed to delete support request",
      "validationError": "There is a problem with the support request input",
      "updateError": "An error occurred while updating support request",
      "noUpdateFields": "No update fields specified"
    },
    "supportReply": {
      "fetchFailed": "Failed to fetch support reply information",
      "accessDenied": "Access denied to this support reply information",
      "createFailed": "Failed to create support reply",
      "updateFailed": "Failed to update support reply",
      "deleteFailed": "Failed to delete support reply",
      "notFound": "Support reply with specified ID not found",
      "updateError": "An error occurred while updating support reply",
      "noUpdateFields": "No update fields specified"
    },
    "newOrder": {
      "fetchFailed": "Failed to fetch new order information",
      "accessDenied": "Access denied to this new order information",
      "notFound": "New order with specified ID not found",
      "otherCompanyAccessDenied": "Access denied to other company's new order information",
      "batchFetchFailed": "Error occurred while fetching multiple new order information",
      "customerBatchFetchFailed": "Error occurred while fetching multiple customer new order information"
    },
    "newOrderRequest": {
      "createFailed": "Failed to create new order request",
      "updateFailed": "Failed to update new order request",
      "deleteFailed": "Failed to delete new order request"
    },
    "newOrderReply": {
      "fetchFailed": "Failed to fetch new order reply information",
      "createFailed": "Failed to create new order reply",
      "updateFailed": "Failed to update new order reply",
      "deleteFailed": "Failed to delete new order reply"
    },
    "auditLog": {
      "customerIdRequired": "Customer ID is required",
      "userIdOrCustomerIdRequired": "User ID or Customer ID is required",
      "resourceNameOrCustomerIdRequired": "Resource name or Customer ID is required",
      "createFailed": "Failed to create audit log",
      "validationFailed": "Audit log validation failed",
      "recordFailed": "Failed to record audit log"
    },
    "dataUsage": {
      "userIdRequired": "User ID is required",
      "customerIdRequired": "Customer ID is required",
      "fetchFailed": "Failed to fetch data usage information",
      "createFailed": "Failed to create data usage record",
      "updateFailed": "Failed to update data usage",
      "noUpdateFields": "No update fields specified",
      "updateFieldRequired": "Please specify at least one field to update",
      "notFound": "Data usage record to update not found",
      "updateError": "An error occurred while updating data usage"
    },
    "limitUsage": {
      "createFailed": "Failed to create limit usage",
      "updateFailed": "Failed to update limit usage",
      "deleteFailed": "Failed to delete limit usage",
      "deleteOperationFailed": "Failed to delete limit usage",
      "deleteProcessingError": "An error occurred while deleting limit usage",
      "unknownResource": "Unknown"
    },
    "recipient": {
      "fetchFailed": "Failed to fetch recipient information",
      "accessDenied": "Access denied to this recipient information",
      "notFound": "Recipient not found",
      "createFailed": "Failed to create recipient",
      "updateFailed": "Failed to update recipient",
      "deleteFailed": "Failed to delete recipient",
      "limitUsageIdRequired": "Limit usage ID is required",
      "noUpdateFields": "No update fields specified",
      "updateError": "An error occurred while updating recipient",
      "createError": "An error occurred while creating recipient",
      "partialUpdateFailed": "Failed to update some recipients"
    },
    "delete": {
      "userDeleteFailed": "Failed to delete user",
      "cognitoUserDeleteFailed": "Failed to delete Cognito user",
      "partialDeleteFailed": "Failed to cancel deletion request for some or all users",
      "authDeleteFailed": "Failed to delete authentication information",
      "dbDeleteFailed": "Failed to delete database user",
      "cancelRequestFailed": "An error occurred while canceling deletion request",
      "cancelRequestProcessingError": "An error occurred during deletion request cancellation",
      "userDeleteSuccess": "User deleted successfully",
      "cognitoUserDeleteSuccess": "Cognito user deleted successfully",
      "relatedResourceDeleteError": "An error occurred while deleting related resources",
      "userNotFoundForDeletion": "User to delete not found",
      "bulkDeleteNoTargets": "No deletion targets specified",
      "bulkDeletePartialFailure": "Failed to delete some users",
      "cancelDeletionSuccess": "Deletion request cancellation completed for {count} users",
      "cancelDeletionPartialFailure": "Success: {successCount}, Failed: {failCount}",
      "lastAdminDeleteNotAllowed": "Cannot delete the last admin user"
    },
    "cognito": {
      "usernameExists": "User already registered",
      "invalidParameter": "Invalid parameter",
      "invalidPassword": "Invalid password",
      "confirmationCodeIncorrect": "Confirmation code is incorrect",
      "confirmationCodeExpired": "Confirmation code has expired",
      "userCreationFailed": "Failed to create Cognito user",
      "confirmationFailed": "Failed to confirm signup",
      "userNotFound": "User not found",
      "emailSendFailed": "Failed to send email",
      "signInFailed": "Sign in failed",
      "passwordResetRequired": "Password reset required",
      "accountNotConfirmed": "Account not confirmed. Please complete email verification"
    },
    "stripe": {
      "customerCreationFailed": "Failed to create Stripe customer",
      "customerNotFound": "Customer not found",
      "setupIntentCreationFailed": "Failed to create setup intent",
      "paymentMethodNotFound": "Payment method not found",
      "paymentMethodDetachFailed": "Failed to detach payment method",
      "paymentHistoryFetchFailed": "Failed to fetch payment history",
      "defaultPaymentMethodSetFailed": "Failed to set default payment method",
      "addressUpdateFailed": "Failed to update address",
      "invalidLocale": "Invalid locale specified",
      "customerIdRequired": "Customer ID is required",
      "paymentMethodIdRequired": "Payment method ID is required",
      "addressRequired": "Address is required",
      "nameRequired": "Name is required",
      "emailRequired": "Email is required",
      "userAttributesRequired": "User attributes are required",
      "invalidAddress": "Invalid address format",
      "stripeError": "Stripe API error occurred",
      "updateFailed": "Update failed",
      "validationError": "There are issues with the input",
      "cardError": "Card error",
      "requestError": "Request error",
      "apiError": "API error",
      "connectionError": "Connection error occurred",
      "authenticationError": "Authentication error occurred"
    },
    "api": {
      "invalidRequest": "Invalid request",
      "missingParameters": "Missing required parameters",
      "serverError": "Internal server error",
      "validationFailed": "Request validation failed",
      "authenticationRequired": "Authentication required",
      "accessDenied": "Access denied",
      "notFound": "Resource not found",
      "methodNotAllowed": "Method not allowed",
      "conflictError": "Resource conflict",
      "rateLimitExceeded": "Rate limit exceeded"
    },
    "verificationEmail": {
      "sendFailed": "Failed to send verification email",
      "templateNotFound": "Email template not found",
      "messageRejected": "Email was rejected (destination may be invalid)",
      "sendingPaused": "Email sending is temporarily paused",
      "mailFromDomainNotVerified": "Mail-from domain is not verified",
      "configurationSetNotFound": "SES configuration set not found",
      "invalidTemplate": "Email template is invalid",
      "invalidAwsCredentials": "AWS credentials are invalid",
      "invalidParameters": "Parameters are invalid"
    }
  },
  "fields": {
    "userName": "Username",
    "email": "Email",
    "department": "Department",
    "position": "Position",
    "role": "Role"
  },
  "messages": {
    "dataUsage": {
      "createSuccess": "Data usage record created successfully",
      "updateSuccess": "Data usage updated successfully"
    },
    "policy": {
      "createSuccess": "Policy created successfully",
      "updateSuccess": "Policy updated successfully",
      "deleteSuccess": "Policy deleted successfully"
    },
    "user": {
      "createSuccess": "User created successfully",
      "updateSuccess": "User information updated successfully",
      "deleteSuccess": "User deleted successfully"
    },
    "group": {
      "createSuccess": "Group created successfully",
      "updateSuccess": "Group updated successfully",
      "deleteSuccess": "Group deleted successfully"
    },
    "groupPolicy": {
      "createSuccess": "Group policy created successfully",
      "deleteSuccess": "Group policy deleted successfully"
    },
    "userGroup": {
      "createSuccess": "User group created successfully",
      "updateSuccess": "User group updated successfully",
      "deleteSuccess": "User group deleted successfully"
    },
    "newOrderRequest": {
      "createSuccess": "New order request created successfully",
      "updateSuccess": "New order request updated successfully",
      "deleteSuccess": "New order request deleted successfully"
    },
    "newOrderReply": {
      "createSuccess": "New order reply created successfully",
      "updateSuccess": "New order reply updated successfully",
      "deleteSuccess": "New order reply deleted successfully"
    },
    "supportRequest": {
      "createSuccess": "Support request created successfully",
      "updateSuccess": "Support request updated successfully",
      "deleteSuccess": "Support request deleted successfully"
    },
    "supportReply": {
      "createSuccess": "Support reply created successfully",
      "updateSuccess": "Support reply updated successfully",
      "deleteSuccess": "Support reply deleted successfully"
    },
    "limitUsage": {
      "createSuccess": "Limit usage created successfully",
      "updateSuccess": "Limit usage updated successfully",
      "deleteSuccess": "Limit usage deleted successfully"
    },
    "recipient": {
      "createSuccess": "Recipient created successfully",
      "updateSuccess": "Recipient updated successfully",
      "deleteSuccess": "Recipient deleted successfully",
      "bulkUpdateSuccess": "Successfully updated {count} recipients"
    },
    "auditLog": {
      "createSuccess": "Audit log created successfully",
      "recordSuccess": "Audit log recorded successfully"
    },
    "stripe": {
      "customerCreateSuccess": "Customer created successfully",
      "setupIntentCreateSuccess": "Setup intent created successfully",
      "paymentMethodDeleteSuccess": "Payment method deleted successfully",
      "paymentHistoryFetchSuccess": "Payment history retrieved successfully",
      "defaultPaymentMethodSetSuccess": "Default payment method set successfully",
      "addressUpdateSuccess": "Address updated successfully"
    },
    "api": {
      "requestSuccess": "Request completed successfully",
      "operationCompleted": "Operation completed successfully"
    },
    "verificationEmail": {
      "sendSuccess": "Verification email has been sent"
    },
    "cognito": {
      "emailVerificationCompleted": "Email verification completed",
      "signInStarted": "Sign in process started"
    }
  }
}

export default en;