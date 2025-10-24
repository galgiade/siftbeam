const ko = {
  errors: {
    general: {
      serverError: "서버 오류가 발생했습니다",
      networkError: "네트워크 오류가 발생했습니다",
      unauthorized: "인증이 필요합니다",
      forbidden: "접근이 거부되었습니다",
      notFound: "리소스를 찾을 수 없습니다",
      validationError: "입력 데이터가 올바르지 않습니다",
      conflict: "데이터 충돌이 발생했습니다",
      unexpectedError: "예기치 못한 오류가 발생했습니다",
      unknownError: "알 수 없는 오류가 발생했습니다",
      targetNotFound: "업데이트 대상이 없습니다",
      operationFailed: "작업 실행에 실패했습니다",
      processingError: "처리 중 오류가 발생했습니다",
      relatedResourceDeleteError: "관련 리소스 삭제 중 오류가 발생했습니다",
      partialOperationFailed: "일부 작업이 실패했습니다",
      rollbackFailed: "롤백에 실패했습니다"
    },
    auth: {
      notAuthenticated: "인증되지 않았습니다",
      insufficientPermissions: "권한이 부족합니다",
      accessDenied: "접근이 거부되었습니다",
      companyNotSet: "회사 정보가 설정되어 있지 않습니다",
      adminRightsRequired: "관리자 권한이 필요합니다",
      adminPermissionRequired: "관리자 권한이 필요합니다",
      codeIncorrect: "인증 코드가 올바르지 않습니다",
      codeExpired: "인증 코드가 만료되었습니다",
      userNotFound: "사용자를 찾을 수 없습니다",
      signInFailed: "로그인에 실패했습니다",
      credentialsIncorrect: "이메일 또는 비밀번호가 올바르지 않습니다",
      accountNotConfirmed: "계정이 확인되지 않았습니다. 이메일 인증을 완료해주세요",
      passwordResetRequired: "비밀번호 재설정이 필요합니다",
      userNotAuthenticated: "사용자가 인증되지 않았습니다",
      getCurrentUserFailed: "현재 사용자 정보 가져오기에 실패했습니다",
      missingParameters: "필수 매개변수가 누락되었습니다: userId, email",
      check2FAStatusFailed: "2단계 인증 상태 확인에 실패했습니다",
      missingEmailParameters: "필수 매개변수가 누락되었습니다: userId, newEmail, userPoolId",
      invalidEmailFormat: "유효하지 않은 이메일 형식입니다",
      cognitoEmailUpdateSuccess: "Cognito 이메일 업데이트에 성공했습니다",
      cognitoEmailUpdateFailed: "Cognito 이메일 업데이트에 실패했습니다",
      userNotFoundInCognito: "Cognito에서 사용자를 찾을 수 없습니다",
      invalidEmailOrUserId: "유효하지 않은 이메일 형식 또는 사용자 ID입니다",
      notAuthorizedToUpdateUser: "사용자 업데이트 권한이 없습니다",
      missingUsernameParameters: "필수 매개변수가 누락되었습니다: userId, newUsername, userPoolId",
      invalidUsernameFormat: "유효하지 않은 사용자명 형식입니다",
      cognitoUsernameUpdateSuccess: "Cognito 사용자명 업데이트에 성공했습니다",
      cognitoUsernameUpdateFailed: "Cognito 사용자명 업데이트에 실패했습니다",
      invalidUsernameOrUserId: "유효하지 않은 사용자명 형식 또는 사용자 ID입니다",
      usernameAlreadyExists: "사용자명이 이미 존재합니다",
      missingVerificationParameters: "필수 매개변수가 누락되었습니다: userId, email, code, userPoolId",
      verificationCodeNotFound: "인증 코드를 찾을 수 없거나 만료되었습니다",
      verificationCodeExpired: "인증 코드가 만료되었습니다",
      tooManyFailedAttempts: "실패한 시도가 너무 많습니다",
      invalidVerificationCode: "유효하지 않은 인증 코드입니다",
      emailVerificationSuccess: "이메일 인증이 성공하고 Cognito가 업데이트되었습니다",
      emailVerificationFailed: "이메일 코드 인증에 실패했습니다",
      missingStoreParameters: "필수 매개변수가 누락되었습니다: userId, email, code, userType",
      verificationCodeStoredSuccess: "인증 코드 저장에 성공했습니다",
      verificationCodeStoreFailed: "인증 코드 저장에 실패했습니다"
    },
    validation: {
      userIdRequired: "사용자 ID는 필수입니다",
      customerIdRequired: "고객 ID는 필수입니다",
      groupIdRequired: "그룹 ID는 필수입니다",
      policyIdRequired: "정책 ID는 필수입니다",
      supportRequestIdRequired: "지원 요청 ID는 필수입니다",
      newOrderRequestIdRequired: "신규 의뢰 ID는 필수입니다",
      statusRequired: "상태는 필수입니다",
      userGroupIdRequired: "사용자 그룹 ID는 필수입니다",
      groupIdRequiredForValidation: "그룹 ID는 필수입니다",
      userIdRequiredForValidation: "사용자 ID는 필수입니다",
      fieldRequired: "필수 입력 항목입니다",
      validEmailRequired: "유효한 이메일 주소를 입력하세요",
      minLength: "최소 {count}자 이상",
      maxLength: "최대 {count}자 이하",
      passwordMinLength: "비밀번호는 최소 8자여야 합니다",
      passwordUppercase: "대문자를 포함해야 합니다",
      passwordLowercase: "소문자를 포함해야 합니다",
      passwordNumber: "숫자를 포함해야 합니다",
      passwordSpecialChar: "특수문자를 포함해야 합니다",
      passwordMismatch: "비밀번호가 일치하지 않습니다",
      userNameRequired: "사용자명은 필수입니다",
      emailRequired: "이메일은 필수입니다",
      companyIdRequired: "회사 ID는 필수입니다",
      departmentRequired: "부서는 필수입니다",
      positionRequired: "직책은 필수입니다",
      roleRequired: "역할은 필수입니다",
      usageMinZero: "사용량은 0 이상이어야 합니다",
      positiveNumber: "양수 값을 입력하세요",
      nonNegativeNumber: "0 이상 값을 입력하세요",
      invalidEmail: "유효한 이메일 주소를 입력하세요",
      required: "필수 입력 항목입니다",
      policyIdsMinOne: "최소 하나 이상의 정책을 선택하세요",
      userIdsMinOne: "최소 하나 이상의 사용자를 선택하세요",
      emailsMinOne: "최소 하나 이상의 이메일 주소를 입력하세요",
      emailsValid: "유효한 이메일 주소를 입력하세요",
      invalidExceedAction: "초과 시 동작은 알림 또는 제한 중에서 선택하세요",
      invalidNotifyType: "알림 방법은 금액 또는 사용량 중에서 선택하세요",
      invalidUnit: "단위는 KB, MB, GB, TB 중에서 선택하세요",
      invalidAiTrainingUsage: "AI 학습 사용 여부는 허용 또는 거부 중에서 선택하세요",
      invalidStatus: "상태는 OPEN, IN_PROGRESS, CLOSED 중에서 선택하세요",
      invalidIssueType: "이슈 유형은 기술, 계정, 결제, 기타 중에서 선택하세요",
      invalidAction: "동작은 READ, CREATE, UPDATE, DELETE, ATTACH, DETACH 중에서 선택하세요",
      invalidResource: "리소스 유형이 올바르지 않습니다",
      invalidDataType: "데이터 유형은 표, 이미지, 텍스트 중에서 선택하세요",
      invalidModelType: "모델 유형은 클러스터링, 예측, 분류 중에서 선택하세요",
      notifyTypeAmountRequired: "알림 방법에 따라 금액 또는 사용량을 입력하세요",
      notifyTypeUsageRequired: "사용량 알림 선택 시 단위(KB, MB, GB, TB) 선택이 필요합니다",
      usageUnitRequired: "사용량 알림 선택 시 단위(KB, MB, GB, TB) 선택이 필요합니다",
      companyNameRequired: "회사명은 필수입니다",
      stateRequired: "주/도는 필수입니다",
      cityRequired: "도시는 필수입니다",
      streetAddressRequired: "주소는 필수입니다",
      groupNameRequired: "그룹명은 필수입니다",
      policyNameRequired: "정책명은 필수입니다",
      subjectRequired: "제목은 필수입니다",
      descriptionRequired: "설명은 필수입니다",
      messageRequired: "메시지는 필수입니다",
      resourceNameRequired: "리소스명은 필수입니다",
      preferredUsernameRequired: "사용자명은 필수입니다",
      localeRequired: "로케일은 필수입니다",
      confirmationCodeRequired: "인증 코드는 필수입니다",
      challengeResponseRequired: "도전 응답은 필수입니다",
      limitUsageIdRequired: "이용 제한 ID는 필수입니다",
      isStaffInvalid: "스태프 플래그는 불리언이어야 합니다"
    },
    user: {
      fetchFailed: "사용자 정보를 가져오지 못했습니다",
      accessDenied: "이 사용자 정보에 대한 접근이 거부되었습니다",
      notFound: "사용자를 찾을 수 없습니다",
      companyAccessDenied: "이 회사의 사용자 정보에 대한 접근이 거부되었습니다",
      batchFetchFailed: "여러 사용자 정보를 가져오는 중 오류가 발생했습니다",
      updateFailed: "사용자 정보 업데이트에 실패했습니다",
      createFailed: "사용자 생성에 실패했습니다",
      deleteFailed: "사용자 삭제에 실패했습니다",
      userGroupFetchFailed: "사용자 그룹 정보를 가져오지 못했습니다",
      userGroupDeleteFailed: "사용자 그룹 삭제에 실패했습니다",
      rollbackFailed: "삭제 롤백에 실패했습니다",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다",
      updateError: "사용자 업데이트 중 오류가 발생했습니다",
      userNameEmpty: "사용자명은 비워둘 수 없습니다",
      emailEmpty: "이메일은 비워둘 수 없습니다",
      departmentEmpty: "부서는 비워둘 수 없습니다",
      positionEmpty: "직책은 비워둘 수 없습니다",
      roleEmpty: "역할은 비워둘 수 없습니다",
      fieldRequired: "{field}는 필수입니다"
    },
    policy: {
      fetchFailed: "정책 정보를 가져오지 못했습니다",
      accessDenied: "이 정책 정보에 대한 접근이 거부되었습니다",
      batchFetchFailed: "여러 고객 정책 정보를 가져오는 중 오류가 발생했습니다",
      createFailed: "정책 생성에 실패했습니다",
      updateFailed: "정책 업데이트에 실패했습니다",
      deleteFailed: "정책 삭제에 실패했습니다",
      idRequired: "유효한 정책 ID가 필요합니다",
      notFound: "지정된 정책을 찾을 수 없습니다",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다",
      updateError: "정책 업데이트 중 오류가 발생했습니다"
    },
    group: {
      fetchFailed: "그룹 가져오기 실패",
      accessDenied: "접근 거부",
      listFetchFailed: "그룹 목록 가져오기 실패",
      updateFailed: "그룹 업데이트 실패",
      createFailed: "그룹 생성 실패",
      deleteFailed: "그룹 삭제 실패",
      userGroupDeleteFailed: "사용자 그룹 삭제 실패",
      groupPolicyDeleteFailed: "그룹 정책 삭제 실패",
      rollbackFailed: "롤백 실패"
    },
    userGroup: {
      fetchFailed: "사용자 그룹 정보를 가져오지 못했습니다",
      accessDenied: "이 사용자 그룹 정보에 대한 접근이 거부되었습니다",
      batchFetchFailed: "여러 사용자 그룹 정보를 가져오는 중 오류가 발생했습니다",
      companyFetchFailed: "고객 ID 기준 사용자 그룹 정보를 가져오지 못했습니다",
      groupFetchFailed: "그룹 ID 기준 사용자 그룹 정보를 가져오지 못했습니다",
      userFetchFailed: "사용자 ID 기준 사용자 그룹 정보를 가져오지 못했습니다",
      membershipCheckFailed: "그룹 멤버십 확인 실패",
      createFailed: "사용자 그룹 생성 실패",
      updateFailed: "사용자 그룹 업데이트 실패",
      deleteFailed: "사용자 그룹 삭제 실패",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다",
      updateError: "사용자 그룹 업데이트 중 오류가 발생했습니다"
    },
    groupPolicy: {
      fetchFailed: "그룹 정책 정보를 가져오지 못했습니다",
      accessDenied: "이 그룹 정책 정보에 대한 접근이 거부되었습니다",
      batchFetchFailed: "여러 그룹 정책 정보를 가져오는 중 오류가 발생했습니다",
      policyFetchFailed: "정책 ID 기준 그룹 정책 정보를 가져오지 못했습니다",
      groupFetchFailed: "그룹 ID 기준 그룹 정책 정보를 가져오지 못했습니다",
      createFailed: "그룹 정책 생성 실패",
      deleteFailed: "그룹 정책 삭제 실패"
    },
    supportRequest: {
      fetchFailed: "지원 요청 정보를 가져오지 못했습니다",
      accessDenied: "이 지원 요청 정보에 대한 접근이 거부되었습니다",
      notFound: "지정된 ID의 지원 요청을 찾을 수 없습니다",
      otherCompanyAccessDenied: "다른 회사의 지원 요청 정보에 대한 접근이 거부되었습니다",
      userAccessDenied: "이 사용자의 지원 요청 정보에 대한 접근이 거부되었습니다",
      batchFetchFailed: "여러 지원 요청 정보를 가져오는 중 오류가 발생했습니다",
      statusBatchFetchFailed: "여러 상태 지원 요청 정보를 가져오는 중 오류가 발생했습니다",
      userBatchFetchFailed: "여러 사용자 지원 요청 정보를 가져오는 중 오류가 발생했습니다",
      customerBatchFetchFailed: "여러 고객 지원 요청 정보를 가져오는 중 오류가 발생했습니다",
      createFailed: "지원 요청 생성 실패",
      updateFailed: "지원 요청 업데이트 실패",
      deleteFailed: "지원 요청 삭제 실패",
      validationError: "지원 요청 입력에 문제가 있습니다",
      updateError: "지원 요청 업데이트 중 오류가 발생했습니다",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다"
    },
    supportReply: {
      fetchFailed: "지원 답변 정보를 가져오지 못했습니다",
      accessDenied: "이 지원 답변 정보에 대한 접근이 거부되었습니다",
      createFailed: "지원 답변 생성 실패",
      updateFailed: "지원 답변 업데이트 실패",
      deleteFailed: "지원 답변 삭제 실패",
      notFound: "지정된 ID의 지원 답변을 찾을 수 없습니다",
      updateError: "지원 답변 업데이트 중 오류가 발생했습니다",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다"
    },
    newOrder: {
      fetchFailed: "신규 의뢰 정보를 가져오지 못했습니다",
      accessDenied: "이 신규 의뢰 정보에 대한 접근이 거부되었습니다",
      notFound: "지정된 ID의 신규 의뢰를 찾을 수 없습니다",
      otherCompanyAccessDenied: "다른 회사의 신규 의뢰 정보에 대한 접근이 거부되었습니다",
      batchFetchFailed: "여러 신규 의뢰 정보를 가져오는 중 오류가 발생했습니다",
      customerBatchFetchFailed: "여러 고객 신규 의뢰 정보를 가져오는 중 오류가 발생했습니다"
    },
    newOrderRequest: {
      createFailed: "신규 의뢰 요청 생성 실패",
      updateFailed: "신규 의뢰 요청 업데이트 실패",
      deleteFailed: "신규 의뢰 요청 삭제 실패"
    },
    newOrderReply: {
      fetchFailed: "신규 의뢰 답변 정보를 가져오지 못했습니다",
      createFailed: "신규 의뢰 답변 생성 실패",
      updateFailed: "신규 의뢰 답변 업데이트 실패",
      deleteFailed: "신규 의뢰 답변 삭제 실패"
    },
    auditLog: {
      customerIdRequired: "고객 ID는 필수입니다",
      userIdOrCustomerIdRequired: "사용자 ID 또는 고객 ID는 필수입니다",
      resourceNameOrCustomerIdRequired: "리소스명 또는 고객 ID는 필수입니다",
      createFailed: "감사 로그 생성 실패",
      validationFailed: "감사 로그 검증 실패",
      recordFailed: "감사 로그 기록 실패"
    },
    dataUsage: {
      userIdRequired: "사용자 ID는 필수입니다",
      customerIdRequired: "고객 ID는 필수입니다",
      fetchFailed: "데이터 이용 정보를 가져오지 못했습니다",
      createFailed: "데이터 이용 기록 생성 실패",
      updateFailed: "데이터 이용 업데이트 실패",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다",
      updateFieldRequired: "최소 하나 이상의 업데이트 필드를 지정하세요",
      notFound: "업데이트할 데이터 이용 기록을 찾을 수 없습니다",
      updateError: "데이터 이용 업데이트 중 오류가 발생했습니다"
    },
    limitUsage: {
      createFailed: "이용 제한 생성 실패",
      updateFailed: "이용 제한 업데이트 실패",
      deleteFailed: "이용 제한 삭제 실패",
      deleteOperationFailed: "이용 제한 삭제 실패",
      deleteProcessingError: "이용 제한 삭제 처리 중 오류가 발생했습니다",
      unknownResource: "알 수 없음"
    },
    recipient: {
      fetchFailed: "수신자 정보를 가져오지 못했습니다",
      accessDenied: "이 수신자 정보에 대한 접근이 거부되었습니다",
      notFound: "수신자를 찾을 수 없습니다",
      createFailed: "수신자 생성 실패",
      updateFailed: "수신자 업데이트 실패",
      deleteFailed: "수신자 삭제 실패",
      limitUsageIdRequired: "이용 제한 ID는 필수입니다",
      noUpdateFields: "업데이트할 필드가 지정되지 않았습니다",
      updateError: "수신자 업데이트 중 오류가 발생했습니다",
      createError: "수신자 생성 중 오류가 발생했습니다",
      partialUpdateFailed: "일부 수신자 업데이트 실패"
    },
    delete: {
      userDeleteFailed: "사용자 삭제에 실패했습니다",
      cognitoUserDeleteFailed: "Cognito 사용자 삭제에 실패했습니다",
      partialDeleteFailed: "일부 또는 전체 사용자 삭제 요청 취소에 실패했습니다",
      authDeleteFailed: "인증 정보 삭제에 실패했습니다",
      dbDeleteFailed: "데이터베이스 사용자 삭제에 실패했습니다",
      cancelRequestFailed: "삭제 요청 취소 중 오류가 발생했습니다",
      cancelRequestProcessingError: "삭제 요청 취소 처리 중 오류가 발생했습니다",
      userDeleteSuccess: "사용자를 삭제했습니다",
      cognitoUserDeleteSuccess: "Cognito 사용자를 삭제했습니다",
      relatedResourceDeleteError: "관련 리소스 삭제 중 오류가 발생했습니다",
      userNotFoundForDeletion: "삭제할 사용자를 찾을 수 없습니다",
      bulkDeleteNoTargets: "삭제 대상이 지정되지 않았습니다",
      bulkDeletePartialFailure: "일부 사용자를 삭제하지 못했습니다",
      cancelDeletionSuccess: "{count}명의 사용자 삭제 요청을 취소했습니다",
      cancelDeletionPartialFailure: "성공: {successCount}, 실패: {failCount}",
      lastAdminDeleteNotAllowed: "마지막 관리자는 삭제할 수 없습니다"
    },
    cognito: {
      usernameExists: "이미 등록된 사용자입니다",
      invalidParameter: "잘못된 파라미터입니다",
      invalidPassword: "잘못된 비밀번호입니다",
      confirmationCodeIncorrect: "인증 코드가 올바르지 않습니다",
      confirmationCodeExpired: "인증 코드가 만료되었습니다",
      userCreationFailed: "Cognito 사용자 생성 실패",
      confirmationFailed: "가입 확인 실패",
      userNotFound: "사용자를 찾을 수 없습니다",
      emailSendFailed: "이메일 전송 실패",
      signInFailed: "로그인 실패",
      passwordResetRequired: "비밀번호 재설정이 필요합니다",
      accountNotConfirmed: "계정이 확인되지 않았습니다. 이메일 인증을 완료해주세요"
    },
    stripe: {
      customerCreationFailed: "Stripe 고객 생성 실패",
      customerNotFound: "고객을 찾을 수 없습니다",
      setupIntentCreationFailed: "Setup Intent 생성 실패",
      paymentMethodNotFound: "결제 수단을 찾을 수 없습니다",
      paymentMethodDetachFailed: "결제 수단 분리 실패",
      paymentHistoryFetchFailed: "결제 내역 조회 실패",
      defaultPaymentMethodSetFailed: "기본 결제 수단 설정 실패",
      addressUpdateFailed: "주소 업데이트 실패",
      invalidLocale: "잘못된 로케일이 지정되었습니다",
      customerIdRequired: "고객 ID는 필수입니다",
      paymentMethodIdRequired: "결제 수단 ID는 필수입니다",
      addressRequired: "주소는 필수입니다",
      nameRequired: "이름은 필수입니다",
      emailRequired: "이메일은 필수입니다",
      userAttributesRequired: "사용자 속성은 필수입니다",
      invalidAddress: "잘못된 주소 형식입니다",
      stripeError: "Stripe API 오류가 발생했습니다",
      updateFailed: "업데이트에 실패했습니다",
      validationError: "입력 내용에 문제가 있습니다",
      cardError: "카드 오류",
      requestError: "요청 오류",
      apiError: "API 오류",
      connectionError: "연결 오류가 발생했습니다",
      authenticationError: "인증 오류가 발생했습니다"
    },
    api: {
      invalidRequest: "잘못된 요청입니다",
      missingParameters: "필수 파라미터가 누락되었습니다",
      serverError: "내부 서버 오류",
      validationFailed: "요청 검증 실패",
      authenticationRequired: "인증이 필요합니다",
      accessDenied: "접근이 거부되었습니다",
      notFound: "리소스를 찾을 수 없습니다",
      methodNotAllowed: "허용되지 않은 메서드",
      conflictError: "리소스 충돌",
      rateLimitExceeded: "요청 한도를 초과했습니다"
    },
    verificationEmail: {
      sendFailed: "인증 이메일 전송에 실패했습니다",
      templateNotFound: "이메일 템플릿을 찾을 수 없습니다",
      messageRejected: "이메일이 거부되었습니다(수신자가 유효하지 않을 수 있음)",
      sendingPaused: "이메일 전송이 일시 중지되었습니다",
      mailFromDomainNotVerified: "보내는 도메인이 인증되지 않았습니다",
      configurationSetNotFound: "SES 구성 세트를 찾을 수 없습니다",
      invalidTemplate: "이메일 템플릿이 잘못되었습니다",
      invalidAwsCredentials: "AWS 자격 증명이 잘못되었습니다",
      invalidParameters: "매개변수가 잘못되었습니다"
    }
  },
  "fields": {
    "userName": "사용자명",
    "email": "이메일",
    "department": "부서",
    "position": "직책",
    "role": "역할"
  },
  messages: {
    dataUsage: {
      createSuccess: "데이터 이용 기록이 생성되었습니다",
      updateSuccess: "데이터 이용이 업데이트되었습니다"
    },
    policy: {
      createSuccess: "정책이 생성되었습니다",
      updateSuccess: "정책이 업데이트되었습니다",
      deleteSuccess: "정책이 삭제되었습니다"
    },
    user: {
      createSuccess: "사용자가 생성되었습니다",
      updateSuccess: "사용자 정보가 업데이트되었습니다",
      deleteSuccess: "사용자가 삭제되었습니다"
    },
    group: {
      createSuccess: "그룹이 생성되었습니다",
      updateSuccess: "그룹이 업데이트되었습니다",
      deleteSuccess: "그룹이 삭제되었습니다"
    },
    groupPolicy: {
      createSuccess: "그룹 정책이 생성되었습니다",
      deleteSuccess: "그룹 정책이 삭제되었습니다"
    },
    userGroup: {
      createSuccess: "사용자 그룹이 생성되었습니다",
      updateSuccess: "사용자 그룹이 업데이트되었습니다",
      deleteSuccess: "사용자 그룹이 삭제되었습니다"
    },
    newOrderRequest: {
      createSuccess: "신규 의뢰 요청이 생성되었습니다",
      updateSuccess: "신규 의뢰 요청이 업데이트되었습니다",
      deleteSuccess: "신규 의뢰 요청이 삭제되었습니다"
    },
    newOrderReply: {
      createSuccess: "신규 의뢰 답변이 생성되었습니다",
      updateSuccess: "신규 의뢰 답변이 업데이트되었습니다",
      deleteSuccess: "신규 의뢰 답변이 삭제되었습니다"
    },
    supportRequest: {
      createSuccess: "지원 요청이 생성되었습니다",
      updateSuccess: "지원 요청이 업데이트되었습니다",
      deleteSuccess: "지원 요청이 삭제되었습니다"
    },
    supportReply: {
      createSuccess: "지원 답변이 생성되었습니다",
      updateSuccess: "지원 답변이 업데이트되었습니다",
      deleteSuccess: "지원 답변이 삭제되었습니다"
    },
    limitUsage: {
      createSuccess: "이용 제한이 생성되었습니다",
      updateSuccess: "이용 제한이 업데이트되었습니다",
      deleteSuccess: "이용 제한이 삭제되었습니다"
    },
    recipient: {
      createSuccess: "수신자가 생성되었습니다",
      updateSuccess: "수신자가 업데이트되었습니다",
      deleteSuccess: "수신자가 삭제되었습니다",
      bulkUpdateSuccess: "{count}명의 수신자를 업데이트했습니다"
    },
    auditLog: {
      createSuccess: "감사 로그가 생성되었습니다",
      recordSuccess: "감사 로그가 기록되었습니다"
    },
    stripe: {
      customerCreateSuccess: "고객이 생성되었습니다",
      setupIntentCreateSuccess: "Setup Intent가 생성되었습니다",
      paymentMethodDeleteSuccess: "결제 수단이 삭제되었습니다",
      paymentHistoryFetchSuccess: "결제 내역을 가져왔습니다",
      defaultPaymentMethodSetSuccess: "기본 결제 수단이 설정되었습니다",
      addressUpdateSuccess: "주소가 업데이트되었습니다"
    },
    api: {
      requestSuccess: "요청이 완료되었습니다",
      operationCompleted: "작업이 완료되었습니다"
    },
    verificationEmail: {
      sendSuccess: "인증 이메일이 발송되었습니다"
    },
    cognito: {
      emailVerificationCompleted: "이메일 인증이 완료되었습니다",
      signInStarted: "로그인 프로세스가 시작되었습니다"
    }
  }
} as const;

export default ko;


