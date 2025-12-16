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

const USAGE_LIMITS_TABLE_NAME = process.env.USAGE_LIMITS_TABLE_NAME || 'siftbeam-usage-limits';

/**
 * 使用量制限の型定義
 */
export interface UsageLimit {
  usageLimitId: string;
  customerId: string;
  usageLimitValue?: number;
  usageUnit?: 'MB' | 'GB' | 'TB';
  amountLimitValue?: number;
  exceedAction: 'notify' | 'restrict';
  emails: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 使用量制限作成用のインターフェース
 */
export interface CreateUsageLimitInput {
  usageLimitId?: string; // 事前生成されたUUID（オプション、未指定時は自動生成）
  customerId: string;
  usageLimitValue?: number;
  usageUnit?: 'MB' | 'GB' | 'TB';
  amountLimitValue?: number;
  exceedAction: 'notify' | 'restrict';
  emails: string[];
}

/**
 * 使用量制限更新用のインターフェース
 */
export interface UpdateUsageLimitInput {
  usageLimitId: string;
  usageLimitValue?: number;
  usageUnit?: 'MB' | 'GB' | 'TB';
  amountLimitValue?: number;
  exceedAction?: 'notify' | 'restrict';
  emails?: string[];
}

/**
 * 使用量制限クエリ用のインターフェース
 */
export interface QueryUsageLimitsInput {
  customerId?: string;
  exceedAction?: 'notify' | 'restrict';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * 使用量制限クエリ結果のインターフェース
 */
export interface QueryUsageLimitsResult {
  usageLimits: UsageLimit[];
  lastEvaluatedKey?: Record<string, any>;
  count: number;
}

/**
 * UUIDを生成する関数
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 使用量制限を作成する
 */
export async function createUsageLimit(input: CreateUsageLimitInput): Promise<ApiResponse<UsageLimit>> {
  try {
    const usageLimitIdValue = input.usageLimitId || generateUUID();
    const now = new Date().toISOString();

    const usageLimit: UsageLimit = {
      usageLimitId: usageLimitIdValue,
      customerId: input.customerId,
      usageLimitValue: input.usageLimitValue,
      usageUnit: input.usageUnit,
      amountLimitValue: input.amountLimitValue,
      exceedAction: input.exceedAction,
      emails: input.emails,
      createdAt: now,
      updatedAt: now
    };

    const command = new PutCommand({
      TableName: USAGE_LIMITS_TABLE_NAME,
      Item: usageLimit,
      ConditionExpression: 'attribute_not_exists(usageLimitId)'
    });

    await dynamoDocClient.send(command);

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'UsageLimit', 'limit', '', `${input.usageLimitValue || 'N/A'} ${input.usageUnit || ''} / ${input.amountLimitValue || 'N/A'} JPY`);

    return {
      success: true,
      data: usageLimit,
      message: '使用量制限が正常に作成されました。'
    };

  } catch (error: any) {
    errorLog('Error creating usage limit:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        success: false,
        message: '同じIDの使用量制限が既に存在します。'
      };
    }

    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'UsageLimit', error?.message || '使用量制限作成に失敗しました', 'limit', '', input.customerId);

    return {
      success: false,
      message: `使用量制限の作成に失敗しました: ${error.message}`
    };
  }
}

/**
 * 使用量制限を取得する
 */
export async function getUsageLimit(usageLimitsId: string): Promise<ApiResponse<UsageLimit>> {
  try {
    const command = new GetCommand({
      TableName: USAGE_LIMITS_TABLE_NAME,
      Key: {
        usageLimitId: usageLimitsId
      }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: '使用量制限が見つかりません。'
      };
    }

    return {
      success: true,
      data: result.Item as UsageLimit,
      message: '使用量制限を正常に取得しました。'
    };

  } catch (error: any) {
    errorLog('Error getting usage limit:', error);
    return {
      success: false,
      message: `使用量制限の取得に失敗しました: ${error.message}`
    };
  }
}

/**
 * 使用量制限を更新する
 */
export async function updateUsageLimit(input: UpdateUsageLimitInput): Promise<ApiResponse<UsageLimit>> {
  try {
    const now = new Date().toISOString();
    
    // 更新する属性を動的に構築
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // updatedAtは常に更新
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = now;

    // 各フィールドの更新
    if (input.usageLimitValue !== undefined) {
      updateExpressions.push('#usageLimitValue = :usageLimitValue');
      expressionAttributeNames['#usageLimitValue'] = 'usageLimitValue';
      expressionAttributeValues[':usageLimitValue'] = input.usageLimitValue;
    }

    if (input.usageUnit !== undefined) {
      updateExpressions.push('#usageUnit = :usageUnit');
      expressionAttributeNames['#usageUnit'] = 'usageUnit';
      expressionAttributeValues[':usageUnit'] = input.usageUnit;
    }

    if (input.amountLimitValue !== undefined) {
      updateExpressions.push('#amountLimitValue = :amountLimitValue');
      expressionAttributeNames['#amountLimitValue'] = 'amountLimitValue';
      expressionAttributeValues[':amountLimitValue'] = input.amountLimitValue;
    }

    if (input.exceedAction !== undefined) {
      updateExpressions.push('#exceedAction = :exceedAction');
      expressionAttributeNames['#exceedAction'] = 'exceedAction';
      expressionAttributeValues[':exceedAction'] = input.exceedAction;
    }

    if (input.emails !== undefined) {
      updateExpressions.push('#emails = :emails');
      expressionAttributeNames['#emails'] = 'emails';
      expressionAttributeValues[':emails'] = input.emails;
    }

    const command = new UpdateCommand({
      TableName: USAGE_LIMITS_TABLE_NAME,
      Key: {
        usageLimitId: input.usageLimitId
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(#usageLimitId)',
      ReturnValues: 'ALL_NEW'
    });

    // ConditionExpression用の属性名を追加
    command.input.ExpressionAttributeNames!['#usageLimitId'] = 'usageLimitId';

    const result = await dynamoDocClient.send(command);

    // 監査ログ記録（成功）
    const updatedFields = Object.keys(command.input.ExpressionAttributeValues || {}).filter(key => key !== ':updatedAt').join(', ');
    await logSuccessAction('UPDATE', 'UsageLimit', updatedFields, '', input.usageLimitId);

    return {
      success: true,
      data: result.Attributes as UsageLimit,
      message: '使用量制限が正常に更新されました。'
    };

  } catch (error: any) {
    errorLog('Error updating usage limit:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        success: false,
        message: '使用量制限が見つかりません。'
      };
    }

    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'UsageLimit', error?.message || '使用量制限更新に失敗しました', 'limit', '', input.usageLimitId);

    return {
      success: false,
      message: `使用量制限の更新に失敗しました: ${error.message}`
    };
  }
}

/**
 * 使用量制限を削除する
 */
export async function deleteUsageLimit(usageLimitsId: string): Promise<ApiResponse<void>> {
  try {
    const command = new DeleteCommand({
      TableName: USAGE_LIMITS_TABLE_NAME,
      Key: {
        usageLimitId: usageLimitsId
      },
      ConditionExpression: 'attribute_exists(#usageLimitId)',
      ExpressionAttributeNames: {
        '#usageLimitId': 'usageLimitId'
      }
    });

    await dynamoDocClient.send(command);

    // 監査ログ記録（成功）
    await logSuccessAction('DELETE', 'UsageLimit', 'limit', '', usageLimitsId);

    return {
      success: true,
      message: '使用量制限が正常に削除されました。'
    };

  } catch (error: any) {
    errorLog('Error deleting usage limit:', error);
    
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        success: false,
        message: '使用量制限が見つかりません。'
      };
    }

    // 監査ログ記録（失敗）
    await logFailureAction('DELETE', 'UsageLimit', error?.message || '使用量制限削除に失敗しました', 'limit', '', usageLimitsId);

    return {
      success: false,
      message: `使用量制限の削除に失敗しました: ${error.message}`
    };
  }
}

/**
 * 使用量制限をクエリする
 */
export async function queryUsageLimits(input: QueryUsageLimitsInput): Promise<ApiResponse<QueryUsageLimitsResult>> {
  try {
    let command: QueryCommand;

    if (input.customerId) {
      // customerId-createdAt-indexを使用してクエリ
      command = new QueryCommand({
        TableName: USAGE_LIMITS_TABLE_NAME,
        IndexName: 'customerId-createdAt-index',
        KeyConditionExpression: '#customerId = :customerId',
        ExpressionAttributeNames: {
          '#customerId': 'customerId'
        },
        ExpressionAttributeValues: {
          ':customerId': input.customerId
        },
        ScanIndexForward: false, // 新しい順
        Limit: input.limit || 50,
        ExclusiveStartKey: input.lastEvaluatedKey
      });

      // exceedActionでフィルタリング
      if (input.exceedAction) {
        command.input.FilterExpression = '#exceedAction = :exceedAction';
        command.input.ExpressionAttributeNames!['#exceedAction'] = 'exceedAction';
        command.input.ExpressionAttributeValues![':exceedAction'] = input.exceedAction;
      }
    } else {
      throw new Error('customerId is required for querying usage limits');
    }

    const result = await dynamoDocClient.send(command);

    return {
      success: true,
      data: {
        usageLimits: (result.Items || []) as UsageLimit[],
        lastEvaluatedKey: result.LastEvaluatedKey,
        count: result.Count || 0
      },
      message: '使用量制限のクエリが正常に完了しました。'
    };

  } catch (error: any) {
    errorLog('Error querying usage limits:', error);
    return {
      success: false,
      message: `使用量制限のクエリに失敗しました: ${error.message}`
    };
  }
}

/**
 * 企業の使用量制限を取得する（通知用と制限用を分けて）
 */
export async function getCustomerUsageLimits(customerId: string): Promise<ApiResponse<{
  notifyLimits: UsageLimit[];
  restrictLimits: UsageLimit[];
}>> {
  try {
    const result = await queryUsageLimits({ customerId, limit: 100 });
    
    if (!result.success) {
      return {
        success: false,
        message: result.message
      };
    }

    const notifyLimits = result.data!.usageLimits.filter(limit => limit.exceedAction === 'notify');
    const restrictLimits = result.data!.usageLimits.filter(limit => limit.exceedAction === 'restrict');

    return {
      success: true,
      data: {
        notifyLimits,
        restrictLimits
      },
      message: '企業の使用量制限を正常に取得しました。'
    };

  } catch (error: any) {
    errorLog('Error getting customer usage limits:', error);
    return {
      success: false,
      message: `企業の使用量制限の取得に失敗しました: ${error.message}`
    };
  }
}

/**
 * 複数の使用量制限を一括作成する
 */
export async function createMultipleUsageLimits(inputs: CreateUsageLimitInput[]): Promise<ApiResponse<UsageLimit[]>> {
  try {
    const usageLimits: UsageLimit[] = [];
    const putRequests: any[] = [];

    for (const input of inputs) {
      const usageLimitIdValue = input.usageLimitId || generateUUID();
      const now = new Date().toISOString();

      const usageLimit: UsageLimit = {
        usageLimitId: usageLimitIdValue,
        customerId: input.customerId,
        usageLimitValue: input.usageLimitValue,
        usageUnit: input.usageUnit,
        amountLimitValue: input.amountLimitValue,
        exceedAction: input.exceedAction,
        emails: input.emails,
        createdAt: now,
        updatedAt: now
      };

      usageLimits.push(usageLimit);
      putRequests.push({
        PutRequest: {
          Item: usageLimit
        }
      });
    }

    // バッチ書き込み（最大25件ずつ）
    const batchSize = 25;
    for (let i = 0; i < putRequests.length; i += batchSize) {
      const batch = putRequests.slice(i, i + batchSize);
      
      const command = new BatchWriteCommand({
        RequestItems: {
          [USAGE_LIMITS_TABLE_NAME]: batch
        }
      });

      await dynamoDocClient.send(command);
    }

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'UsageLimit', 'batchCreate', '', `${usageLimits.length} limits for customer ${inputs[0]?.customerId || 'unknown'}`);

    return {
      success: true,
      data: usageLimits,
      message: `${usageLimits.length}件の使用量制限が正常に作成されました。`
    };

  } catch (error: any) {
    errorLog('Error creating multiple usage limits:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'UsageLimit', error?.message || '複数使用量制限作成に失敗しました', 'batchCreate', '', inputs[0]?.customerId || 'unknown');
    
    return {
      success: false,
      message: `複数使用量制限の作成に失敗しました: ${error.message}`
    };
  }
}
