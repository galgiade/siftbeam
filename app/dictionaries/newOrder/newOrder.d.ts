export type NewOrderLocale = {
  label: {
    // 共通
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    back: string;
    submit: string;
    reply: string;
    
    // メイン画面
    newOrderTitle: string;
    newOrderHistory: string;
    newOrderButton: string;
    noOrderHistory: string;
    newOrderManagement: string;
    createNewOrder: string;
    orderList: string;
    orderListCount: string;
    noOrdersFound: string;
    createFirstOrder: string;
    changeSearchCriteria: string;
    viewDetails: string;
    orderId: string;
    creator: string;
    attachedFiles: string;
    filesCount: string;
    
    // エラー画面
    newOrderError: string;
    errorOccurred: string;
    contactSupport: string;
    
    // 詳細画面
    orderDetail: string;
    policyDetail: string;
    progressHistory: string;
    noProgressHistory: string;
    assignee: string;
    dataType: string;
    aiType: string;
    predictionItem: string;
    overview: string;
    details: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    staff: string;
    files: string;
    filesNone: string;
    
    // ステータス
    statusOpen: string;
    statusInProgress: string;
    statusClosed: string;
    statusResolved: string;
    
    // データタイプ
    dataTypeTable: string;
    dataTypeImage: string;
    dataTypeText: string;
    dataTypeStructured: string;
    dataTypeUnstructured: string;
    dataTypeMixed: string;
    dataTypeOther: string;
    
    // モデルタイプ
    modelTypeClustering: string;
    modelTypePrediction: string;
    modelTypeClassification: string;
    modelTypeRegression: string;
    modelTypeNLP: string;
    modelTypeComputerVision: string;
    modelTypeOther: string;
    
    // フィルター
    searchPlaceholder: string;
    filterByStatus: string;
    filterByDataType: string;
    filterByModelType: string;
    filterAll: string;
    
    // フォーム
    dataTypeQuestion: string;
    aiPurposeQuestion: string;
    predictionItemQuestion: string;
    detailsLabel: string;
    replyLabel: string;
    replyPlaceholder: string;
    messagePlaceholder: string;
    
    // データタイプの説明
    tableDataDescription: string;
    imageDataDescription: string;
    textDataDescription: string;
    
    // AIタイプの説明
    clusteringDescription: string;
    predictionDescription: string;
    classificationDescription: string;
    
    // ボタンとアクション
    markResolved: string;
    markUnresolved: string;
    orderNotFound: string;
    
    // ファイルアップロード
    fileUploadDescription: string;
    fileUploadMaxCount: string;
    
    // Create画面
    createNewOrderRequest: string;
    dataTypeLabel: string;
    requiredMark: string;
    selectDataType: string;
    analysisTypeQuestion: string;
    analysisTypeDescription: string;
    selectAnalysisType: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    projectDetailsLabel: string;
    projectDetailsPlaceholder: string;
    fileAttachment: string;
    optionalLabel: string;
    fileAttachmentDescription: string;
    fileUploadPreparing: string;
    filesSelected: string;
    detailedErrors: string;
    showDebugInfo: string;
    redirecting: string;
    debugInfo: string;
    cancelButton: string;
    creatingOrder: string;
    createOrderButton: string;
    
    // データタイプオプション
    dataTypeStructuredOption: string;
    dataTypeUnstructuredOption: string;
    dataTypeMixedOption: string;
    dataTypeOtherOption: string;
    
    // モデルタイプオプション
    modelTypeClassificationOption: string;
    modelTypeRegressionOption: string;
    modelTypeClusteringOption: string;
    modelTypeOtherOption: string;
    
    // Detail画面
    backToList: string;
    newOrderDetail: string;
    modelType: string;
    projectDetails: string;
    attachedFilesCount: string;
    requestCreationTime: string;
    communicationHistory: string;
    noConversation: string;
    customer: string;
    support: string;
    admin: string;
    sendMessage: string;
    sending: string;
    sendMessageButton: string;
    messageSent: string;
    orderClosed: string;
    orderClosedMessage: string;
    createNewOrderIfNeeded: string;
    accessDenied: string;
    orderNotFoundMessage: string;
  };
  alert: {
    // 成功メッセージ
    orderSubmitted: string;
    replySubmitted: string;
    
    // エラーメッセージ
    orderSubmitFailed: string;
    replySubmitFailed: string;
    messageRequired: string;
    subjectRequired: string;
    descriptionRequired: string;
    loginRequired: string;
    fetchOrdersFailed: string;
    authError: string;
    unknownError: string;
    errorLabel: string;
    customerIdLabel: string;
    timestampLabel: string;
    detailedErrorLabel: string;
    errorType: string;
    localeLabel: string;
    stackTrace: string;
    noStackTrace: string;
    dataTypeRequired: string;
    modelTypeRequired: string;
    unexpectedResponseFormat: string;
    formSubmissionError: string;
    replyError: string;
    
    // その他
    retryRequest: string;
  };
};
