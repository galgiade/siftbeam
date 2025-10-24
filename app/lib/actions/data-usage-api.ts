'use server'

import { 
  PutCommand, 
  QueryCommand,
  UpdateCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient } from '@/app/lib/aws-clients';
import { ApiResponse } from '@/app/lib/types/TypeAPIs';

const DATA_USAGE_TABLE_NAME = process.env.DATA_USAGE_TABLE_NAME || 'siftbeam-data-usage';

/**
 * データ使用量のインターフェース
 */
export interface DataUsage {
  'data-usageId': string;
  customerId: string;
  userId: string;
  userName: string;
  processingHistoryId: string;
  policyId: string;
  policyName: string;
  usageAmountBytes: number;
  usageType: 'processing' | 'storage';
  createdAt: string;
  updatedAt: string;
  completedAt?: string; // 処理完了時刻（ISO8601形式）
}

/**
 * データ使用量作成用のインターフェース
 */
export interface CreateDataUsageInput {
  'data-usageId'?: string;
  customerId: string;
  userId: string;
  userName: string;
  processingHistoryId: string;
  policyId: string;
  policyName: string;
  usageAmountBytes: number;
  usageType: 'processing' | 'storage';
  completedAt?: string; // 処理完了時刻（ISO8601形式）
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
  
  return {
    success: false,
    message: `${operation}に失敗しました: ${error.message || '不明なエラー'}`,
    errors: { 
      general: [error.message || '不明なエラーが発生しました。']
    }
  };
}

/**
 * IDを生成する関数（UUIDv4）
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * データ使用量を記録
 */
export async function createDataUsage(input: CreateDataUsageInput): Promise<ApiResponse<DataUsage>> {
  try {
    console.log('createDataUsage called with:', input);
    
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
    
    if (!input.processingHistoryId?.trim()) {
      errors.processingHistoryId = ['処理履歴IDは必須です。'];
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
    
    if (!['processing', 'storage'].includes(input.usageType)) {
      errors.usageType = ['使用タイプは"processing"または"storage"である必要があります。'];
    }
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    const dataUsageId = input['data-usageId'] || generateId();
    const now = new Date().toISOString();
    
    const dataUsage: DataUsage = {
      'data-usageId': dataUsageId,
      customerId: input.customerId,
      userId: input.userId,
      userName: input.userName,
      processingHistoryId: input.processingHistoryId,
      policyId: input.policyId,
      policyName: input.policyName,
      usageAmountBytes: input.usageAmountBytes,
      usageType: input.usageType,
      createdAt: now,
      updatedAt: now
    };
    
    // 処理完了時刻が指定されている場合は追加
    if (input.completedAt) {
      dataUsage.completedAt = input.completedAt;
    }

    const putCommand = new PutCommand({
      TableName: DATA_USAGE_TABLE_NAME,
      Item: dataUsage
    });

    await dynamoDocClient.send(putCommand);

    console.log('Data usage created successfully:', {
      dataUsageId,
      customerId: input.customerId,
      usageAmountBytes: input.usageAmountBytes
    });

    return {
      success: true,
      message: 'データ使用量が正常に記録されました。',
      data: dataUsage
    };

  } catch (error: any) {
    return handleError(error, 'データ使用量記録');
  }
}

/**
 * 企業の月次使用量を取得
 * 現在の月の使用量を全て取得します
 */
export async function getCustomerMonthlyUsage(
  customerId: string
): Promise<ApiResponse<{ totalBytes: number; usageRecords: DataUsage[] }>> {
  try {
    // 現在の月の開始日時を取得
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthISO = startOfMonth.toISOString();
    
    const command = new QueryCommand({
      TableName: DATA_USAGE_TABLE_NAME,
      IndexName: 'customerId-createdAt-index',
      KeyConditionExpression: 'customerId = :customerId AND createdAt >= :startOfMonth',
      ExpressionAttributeValues: {
        ':customerId': customerId,
        ':startOfMonth': startOfMonthISO
      }
    });

    const result = await dynamoDocClient.send(command);
    const usageRecords = (result.Items || []) as DataUsage[];
    
    // 合計バイト数を計算
    const totalBytes = usageRecords.reduce((sum, record) => sum + record.usageAmountBytes, 0);

    console.log('Customer monthly usage retrieved:', {
      customerId,
      startOfMonth: startOfMonthISO,
      totalBytes,
      recordCount: usageRecords.length
    });

    return {
      success: true,
      message: '月次使用量を取得しました。',
      data: {
        totalBytes,
        usageRecords
      }
    };

  } catch (error: any) {
    return handleError(error, '月次使用量取得');
  }
}

/**
 * ユーザーの月次使用量を取得
 * 現在の月の使用量を全て取得します
 */
export async function getUserMonthlyUsage(
  userId: string
): Promise<ApiResponse<{ totalBytes: number; usageRecords: DataUsage[] }>> {
  try {
    // 現在の月の開始日時を取得
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthISO = startOfMonth.toISOString();
    
    const command = new QueryCommand({
      TableName: DATA_USAGE_TABLE_NAME,
      IndexName: 'userId-createdAt-index',
      KeyConditionExpression: 'userId = :userId AND createdAt >= :startOfMonth',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':startOfMonth': startOfMonthISO
      }
    });

    const result = await dynamoDocClient.send(command);
    const usageRecords = (result.Items || []) as DataUsage[];
    
    // 合計バイト数を計算
    const totalBytes = usageRecords.reduce((sum, record) => sum + record.usageAmountBytes, 0);

    console.log('User monthly usage retrieved:', {
      userId,
      startOfMonth: startOfMonthISO,
      totalBytes,
      recordCount: usageRecords.length
    });

    return {
      success: true,
      message: 'ユーザーの月次使用量を取得しました。',
      data: {
        totalBytes,
        usageRecords
      }
    };

  } catch (error: any) {
    return handleError(error, 'ユーザー月次使用量取得');
  }
}

/**
 * データ使用量を更新（処理完了時刻の記録など）
 */
export async function updateDataUsage(
  dataUsageId: string,
  updates: {
    completedAt?: string;
    usageAmountBytes?: number;
  }
): Promise<ApiResponse<DataUsage>> {
  try {
    console.log('updateDataUsage called with:', { dataUsageId, updates });
    
    // 更新する属性を動的に構築
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    if (updates.completedAt !== undefined) {
      updateExpressions.push('#completedAt = :completedAt');
      expressionAttributeNames['#completedAt'] = 'completedAt';
      expressionAttributeValues[':completedAt'] = updates.completedAt;
    }
    
    if (updates.usageAmountBytes !== undefined) {
      updateExpressions.push('#usageAmountBytes = :usageAmountBytes');
      expressionAttributeNames['#usageAmountBytes'] = 'usageAmountBytes';
      expressionAttributeValues[':usageAmountBytes'] = updates.usageAmountBytes;
    }
    
    // updatedAtは常に更新
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    
    if (updateExpressions.length === 1) { // updatedAtのみの場合
      return {
        success: false,
        message: '更新するフィールドがありません。',
      };
    }
    
    const command = new UpdateCommand({
      TableName: DATA_USAGE_TABLE_NAME,
      Key: {
        'data-usageId': dataUsageId
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        '#dataUsageId': 'data-usageId'
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#dataUsageId)',
      ReturnValues: 'ALL_NEW'
    });
    
    const result = await dynamoDocClient.send(command);
    
    console.log('Data usage updated successfully:', {
      dataUsageId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });
    
    return {
      success: true,
      message: 'データ使用量が正常に更新されました。',
      data: result.Attributes as DataUsage
    };
    
  } catch (error: any) {
    console.error('Error updating data usage:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        success: false,
        message: 'データ使用量が見つかりません。'
      };
    }
    
    return handleError(error, 'データ使用量更新');
  }
}

/**
 * data-usageIdでデータ使用量を取得
 */
export async function getDataUsageById(
  dataUsageId: string
): Promise<ApiResponse<DataUsage | null>> {
  try {
    const command = new GetCommand({
      TableName: DATA_USAGE_TABLE_NAME,
      Key: {
        'data-usageId': dataUsageId
      }
    });
    
    const result = await dynamoDocClient.send(command);
    
    if (!result.Item) {
      return {
        success: true,
        message: 'データ使用量が見つかりませんでした。',
        data: null
      };
    }
    
    return {
      success: true,
      message: 'データ使用量を取得しました。',
      data: result.Item as DataUsage
    };
    
  } catch (error: any) {
    return handleError(error, 'データ使用量取得');
  }
}

