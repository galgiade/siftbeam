const zhCN = {
  errors: {
    general: {
      serverError: "发生服务器错误",
      networkError: "发生网络错误",
      unauthorized: "需要认证",
      forbidden: "访问被拒绝",
      notFound: "未找到资源",
      validationError: "输入数据无效",
      conflict: "发生数据冲突",
      unexpectedError: "发生意外错误",
      unknownError: "发生未知错误",
      targetNotFound: "未找到要更新的对象",
      operationFailed: "操作执行失败",
      processingError: "处理过程中发生错误",
      relatedResourceDeleteError: "删除相关资源时发生错误",
      partialOperationFailed: "部分操作失败",
      rollbackFailed: "回滚处理失败"
    },
    auth: {
      notAuthenticated: "未认证",
      insufficientPermissions: "权限不足",
      accessDenied: "访问被拒绝",
      companyNotSet: "未设置公司信息",
      adminRightsRequired: "需要管理员权限",
      adminPermissionRequired: "需要管理员权限",
      codeIncorrect: "验证码不正确",
      codeExpired: "验证码已过期",
      userNotFound: "未找到用户",
      signInFailed: "登录失败",
      credentialsIncorrect: "邮箱或密码不正确",
      accountNotConfirmed: "账户未确认。请完成邮箱验证",
      passwordResetRequired: "需要重置密码",
      userNotAuthenticated: "用户未认证",
      getCurrentUserFailed: "获取当前用户失败",
      missingParameters: "缺少必需参数: userId, email",
      check2FAStatusFailed: "检查2FA状态失败",
      missingEmailParameters: "缺少必需参数: userId, newEmail, userPoolId",
      invalidEmailFormat: "无效的电子邮件格式",
      cognitoEmailUpdateSuccess: "Cognito电子邮件更新成功",
      cognitoEmailUpdateFailed: "Cognito电子邮件更新失败",
      userNotFoundInCognito: "在Cognito中未找到用户",
      invalidEmailOrUserId: "无效的电子邮件格式或用户ID",
      notAuthorizedToUpdateUser: "无权更新用户",
      missingUsernameParameters: "缺少必需参数: userId, newUsername, userPoolId",
      invalidUsernameFormat: "无效的用户名格式",
      cognitoUsernameUpdateSuccess: "Cognito用户名更新成功",
      cognitoUsernameUpdateFailed: "Cognito用户名更新失败",
      invalidUsernameOrUserId: "无效的用户名格式或用户ID",
      usernameAlreadyExists: "用户名已存在",
      missingVerificationParameters: "缺少必需参数: userId, email, code, userPoolId",
      verificationCodeNotFound: "验证码未找到或已过期",
      verificationCodeExpired: "验证码已过期",
      tooManyFailedAttempts: "失败尝试次数过多",
      invalidVerificationCode: "无效的验证码",
      emailVerificationSuccess: "电子邮件验证成功，Cognito已更新",
      emailVerificationFailed: "验证电子邮件代码失败",
      missingStoreParameters: "缺少必需参数: userId, email, code, userType",
      verificationCodeStoredSuccess: "验证码存储成功",
      verificationCodeStoreFailed: "验证码存储失败"
    },
    validation: {
      userIdRequired: "需要用户 ID",
      customerIdRequired: "需要客户 ID",
      groupIdRequired: "需要群组 ID",
      policyIdRequired: "需要策略 ID",
      supportRequestIdRequired: "需要支持请求 ID",
      newOrderRequestIdRequired: "需要新订单请求 ID",
      statusRequired: "需要状态",
      userGroupIdRequired: "需要用户组 ID",
      groupIdRequiredForValidation: "需要群组 ID",
      userIdRequiredForValidation: "需要用户 ID",
      fieldRequired: "此字段为必填项",
      validEmailRequired: "请输入有效的邮箱地址",
      minLength: "至少需要 {count} 个字符",
      maxLength: "最多允许 {count} 个字符",
      passwordMinLength: "密码至少 8 个字符",
      passwordUppercase: "必须包含大写字母",
      passwordLowercase: "必须包含小写字母",
      passwordNumber: "必须包含数字",
      passwordSpecialChar: "必须包含特殊字符",
      passwordMismatch: "两次密码不一致",
      userNameRequired: "需要用户名",
      emailRequired: "需要邮箱",
      companyIdRequired: "需要公司 ID",
      departmentRequired: "需要部门",
      positionRequired: "需要职位",
      roleRequired: "需要角色",
      usageMinZero: "用量必须大于等于 0",
      positiveNumber: "必须为正数",
      nonNegativeNumber: "必须大于等于 0",
      invalidEmail: "请输入有效的邮箱地址",
      required: "此字段为必填项",
      policyIdsMinOne: "请至少选择一个策略",
      userIdsMinOne: "请至少选择一个用户",
      emailsMinOne: "请至少指定一个邮箱地址",
      emailsValid: "请输入有效的邮箱地址",
      invalidExceedAction: "请为超额动作选择通知或限制",
      invalidNotifyType: "请为通知方式选择金额或用量",
      invalidUnit: "单位请选择 KB、MB、GB 或 TB",
      invalidAiTrainingUsage: "请为 AI 训练使用选择允许或拒绝",
      invalidStatus: "状态请选择 OPEN、IN_PROGRESS 或 CLOSED",
      invalidIssueType: "问题类型请选择 technical、account、billing 或 other",
      invalidAction: "动作请选择 READ、CREATE、UPDATE、DELETE、ATTACH 或 DETACH",
      invalidResource: "资源类型无效",
      invalidDataType: "数据类型请选择 table、image 或 text",
      invalidModelType: "模型类型请选择 clustering、prediction 或 classification",
      notifyTypeAmountRequired: "请根据通知方式输入金额或用量",
      notifyTypeUsageRequired: "选择用量通知时必须选择单位 (KB, MB, GB, TB)",
      usageUnitRequired: "选择用量通知时必须选择单位 (KB, MB, GB, TB)",
      companyNameRequired: "公司名称为必填项",
      stateRequired: "州/省为必填项",
      cityRequired: "城市为必填项",
      streetAddressRequired: "地址为必填项",
      groupNameRequired: "群组名称为必填项",
      policyNameRequired: "策略名称为必填项",
      subjectRequired: "主题为必填项",
      descriptionRequired: "说明为必填项",
      messageRequired: "消息为必填项",
      resourceNameRequired: "资源名称为必填项",
      preferredUsernameRequired: "用户名为必填项",
      localeRequired: "语言区域为必填项",
      confirmationCodeRequired: "验证码为必填项",
      challengeResponseRequired: "质询响应为必填项",
      limitUsageIdRequired: "需要使用上限 ID",
      isStaffInvalid: "员工标志必须为布尔值"
    },
    user: {
      fetchFailed: "获取用户信息失败",
      accessDenied: "无权访问此用户信息",
      notFound: "未找到用户",
      companyAccessDenied: "无权访问该公司的用户信息",
      batchFetchFailed: "获取多个用户信息时发生错误",
      updateFailed: "更新用户信息失败",
      createFailed: "创建用户失败",
      deleteFailed: "删除用户失败",
      userGroupFetchFailed: "获取用户组信息失败",
      userGroupDeleteFailed: "删除用户组失败",
      rollbackFailed: "删除回滚处理失败",
      noUpdateFields: "未指定更新字段",
      updateError: "更新用户时发生错误",
      userNameEmpty: "用户名不能为空",
      emailEmpty: "邮箱不能为空",
      departmentEmpty: "部门不能为空",
      positionEmpty: "职位不能为空",
      roleEmpty: "角色不能为空",
      fieldRequired: "{field}不能为空"
    },
    policy: {
      fetchFailed: "获取策略信息失败",
      accessDenied: "无权访问该策略信息",
      batchFetchFailed: "获取多个客户策略信息时出错",
      createFailed: "创建策略失败",
      updateFailed: "更新策略失败",
      deleteFailed: "删除策略失败",
      idRequired: "需要有效的策略 ID",
      notFound: "未找到指定策略",
      noUpdateFields: "未指定更新字段",
      updateError: "更新策略时发生错误"
    },
    group: {
      fetchFailed: "获取群组失败",
      accessDenied: "访问被拒绝",
      listFetchFailed: "获取群组列表失败",
      updateFailed: "更新群组失败",
      createFailed: "创建群组失败",
      deleteFailed: "删除群组失败",
      userGroupDeleteFailed: "删除用户组失败",
      groupPolicyDeleteFailed: "删除群组策略失败",
      rollbackFailed: "删除回滚处理失败"
    },
    userGroup: {
      fetchFailed: "获取用户组信息失败",
      accessDenied: "无权访问该用户组信息",
      batchFetchFailed: "获取多个用户组信息时发生错误",
      companyFetchFailed: "基于客户 ID 获取用户组信息失败",
      groupFetchFailed: "基于群组 ID 获取用户组信息失败",
      userFetchFailed: "基于用户 ID 获取用户组信息失败",
      membershipCheckFailed: "检查用户组成员资格失败",
      createFailed: "创建用户组失败",
      updateFailed: "更新用户组失败",
      deleteFailed: "删除用户组失败",
      noUpdateFields: "未指定更新字段",
      updateError: "更新用户组时发生错误"
    },
    groupPolicy: {
      fetchFailed: "获取群组策略信息失败",
      accessDenied: "无权访问该群组策略信息",
      batchFetchFailed: "获取多个群组策略信息时发生错误",
      policyFetchFailed: "基于策略 ID 获取群组策略信息失败",
      groupFetchFailed: "基于群组 ID 获取群组策略信息失败",
      createFailed: "创建群组策略失败",
      deleteFailed: "删除群组策略失败"
    },
    supportRequest: {
      fetchFailed: "获取支持请求信息失败",
      accessDenied: "无权访问该支持请求信息",
      notFound: "未找到指定 ID 的支持请求",
      otherCompanyAccessDenied: "无权访问其他公司的支持请求信息",
      userAccessDenied: "无权访问该用户的支持请求信息",
      batchFetchFailed: "获取多个支持请求信息时发生错误",
      statusBatchFetchFailed: "获取多个状态的支持请求信息时发生错误",
      userBatchFetchFailed: "获取多个用户支持请求信息时发生错误",
      customerBatchFetchFailed: "获取多个客户支持请求信息时发生错误",
      createFailed: "创建支持请求失败",
      updateFailed: "更新支持请求失败",
      deleteFailed: "删除支持请求失败",
      validationError: "支持请求输入存在问题",
      updateError: "更新支持请求时发生错误",
      noUpdateFields: "未指定更新字段"
    },
    supportReply: {
      fetchFailed: "获取支持回复信息失败",
      accessDenied: "无权访问该支持回复信息",
      createFailed: "创建支持回复失败",
      updateFailed: "更新支持回复失败",
      deleteFailed: "删除支持回复失败",
      notFound: "未找到指定 ID 的支持回复",
      updateError: "更新支持回复时发生错误",
      noUpdateFields: "未指定更新字段"
    },
    newOrder: {
      fetchFailed: "获取新订单信息失败",
      accessDenied: "无权访问该新订单信息",
      notFound: "未找到指定 ID 的新订单",
      otherCompanyAccessDenied: "无权访问其他公司的新订单信息",
      batchFetchFailed: "获取多个新订单信息时发生错误",
      customerBatchFetchFailed: "获取多个客户新订单信息时发生错误"
    },
    newOrderRequest: {
      createFailed: "创建新订单请求失败",
      updateFailed: "更新新订单请求失败",
      deleteFailed: "删除新订单请求失败"
    },
    newOrderReply: {
      fetchFailed: "获取新订单回复信息失败",
      createFailed: "创建新订单回复失败",
      updateFailed: "更新新订单回复失败",
      deleteFailed: "删除新订单回复失败"
    },
    auditLog: {
      customerIdRequired: "需要客户 ID",
      userIdOrCustomerIdRequired: "需要用户 ID 或客户 ID",
      resourceNameOrCustomerIdRequired: "需要资源名称或客户 ID",
      createFailed: "创建审计日志失败",
      validationFailed: "审计日志验证失败",
      recordFailed: "记录审计日志失败"
    },
    dataUsage: {
      userIdRequired: "需要用户 ID",
      customerIdRequired: "需要客户 ID",
      fetchFailed: "获取数据使用信息失败",
      createFailed: "创建数据使用记录失败",
      updateFailed: "更新数据使用失败",
      noUpdateFields: "未指定更新字段",
      updateFieldRequired: "请至少指定一个要更新的字段",
      notFound: "未找到要更新的数据使用记录",
      updateError: "更新数据使用时发生错误"
    },
    limitUsage: {
      createFailed: "创建使用上限失败",
      updateFailed: "更新使用上限失败",
      deleteFailed: "删除使用上限失败",
      deleteOperationFailed: "删除使用上限失败",
      deleteProcessingError: "删除使用上限时发生错误",
      unknownResource: "未知"
    },
    recipient: {
      fetchFailed: "获取收件人信息失败",
      accessDenied: "无权访问该收件人信息",
      notFound: "未找到收件人",
      createFailed: "创建收件人失败",
      updateFailed: "更新收件人失败",
      deleteFailed: "删除收件人失败",
      limitUsageIdRequired: "需要使用上限 ID",
      noUpdateFields: "未指定更新字段",
      updateError: "更新收件人时发生错误",
      createError: "创建收件人时发生错误",
      partialUpdateFailed: "部分收件人更新失败"
    },
    delete: {
      userDeleteFailed: "删除用户失败",
      cognitoUserDeleteFailed: "删除 Cognito 用户失败",
      partialDeleteFailed: "部分或全部用户的删除请求取消失败",
      authDeleteFailed: "删除认证信息失败",
      dbDeleteFailed: "删除数据库用户失败",
      cancelRequestFailed: "取消删除请求时发生错误",
      cancelRequestProcessingError: "删除请求取消过程中发生错误",
      userDeleteSuccess: "用户删除成功",
      cognitoUserDeleteSuccess: "Cognito 用户删除成功",
      relatedResourceDeleteError: "删除相关资源时发生错误",
      userNotFoundForDeletion: "未找到要删除的用户",
      bulkDeleteNoTargets: "未指定删除对象",
      bulkDeletePartialFailure: "部分用户删除失败",
      cancelDeletionSuccess: "已为 {count} 位用户完成删除请求取消",
      cancelDeletionPartialFailure: "成功: {successCount}，失败: {failCount}",
      lastAdminDeleteNotAllowed: "无法删除最后一个管理员用户"
    },
    cognito: {
      usernameExists: "用户已注册",
      invalidParameter: "参数无效",
      invalidPassword: "密码无效",
      confirmationCodeIncorrect: "确认码不正确",
      confirmationCodeExpired: "确认码已过期",
      userCreationFailed: "创建 Cognito 用户失败",
      confirmationFailed: "确认注册失败",
      userNotFound: "未找到用户",
      emailSendFailed: "发送邮件失败",
      signInFailed: "登录失败",
      passwordResetRequired: "需要重置密码",
      accountNotConfirmed: "账户未确认。请完成邮箱验证"
    },
    stripe: {
      customerCreationFailed: "创建 Stripe 客户失败",
      customerNotFound: "未找到客户",
      setupIntentCreationFailed: "创建 Setup Intent 失败",
      paymentMethodNotFound: "未找到支付方式",
      paymentMethodDetachFailed: "解绑支付方式失败",
      paymentHistoryFetchFailed: "获取支付历史失败",
      defaultPaymentMethodSetFailed: "设置默认支付方式失败",
      addressUpdateFailed: "更新地址失败",
      invalidLocale: "指定的语言区域无效",
      customerIdRequired: "需要客户 ID",
      paymentMethodIdRequired: "需要支付方式 ID",
      addressRequired: "需要地址",
      nameRequired: "需要姓名",
      emailRequired: "需要邮箱",
      userAttributesRequired: "需要用户属性",
      invalidAddress: "地址格式无效",
      stripeError: "发生 Stripe API 错误",
      updateFailed: "更新失败",
      validationError: "输入内容有问题",
      cardError: "卡片错误",
      requestError: "请求错误",
      apiError: "API 错误",
      connectionError: "发生连接错误",
      authenticationError: "发生认证错误"
    },
    api: {
      invalidRequest: "无效的请求",
      missingParameters: "缺少必需参数",
      serverError: "服务器内部错误",
      validationFailed: "请求验证失败",
      authenticationRequired: "需要认证",
      accessDenied: "访问被拒绝",
      notFound: "未找到资源",
      methodNotAllowed: "不允许的方法",
      conflictError: "资源冲突",
      rateLimitExceeded: "超过速率限制"
    },
    verificationEmail: {
      sendFailed: "发送验证码邮件失败",
      templateNotFound: "未找到邮件模板",
      messageRejected: "邮件被拒收（收件人可能无效）",
      sendingPaused: "邮件发送暂时暂停",
      mailFromDomainNotVerified: "发件域名未验证",
      configurationSetNotFound: "未找到 SES 配置集",
      invalidTemplate: "邮件模板无效",
      invalidAwsCredentials: "AWS 凭证无效",
      invalidParameters: "参数无效"
    }
  },
  "fields": {
    "userName": "用户名",
    "email": "邮箱",
    "department": "部门",
    "position": "职位",
    "role": "角色"
  },
  messages: {
    dataUsage: {
      createSuccess: "已成功创建数据使用记录",
      updateSuccess: "数据使用更新成功"
    },
    policy: {
      createSuccess: "策略创建成功",
      updateSuccess: "策略更新成功",
      deleteSuccess: "策略删除成功"
    },
    user: {
      createSuccess: "用户创建成功",
      updateSuccess: "用户信息更新成功",
      deleteSuccess: "用户删除成功"
    },
    group: {
      createSuccess: "群组创建成功",
      updateSuccess: "群组更新成功",
      deleteSuccess: "群组删除成功"
    },
    groupPolicy: {
      createSuccess: "群组策略创建成功",
      deleteSuccess: "群组策略删除成功"
    },
    userGroup: {
      createSuccess: "用户组创建成功",
      updateSuccess: "用户组更新成功",
      deleteSuccess: "用户组删除成功"
    },
    newOrderRequest: {
      createSuccess: "新订单请求创建成功",
      updateSuccess: "新订单请求更新成功",
      deleteSuccess: "新订单请求删除成功"
    },
    newOrderReply: {
      createSuccess: "新订单回复创建成功",
      updateSuccess: "新订单回复更新成功",
      deleteSuccess: "新订单回复删除成功"
    },
    supportRequest: {
      createSuccess: "支持请求创建成功",
      updateSuccess: "支持请求更新成功",
      deleteSuccess: "支持请求删除成功"
    },
    supportReply: {
      createSuccess: "支持回复创建成功",
      updateSuccess: "支持回复更新成功",
      deleteSuccess: "支持回复删除成功"
    },
    limitUsage: {
      createSuccess: "使用上限创建成功",
      updateSuccess: "使用上限更新成功",
      deleteSuccess: "使用上限删除成功"
    },
    recipient: {
      createSuccess: "收件人创建成功",
      updateSuccess: "收件人更新成功",
      deleteSuccess: "收件人删除成功",
      bulkUpdateSuccess: "已成功更新 {count} 位收件人"
    },
    auditLog: {
      createSuccess: "审计日志创建成功",
      recordSuccess: "审计日志记录成功"
    },
    stripe: {
      customerCreateSuccess: "客户创建成功",
      setupIntentCreateSuccess: "Setup Intent 创建成功",
      paymentMethodDeleteSuccess: "支付方式删除成功",
      paymentHistoryFetchSuccess: "支付历史获取成功",
      defaultPaymentMethodSetSuccess: "默认支付方式设置成功",
      addressUpdateSuccess: "地址更新成功"
    },
    api: {
      requestSuccess: "请求已成功完成",
      operationCompleted: "操作已成功完成"
    },
    verificationEmail: {
      sendSuccess: "验证码邮件已发送"
    },
    cognito: {
      emailVerificationCompleted: "邮箱验证完成",
      signInStarted: "登录流程已开始"
    }
  }
}

export default zhCN;


