const ja = {
  "errors": {
    "general": {
      "serverError": "サーバーエラーが発生しました",
      "networkError": "ネットワークエラーが発生しました",
      "unauthorized": "認証が必要です",
      "forbidden": "アクセス権限がありません",
      "notFound": "リソースが見つかりません",
      "validationError": "入力データが不正です",
      "conflict": "データの競合が発生しました",
      "unexpectedError": "予期せぬエラーが発生しました",
      "unknownError": "不明なエラーが発生しました",
      "targetNotFound": "更新対象が見つかりません",
      "operationFailed": "操作の実行に失敗しました",
      "processingError": "処理中にエラーが発生しました",
      "relatedResourceDeleteError": "関連リソースの削除中にエラーが発生しました",
      "partialOperationFailed": "一部の操作に失敗しました",
      "rollbackFailed": "ロールバック処理に失敗しました"
    },
    "auth": {
      "notAuthenticated": "認証されていません",
      "insufficientPermissions": "権限が不足しています",
      "accessDenied": "アクセス権限がありません",
      "companyNotSet": "会社情報が設定されていません",
      "adminRightsRequired": "管理者権限がありません",
      "adminPermissionRequired": "管理者権限が必要です",
      "codeIncorrect": "認証コードが正しくありません",
      "codeExpired": "認証コードの有効期限が切れています",
      "userNotFound": "ユーザーが見つかりません",
      "signInFailed": "サインインに失敗しました",
      "credentialsIncorrect": "メールアドレスまたはパスワードが正しくありません",
      "accountNotConfirmed": "アカウントが確認されていません。メール認証を完了してください",
      "passwordResetRequired": "パスワードのリセットが必要です",
      "userNotAuthenticated": "ユーザーが認証されていません",
      "getCurrentUserFailed": "現在のユーザー情報の取得に失敗しました",
      "missingParameters": "必須パラメータが不足しています: userId, email",
      "check2FAStatusFailed": "2段階認証状態の確認に失敗しました",
      "missingEmailParameters": "必須パラメータが不足しています: userId, newEmail, userPoolId",
      "invalidEmailFormat": "無効なメールアドレス形式です",
      "cognitoEmailUpdateSuccess": "Cognitoメールアドレスの更新に成功しました",
      "cognitoEmailUpdateFailed": "Cognitoメールアドレスの更新に失敗しました",
      "userNotFoundInCognito": "Cognitoでユーザーが見つかりません",
      "invalidEmailOrUserId": "無効なメールアドレス形式またはユーザーIDです",
      "notAuthorizedToUpdateUser": "ユーザーの更新権限がありません",
      "missingUsernameParameters": "必須パラメータが不足しています: userId, newUsername, userPoolId",
      "invalidUsernameFormat": "無効なユーザー名形式です",
      "cognitoUsernameUpdateSuccess": "Cognitoユーザー名の更新に成功しました",
      "cognitoUsernameUpdateFailed": "Cognitoユーザー名の更新に失敗しました",
      "invalidUsernameOrUserId": "無効なユーザー名形式またはユーザーIDです",
      "usernameAlreadyExists": "ユーザー名は既に存在します",
      "missingVerificationParameters": "必須パラメータが不足しています: userId, email, code, userPoolId",
      "verificationCodeNotFound": "認証コードが見つからないか期限切れです",
      "verificationCodeExpired": "認証コードの有効期限が切れています",
      "tooManyFailedAttempts": "試行回数が上限に達しました",
      "invalidVerificationCode": "無効な認証コードです",
      "emailVerificationSuccess": "メール認証が成功し、Cognitoが更新されました",
      "emailVerificationFailed": "メール認証コードの確認に失敗しました",
      "missingStoreParameters": "必須パラメータが不足しています: userId, email, code, userType",
      "verificationCodeStoredSuccess": "認証コードの保存に成功しました",
      "verificationCodeStoreFailed": "認証コードの保存に失敗しました"
    },
    "validation": {
      "userIdRequired": "ユーザーIDが指定されていません",
      "customerIdRequired": "顧客IDが指定されていません",
      "groupIdRequired": "グループIDが指定されていません",
      "policyIdRequired": "ポリシーIDが指定されていません",
      "supportRequestIdRequired": "サポートリクエストIDが指定されていません",
      "newOrderRequestIdRequired": "新規注文リクエストIDが指定されていません",
      "statusRequired": "ステータスが指定されていません",
      "userGroupIdRequired": "ユーザーグループIDは必須です",
      "groupIdRequiredForValidation": "グループIDは必須です",
      "userIdRequiredForValidation": "ユーザーIDは必須です",
      "fieldRequired": "このフィールドは必須です",
      "validEmailRequired": "有効なメールアドレスを入力してください",
      "minLength": "{count}文字以上必要です",
      "maxLength": "{count}文字以内で入力してください",
      "passwordMinLength": "パスワードは8文字以上必要です",
      "passwordUppercase": "大文字を含める必要があります",
      "passwordLowercase": "小文字を含める必要があります",
      "passwordNumber": "数字を含める必要があります",
      "passwordSpecialChar": "特殊文字を含める必要があります",
      "passwordMismatch": "パスワードが一致しません",
      "userNameRequired": "ユーザー名は必須です",
      "emailRequired": "メールアドレスは必須です",
      "companyIdRequired": "会社IDは必須です",
      "departmentRequired": "部署は必須です",
      "positionRequired": "役職は必須です",
      "roleRequired": "権限は必須です",
      "usageMinZero": "使用量は0以上である必要があります",
      "positiveNumber": "正の値である必要があります",
      "nonNegativeNumber": "0以上である必要があります",
      "invalidEmail": "有効なメールアドレスを入力してください",
      "required": "このフィールドは必須です",
      // 配列バリデーション
      "policyIdsMinOne": "少なくとも1つのポリシーを選択してください",
      "userIdsMinOne": "少なくとも1人のユーザーを選択してください",
      "emailsMinOne": "少なくとも1つのメールアドレスを指定してください",
      "emailsValid": "有効なメールアドレスを入力してください",
      // Enum バリデーション
      "invalidExceedAction": "超過時のアクションは notify または restrict を選択してください",
      "invalidNotifyType": "通知方法は amount または usage を選択してください",
      "invalidUnit": "単位は KB, MB, GB, TB のいずれかを選択してください",
      "invalidAiTrainingUsage": "AI学習利用可否は allow または deny を選択してください",
      "invalidStatus": "状態は OPEN, IN_PROGRESS, CLOSED のいずれかを選択してください",
      "invalidIssueType": "問題の種類は technical, account, billing, other のいずれかを選択してください",
      "invalidAction": "アクションは READ, CREATE, UPDATE, DELETE, ATTACH, DETACH のいずれかを選択してください",
      "invalidResource": "リソースタイプが無効です",
      "invalidDataType": "データの種類は table, image, text のいずれかを選択してください",
      "invalidModelType": "モデルの種類は clustering, prediction, classification のいずれかを選択してください",
      // Refine バリデーション
      "notifyTypeAmountRequired": "通知方法に応じて金額または利用量を入力してください",
      "notifyTypeUsageRequired": "利用量での通知を選択した場合、単位（KB, MB, GB, TB）の選択が必要です",
      "usageUnitRequired": "利用量での通知を選択した場合、単位（KB, MB, GB, TB）の選択が必要です",
      // フィールド固有バリデーション
      "companyNameRequired": "会社名は必須です",
      "stateRequired": "都道府県は必須です",
      "cityRequired": "市区町村は必須です",
      "streetAddressRequired": "住所は必須です",
      "groupNameRequired": "グループ名は必須です",
      "policyNameRequired": "ポリシー名は必須です",
      "subjectRequired": "件名は必須です",
      "descriptionRequired": "詳細説明は必須です",
      "messageRequired": "メッセージは必須です",
      "resourceNameRequired": "リソース名は必須です",
      "preferredUsernameRequired": "ユーザー名は必須です",
      "localeRequired": "ロケールは必須です",
      "confirmationCodeRequired": "認証コードは必須です",
      "challengeResponseRequired": "認証コードは必須です",
      "limitUsageIdRequired": "使用制限IDは必須です",
      "isStaffInvalid": "スタッフフラグはブール値である必要があります"
    },
    "user": {
      "fetchFailed": "ユーザー情報の取得に失敗しました",
      "accessDenied": "このユーザー情報へのアクセス権限がありません",
      "notFound": "ユーザーが見つかりません",
      "companyAccessDenied": "この会社のユーザー情報へのアクセス権限がありません",
      "batchFetchFailed": "複数ユーザー情報取得中にエラーが発生しました",
      "updateFailed": "ユーザー情報の更新に失敗しました",
      "createFailed": "ユーザーの作成に失敗しました",
      "deleteFailed": "ユーザーの削除に失敗しました",
      "userGroupFetchFailed": "ユーザーグループ情報の取得に失敗しました",
      "userGroupDeleteFailed": "ユーザーグループの削除に失敗しました",
      "rollbackFailed": "削除処理のロールバックに失敗しました",
      "noUpdateFields": "更新するフィールドが指定されていません",
      "updateError": "ユーザーの更新中にエラーが発生しました",
      "userNameEmpty": "ユーザー名は空文字にできません",
      "emailEmpty": "メールアドレスは空文字にできません",
      "departmentEmpty": "部署は空文字にできません",
      "positionEmpty": "役職は空文字にできません",
      "roleEmpty": "ロールは空文字にできません",
      "fieldRequired": "{field}は必須です"
    },
    "policy": {
      "fetchFailed": "ポリシー情報の取得に失敗しました",
      "accessDenied": "このポリシー情報へのアクセス権限がありません",
      "batchFetchFailed": "複数顧客ポリシー情報取得中にエラーが発生しました",
      "createFailed": "ポリシーの作成に失敗しました",
      "updateFailed": "ポリシーの更新に失敗しました",
      "deleteFailed": "ポリシーの削除に失敗しました",
      "idRequired": "有効なポリシーIDを指定してください",
      "notFound": "指定されたポリシーが見つかりません",
      "noUpdateFields": "更新するフィールドが指定されていません",
      "updateError": "ポリシーの更新中にエラーが発生しました"
    },
    "group": {
      "fetchFailed": "グループの取得に失敗しました",
      "accessDenied": "アクセス権限がありません",
      "listFetchFailed": "グループ一覧の取得に失敗しました",
      "updateFailed": "グループの更新に失敗しました",
      "createFailed": "グループの作成に失敗しました",
      "deleteFailed": "グループの削除に失敗しました",
      "userGroupDeleteFailed": "ユーザーグループの削除に失敗しました",
      "groupPolicyDeleteFailed": "グループポリシーの削除に失敗しました",
      "rollbackFailed": "削除処理のロールバックに失敗しました"
    },
    "userGroup": {
      "fetchFailed": "ユーザーグループ情報の取得に失敗しました",
      "accessDenied": "このユーザーグループ情報へのアクセス権限がありません",
      "batchFetchFailed": "複数ユーザーグループ情報取得中にエラーが発生しました",
      "companyFetchFailed": "カスタマーIDに基づくユーザーグループ情報の取得に失敗しました",
      "groupFetchFailed": "グループIDに基づくユーザーグループ情報の取得に失敗しました",
      "userFetchFailed": "ユーザーIDに基づくユーザーグループ情報の取得に失敗しました",
      "membershipCheckFailed": "ユーザー所属グループの確認に失敗しました",
      "createFailed": "ユーザーグループの作成に失敗しました",
      "updateFailed": "ユーザーグループの更新に失敗しました",
      "deleteFailed": "ユーザーグループの削除に失敗しました",
      "noUpdateFields": "更新するフィールドが指定されていません",
      "updateError": "ユーザーグループの更新中にエラーが発生しました"
    },
    "groupPolicy": {
      "fetchFailed": "グループポリシー情報の取得に失敗しました",
      "accessDenied": "このグループポリシー情報へのアクセス権限がありません",
      "batchFetchFailed": "複数グループポリシー情報取得中にエラーが発生しました",
      "policyFetchFailed": "ポリシーIDに基づくグループポリシー情報の取得に失敗しました",
      "groupFetchFailed": "グループIDに基づくグループポリシー情報の取得に失敗しました",
      "createFailed": "グループポリシーの作成に失敗しました",
      "deleteFailed": "グループポリシーの削除に失敗しました"
    },
    "supportRequest": {
      "fetchFailed": "サポートリクエスト情報の取得に失敗しました",
      "accessDenied": "このサポートリクエスト情報へのアクセス権限がありません",
      "notFound": "指定されたIDのサポートリクエストが見つかりません",
      "otherCompanyAccessDenied": "他社のサポートリクエスト情報へのアクセス権限がありません",
      "userAccessDenied": "このユーザーのサポートリクエスト情報へのアクセス権限がありません",
      "batchFetchFailed": "複数サポートリクエスト情報取得中にエラーが発生しました",
      "statusBatchFetchFailed": "複数ステータスのサポートリクエスト情報取得中にエラーが発生しました",
      "userBatchFetchFailed": "複数ユーザーサポートリクエスト情報取得中にエラーが発生しました",
      "customerBatchFetchFailed": "複数顧客サポートリクエスト情報取得中にエラーが発生しました",
      "createFailed": "サポートリクエストの作成に失敗しました",
      "updateFailed": "サポートリクエストの更新に失敗しました",
      "deleteFailed": "サポートリクエストの削除に失敗しました",
      "validationError": "サポートリクエストの入力に問題があります",
      "updateError": "サポートリクエストの更新中にエラーが発生しました",
      "noUpdateFields": "更新するフィールドが指定されていません"
    },
    "supportReply": {
      "fetchFailed": "サポート返信情報の取得に失敗しました",
      "accessDenied": "このサポート返信情報へのアクセス権限がありません",
      "createFailed": "サポート返信の作成に失敗しました",
      "updateFailed": "サポート返信の更新に失敗しました",
      "deleteFailed": "サポート返信の削除に失敗しました",
      "notFound": "指定されたIDのサポート返信が見つかりません",
      "updateError": "サポート返信の更新中にエラーが発生しました",
      "noUpdateFields": "更新するフィールドが指定されていません"
    },
    "newOrder": {
      "fetchFailed": "新規注文情報の取得に失敗しました",
      "accessDenied": "この新規注文情報へのアクセス権限がありません",
      "notFound": "指定されたIDの新規注文が見つかりません",
      "otherCompanyAccessDenied": "他社の新規注文情報へのアクセス権限がありません",
      "batchFetchFailed": "複数新規注文情報取得中にエラーが発生しました",
      "customerBatchFetchFailed": "複数顧客新規注文情報取得中にエラーが発生しました"
    },
    "newOrderRequest": {
      "createFailed": "新規注文リクエストの作成に失敗しました",
      "updateFailed": "新規注文リクエストの更新に失敗しました",
      "deleteFailed": "新規注文リクエストの削除に失敗しました"
    },
    "newOrderReply": {
      "fetchFailed": "新規注文返信情報の取得に失敗しました",
      "createFailed": "新規注文返信の作成に失敗しました",
      "updateFailed": "新規注文返信の更新に失敗しました",
      "deleteFailed": "新規注文返信の削除に失敗しました"
    },
    "auditLog": {
      "customerIdRequired": "顧客IDが指定されていません",
      "userIdOrCustomerIdRequired": "ユーザーIDまたは顧客IDが指定されていません",
      "resourceNameOrCustomerIdRequired": "リソース名または顧客IDが指定されていません",
      "createFailed": "監査ログの作成に失敗しました",
      "validationFailed": "監査ログの検証に失敗しました",
      "recordFailed": "監査ログの記録に失敗しました"
    },
    "dataUsage": {
      "userIdRequired": "ユーザーIDが指定されていません",
      "customerIdRequired": "カスタマーIDが指定されていません",
      "fetchFailed": "データ使用量情報の取得に失敗しました",
      "createFailed": "データ使用量の記録の作成に失敗しました",
      "updateFailed": "データ使用量の更新に失敗しました",
      "noUpdateFields": "更新するフィールドが指定されていません",
      "updateFieldRequired": "少なくとも1つの更新フィールドを指定してください",
      "notFound": "更新対象のデータ使用量が見つかりません",
      "updateError": "データ使用量の更新中にエラーが発生しました"
    },
    "limitUsage": {
      "createFailed": "使用制限の作成に失敗しました",
      "updateFailed": "使用制限の更新に失敗しました",
      "deleteFailed": "使用制限の削除に失敗しました",
      "deleteOperationFailed": "使用制限の削除に失敗しました",
      "deleteProcessingError": "使用制限の削除中にエラーが発生しました",
      "unknownResource": "不明"
    },
    "recipient": {
      "fetchFailed": "受信者情報の取得に失敗しました",
      "accessDenied": "この受信者情報へのアクセス権限がありません",
      "notFound": "受信者が見つかりません",
      "createFailed": "受信者の作成に失敗しました",
      "updateFailed": "受信者の更新に失敗しました",
      "deleteFailed": "受信者の削除に失敗しました",
      "limitUsageIdRequired": "使用制限IDが指定されていません",
      "noUpdateFields": "更新するフィールドが指定されていません",
      "updateError": "受信者の更新中にエラーが発生しました",
      "createError": "受信者の作成中にエラーが発生しました",
      "partialUpdateFailed": "一部の受信者の更新に失敗しました"
    },
    "delete": {
      "userDeleteFailed": "ユーザー削除に失敗しました",
      "cognitoUserDeleteFailed": "Cognitoユーザー削除に失敗しました",
      "partialDeleteFailed": "一部または全てのユーザーの削除リクエスト取消に失敗しました",
      "authDeleteFailed": "認証情報の削除に失敗しました",
      "dbDeleteFailed": "データベースユーザーの削除に失敗しました",
      "cancelRequestFailed": "削除リクエスト取消中にエラーが発生しました",
      "cancelRequestProcessingError": "削除リクエスト取消中にエラーが発生しました",
      "userDeleteSuccess": "ユーザーを削除しました",
      "cognitoUserDeleteSuccess": "Cognitoユーザーを削除しました",
      "relatedResourceDeleteError": "関連リソースの削除中にエラーが発生しました",
      "userNotFoundForDeletion": "ユーザーの削除に失敗しました",
      "bulkDeleteNoTargets": "削除対象のユーザーIDが指定されていません",
      "bulkDeletePartialFailure": "一部のユーザーの削除に失敗しました",
      "cancelDeletionSuccess": "{count}件のユーザーの削除リクエスト取消が完了しました",
      "cancelDeletionPartialFailure": "成功: {successCount}件, 失敗: {failCount}件",
      "lastAdminDeleteNotAllowed": "管理者が1人しかいないため削除できません"
    },
    "cognito": {
      "usernameExists": "すでに登録されています",
      "invalidParameter": "パラメータが無効です",
      "invalidPassword": "パスワードが無効です",
      "confirmationCodeIncorrect": "認証コードが正しくありません",
      "confirmationCodeExpired": "認証コードの有効期限が切れています",
      "userCreationFailed": "Cognitoユーザーの作成に失敗しました",
      "confirmationFailed": "サインアップ確認に失敗しました",
      "userNotFound": "ユーザーが見つかりません",
      "emailSendFailed": "メール送信に失敗しました",
      "signInFailed": "サインインに失敗しました",
      "passwordResetRequired": "パスワードのリセットが必要です",
      "accountNotConfirmed": "アカウントが確認されていません。メール認証を完了してください"
    },
    "stripe": {
      "customerCreationFailed": "Stripe顧客の作成に失敗しました",
      "customerNotFound": "顧客が見つかりません",
      "setupIntentCreationFailed": "セットアップインテントの作成に失敗しました",
      "paymentMethodNotFound": "支払い方法が見つかりません",
      "paymentMethodDetachFailed": "支払い方法の削除に失敗しました",
      "paymentHistoryFetchFailed": "支払い履歴の取得に失敗しました",
      "defaultPaymentMethodSetFailed": "デフォルト支払い方法の設定に失敗しました",
      "addressUpdateFailed": "住所の更新に失敗しました",
      "invalidLocale": "無効なロケールが指定されました",
      "customerIdRequired": "顧客IDが必要です",
      "paymentMethodIdRequired": "支払い方法IDが必要です",
      "addressRequired": "住所が必要です",
      "nameRequired": "名前が必要です",
      "emailRequired": "メールアドレスが必要です",
      "userAttributesRequired": "ユーザー属性が必要です",
      "invalidAddress": "住所の形式が無効です",
      "stripeError": "Stripe APIエラーが発生しました",
      "updateFailed": "更新に失敗しました",
      "validationError": "入力内容に問題があります",
      "cardError": "カードエラー",
      "requestError": "リクエストエラー",
      "apiError": "APIエラー",
      "connectionError": "接続エラーが発生しました",
      "authenticationError": "認証エラーが発生しました"
    },
    "api": {
      "invalidRequest": "無効なリクエストです",
      "missingParameters": "必須パラメータが不足しています",
      "serverError": "内部サーバーエラーです",
      "validationFailed": "リクエストの検証に失敗しました",
      "authenticationRequired": "認証が必要です",
      "accessDenied": "アクセスが拒否されました",
      "notFound": "リソースが見つかりません",
      "methodNotAllowed": "メソッドが許可されていません",
      "conflictError": "リソースの競合です",
      "rateLimitExceeded": "レート制限を超過しました"
    },
    "verificationEmail": {
      "sendFailed": "認証コードメールの送信に失敗しました",
      "templateNotFound": "メールテンプレートが見つかりません",
      "messageRejected": "メールが拒否されました（宛先が無効の可能性）",
      "sendingPaused": "メール送信が一時停止中です",
      "mailFromDomainNotVerified": "送信元ドメインが未検証です",
      "configurationSetNotFound": "SES設定セットが見つかりません",
      "invalidTemplate": "メールテンプレートが無効です",
      "invalidAwsCredentials": "AWS認証情報が無効です",
      "invalidParameters": "パラメータが不正です"
    }
  },
  "fields": {
    "userName": "ユーザー名",
    "email": "メールアドレス",
    "department": "部署",
    "position": "役職",
    "role": "ロール"
  },
  "messages": {
    "dataUsage": {
      "createSuccess": "データ使用量の記録を作成しました",
      "updateSuccess": "データ使用量を正常に更新しました"
    },
    "policy": {
      "createSuccess": "ポリシーの作成が完了しました",
      "updateSuccess": "ポリシーの更新が完了しました",
      "deleteSuccess": "ポリシーの削除が完了しました"
    },
    "user": {
      "createSuccess": "ユーザーの作成が完了しました",
      "updateSuccess": "ユーザー情報を正常に更新しました",
      "deleteSuccess": "ユーザーの削除が完了しました"
    },
    "group": {
      "createSuccess": "グループの作成が完了しました",
      "updateSuccess": "グループを正常に更新しました",
      "deleteSuccess": "グループの削除が完了しました"
    },
    "groupPolicy": {
      "createSuccess": "グループポリシーの作成が完了しました",
      "deleteSuccess": "グループポリシーの削除が完了しました"
    },
    "userGroup": {
      "createSuccess": "ユーザーグループの作成が完了しました",
      "updateSuccess": "ユーザーグループの更新が完了しました",
      "deleteSuccess": "ユーザーグループの削除が完了しました"
    },
    "newOrderRequest": {
      "createSuccess": "新規注文リクエストの作成が完了しました",
      "updateSuccess": "新規注文リクエストの更新が完了しました",
      "deleteSuccess": "新規注文リクエストの削除が完了しました"
    },
    "newOrderReply": {
      "createSuccess": "新規注文返信の作成が完了しました",
      "updateSuccess": "新規注文返信の更新が完了しました",
      "deleteSuccess": "新規注文返信の削除が完了しました"
    },
    "supportRequest": {
      "createSuccess": "サポートリクエストの作成が完了しました",
      "updateSuccess": "サポートリクエストの更新が完了しました",
      "deleteSuccess": "サポートリクエストの削除が完了しました"
    },
    "supportReply": {
      "createSuccess": "サポート返信の作成が完了しました",
      "updateSuccess": "サポート返信の更新が完了しました",
      "deleteSuccess": "サポート返信の削除が完了しました"
    },
    "limitUsage": {
      "createSuccess": "使用制限の作成が完了しました",
      "updateSuccess": "使用制限の更新が完了しました",
      "deleteSuccess": "使用制限の削除が完了しました"
    },
    "recipient": {
      "createSuccess": "受信者の作成が完了しました",
      "updateSuccess": "受信者の更新が完了しました",
      "deleteSuccess": "受信者の削除が完了しました",
      "bulkUpdateSuccess": "{count}件の受信者を正常に更新しました"
    },
    "auditLog": {
      "createSuccess": "監査ログの作成が完了しました",
      "recordSuccess": "監査ログの記録が完了しました"
    },
    "stripe": {
      "customerCreateSuccess": "顧客の作成が完了しました",
      "setupIntentCreateSuccess": "セットアップインテントの作成が完了しました",
      "paymentMethodDeleteSuccess": "支払い方法の削除が完了しました",
      "paymentHistoryFetchSuccess": "支払い履歴の取得が完了しました",
      "defaultPaymentMethodSetSuccess": "デフォルト支払い方法の設定が完了しました",
      "addressUpdateSuccess": "住所の更新が完了しました"
    },
    "api": {
      "requestSuccess": "リクエストが正常に完了しました",
      "operationCompleted": "操作が正常に完了しました"
    },
    "verificationEmail": {
      "sendSuccess": "認証コードメールを送信しました"
    },
    "cognito": {
      "emailVerificationCompleted": "メール認証が完了しました",
      "signInStarted": "サインイン処理を開始しました"
    }
  }
} 

export default ja;