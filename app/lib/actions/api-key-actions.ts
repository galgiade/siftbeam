'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayClient, CreateApiKeyCommand, DeleteApiKeyCommand, CreateUsagePlanKeyCommand, DeleteUsagePlanKeyCommand } from "@aws-sdk/client-api-gateway";
import { v4 as uuidv4 } from 'uuid';
import { getUserCustomAttributes } from '@/app/utils/cognito-utils';
import { logSuccessAction, logFailureAction } from './audit-log-actions';

const client = new DynamoDBClient({
  region: process.env.REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

// API Gateway クライアント
const apiGatewayClient = new APIGatewayClient({
  region: process.env.REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const API_KEY_TABLE_NAME = process.env.API_KEY_TABLE_NAME || 'siftbeam-api-keys';
const CUSTOMER_CREATED_AT_INDEX = process.env.CUSTOMER_CREATED_AT_INDEX || 'customerId-createdAt-index';

// API Gateway 設定
const USAGE_PLAN_ID = process.env.USAGE_PLAN_ID || '';
const API_GATEWAY_REGION = process.env.REGION || 'ap-northeast-1';

export type APIKeyStatus = "active" | "inactive" | "expired" | "revoked";

export interface APIKeyEntry {
  'api-keysId': string;
  apiName: string;
  description?: string;
  gatewayApiKeyId: string;
  policyId: string;
  customerId: string;
  status: APIKeyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface APIKeyResponse {
  success: boolean;
  message?: string;
  apiKey?: APIKeyEntry;
  apiKeys?: APIKeyEntry[];
  lastEvaluatedKey?: Record<string, any>;
}

export interface CreateAPIKeyRequest {
  apiName: string;
  description?: string;
  gatewayApiKeyId?: string; // オプションに変更（自動生成する場合）
  policyId: string;
}

export interface UpdateAPIKeyRequest {
  'api-keysId': string;
  apiName?: string;
  description?: string;
  status?: APIKeyStatus;
}

export interface APIKeyFilter {
  policyId?: string;
  status?: APIKeyStatus;
  searchText?: string; // apiName, description
}

/**
 * API Gateway でAPIキーを作成し、Usage Planに紐付ける
 */
async function createAPIGatewayKey(apiName: string): Promise<{ gatewayApiKeyId: string; gatewayApiKeyValue: string }> {
  try {
    // Usage Plan IDの確認
    if (!USAGE_PLAN_ID) {
      throw new Error('USAGE_PLAN_ID is not configured');
    }

    // API Gateway でAPIキーを作成
    const createKeyCommand = new CreateApiKeyCommand({
      name: `${apiName}-${Date.now()}`,
      description: `API key for ${apiName}`,
      enabled: true,
      generateDistinctId: true,
    });

    const createKeyResponse = await apiGatewayClient.send(createKeyCommand);
    
    if (!createKeyResponse.id || !createKeyResponse.value) {
      throw new Error('Failed to create API Gateway key');
    }

    const gatewayApiKeyId = createKeyResponse.id;
    const gatewayApiKeyValue = createKeyResponse.value;

    // Usage Plan に紐付け
    const createUsagePlanKeyCommand = new CreateUsagePlanKeyCommand({
      usagePlanId: USAGE_PLAN_ID,
      keyId: gatewayApiKeyId,
      keyType: 'API_KEY',
    });

    await apiGatewayClient.send(createUsagePlanKeyCommand);

    return { gatewayApiKeyId, gatewayApiKeyValue };
  } catch (error: any) {
    console.error('Error creating API Gateway key:', error);
    throw new Error(`Failed to create API Gateway key: ${error.message}`);
  }
}

/**
 * API Gateway でAPIキーを削除し、Usage Planから紐付けを解除する
 */
async function deleteAPIGatewayKey(gatewayApiKeyId: string): Promise<void> {
  try {
    // Usage Plan からの紐付けを削除（存在すれば）
    if (USAGE_PLAN_ID) {
      try {
        const deleteUsagePlanKeyCommand = new DeleteUsagePlanKeyCommand({
          usagePlanId: USAGE_PLAN_ID,
          keyId: gatewayApiKeyId,
        });
        await apiGatewayClient.send(deleteUsagePlanKeyCommand);
      } catch (error: any) {
        // 既に削除済みの場合は無視
        if (error.name !== 'NotFoundException') {
          console.warn('Failed to delete usage plan key:', error);
        }
      }
    }

    // API Gateway からAPIキーを削除
    const deleteKeyCommand = new DeleteApiKeyCommand({
      apiKey: gatewayApiKeyId,
    });

    await apiGatewayClient.send(deleteKeyCommand);
  } catch (error: any) {
    // 既に削除済みの場合は無視
    if (error.name !== 'NotFoundException') {
      console.error('Error deleting API Gateway key:', error);
      throw new Error(`Failed to delete API Gateway key: ${error.message}`);
    }
  }
}

/**
 * APIキーを作成
 */
export async function createAPIKeyAction(request: CreateAPIKeyRequest): Promise<APIKeyResponse & { gatewayApiKeyValue?: string }> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('CREATE', 'APIKey', 'User not authenticated or customer ID not found');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    const timestamp = new Date().toISOString();
    const apiKeyId = uuidv4();

    let gatewayApiKeyId: string;
    let gatewayApiKeyValue: string;

    // API Gateway でキーを作成するか、既存のキーIDを使用するかを判定
    if (request.gatewayApiKeyId) {
      // 既存のgatewayApiKeyIdが提供された場合、重複チェック
      const existingKey = await getAPIKeyByGatewayIdAction(request.gatewayApiKeyId);
      if (existingKey.success && existingKey.apiKey) {
        await logFailureAction('CREATE', 'APIKey', 'Gateway API Key ID already exists');
        return {
          success: false,
          message: 'Gateway API Key ID already exists'
        };
      }
      gatewayApiKeyId = request.gatewayApiKeyId;
      gatewayApiKeyValue = ''; // 既存キーの場合、値は返さない
    } else {
      // 新しいAPI Gateway キーを作成
      try {
        const gatewayKeyResult = await createAPIGatewayKey(request.apiName);
        gatewayApiKeyId = gatewayKeyResult.gatewayApiKeyId;
        gatewayApiKeyValue = gatewayKeyResult.gatewayApiKeyValue;
      } catch (gatewayError: any) {
        await logFailureAction('CREATE', 'APIKey', gatewayError.message || 'Failed to create API Gateway key');
        return {
          success: false,
          message: gatewayError.message || 'Failed to create API Gateway key'
        };
      }
    }

    const apiKeyEntry: APIKeyEntry = {
      'api-keysId': apiKeyId,
      apiName: request.apiName,
      description: request.description,
      gatewayApiKeyId,
      policyId: request.policyId,
      customerId,
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const command = new PutCommand({
      TableName: API_KEY_TABLE_NAME,
      Item: apiKeyEntry,
      ConditionExpression: 'attribute_not_exists(#apiKeysId)', // 重複防止
      ExpressionAttributeNames: {
        '#apiKeysId': 'api-keysId'
      }
    });

    try {
      await docClient.send(command);
    } catch (dbError: any) {
      // DynamoDB保存に失敗した場合、作成したAPI Gateway キーを削除
      if (!request.gatewayApiKeyId && gatewayApiKeyId) {
        try {
          await deleteAPIGatewayKey(gatewayApiKeyId);
        } catch (cleanupError) {
          console.error('Failed to cleanup API Gateway key:', cleanupError);
        }
      }
      throw dbError;
    }

    await logSuccessAction('CREATE', 'APIKey', 'apiName', '', request.apiName);

    return {
      success: true,
      message: 'API key created successfully',
      apiKey: apiKeyEntry,
      gatewayApiKeyValue: gatewayApiKeyValue || undefined
    };
  } catch (error: any) {
    console.error('Error creating API key:', error);
    await logFailureAction('CREATE', 'APIKey', error.message || 'Failed to create API key');
    return {
      success: false,
      message: error.message || 'Failed to create API key'
    };
  }
}

/**
 * 顧客IDでAPIキー一覧を取得
 */
export async function getAPIKeysByCustomerIdAction(
  limit: number = 20,
  lastEvaluatedKey?: Record<string, any>,
  filter?: APIKeyFilter
): Promise<APIKeyResponse> {
  try {
    // 環境変数の確認
    console.log('Environment check:', {
      API_KEY_TABLE_NAME,
      CUSTOMER_CREATED_AT_INDEX,
      REGION: process.env.REGION,
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID ? 'SET' : 'NOT_SET',
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ? 'SET' : 'NOT_SET'
    });

    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];
    console.log('Customer ID:', customerId);

    let filterExpression = '';
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    // Base filter for customerId
    expressionAttributeValues[':customerId'] = customerId;

    // Optional filters
    if (filter?.policyId) {
      filterExpression += ' AND policyId = :policyId';
      expressionAttributeValues[':policyId'] = filter.policyId;
    }
    if (filter?.status) {
      filterExpression += ' AND #status = :status';
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = filter.status;
    }
    if (filter?.searchText) {
      const search = filter.searchText.toLowerCase();
      filterExpression += ` AND (contains(apiName, :search) OR contains(description, :search))`;
      expressionAttributeValues[':search'] = search;
    }

    const command = new QueryCommand({
      TableName: API_KEY_TABLE_NAME,
      IndexName: CUSTOMER_CREATED_AT_INDEX,
      KeyConditionExpression: 'customerId = :customerId',
      FilterExpression: filterExpression ? filterExpression.substring(5) : undefined, // Remove leading ' AND '
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false, // Newest first
    });

    console.log('DynamoDB Command:', JSON.stringify({
      TableName: command.input.TableName,
      IndexName: command.input.IndexName,
      KeyConditionExpression: command.input.KeyConditionExpression,
      ExpressionAttributeValues: command.input.ExpressionAttributeValues
    }, null, 2));

    let response;
    try {
      response = await docClient.send(command);
      console.log('Query successful, items count:', response.Items?.length || 0);
    } catch (queryError: any) {
      console.error('Query failed:', {
        name: queryError.name,
        code: queryError.code,
        message: queryError.message,
        statusCode: queryError.$metadata?.httpStatusCode
      });

      // インデックスが存在しない場合、またはアクセス権限がない場合、Scanでフォールバック
      if (
        queryError.name === 'ResourceNotFoundException' || 
        queryError.code === 'ResourceNotFoundException' ||
        queryError.name === 'AccessDeniedException' ||
        queryError.code === 'AccessDeniedException'
      ) {
        console.log('Attempting fallback with Scan...');
        try {
          const scanCommand = new ScanCommand({
            TableName: API_KEY_TABLE_NAME,
            FilterExpression: 'customerId = :customerId',
            ExpressionAttributeValues: { ':customerId': customerId },
            Limit: limit,
            ExclusiveStartKey: lastEvaluatedKey,
          });
          
          response = await docClient.send(scanCommand);
          console.log('Scan successful, items count:', response.Items?.length || 0);
        } catch (scanError: any) {
          console.error('Scan also failed:', {
            name: scanError.name,
            code: scanError.code,
            message: scanError.message
          });
          
          // テーブルが存在しない場合、空の結果を返す
          if (
            scanError.name === 'ResourceNotFoundException' || 
            scanError.code === 'ResourceNotFoundException'
          ) {
            console.log('Table does not exist, returning empty result');
            await logSuccessAction('READ', 'APIKey', 'count', '', '0');
            return {
              success: true,
              apiKeys: [],
              lastEvaluatedKey: undefined,
            };
          }
          
          throw scanError;
        }
      } else {
        throw queryError;
      }
    }

    await logSuccessAction('READ', 'APIKey', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      apiKeys: response.Items as APIKeyEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching API keys by customer ID:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to fetch API keys');
    return { success: false, message: error.message || 'Failed to fetch API keys' };
  }
}

/**
 * ポリシーIDでAPIキー一覧を取得
 */
export async function getAPIKeysByPolicyIdAction(
  policyId: string,
  limit: number = 20,
  lastEvaluatedKey?: Record<string, any>
): Promise<APIKeyResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    const command = new QueryCommand({
      TableName: API_KEY_TABLE_NAME,
      IndexName: 'policyId-index',
      KeyConditionExpression: 'policyId = :policyId',
      FilterExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':policyId': policyId,
        ':customerId': customerId,
      },
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);

    await logSuccessAction('READ', 'APIKey', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      apiKeys: response.Items as APIKeyEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching API keys by policy ID:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to fetch API keys');
    return { success: false, message: error.message || 'Failed to fetch API keys' };
  }
}

/**
 * APIキーIDで単一のAPIキーを取得
 */
export async function getAPIKeyByIdAction(apiKeyId: string): Promise<APIKeyResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      return { success: false, message: 'Unauthorized access' };
    }

    const customerId = userAttributes['custom:customerId'];

    const command = new GetCommand({
      TableName: API_KEY_TABLE_NAME,
      Key: {
        'api-keysId': apiKeyId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return { success: false, message: 'API key not found' };
    }

    const apiKey = response.Item as APIKeyEntry;

    // 顧客IDの確認
    if (apiKey.customerId !== customerId) {
      return { success: false, message: 'Unauthorized access to this API key' };
    }

    await logSuccessAction('READ', 'APIKey', 'id', '', apiKeyId);

    return { success: true, apiKey };
  } catch (error: any) {
    console.error('Error fetching API key by ID:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to fetch API key');
    return { success: false, message: error.message || 'Failed to fetch API key' };
  }
}

/**
 * Gateway API Key IDで単一のAPIキーを取得（内部使用）
 */
export async function getAPIKeyByGatewayIdAction(gatewayApiKeyId: string): Promise<APIKeyResponse> {
  try {
    const command = new QueryCommand({
      TableName: API_KEY_TABLE_NAME,
      IndexName: 'gatewayApiKeyId-index',
      KeyConditionExpression: 'gatewayApiKeyId = :gatewayApiKeyId',
      ExpressionAttributeValues: {
        ':gatewayApiKeyId': gatewayApiKeyId,
      },
      Limit: 1,
    });

    const response = await docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return { success: false, message: 'API key not found' };
    }

    return { success: true, apiKey: response.Items[0] as APIKeyEntry };
  } catch (error: any) {
    console.error('Error fetching API key by gateway ID:', error);
    return { success: false, message: error.message || 'Failed to fetch API key' };
  }
}

/**
 * APIキーを更新
 */
export async function updateAPIKeyAction(request: UpdateAPIKeyRequest): Promise<APIKeyResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('UPDATE', 'APIKey', request['api-keysId'], 'User not authenticated or customer ID not found');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // 既存のAPIキーを取得して権限確認
    const existingApiKey = await getAPIKeyByIdAction(request['api-keysId']);
    if (!existingApiKey.success || !existingApiKey.apiKey) {
      return existingApiKey;
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (request.apiName !== undefined) {
      updateExpressions.push('#apiName = :apiName');
      expressionAttributeNames['#apiName'] = 'apiName';
      expressionAttributeValues[':apiName'] = request.apiName;
    }

    if (request.description !== undefined) {
      updateExpressions.push('description = :description');
      expressionAttributeValues[':description'] = request.description;
    }

    if (request.status !== undefined) {
      updateExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = request.status;
    }

    if (updateExpressions.length === 0) {
      return { success: false, message: 'No fields to update' };
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: API_KEY_TABLE_NAME,
      Key: { 'api-keysId': request['api-keysId'] },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'customerId = :customerId',
      ReturnValues: 'ALL_NEW',
    });

    expressionAttributeValues[':customerId'] = customerId;

    const response = await docClient.send(command);

    await logSuccessAction('UPDATE', 'APIKey', 'multiple', 
      JSON.stringify(existingApiKey.apiKey), JSON.stringify(response.Attributes));

    return {
      success: true,
      message: 'API key updated successfully',
      apiKey: response.Attributes as APIKeyEntry
    };
  } catch (error: any) {
    console.error('Error updating API key:', error);
    await logFailureAction('UPDATE', 'APIKey', request['api-keysId'], error.message || 'Failed to update API key');
    return {
      success: false,
      message: error.message || 'Failed to update API key'
    };
  }
}

/**
 * APIキーを削除
 */
export async function deleteAPIKeyAction(apiKeyId: string): Promise<APIKeyResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('DELETE', 'APIKey', apiKeyId, 'User not authenticated or customer ID not found');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];

    // 既存のAPIキーを取得して権限確認
    const existingApiKey = await getAPIKeyByIdAction(apiKeyId);
    if (!existingApiKey.success || !existingApiKey.apiKey) {
      return existingApiKey;
    }

    const gatewayApiKeyId = existingApiKey.apiKey.gatewayApiKeyId;

    // DynamoDBからAPIキーを削除
    const command = new DeleteCommand({
      TableName: API_KEY_TABLE_NAME,
      Key: { 'api-keysId': apiKeyId },
      ConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': customerId,
      },
    });

    await docClient.send(command);

    // API Gateway からもAPIキーを削除
    try {
      await deleteAPIGatewayKey(gatewayApiKeyId);
    } catch (gatewayError: any) {
      console.warn('Failed to delete API Gateway key, but DynamoDB deletion succeeded:', gatewayError);
      // API Gateway削除に失敗してもDynamoDB削除は成功しているので、警告のみ
    }

    await logSuccessAction('DELETE', 'APIKey', 'id', apiKeyId, '');

    return {
      success: true,
      message: 'API key deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting API key:', error);
    await logFailureAction('DELETE', 'APIKey', apiKeyId, error.message || 'Failed to delete API key');
    return {
      success: false,
      message: error.message || 'Failed to delete API key'
    };
  }
}

/**
 * APIキーのステータスを変更（有効/無効切り替え）
 */
export async function toggleAPIKeyStatusAction(apiKeyId: string): Promise<APIKeyResponse> {
  try {
    const existingApiKey = await getAPIKeyByIdAction(apiKeyId);
    if (!existingApiKey.success || !existingApiKey.apiKey) {
      return existingApiKey;
    }

    const newStatus: APIKeyStatus = existingApiKey.apiKey.status === 'active' ? 'inactive' : 'active';

    return await updateAPIKeyAction({
      'api-keysId': apiKeyId,
      status: newStatus
    });
  } catch (error: any) {
    console.error('Error toggling API key status:', error);
    await logFailureAction('UPDATE', 'APIKey', apiKeyId, error.message || 'Failed to toggle API key status');
    return {
      success: false,
      message: error.message || 'Failed to toggle API key status'
    };
  }
}

/**
 * 管理者用：全APIキーを取得（管理者のみ）
 */
export async function getAllAPIKeysAction(
  limit: number = 50,
  lastEvaluatedKey?: Record<string, any>
): Promise<APIKeyResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || userAttributes['custom:role'] !== 'admin') {
      await logFailureAction('READ', 'APIKey', 'AllAPIKeys', 'Admin access required');
      return { success: false, message: 'Admin access required' };
    }

    const command = new ScanCommand({
      TableName: API_KEY_TABLE_NAME,
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);

    await logSuccessAction('READ', 'APIKey', 'count', '', String(response.Items?.length || 0));

    return {
      success: true,
      apiKeys: response.Items as APIKeyEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching all API keys:', error);
    await logFailureAction('READ', 'APIKey', 'AllAPIKeys', error.message || 'Failed to fetch all API keys');
    return { success: false, message: error.message || 'Failed to fetch all API keys' };
  }
}
