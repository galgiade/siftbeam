'use server'

import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';
import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient } from '@/app/lib/aws-clients';
import { ApiResponse } from '@/app/lib/types/TypeAPIs';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';

const NEWORDER_REQUEST_TABLE_NAME = process.env.NEWORDER_REQUEST_TABLE_NAME || 'siftbeam-new-order-requests';
const NEWORDER_REPLY_TABLE_NAME = process.env.NEWORDER_REPLY_TABLE_NAME || 'siftbeam-new-order-replies';

/**
 * 新規オーダーリクエスト型定義
 */
export interface NewOrderRequest {
  newOrderRequestId: string;
  customerId: string;
  userId: string;
  userName: string;
  dataType: 'structured' | 'unstructured' | 'mixed' | 'other';
  modelType: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  fileKeys: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 新規オーダー返信型定義
 */
export interface NewOrderReply {
  newOrderReplyId: string;
  newOrderRequestId: string; // GSIキー名に合わせる
  userId: string;
  userName: string;
  senderType: 'customer' | 'support' | 'admin';
  message: string;
  fileKeys: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 新規オーダーリクエスト作成用のインターフェース
 */
export interface CreateNewOrderRequestInput {
  newOrderRequestId?: string; // 事前生成されたUUID（オプション、未指定時は自動生成）
  customerId: string;
  userId: string;
  userName: string;
  dataType: 'structured' | 'unstructured' | 'mixed' | 'other';
  modelType: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision' | 'other';
  subject: string;
  description: string;
  fileKeys?: string[];
}

/**
 * 新規オーダーリクエスト更新用のインターフェース
 */
export interface UpdateNewOrderRequestInput {
  newOrderRequestId: string;
  dataType?: 'structured' | 'unstructured' | 'mixed' | 'other';
  modelType?: 'classification' | 'regression' | 'clustering' | 'nlp' | 'computer_vision' | 'other';
  subject?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  fileKeys?: string[];
}

/**
 * 新規オーダーリクエストクエリ用のインターフェース
 */
export interface QueryNewOrderRequestsInput {
  customerId?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * 新規オーダー返信作成用のインターフェース
 */
export interface CreateNewOrderReplyInput {
  newOrderReplyId?: string; // 事前生成されたUUID（オプション、未指定時は自動生成）
  newOrderRequestId: string; // GSIキー名に合わせる
  userId: string;
  userName: string;
  senderType: 'customer' | 'support' | 'admin';
  message: string;
  fileKeys?: string[];
}

/**
 * 新規オーダー返信更新用のインターフェース
 */
export interface UpdateNewOrderReplyInput {
  newOrderReplyId: string;
  message?: string;
  fileKeys?: string[];
}

/**
 * 新規オーダー返信クエリ用のインターフェース
 */
export interface QueryNewOrderRepliesInput {
  newOrderRequestId: string; // GSIキー名に合わせる
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * エラーハンドリング用のヘルパー関数
 */
function handleError(error: any, operation: string): ApiResponse<any> {
  errorLog(`Error in ${operation}:`, {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.$metadata?.httpStatusCode,
    requestId: error.$metadata?.requestId,
    timestamp: new Date().toISOString()
  });
  
  // DynamoDB関連エラー
  if (error.name === 'ConditionalCheckFailedException') {
    return {
      success: false,
      message: '新規オーダーリクエストが見つかりません。',
      errors: { dynamodb: ['指定された新規オーダーリクエストIDが存在しないか、条件が満たされませんでした。'] }
    };
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return {
      success: false,
      message: 'DynamoDBテーブルが見つかりません。',
      errors: { 
        dynamodb: ['テーブル名を確認してください。'],
        config: [
          `NEWORDER_REQUEST_TABLE_NAME: ${NEWORDER_REQUEST_TABLE_NAME}`,
          `NEWORDER_REPLY_TABLE_NAME: ${NEWORDER_REPLY_TABLE_NAME}`
        ]
      }
    };
  }
  
  if (error.name === 'ValidationException') {
    return {
      success: false,
      message: 'DynamoDBバリデーションエラー',
      errors: { 
        dynamodb: [error.message],
        validation: ['リクエストパラメータを確認してください。']
      }
    };
  }
  
  // AWS権限関連エラー
  if (error.name === 'AccessDeniedException' || error.message?.includes('is not authorized to perform')) {
    return {
      success: false,
      message: `AWS権限エラー: ${error.message}`,
      errors: { 
        aws: ['IAMユーザーまたはロールに適切な権限が設定されていません。'],
        permissions: ['DynamoDB: GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan権限が必要です。']
      }
    };
  }
  
  // ネットワーク関連エラー
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return {
      success: false,
      message: 'ネットワーク接続エラー',
      errors: { 
        network: ['AWS サービスへの接続に失敗しました。'],
        config: ['リージョン設定とネットワーク接続を確認してください。']
      }
    };
  }
  
  // その他のエラー
  return {
    success: false,
    message: `${operation}に失敗しました: ${error.message || '不明なエラー'}`,
    errors: { 
      general: [error.message || '不明なエラーが発生しました。'],
      debug: [
        `エラー名: ${error.name}`,
        `ステータスコード: ${error.$metadata?.httpStatusCode || 'N/A'}`,
        `リクエストID: ${error.$metadata?.requestId || 'N/A'}`
      ]
    }
  };
}

/**
 * IDを生成する関数（UUIDv4）
 */
function generateId(): string {
  return crypto.randomUUID();
}

// ==================== 新規オーダーリクエスト管理 ====================

/**
 * 新規オーダーリクエストをIDで取得 (getItem)
 */
export async function getNewOrderRequestById(newOrderRequestId: string): Promise<ApiResponse<NewOrderRequest>> {
  try {
    if (!newOrderRequestId) {
      return {
        success: false,
        message: '新規オーダーリクエストIDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: NEWORDER_REQUEST_TABLE_NAME,
      Key: { newOrderRequestId: newOrderRequestId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: '新規オーダーリクエストが見つかりません。',
      };
    }

    debugLog('New order request retrieved successfully:', { newOrderRequestId });

    return {
      success: true,
      message: '新規オーダーリクエスト情報を取得しました。',
      data: result.Item as NewOrderRequest
    };

  } catch (error: any) {
    return handleError(error, '新規オーダーリクエスト取得');
  }
}

/**
 * 新規オーダーリクエストをクエリで検索 (query)
 */
export async function queryNewOrderRequests(
  input: QueryNewOrderRequestsInput
): Promise<ApiResponse<{ newOrderRequests: NewOrderRequest[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    let command: QueryCommand;

    if (input.customerId) {
      // customerIdでクエリ（GSI使用）
      command = new QueryCommand({
        TableName: NEWORDER_REQUEST_TABLE_NAME,
        IndexName: 'customerId-createdAt-index',
        KeyConditionExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
          ':customerId': input.customerId
        },
        ScanIndexForward: false, // 新しい順にソート
        Limit: input.limit || 1000,
        ExclusiveStartKey: input.lastEvaluatedKey
      });
    } else if (input.status) {
      // statusでクエリ（GSI使用）
      command = new QueryCommand({
        TableName: NEWORDER_REQUEST_TABLE_NAME,
        IndexName: 'status-createdAt-index',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': input.status
        },
        ScanIndexForward: false, // 新しい順にソート
        Limit: input.limit || 1000,
        ExclusiveStartKey: input.lastEvaluatedKey
      });
    } else {
      return {
        success: false,
        message: 'customerIdまたはstatusが必要です。',
      };
    }

    const result = await dynamoDocClient.send(command);
    const newOrderRequests = result.Items as NewOrderRequest[];

    debugLog('New order requests queried successfully:', { 
      count: newOrderRequests.length, 
      customerId: input.customerId,
      status: input.status
    });

    return {
      success: true,
      message: '新規オーダーリクエスト一覧を取得しました。',
      data: {
        newOrderRequests,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, '新規オーダーリクエストクエリ');
  }
}

/**
 * 新規オーダーリクエストを作成 (create)
 */
export async function createNewOrderRequest(input: CreateNewOrderRequestInput): Promise<ApiResponse<NewOrderRequest>> {
  try {
    debugLog('createNewOrderRequest called with input:', input);
    
    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.customerId?.trim()) {
      errors.customerId = ['カスタマーIDは必須です。'];
    }
    
    if (!input.userId?.trim()) {
      errors.userId = ['ユーザーIDは必須です。'];
    }
    
    if (!input.userName?.trim()) {
      errors.userName = ['ユーザー名は必須です。'];
    }
    
    if (!input.subject?.trim()) {
      errors.subject = ['件名は必須です。'];
    }
    
    if (!input.description?.trim()) {
      errors.description = ['説明は必須です。'];
    }
    
    if (!['structured', 'unstructured', 'mixed', 'other'].includes(input.dataType)) {
      errors.dataType = ['有効なデータタイプを選択してください。'];
    }
    
    if (!['classification', 'regression', 'clustering', 'nlp', 'computer_vision', 'other'].includes(input.modelType)) {
      errors.modelType = ['有効なモデルタイプを選択してください。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // 新規オーダーリクエストIDを生成（事前生成されたIDがあればそれを使用）
    const newOrderRequestId = input.newOrderRequestId || generateId();
    const now = new Date().toISOString();
    
    const newOrderRequest: NewOrderRequest = {
      newOrderRequestId: newOrderRequestId,
      customerId: input.customerId,
      userId: input.userId,
      userName: input.userName.trim(),
      dataType: input.dataType,
      modelType: input.modelType,
      subject: input.subject.trim(),
      description: input.description.trim(),
      status: 'open',
      fileKeys: input.fileKeys || [],
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: NEWORDER_REQUEST_TABLE_NAME,
      Item: newOrderRequest,
      ConditionExpression: 'attribute_not_exists(#newOrderRequestId)',
      ExpressionAttributeNames: {
        '#newOrderRequestId': 'newOrderRequestId'
      }
    });

    await dynamoDocClient.send(putCommand);

    debugLog('New order request created successfully:', { 
      newOrderRequestId,
      subject: input.subject,
      customerId: input.customerId 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'NewOrderRequest', 'request', '', input.subject);

    return {
      success: true,
      message: '新規オーダーリクエストが正常に作成されました。',
      data: newOrderRequest
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'NewOrderRequest', error?.message || '新規オーダーリクエスト作成に失敗しました', 'request', '', input.subject || '');
    
    return handleError(error, '新規オーダーリクエスト作成');
  }
}

/**
 * 新規オーダーリクエストを更新 (update)
 */
export async function updateNewOrderRequest(input: UpdateNewOrderRequestInput): Promise<ApiResponse<NewOrderRequest>> {
  try {
    debugLog('updateNewOrderRequest called with:', input);
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    if (input.subject !== undefined && !input.subject.trim()) {
      errors.subject = ['件名は必須です。'];
    }
    
    if (input.description !== undefined && !input.description.trim()) {
      errors.description = ['説明は必須です。'];
    }
    
    if (input.dataType !== undefined && !['structured', 'unstructured', 'mixed', 'other'].includes(input.dataType)) {
      errors.dataType = ['有効なデータタイプを選択してください。'];
    }
    
    if (input.modelType !== undefined && !['classification', 'regression', 'clustering', 'nlp', 'computer_vision', 'other'].includes(input.modelType)) {
      errors.modelType = ['有効なモデルタイプを選択してください。'];
    }
    
    if (input.status !== undefined && !['open', 'in_progress', 'resolved', 'closed'].includes(input.status)) {
      errors.status = ['有効なステータスを選択してください。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // 更新するフィールドを動的に構築
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    if (input.dataType) {
      updateExpression.push('#dataType = :dataType');
      expressionAttributeNames['#dataType'] = 'dataType';
      expressionAttributeValues[':dataType'] = input.dataType;
    }
    
    if (input.modelType) {
      updateExpression.push('#modelType = :modelType');
      expressionAttributeNames['#modelType'] = 'modelType';
      expressionAttributeValues[':modelType'] = input.modelType;
    }
    
    if (input.subject) {
      updateExpression.push('#subject = :subject');
      expressionAttributeNames['#subject'] = 'subject';
      expressionAttributeValues[':subject'] = input.subject.trim();
    }
    
    if (input.description) {
      updateExpression.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = input.description.trim();
    }

    if (input.status) {
      updateExpression.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = input.status;
    }

    if (input.fileKeys !== undefined) {
      updateExpression.push('#fileKeys = :fileKeys');
      expressionAttributeNames['#fileKeys'] = 'fileKeys';
      expressionAttributeValues[':fileKeys'] = input.fileKeys;
    }

    // 更新日時を追加
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateExpression.length === 1) { // updatedAtのみの場合
      return {
        success: false,
        message: '更新するフィールドがありません。',
      };
    }

    // DynamoDB更新
    const updateCommand = new UpdateCommand({
      TableName: NEWORDER_REQUEST_TABLE_NAME,
      Key: { newOrderRequestId: input.newOrderRequestId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        '#newOrderRequestId': 'newOrderRequestId'
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#newOrderRequestId)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('New order request updated successfully:', {
      newOrderRequestId: input.newOrderRequestId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    // 監査ログ記録（成功）
    const updatedFields = Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt').join(', ');
    await logSuccessAction('UPDATE', 'NewOrderRequest', updatedFields, '', input.newOrderRequestId);

    return {
      success: true,
      message: '新規オーダーリクエスト情報が正常に更新されました。',
      data: result.Attributes as NewOrderRequest
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'NewOrderRequest', error?.message || '新規オーダーリクエスト更新に失敗しました', 'request', '', input.newOrderRequestId);
    
    return handleError(error, '新規オーダーリクエスト更新');
  }
}

/**
 * 新規オーダーリクエストを削除 (delete)
 */
export async function deleteNewOrderRequest(
  newOrderRequestId: string,
  softDelete: boolean = true
): Promise<ApiResponse<void>> {
  try {
    if (!newOrderRequestId) {
      return {
        success: false,
        message: '新規オーダーリクエストIDが必要です。',
      };
    }

    if (softDelete) {
      // ソフト削除（ステータスをclosedに変更）
      const updateCommand = new UpdateCommand({
        TableName: NEWORDER_REQUEST_TABLE_NAME,
        Key: { newOrderRequestId: newOrderRequestId },
        UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#newOrderRequestId': 'newOrderRequestId',
          '#status': 'status',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':status': 'closed',
          ':updatedAt': new Date().toISOString()
        },
        ConditionExpression: 'attribute_exists(#newOrderRequestId)'
      });

      await dynamoDocClient.send(updateCommand);
    } else {
      // ハード削除
      const deleteCommand = new DeleteCommand({
        TableName: NEWORDER_REQUEST_TABLE_NAME,
        Key: { newOrderRequestId: newOrderRequestId },
        ConditionExpression: 'attribute_exists(#newOrderRequestId)',
        ExpressionAttributeNames: {
          '#newOrderRequestId': 'newOrderRequestId'
        }
      });

      await dynamoDocClient.send(deleteCommand);
    }

    debugLog('New order request deleted successfully:', { 
      newOrderRequestId, 
      softDelete 
    });

    return {
      success: true,
      message: softDelete ? '新規オーダーリクエストがクローズされました。' : '新規オーダーリクエストが削除されました。',
    };

  } catch (error: any) {
    return handleError(error, '新規オーダーリクエスト削除');
  }
}

// ==================== 新規オーダー返信管理 ====================

/**
 * 新規オーダー返信をIDで取得 (getItem)
 */
export async function getNewOrderReplyById(newOrderReplyId: string): Promise<ApiResponse<NewOrderReply>> {
  try {
    if (!newOrderReplyId) {
      return {
        success: false,
        message: '新規オーダー返信IDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: NEWORDER_REPLY_TABLE_NAME,
      Key: { newOrderReplyId: newOrderReplyId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: '新規オーダー返信が見つかりません。',
      };
    }

    debugLog('New order reply retrieved successfully:', { newOrderReplyId });

    return {
      success: true,
      message: '新規オーダー返信情報を取得しました。',
      data: result.Item as NewOrderReply
    };

  } catch (error: any) {
    return handleError(error, '新規オーダー返信取得');
  }
}

/**
 * 新規オーダーリクエストの返信一覧を取得 (query)
 */
export async function queryNewOrderReplies(
  input: QueryNewOrderRepliesInput
): Promise<ApiResponse<{ newOrderReplies: NewOrderReply[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    const command = new QueryCommand({
      TableName: NEWORDER_REPLY_TABLE_NAME,
      IndexName: 'newOrderRequestId-createdAt-index',
      KeyConditionExpression: '#newOrderRequestId = :newOrderRequestId',
      ExpressionAttributeNames: {
        '#newOrderRequestId': 'newOrderRequestId' // GSIのキー名に合わせる
      },
      ExpressionAttributeValues: {
        ':newOrderRequestId': input.newOrderRequestId
      },
      ScanIndexForward: true, // 古い順にソート（会話の流れ）
      Limit: input.limit || 1000,
      ExclusiveStartKey: input.lastEvaluatedKey
    });

    const result = await dynamoDocClient.send(command);
    const newOrderReplies = result.Items as NewOrderReply[];

    debugLog('New order replies queried successfully:', { 
      newOrderRequestId: input.newOrderRequestId,
      count: newOrderReplies.length
    });

    return {
      success: true,
      message: '新規オーダー返信一覧を取得しました。',
      data: {
        newOrderReplies,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, '新規オーダー返信クエリ');
  }
}

/**
 * 新規オーダー返信を作成 (create)
 */
export async function createNewOrderReply(input: CreateNewOrderReplyInput): Promise<ApiResponse<NewOrderReply>> {
  try {
    
    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.newOrderRequestId?.trim()) {
      errors['newOrderRequestId'] = ['新規オーダーリクエストIDは必須です。'];
    }
    
    if (!input.userId?.trim()) {
      errors.userId = ['ユーザーIDは必須です。'];
    }
    
    if (!input.userName?.trim()) {
      errors.userName = ['ユーザー名は必須です。'];
    }
    
    if (!input.message?.trim()) {
      errors.message = ['メッセージは必須です。'];
    }
    
    if (!['customer', 'support', 'admin'].includes(input.senderType)) {
      errors.senderType = ['有効な送信者タイプを選択してください。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // 新規オーダー返信IDを生成（事前生成されたIDがあればそれを使用）
    const newOrderReplyId = input.newOrderReplyId || generateId();
    const now = new Date().toISOString();
    
    const newOrderReply: NewOrderReply = {
      newOrderReplyId: newOrderReplyId,
      newOrderRequestId: input.newOrderRequestId, // GSIキー名に合わせる
      userId: input.userId,
      userName: input.userName.trim(),
      senderType: input.senderType,
      message: input.message.trim(),
      fileKeys: input.fileKeys || [],
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: NEWORDER_REPLY_TABLE_NAME,
      Item: newOrderReply,
      ConditionExpression: 'attribute_not_exists(#newOrderReplyId)',
      ExpressionAttributeNames: {
        '#newOrderReplyId': 'newOrderReplyId'
      }
    });

    await dynamoDocClient.send(putCommand);

    debugLog('New order reply created successfully:', { 
      newOrderReplyId,
      newOrderRequestId: input.newOrderRequestId,
      senderType: input.senderType
    });

    return {
      success: true,
      message: '新規オーダー返信が正常に作成されました。',
      data: newOrderReply
    };

  } catch (error: any) {
    return handleError(error, '新規オーダー返信作成');
  }
}

/**
 * 新規オーダー返信を更新 (update)
 */
export async function updateNewOrderReply(input: UpdateNewOrderReplyInput): Promise<ApiResponse<NewOrderReply>> {
  try {
    debugLog('updateNewOrderReply called with:', input);
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    if (input.message !== undefined && !input.message.trim()) {
      errors.message = ['メッセージは必須です。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // 更新するフィールドを動的に構築
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    if (input.message) {
      updateExpression.push('#message = :message');
      expressionAttributeNames['#message'] = 'message';
      expressionAttributeValues[':message'] = input.message.trim();
    }

    if (input.fileKeys !== undefined) {
      updateExpression.push('#fileKeys = :fileKeys');
      expressionAttributeNames['#fileKeys'] = 'fileKeys';
      expressionAttributeValues[':fileKeys'] = input.fileKeys;
    }

    // 更新日時を追加
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateExpression.length === 1) { // updatedAtのみの場合
      return {
        success: false,
        message: '更新するフィールドがありません。',
      };
    }

    // DynamoDB更新
    const updateCommand = new UpdateCommand({
      TableName: NEWORDER_REPLY_TABLE_NAME,
      Key: { newOrderReplyId: input.newOrderReplyId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        '#newOrderReplyId': 'newOrderReplyId'
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#newOrderReplyId)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('New order reply updated successfully:', {
      newOrderReplyId: input.newOrderReplyId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    return {
      success: true,
      message: '新規オーダー返信情報が正常に更新されました。',
      data: result.Attributes as NewOrderReply
    };

  } catch (error: any) {
    return handleError(error, '新規オーダー返信更新');
  }
}

/**
 * 新規オーダー返信を削除 (delete)
 */
export async function deleteNewOrderReply(
  newOrderReplyId: string,
  softDelete: boolean = false
): Promise<ApiResponse<void>> {
  try {
    if (!newOrderReplyId) {
      return {
        success: false,
        message: '新規オーダー返信IDが必要です。',
      };
    }

    // 新規オーダー返信は通常ハード削除（会話の整合性のため）
    const deleteCommand = new DeleteCommand({
      TableName: NEWORDER_REPLY_TABLE_NAME,
      Key: { newOrderReplyId: newOrderReplyId },
      ConditionExpression: 'attribute_exists(#newOrderReplyId)',
      ExpressionAttributeNames: {
        '#newOrderReplyId': 'newOrderReplyId'
      }
    });

    await dynamoDocClient.send(deleteCommand);

    debugLog('New order reply deleted successfully:', { 
      newOrderReplyId, 
      softDelete 
    });

    return {
      success: true,
      message: '新規オーダー返信が削除されました。',
    };

  } catch (error: any) {
    return handleError(error, '新規オーダー返信削除');
  }
}
