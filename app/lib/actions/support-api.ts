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
import { ApiResponse, SupportRequest, SupportReply } from '@/app/lib/types/TypeAPIs';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';

const SUPPORT_REQUEST_TABLE_NAME = process.env.SUPPORT_REQUEST_TABLE_NAME || 'siftbeam-support-requests';
const SUPPORT_REPLY_TABLE_NAME = process.env.SUPPORT_REPLY_TABLE_NAME || 'siftbeam-support-replies';

/**
 * サポートリクエスト作成用のインターフェース
 */
export interface CreateSupportRequestInput {
  supportRequestId?: string; // 事前生成されたUUID（オプション、未指定時は自動生成）
  customerId: string;
  userId: string;
  userName: string;
  issueType: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  subject: string;
  description: string;
  fileKeys?: string[];
}

/**
 * サポートリクエスト更新用のインターフェース
 */
export interface UpdateSupportRequestInput {
  supportRequestId: string;
  issueType?: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  subject?: string;
  description?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  fileKeys?: string[];
}

/**
 * サポートリクエストクエリ用のインターフェース
 */
export interface QuerySupportRequestsInput {
  customerId?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * サポート返信作成用のインターフェース
 */
export interface CreateSupportReplyInput {
  supportReplyId?: string; // 事前生成されたUUID（オプション、未指定時は自動生成）
  supportRequestId: string;
  userId: string;
  userName: string;
  senderType: 'customer' | 'support' | 'admin';
  message: string;
  fileKeys?: string[];
}

/**
 * サポート返信更新用のインターフェース
 */
export interface UpdateSupportReplyInput {
  supportReplyId: string;
  message?: string;
  fileKeys?: string[];
}

/**
 * サポート返信クエリ用のインターフェース
 */
export interface QuerySupportRepliesInput {
  supportRequestId: string;
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
      message: 'サポートリクエストが見つかりません。',
      errors: { dynamodb: ['指定されたサポートリクエストIDが存在しないか、条件が満たされませんでした。'] }
    };
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return {
      success: false,
      message: 'DynamoDBテーブルが見つかりません。',
      errors: { 
        dynamodb: ['テーブル名を確認してください。'],
        config: [
          `SUPPORT_REQUEST_TABLE_NAME: ${SUPPORT_REQUEST_TABLE_NAME}`,
          `SUPPORT_REPLY_TABLE_NAME: ${SUPPORT_REPLY_TABLE_NAME}`
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

// ==================== サポートリクエスト管理 ====================

/**
 * サポートリクエストをIDで取得 (getItem)
 */
export async function getSupportRequestById(supportRequestId: string): Promise<ApiResponse<SupportRequest>> {
  try {
    if (!supportRequestId) {
      return {
        success: false,
        message: 'サポートリクエストIDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: SUPPORT_REQUEST_TABLE_NAME,
      Key: { supportRequestId: supportRequestId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: 'サポートリクエストが見つかりません。',
      };
    }

    debugLog('Support request retrieved successfully:', { supportRequestId });

    return {
      success: true,
      message: 'サポートリクエスト情報を取得しました。',
      data: result.Item as SupportRequest
    };

  } catch (error: any) {
    return handleError(error, 'サポートリクエスト取得');
  }
}

/**
 * サポートリクエストをクエリで検索 (query)
 */
export async function querySupportRequests(
  input: QuerySupportRequestsInput
): Promise<ApiResponse<{ supportRequests: SupportRequest[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    let command: QueryCommand;

    if (input.customerId) {
      // customerIdでクエリ（GSI使用）
      command = new QueryCommand({
        TableName: SUPPORT_REQUEST_TABLE_NAME,
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
        TableName: SUPPORT_REQUEST_TABLE_NAME,
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
    const supportRequests = result.Items as SupportRequest[];

    debugLog('Support requests queried successfully:', { 
      count: supportRequests.length, 
      customerId: input.customerId,
      status: input.status
    });

    return {
      success: true,
      message: 'サポートリクエスト一覧を取得しました。',
      data: {
        supportRequests,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, 'サポートリクエストクエリ');
  }
}

/**
 * サポートリクエストを作成 (create)
 */
export async function createSupportRequest(input: CreateSupportRequestInput): Promise<ApiResponse<SupportRequest>> {
  try {
    debugLog('createSupportRequest called with input:', input);
    
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
    
    if (!['technical', 'billing', 'feature', 'bug', 'other'].includes(input.issueType)) {
      errors.issueType = ['有効な問題タイプを選択してください。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // サポートリクエストIDを生成（事前生成されたIDがあればそれを使用）
    const supportRequestId = input.supportRequestId || generateId();
    const now = new Date().toISOString();
    
    const newSupportRequest: SupportRequest = {
      supportRequestId: supportRequestId,
      customerId: input.customerId,
      userId: input.userId,
      userName: input.userName.trim(),
      issueType: input.issueType,
      subject: input.subject.trim(),
      description: input.description.trim(),
      status: 'open',
      fileKeys: input.fileKeys || [],
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: SUPPORT_REQUEST_TABLE_NAME,
      Item: newSupportRequest,
      ConditionExpression: 'attribute_not_exists(#supportRequestId)',
      ExpressionAttributeNames: {
        '#supportRequestId': 'supportRequestId'
      }
    });

    await dynamoDocClient.send(putCommand);

    debugLog('Support request created successfully:', { 
      supportRequestId,
      subject: input.subject,
      customerId: input.customerId 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'SupportRequest', 'request', '', input.subject);

    return {
      success: true,
      message: 'サポートリクエストが正常に作成されました。',
      data: newSupportRequest
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'SupportRequest', error?.message || 'サポートリクエスト作成に失敗しました', 'request', '', input.subject || '');
    
    return handleError(error, 'サポートリクエスト作成');
  }
}

/**
 * サポートリクエストを更新 (update)
 */
export async function updateSupportRequest(input: UpdateSupportRequestInput): Promise<ApiResponse<SupportRequest>> {
  try {
    debugLog('updateSupportRequest called with:', input);
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    if (input.subject !== undefined && !input.subject.trim()) {
      errors.subject = ['件名は必須です。'];
    }
    
    if (input.description !== undefined && !input.description.trim()) {
      errors.description = ['説明は必須です。'];
    }
    
    if (input.issueType !== undefined && !['technical', 'billing', 'feature', 'bug', 'other'].includes(input.issueType)) {
      errors.issueType = ['有効な問題タイプを選択してください。'];
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
    
    if (input.issueType) {
      updateExpression.push('#issueType = :issueType');
      expressionAttributeNames['#issueType'] = 'issueType';
      expressionAttributeValues[':issueType'] = input.issueType;
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
      TableName: SUPPORT_REQUEST_TABLE_NAME,
      Key: { supportRequestId: input.supportRequestId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        '#supportRequestId': 'supportRequestId'
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#supportRequestId)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('Support request updated successfully:', {
      supportRequestId: input.supportRequestId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    return {
      success: true,
      message: 'サポートリクエスト情報が正常に更新されました。',
      data: result.Attributes as SupportRequest
    };

  } catch (error: any) {
    return handleError(error, 'サポートリクエスト更新');
  }
}

/**
 * サポートリクエストを削除 (delete)
 */
export async function deleteSupportRequest(
  supportRequestId: string,
  softDelete: boolean = true
): Promise<ApiResponse<void>> {
  try {
    if (!supportRequestId) {
      return {
        success: false,
        message: 'サポートリクエストIDが必要です。',
      };
    }

    if (softDelete) {
      // ソフト削除（ステータスをclosedに変更）
      const updateCommand = new UpdateCommand({
        TableName: SUPPORT_REQUEST_TABLE_NAME,
        Key: { supportRequestId: supportRequestId },
        UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#supportRequestId': 'supportRequestId',
          '#status': 'status',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':status': 'closed',
          ':updatedAt': new Date().toISOString()
        },
        ConditionExpression: 'attribute_exists(#supportRequestId)'
      });

      await dynamoDocClient.send(updateCommand);
    } else {
      // ハード削除
      const deleteCommand = new DeleteCommand({
        TableName: SUPPORT_REQUEST_TABLE_NAME,
        Key: { supportRequestId: supportRequestId },
        ConditionExpression: 'attribute_exists(#supportRequestId)',
        ExpressionAttributeNames: {
          '#supportRequestId': 'supportRequestId'
        }
      });

      await dynamoDocClient.send(deleteCommand);
    }

    debugLog('Support request deleted successfully:', { 
      supportRequestId, 
      softDelete 
    });

    return {
      success: true,
      message: softDelete ? 'サポートリクエストがクローズされました。' : 'サポートリクエストが削除されました。',
    };

  } catch (error: any) {
    return handleError(error, 'サポートリクエスト削除');
  }
}

// ==================== サポート返信管理 ====================

/**
 * サポート返信をIDで取得 (getItem)
 */
export async function getSupportReplyById(supportReplyId: string): Promise<ApiResponse<SupportReply>> {
  try {
    if (!supportReplyId) {
      return {
        success: false,
        message: 'サポート返信IDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: SUPPORT_REPLY_TABLE_NAME,
      Key: { supportReplyId: supportReplyId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: 'サポート返信が見つかりません。',
      };
    }

    debugLog('Support reply retrieved successfully:', { supportReplyId });

    return {
      success: true,
      message: 'サポート返信情報を取得しました。',
      data: result.Item as SupportReply
    };

  } catch (error: any) {
    return handleError(error, 'サポート返信取得');
  }
}

/**
 * サポートリクエストの返信一覧を取得 (query)
 */
export async function querySupportReplies(
  input: QuerySupportRepliesInput
): Promise<ApiResponse<{ supportReplies: SupportReply[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    const command = new QueryCommand({
      TableName: SUPPORT_REPLY_TABLE_NAME,
      IndexName: 'supportRequestId-createdAt-index',
      KeyConditionExpression: '#supportRequestId = :supportRequestId',
      ExpressionAttributeNames: {
        '#supportRequestId': 'supportRequestId'
      },
      ExpressionAttributeValues: {
        ':supportRequestId': input.supportRequestId
      },
      ScanIndexForward: true, // 古い順にソート（会話の流れ）
      Limit: input.limit || 1000,
      ExclusiveStartKey: input.lastEvaluatedKey
    });

    const result = await dynamoDocClient.send(command);
    const supportReplies = result.Items as SupportReply[];

    debugLog('Support replies queried successfully:', { 
      supportRequestId: input.supportRequestId,
      count: supportReplies.length
    });

    return {
      success: true,
      message: 'サポート返信一覧を取得しました。',
      data: {
        supportReplies,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, 'サポート返信クエリ');
  }
}

/**
 * サポート返信を作成 (create)
 */
export async function createSupportReply(input: CreateSupportReplyInput): Promise<ApiResponse<SupportReply>> {
  try {
    debugLog('createSupportReply called with input:', input);
    
    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.supportRequestId?.trim()) {
      errors.supportRequestId = ['サポートリクエストIDは必須です。'];
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

    // サポート返信IDを生成（事前生成されたIDがあればそれを使用）
    const supportReplyId = input.supportReplyId || generateId();
    const now = new Date().toISOString();
    
    const newSupportReply: SupportReply = {
      supportReplyId: supportReplyId,
      supportRequestId: input.supportRequestId,
      userId: input.userId,
      userName: input.userName.trim(),
      senderType: input.senderType,
      message: input.message.trim(),
      fileKeys: input.fileKeys || [],
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: SUPPORT_REPLY_TABLE_NAME,
      Item: newSupportReply,
      ConditionExpression: 'attribute_not_exists(#supportReplyId)',
      ExpressionAttributeNames: {
        '#supportReplyId': 'supportReplyId'
      }
    });

    await dynamoDocClient.send(putCommand);

    debugLog('Support reply created successfully:', { 
      supportReplyId,
      supportRequestId: input.supportRequestId,
      senderType: input.senderType
    });

    return {
      success: true,
      message: 'サポート返信が正常に作成されました。',
      data: newSupportReply
    };

  } catch (error: any) {
    return handleError(error, 'サポート返信作成');
  }
}

/**
 * サポート返信を更新 (update)
 */
export async function updateSupportReply(input: UpdateSupportReplyInput): Promise<ApiResponse<SupportReply>> {
  try {
    debugLog('updateSupportReply called with:', input);
    
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
      TableName: SUPPORT_REPLY_TABLE_NAME,
      Key: { supportReplyId: input.supportReplyId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        '#supportReplyId': 'supportReplyId'
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#supportReplyId)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('Support reply updated successfully:', {
      supportReplyId: input.supportReplyId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    return {
      success: true,
      message: 'サポート返信情報が正常に更新されました。',
      data: result.Attributes as SupportReply
    };

  } catch (error: any) {
    return handleError(error, 'サポート返信更新');
  }
}

/**
 * サポート返信を削除 (delete)
 */
export async function deleteSupportReply(
  supportReplyId: string,
  softDelete: boolean = false
): Promise<ApiResponse<void>> {
  try {
    if (!supportReplyId) {
      return {
        success: false,
        message: 'サポート返信IDが必要です。',
      };
    }

    // サポート返信は通常ハード削除（会話の整合性のため）
    const deleteCommand = new DeleteCommand({
      TableName: SUPPORT_REPLY_TABLE_NAME,
      Key: { supportReplyId: supportReplyId },
      ConditionExpression: 'attribute_exists(#supportReplyId)',
      ExpressionAttributeNames: {
        '#supportReplyId': 'supportReplyId'
      }
    });

    await dynamoDocClient.send(deleteCommand);

    debugLog('Support reply deleted successfully:', { 
      supportReplyId, 
      softDelete 
    });

    return {
      success: true,
      message: 'サポート返信が削除されました。',
    };

  } catch (error: any) {
    return handleError(error, 'サポート返信削除');
  }
}

