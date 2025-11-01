'use server'

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

const PROCESSING_HISTORY_TABLE_NAME = process.env.PROCESSING_HISTORY_TABLE_NAME || 'siftbeam-processing-history';

/**
 * 処理履歴のインターフェース
 */
export interface ProcessingHistory {
  'processing-historyId': string;
  userId: string;
  userName: string;
  customerId: string;
  policyId: string;
  policyName: string;
  usageAmountBytes: number;
  status: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed';
  downloadS3Keys: string[];
  uploadedFileKeys: string[];
  aiTrainingUsage: 'allow' | 'deny';
  errorDetail?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * 処理履歴作成用のインターフェース
 */
export interface CreateProcessingHistoryInput {
  'processing-historyId'?: string; // 事前生成されたUUID（オプション、未指定時は自動生成）
  userId: string;
  userName: string;
  customerId: string;
  policyId: string;
  policyName: string;
  usageAmountBytes: number;
  uploadedFileKeys: string[];
  aiTrainingUsage: 'allow' | 'deny';
}

/**
 * 処理履歴更新用のインターフェース
 */
export interface UpdateProcessingHistoryInput {
  'processing-historyId': string;
  status?: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed';
  downloadS3Keys?: string[];
  usageAmountBytes?: number;
  errorDetail?: string;
  completedAt?: string;
  aiTrainingUsage?: 'allow' | 'deny';
}

/**
 * 処理履歴クエリ用のインターフェース
 */
export interface QueryProcessingHistoryInput {
  userId?: string;
  customerId?: string;
  status?: 'in_progress' | 'success' | 'failed' | 'canceled' | 'deleted' | 'delete_failed';
  policyId?: string;
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * エラーハンドリング用のヘルパー関数
 */
function handleError(error: any, operation: string): ApiResponse<any> {
  console.error(`Error in ${operation}:`, {
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
      message: '処理履歴が見つかりません。',
      errors: { dynamodb: ['指定された処理履歴IDが存在しないか、条件が満たされませんでした。'] }
    };
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return {
      success: false,
      message: 'DynamoDBテーブルが見つかりません。',
      errors: { 
        dynamodb: ['テーブル名を確認してください。'],
        config: [
          `PROCESSING_HISTORY_TABLE_NAME: ${PROCESSING_HISTORY_TABLE_NAME}`
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




// ==================== 処理履歴管理 ====================

/**
 * 処理履歴をIDで取得 (getItem)
 */
export async function getProcessingHistoryById(processingHistoryId: string): Promise<ApiResponse<ProcessingHistory>> {
  try {
    if (!processingHistoryId) {
      return {
        success: false,
        message: '処理履歴IDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: PROCESSING_HISTORY_TABLE_NAME,
      Key: { 'processing-historyId': processingHistoryId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: '処理履歴が見つかりません。',
      };
    }

    console.log('Processing history retrieved successfully:', { processingHistoryId });

    return {
      success: true,
      message: '処理履歴情報を取得しました。',
      data: result.Item as ProcessingHistory
    };

  } catch (error: any) {
    return handleError(error, '処理履歴取得');
  }
}

/**
 * 処理履歴をクエリで検索 (query)
 */
export async function queryProcessingHistory(
  input: QueryProcessingHistoryInput
): Promise<ApiResponse<{ processingHistory: ProcessingHistory[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    let command: QueryCommand;

    if (input.userId) {
      // userIdでクエリ（GSI1使用）
      command = new QueryCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
        IndexName: 'userId-createdAt-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': input.userId
        },
        ScanIndexForward: false, // 新しい順にソート
        Limit: input.limit || 1000,
        ExclusiveStartKey: input.lastEvaluatedKey
      });
    } else if (input.customerId) {
      // customerIdでクエリ（GSI2使用）
      command = new QueryCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
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
      // statusでクエリ（GSI3使用）
      command = new QueryCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
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
    } else if (input.policyId) {
      // policyIdでクエリ（GSI4使用）
      command = new QueryCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
        IndexName: 'policyId-createdAt-index',
        KeyConditionExpression: 'policyId = :policyId',
        ExpressionAttributeValues: {
          ':policyId': input.policyId
        },
        ScanIndexForward: false, // 新しい順にソート
        Limit: input.limit || 1000,
        ExclusiveStartKey: input.lastEvaluatedKey
      });
    } else {
      return {
        success: false,
        message: 'userId、customerId、status、またはpolicyIdのいずれかが必要です。',
      };
    }

    const result = await dynamoDocClient.send(command);
    const processingHistory = result.Items as ProcessingHistory[];

    console.log('Processing history queried successfully:', { 
      count: processingHistory.length, 
      userId: input.userId,
      customerId: input.customerId,
      status: input.status,
      policyId: input.policyId
    });

    return {
      success: true,
      message: '処理履歴一覧を取得しました。',
      data: {
        processingHistory,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, '処理履歴クエリ');
  }
}

/**
 * 処理履歴を作成 (create)
 */
export async function createProcessingHistory(input: CreateProcessingHistoryInput): Promise<ApiResponse<ProcessingHistory>> {
  try {
    console.log('createProcessingHistory called with input:', input);
    
    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.userId?.trim()) {
      errors.userId = ['ユーザーIDは必須です。'];
    }
    
    if (!input.userName?.trim()) {
      errors.userName = ['ユーザー名は必須です。'];
    }
    
    if (!input.customerId?.trim()) {
      errors.customerId = ['カスタマーIDは必須です。'];
    }
    
    if (!input.policyId?.trim()) {
      errors.policyId = ['ポリシーIDは必須です。'];
    }
    
    if (!input.policyName?.trim()) {
      errors.policyName = ['ポリシー名は必須です。'];
    }
    
    if (typeof input.usageAmountBytes !== 'number' || input.usageAmountBytes < 0) {
      errors.usageAmountBytes = ['使用量は0以上の数値である必要があります。'];
    }
    
    if (!Array.isArray(input.uploadedFileKeys) || input.uploadedFileKeys.length === 0) {
      errors.uploadedFileKeys = ['アップロードファイルキーは必須です。'];
    }
    
    if (!['allow', 'deny'].includes(input.aiTrainingUsage)) {
      errors.aiTrainingUsage = ['AI学習使用許可は"allow"または"deny"である必要があります。'];
    }
    
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // 処理履歴IDを生成（事前生成されたIDがあればそれを使用）
    const processingHistoryId = input['processing-historyId'] || generateId();
    const now = new Date().toISOString();
    
    const newProcessingHistory: ProcessingHistory = {
      'processing-historyId': processingHistoryId,
      userId: input.userId,
      userName: input.userName.trim(),
      customerId: input.customerId,
      policyId: input.policyId,
      policyName: input.policyName.trim(),
      usageAmountBytes: input.usageAmountBytes,
      status: 'in_progress',
      downloadS3Keys: [],
      uploadedFileKeys: input.uploadedFileKeys,
      aiTrainingUsage: input.aiTrainingUsage,
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: PROCESSING_HISTORY_TABLE_NAME,
      Item: newProcessingHistory,
      ConditionExpression: 'attribute_not_exists(#processingHistoryId)',
      ExpressionAttributeNames: {
        '#processingHistoryId': 'processing-historyId'
      }
    });

    await dynamoDocClient.send(putCommand);

    console.log('Processing history created successfully:', { 
      processingHistoryId,
      policyName: input.policyName,
      customerId: input.customerId 
    });

    return {
      success: true,
      message: '処理履歴が正常に作成されました。',
      data: newProcessingHistory
    };

  } catch (error: any) {
    return handleError(error, '処理履歴作成');
  }
}

/**
 * 処理履歴を更新 (update)
 */
export async function updateProcessingHistory(input: UpdateProcessingHistoryInput): Promise<ApiResponse<ProcessingHistory>> {
  try {
    console.log('updateProcessingHistory called with:', input);
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    if (input.status !== undefined && !['in_progress', 'success', 'failed', 'canceled', 'deleted', 'delete_failed'].includes(input.status)) {
      errors.status = ['有効なステータスを選択してください。'];
    }
    
    if (input.usageAmountBytes !== undefined && (typeof input.usageAmountBytes !== 'number' || input.usageAmountBytes < 0)) {
      errors.usageAmountBytes = ['使用量は0以上の数値である必要があります。'];
    }
    
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
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
    
    if (input.status) {
      updateExpression.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = input.status;
    }
    
    if (input.downloadS3Keys !== undefined) {
      updateExpression.push('#downloadS3Keys = :downloadS3Keys');
      expressionAttributeNames['#downloadS3Keys'] = 'downloadS3Keys';
      expressionAttributeValues[':downloadS3Keys'] = input.downloadS3Keys;
    }
    
    if (input.usageAmountBytes !== undefined) {
      updateExpression.push('#usageAmountBytes = :usageAmountBytes');
      expressionAttributeNames['#usageAmountBytes'] = 'usageAmountBytes';
      expressionAttributeValues[':usageAmountBytes'] = input.usageAmountBytes;
    }

    if (input.errorDetail !== undefined) {
      updateExpression.push('#errorDetail = :errorDetail');
      expressionAttributeNames['#errorDetail'] = 'errorDetail';
      expressionAttributeValues[':errorDetail'] = input.errorDetail;
    }

    if (input.completedAt !== undefined) {
      updateExpression.push('#completedAt = :completedAt');
      expressionAttributeNames['#completedAt'] = 'completedAt';
      expressionAttributeValues[':completedAt'] = input.completedAt;
    }

    if (input.aiTrainingUsage !== undefined) {
      updateExpression.push('#aiTrainingUsage = :aiTrainingUsage');
      expressionAttributeNames['#aiTrainingUsage'] = 'aiTrainingUsage';
      expressionAttributeValues[':aiTrainingUsage'] = input.aiTrainingUsage;
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
      TableName: PROCESSING_HISTORY_TABLE_NAME,
      Key: { 'processing-historyId': input['processing-historyId'] },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        '#processingHistoryId': 'processing-historyId'
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#processingHistoryId)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    console.log('Processing history updated successfully:', {
      processingHistoryId: input['processing-historyId'],
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    return {
      success: true,
      message: '処理履歴情報が正常に更新されました。',
      data: result.Attributes as ProcessingHistory
    };

  } catch (error: any) {
    return handleError(error, '処理履歴更新');
  }
}

/**
 * 処理履歴を削除 (delete)
 */
export async function deleteProcessingHistory(
  processingHistoryId: string,
  softDelete: boolean = true
): Promise<ApiResponse<void>> {
  try {
    if (!processingHistoryId) {
      return {
        success: false,
        message: '処理履歴IDが必要です。',
      };
    }

    if (softDelete) {
      // ソフト削除（ステータスをdeletedに変更）
      const updateCommand = new UpdateCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
        Key: { 'processing-historyId': processingHistoryId },
        UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#processingHistoryId': 'processing-historyId',
          '#status': 'status',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':status': 'deleted',
          ':updatedAt': new Date().toISOString()
        },
        ConditionExpression: 'attribute_exists(#processingHistoryId)'
      });

      await dynamoDocClient.send(updateCommand);
    } else {
      // ハード削除
      const deleteCommand = new DeleteCommand({
        TableName: PROCESSING_HISTORY_TABLE_NAME,
        Key: { 'processing-historyId': processingHistoryId },
        ConditionExpression: 'attribute_exists(#processingHistoryId)',
        ExpressionAttributeNames: {
          '#processingHistoryId': 'processing-historyId'
        }
      });

      await dynamoDocClient.send(deleteCommand);
    }

    console.log('Processing history deleted successfully:', { 
      processingHistoryId, 
      softDelete 
    });

    return {
      success: true,
      message: softDelete ? '処理履歴が削除されました。' : '処理履歴が完全に削除されました。',
    };

  } catch (error: any) {
    return handleError(error, '処理履歴削除');
  }
}

/**
 * ユーザーの最新処理履歴を取得
 */
export async function getUserLatestProcessingHistory(
  userId: string, 
  limit: number = 10
): Promise<ApiResponse<ProcessingHistory[]>> {
  try {
    const result = await queryProcessingHistory({
      userId,
      limit
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors
      };
    }

    return {
      success: true,
      message: 'ユーザーの最新処理履歴を取得しました。',
      data: result.data?.processingHistory || []
    };

  } catch (error: any) {
    return handleError(error, 'ユーザー最新処理履歴取得');
  }
}

/**
 * 企業の処理中タスクを取得
 */
export async function getInProgressTasks(
  customerId?: string
): Promise<ApiResponse<ProcessingHistory[]>> {
  try {
    const result = await queryProcessingHistory({
      status: 'in_progress',
      customerId
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: result.errors
      };
    }

    return {
      success: true,
      message: '処理中のタスクを取得しました。',
      data: result.data?.processingHistory || []
    };

  } catch (error: any) {
    return handleError(error, '処理中タスク取得');
  }
}

/**
 * 処理を完了としてマーク（サーバーサイド処理完了時に使用）
 * completedAtを自動的に設定し、処理時間を計算可能にする
 * 
 * @param processingHistoryId - 処理履歴ID
 * @param status - 完了ステータス ('success' | 'failed')
 * @param downloadS3Keys - ダウンロード可能なS3キー（オプション）
 * @param errorDetail - エラー詳細（failedの場合）
 * @returns ApiResponse<ProcessingHistory>
 * 
 * @example
 * // 処理成功時
 * await markProcessingAsCompleted(
 *   'processing-history-123',
 *   'success',
 *   ['service/output/customer1/history123/result.json']
 * );
 * 
 * // 処理失敗時
 * await markProcessingAsCompleted(
 *   'processing-history-123',
 *   'failed',
 *   undefined,
 *   'AI処理中にエラーが発生しました'
 * );
 */
export async function markProcessingAsCompleted(
  processingHistoryId: string,
  status: 'success' | 'failed',
  downloadS3Keys?: string[],
  errorDetail?: string
): Promise<ApiResponse<ProcessingHistory>> {
  try {
    console.log('markProcessingAsCompleted called with:', {
      processingHistoryId,
      status,
      downloadS3Keys,
      errorDetail
    });

    // 完了時刻を現在時刻に設定
    const completedAt = new Date().toISOString();

    // 処理履歴を更新
    const result = await updateProcessingHistory({
      'processing-historyId': processingHistoryId,
      status,
      completedAt,
      downloadS3Keys,
      errorDetail
    });

    if (!result.success) {
      return result;
    }

    // 処理時間を計算（参考情報としてログ出力）
    if (result.data?.createdAt) {
      const startTime = new Date(result.data.createdAt).getTime();
      const endTime = new Date(completedAt).getTime();
      const processingTimeMs = endTime - startTime;
      const processingTimeSec = (processingTimeMs / 1000).toFixed(2);
      
      console.log('処理完了:', {
        processingHistoryId,
        status,
        startTime: result.data.createdAt,
        endTime: completedAt,
        processingTime: `${processingTimeSec}秒`
      });
    }

    return {
      success: true,
      message: `処理が${status === 'success' ? '成功' : '失敗'}として完了しました。`,
      data: result.data
    };

  } catch (error: any) {
    return handleError(error, '処理完了マーク');
  }
}