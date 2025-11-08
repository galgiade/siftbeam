'use server'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { getUserCustomAttributes } from '@/app/utils/cognito-utils';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

// DynamoDB設定
const client = new DynamoDBClient({
  region: process.env.REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AUDIT_LOG_TABLE_NAME || 'siftbeam-audit-logs';

// 型定義
export type AuditAction = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'ATTACH' | 'DETACH';
export type AuditStatus = 'SUCCESS' | 'FAILED';

export interface AuditLogEntry {
  auditLogId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: string;
  changedField?: string;
  oldValue?: string;
  newValue?: string;
  status: AuditStatus;
  errorDetail?: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuditLogParams {
  action: AuditAction;
  resource: string;
  changedField?: string;
  oldValue?: string;
  newValue?: string;
  status: AuditStatus;
  errorDetail?: string;
}

export interface AuditLogResponse {
  success: boolean;
  message?: string;
  auditLogId?: string;
}

export interface GetAuditLogsResponse {
  success: boolean;
  data?: AuditLogEntry[];
  message?: string;
  nextToken?: string;
}

// 監査ログを作成
export async function createAuditLogAction(params: CreateAuditLogParams): Promise<AuditLogResponse> {
  try {
    // ユーザー情報を取得
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const userId = userAttributes.sub;
    const userName = userAttributes.preferred_username || userAttributes.email || 'Unknown';
    const customerId = userAttributes['custom:customerId'];

    if (!userId || !customerId) {
      return {
        success: false,
        message: 'Required user attributes not found'
      };
    }

    const auditLogId = uuidv4();
    const now = new Date().toISOString();

    const auditLogEntry: AuditLogEntry = {
      auditLogId: auditLogId,
      userId,
      userName,
      action: params.action,
      resource: params.resource,
      changedField: params.changedField,
      oldValue: params.oldValue,
      newValue: params.newValue,
      status: params.status,
      errorDetail: params.errorDetail,
      customerId,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: auditLogEntry,
    });

    await docClient.send(command);

    return {
      success: true,
      message: 'Audit log created successfully',
      auditLogId,
    };
  } catch (error) {
    errorLog('Error creating audit log:', error);
    return {
      success: false,
      message: 'Failed to create audit log',
    };
  }
}

// 顧客IDで監査ログを取得（時系列順）
export async function getAuditLogsByCustomerIdAction(
  limit: number = 50,
  lastEvaluatedKey?: string
): Promise<GetAuditLogsResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    
    if (!customerId) {
      return {
        success: false,
        message: 'Customer ID not found'
      };
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'customerId-createdAt-index',
      KeyConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': customerId,
      },
      ScanIndexForward: false, // 降順（新しい順）
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
    });

    const result = await docClient.send(command);

    return {
      success: true,
      data: result.Items as AuditLogEntry[],
      nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
    };
  } catch (error) {
    errorLog('Error getting audit logs:', error);
    return {
      success: false,
      message: 'Failed to get audit logs',
    };
  }
}

// ユーザーIDで監査ログを取得
export async function getAuditLogsByUserIdAction(
  targetUserId: string,
  limit: number = 50,
  lastEvaluatedKey?: string
): Promise<GetAuditLogsResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // 管理者権限チェック
    if (userAttributes['custom:role'] !== 'admin') {
      return {
        success: false,
        message: 'Admin privileges required'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    
    if (!customerId) {
      return {
        success: false,
        message: 'Customer ID not found'
      };
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':userId': targetUserId,
        ':customerId': customerId,
      },
      ScanIndexForward: false,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
    });

    const result = await docClient.send(command);

    return {
      success: true,
      data: result.Items as AuditLogEntry[],
      nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
    };
  } catch (error) {
    errorLog('Error getting audit logs by user ID:', error);
    return {
      success: false,
      message: 'Failed to get audit logs',
    };
  }
}

// アクション別で監査ログを取得
export async function getAuditLogsByActionAction(
  action: AuditAction,
  limit: number = 50,
  lastEvaluatedKey?: string
): Promise<GetAuditLogsResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // 管理者権限チェック
    if (userAttributes['custom:role'] !== 'admin') {
      return {
        success: false,
        message: 'Admin privileges required'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    
    if (!customerId) {
      return {
        success: false,
        message: 'Customer ID not found'
      };
    }

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'customerId = :customerId AND #action = :action',
      ExpressionAttributeNames: {
        '#action': 'action',
      },
      ExpressionAttributeValues: {
        ':customerId': customerId,
        ':action': action,
      },
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
    });

    const result = await docClient.send(command);

    // 作成日時で降順ソート
    const sortedItems = (result.Items as AuditLogEntry[]).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: sortedItems,
      nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
    };
  } catch (error) {
    errorLog('Error getting audit logs by action:', error);
    return {
      success: false,
      message: 'Failed to get audit logs',
    };
  }
}

// 特定の監査ログを取得
export async function getAuditLogByIdAction(auditLogId: string): Promise<GetAuditLogsResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    
    if (!customerId) {
      return {
        success: false,
        message: 'Customer ID not found'
      };
    }

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        auditLogId: auditLogId,
      },
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: 'Audit log not found',
      };
    }

    const auditLog = result.Item as AuditLogEntry;

    // 同じ顧客のログのみアクセス可能
    if (auditLog.customerId !== customerId) {
      return {
        success: false,
        message: 'Access denied',
      };
    }

    return {
      success: true,
      data: [auditLog],
    };
  } catch (error) {
    errorLog('Error getting audit log by ID:', error);
    return {
      success: false,
      message: 'Failed to get audit log',
    };
  }
}

// 便利関数：成功ログを作成
// 注意: READアクションは成功時にログを記録しません（失敗のみ記録）
export async function logSuccessAction(
  action: AuditAction,
  resource: string,
  changedField?: string,
  oldValue?: string,
  newValue?: string
): Promise<AuditLogResponse> {
  // READアクションの成功は記録しない（データ量が膨大になるため）
  if (action === 'READ') {
    return {
      success: true,
      message: 'READ action success - not logged',
    };
  }

  return createAuditLogAction({
    action,
    resource,
    changedField,
    oldValue,
    newValue,
    status: 'SUCCESS',
  });
}

// 便利関数：失敗ログを作成
export async function logFailureAction(
  action: AuditAction,
  resource: string,
  errorDetail: string,
  changedField?: string,
  oldValue?: string,
  newValue?: string
): Promise<AuditLogResponse> {
  return createAuditLogAction({
    action,
    resource,
    changedField,
    oldValue,
    newValue,
    status: 'FAILED',
    errorDetail,
  });
}
