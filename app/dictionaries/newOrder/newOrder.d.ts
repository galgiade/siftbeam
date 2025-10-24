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
    
    // データタイプ
    dataTypeTable: string;
    dataTypeImage: string;
    dataTypeText: string;
    
    // モデルタイプ
    modelTypeClustering: string;
    modelTypePrediction: string;
    modelTypeClassification: string;
    
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
    // その他
    retryRequest: string;
  };
};
