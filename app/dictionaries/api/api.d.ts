export default interface APILocale {
  errors: {
    // 共通エラー
    general: {
      serverError: string;
      networkError: string;
      unauthorized: string;
      forbidden: string;
      notFound: string;
      validationError: string;
      conflict: string;
      unexpectedError: string;
      unknownError: string;
      targetNotFound: string;
      operationFailed: string;
      processingError: string;
      relatedResourceDeleteError: string;
      partialOperationFailed: string;
      rollbackFailed: string;
    };
    
    // 認証関連
    auth: {
      notAuthenticated: string;
      insufficientPermissions: string;
      accessDenied: string;
      companyNotSet: string;
      adminRightsRequired: string;
      adminPermissionRequired: string;
      codeIncorrect: string;
      codeExpired: string;
      userNotFound: string;
      signInFailed: string;
      credentialsIncorrect: string;
      accountNotConfirmed: string;
      passwordResetRequired: string;
      userNotAuthenticated: string;
      getCurrentUserFailed: string;
      missingParameters: string;
      check2FAStatusFailed: string;
      missingEmailParameters: string;
      invalidEmailFormat: string;
      cognitoEmailUpdateSuccess: string;
      cognitoEmailUpdateFailed: string;
      userNotFoundInCognito: string;
      invalidEmailOrUserId: string;
      notAuthorizedToUpdateUser: string;
      missingUsernameParameters: string;
      invalidUsernameFormat: string;
      cognitoUsernameUpdateSuccess: string;
      cognitoUsernameUpdateFailed: string;
      invalidUsernameOrUserId: string;
      usernameAlreadyExists: string;
      missingVerificationParameters: string;
      verificationCodeNotFound: string;
      verificationCodeExpired: string;
      tooManyFailedAttempts: string;
      invalidVerificationCode: string;
      emailVerificationSuccess: string;
      emailVerificationFailed: string;
      missingStoreParameters: string;
      verificationCodeStoredSuccess: string;
      verificationCodeStoreFailed: string;
    };
    
    // バリデーション関連
    validation: {
      userIdRequired: string;
      customerIdRequired: string;
      groupIdRequired: string;
      policyIdRequired: string;
      supportRequestIdRequired: string;
      newOrderRequestIdRequired: string;
      statusRequired: string;
      userGroupIdRequired: string;
      groupIdRequiredForValidation: string;
      userIdRequiredForValidation: string;
      fieldRequired: string;
      validEmailRequired: string;
      minLength: string;
      maxLength: string;
      passwordMinLength: string;
      passwordUppercase: string;
      passwordLowercase: string;
      passwordNumber: string;
      passwordSpecialChar: string;
      passwordMismatch: string;
      userNameRequired: string;
      emailRequired: string;
      companyIdRequired: string;
      departmentRequired: string;
      positionRequired: string;
      roleRequired: string;
      usageMinZero: string;
      positiveNumber: string;
      nonNegativeNumber: string;
      invalidEmail: string;
      required: string;
      // 配列バリデーション
      policyIdsMinOne: string;
      userIdsMinOne: string;
      emailsMinOne: string;
      emailsValid: string;
      // Enum バリデーション
      invalidExceedAction: string;
      invalidNotifyType: string;
      invalidUnit: string;
      invalidAiTrainingUsage: string;
      invalidStatus: string;
      invalidIssueType: string;
      invalidAction: string;
      invalidResource: string;
      invalidDataType: string;
      invalidModelType: string;
      // Refine バリデーション
      notifyTypeAmountRequired: string;
      notifyTypeUsageRequired: string;
      usageUnitRequired: string;
      // フィールド固有バリデーション
      companyNameRequired: string;
      stateRequired: string;
      cityRequired: string;
      streetAddressRequired: string;
      groupNameRequired: string;
      policyNameRequired: string;
      subjectRequired: string;
      descriptionRequired: string;
      messageRequired: string;
      resourceNameRequired: string;
      preferredUsernameRequired: string;
      localeRequired: string;
      confirmationCodeRequired: string;
      challengeResponseRequired: string;
      limitUsageIdRequired: string;
      isStaffInvalid: string;
      newOrderRequestIdRequired: string;
    };
    
    // ユーザー関連
    user: {
      fetchFailed: string;
      accessDenied: string;
      notFound: string;
      companyAccessDenied: string;
      batchFetchFailed: string;
      updateFailed: string;
      createFailed: string;
      deleteFailed: string;
      userGroupFetchFailed: string;
      userGroupDeleteFailed: string;
      rollbackFailed: string;
      noUpdateFields: string;
      updateError: string;
      userNameEmpty: string;
      emailEmpty: string;
      departmentEmpty: string;
      positionEmpty: string;
      roleEmpty: string;
      fieldRequired: string;
    };
    
    // ポリシー関連
    policy: {
      fetchFailed: string;
      accessDenied: string;
      batchFetchFailed: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
      idRequired: string;
      notFound: string;
      noUpdateFields: string;
      updateError: string;
    };
    
    // グループ関連
    group: {
      fetchFailed: string;
      accessDenied: string;
      listFetchFailed: string;
      updateFailed: string;
      createFailed: string;
      deleteFailed: string;
      userGroupDeleteFailed: string;
      groupPolicyDeleteFailed: string;
      rollbackFailed: string;
    };
    
    // ユーザーグループ関連
    userGroup: {
      fetchFailed: string;
      accessDenied: string;
      batchFetchFailed: string;
      companyFetchFailed: string;
      groupFetchFailed: string;
      userFetchFailed: string;
      membershipCheckFailed: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
      noUpdateFields: string;
      updateError: string;
    };
    
    // グループポリシー関連
    groupPolicy: {
      fetchFailed: string;
      accessDenied: string;
      batchFetchFailed: string;
      policyFetchFailed: string;
      groupFetchFailed: string;
      createFailed: string;
      deleteFailed: string;
    };
    
    // サポートリクエスト関連
    supportRequest: {
      fetchFailed: string;
      accessDenied: string;
      notFound: string;
      otherCompanyAccessDenied: string;
      userAccessDenied: string;
      batchFetchFailed: string;
      statusBatchFetchFailed: string;
      userBatchFetchFailed: string;
      customerBatchFetchFailed: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
      validationError: string;
      updateError: string;
      noUpdateFields: string;
    };
    
    // サポート返信関連
    supportReply: {
      fetchFailed: string;
      accessDenied: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
      notFound: string;
      updateError: string;
      noUpdateFields: string;
    };
    
    // 新規注文関連
    newOrder: {
      fetchFailed: string;
      accessDenied: string;
      notFound: string;
      otherCompanyAccessDenied: string;
      batchFetchFailed: string;
      customerBatchFetchFailed: string;
    };
    
    // 新規注文リクエスト関連
    newOrderRequest: {
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
    };
    
    // 新規注文返信関連
    newOrderReply: {
      fetchFailed: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
    };
    
    // 監査ログ関連
    auditLog: {
      customerIdRequired: string;
      userIdOrCustomerIdRequired: string;
      resourceNameOrCustomerIdRequired: string;
      createFailed: string;
      validationFailed: string;
      recordFailed: string;
    };
    
    // データ使用量関連
    dataUsage: {
      userIdRequired: string;
      customerIdRequired: string;
      fetchFailed: string;
      createFailed: string;
      updateFailed: string;
      noUpdateFields: string;
      updateFieldRequired: string;
      notFound: string;
      updateError: string;
    };
    
    // 使用制限関連
    limitUsage: {
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
      deleteOperationFailed: string;
      deleteProcessingError: string;
      unknownResource: string;
    };
    
    // 受信者関連
    recipient: {
      fetchFailed: string;
      accessDenied: string;
      notFound: string;
      createFailed: string;
      updateFailed: string;
      deleteFailed: string;
      noUpdateFields: string;
      updateError: string;
      limitUsageIdRequired: string;
      partialUpdateFailed: string;
      createError: string;
    };
    
    // 削除関連
    delete: {
      userDeleteFailed: string;
      cognitoUserDeleteFailed: string;
      partialDeleteFailed: string;
      authDeleteFailed: string;
      dbDeleteFailed: string;
      cancelRequestFailed: string;
      cancelRequestProcessingError: string;
      userDeleteSuccess: string;
      cognitoUserDeleteSuccess: string;
      relatedResourceDeleteError: string;
      userNotFoundForDeletion: string;
      bulkDeleteNoTargets: string;
      bulkDeletePartialFailure: string;
      cancelDeletionSuccess: string;
      cancelDeletionPartialFailure: string;
      lastAdminDeleteNotAllowed: string;
    };

    // Cognito関連のエラー
    cognito: {
      usernameExists: string;
      invalidParameter: string;
      invalidPassword: string;
      confirmationCodeIncorrect: string;
      confirmationCodeExpired: string;
      userCreationFailed: string;
      confirmationFailed: string;
      userNotFound: string;
      emailSendFailed: string;
      signInFailed: string;
      passwordResetRequired: string;
      accountNotConfirmed: string;
    };

    // Stripe関連のエラー
    stripe: {
      customerCreationFailed: string;
      customerNotFound: string;
      setupIntentCreationFailed: string;
      paymentMethodNotFound: string;
      paymentMethodDetachFailed: string;
      paymentHistoryFetchFailed: string;
      defaultPaymentMethodSetFailed: string;
      addressUpdateFailed: string;
      invalidLocale: string;
      customerIdRequired: string;
      paymentMethodIdRequired: string;
      addressRequired: string;
      nameRequired: string;
      emailRequired: string;
      userAttributesRequired: string;
      invalidAddress: string;
      stripeError: string;
      updateFailed: string;
      validationError: string;
      cardError: string;
      requestError: string;
      apiError: string;
      connectionError: string;
      authenticationError: string;
    };

    // API関連のエラー
    api: {
      invalidRequest: string;
      missingParameters: string;
      serverError: string;
      validationFailed: string;
      authenticationRequired: string;
      accessDenied: string;
      notFound: string;
      methodNotAllowed: string;
      conflictError: string;
      rateLimitExceeded: string;
    };

    // 認証コード送信API（/api/send-verification-email）
    verificationEmail: {
      sendFailed: string;
      templateNotFound: string;
      messageRejected: string;
      sendingPaused: string;
      mailFromDomainNotVerified: string;
      configurationSetNotFound: string;
      invalidTemplate: string;
      invalidAwsCredentials: string;
      invalidParameters: string;
    };

  };
  
  // 成功メッセージ
  messages: {
    // データ使用量関連
    dataUsage: {
      createSuccess: string;
      updateSuccess: string;
    };
    // ポリシー関連
    policy: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    // ユーザー関連
    user: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    // グループ関連
    group: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    // グループポリシー関連
    groupPolicy: {
      createSuccess: string;
      deleteSuccess: string;
    };
    // ユーザーグループ関連
    userGroup: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    
    // 新規注文リクエスト関連
    newOrderRequest: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    
    // 新規注文返信関連
    newOrderReply: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    
    // サポートリクエスト関連
    supportRequest: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    
    // サポート返信関連
    supportReply: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    
    // 使用制限関連
    limitUsage: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
    };
    
    // 受信者関連
    recipient: {
      createSuccess: string;
      updateSuccess: string;
      deleteSuccess: string;
      bulkUpdateSuccess: string;
    };
    
    // 監査ログ関連
    auditLog: {
      createSuccess: string;
      recordSuccess: string;
    };
    
    // Stripe関連
    stripe: {
      customerCreateSuccess: string;
      setupIntentCreateSuccess: string;
      paymentMethodDeleteSuccess: string;
      paymentHistoryFetchSuccess: string;
      defaultPaymentMethodSetSuccess: string;
      addressUpdateSuccess: string;
    };

    // API関連
    api: {
      requestSuccess: string;
      operationCompleted: string;
    };

    // 認証コード送信API
    verificationEmail: {
      sendSuccess: string;
    };

    // Cognito関連の成功メッセージ
    cognito: {
      emailVerificationCompleted: string;
      signInStarted: string;
    };
  };
  
  // フィールド名の翻訳
  fields: {
    userName: string;
    email: string;
    department: string;
    position: string;
    role: string;
  };
};
