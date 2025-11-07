'use server'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayClient, CreateApiKeyCommand, DeleteApiKeyCommand, CreateUsagePlanKeyCommand, DeleteUsagePlanKeyCommand, UpdateApiKeyCommand, GetApiKeyCommand } from "@aws-sdk/client-api-gateway";
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
  apiKeyId: string;
  apiName: string;
  description?: string;
  policyId: string;
  customerId: string;
  status: APIKeyStatus;
  tags?: Record<string, string>; // タグ情報
  createdAt: string;
  updatedAt: string;
}

export interface APIKeyResponse {
  success: boolean;
  message?: string;
  warning?: string;
  apiKey?: APIKeyEntry;
  apiKeys?: APIKeyEntry[];
  lastEvaluatedKey?: Record<string, any>;
}

export interface CreateAPIKeyRequest {
  apiName: string;
  description?: string;
  policyId: string;
  tags?: Record<string, string>; // カスタムタグ（Project, environmentなど）
}

export interface UpdateAPIKeyRequest {
  apiKeyId: string;
  apiName?: string;
  description?: string;
  status?: APIKeyStatus;
  tags?: Record<string, string>; // タグの更新
}

export interface APIKeyFilter {
  policyId?: string;
  status?: APIKeyStatus;
  searchText?: string; // apiName, description
}

/**
 * API Gateway でAPIキーのタグを取得
 * 注意: API Gatewayでは、GetApiKeyCommandのレスポンスにタグが含まれます
 */
async function getAPIGatewayKeyTags(apiKeyId: string): Promise<Record<string, string>> {
  try {
    const getKeyCommand = new GetApiKeyCommand({
      apiKey: apiKeyId,
      includeValue: false
    });
    
    const response = await apiGatewayClient.send(getKeyCommand);
    
    console.log('API Gateway key tags retrieved:', {
      apiKeyId,
      tags: response.tags
    });
    
    return response.tags || {};
  } catch (error: any) {
    console.error('Error getting API Gateway key tags:', error);
    // タグ取得に失敗しても処理は続行（空のオブジェクトを返す）
    return {};
  }
}

/**
 * API Gateway でAPIキーを作成し、Usage Planに紐付ける
 */
async function createAPIGatewayKey(apiName: string, customerId: string, tags?: Record<string, string>): Promise<{ gatewayApiKeyId: string; gatewayApiKeyValue: string }> {
  try {
    // Usage Plan IDの確認
    if (!USAGE_PLAN_ID) {
      throw new Error('USAGE_PLAN_ID is not configured');
    }

    // デフォルトタグを準備（全てのAPIキーに自動適用）
    const defaultTags: Record<string, string> = {
      Project: 'siftbeam',
      customerId: customerId,
      environment: 'Production', // デフォルト環境
      version: 'v1.0'            // デフォルトバージョン
    };
    
    // カスタムタグとマージ（カスタムタグが優先）
    const allTags = { ...defaultTags, ...tags };

    // API Gateway でAPIキーを作成
    const createKeyCommand = new CreateApiKeyCommand({
      name: `${apiName}-${Date.now()}`,
      description: `API key for ${apiName}`,
      enabled: true,
      generateDistinctId: true,
      tags: allTags // タグを含めて作成
    });

    const createKeyResponse = await apiGatewayClient.send(createKeyCommand);
    
    if (!createKeyResponse.id || !createKeyResponse.value) {
      throw new Error('Failed to create API Gateway key');
    }

    const gatewayApiKeyId = createKeyResponse.id;
    const gatewayApiKeyValue = createKeyResponse.value;

    console.log('API Gateway key created:', {
      id: gatewayApiKeyId,
      idLength: gatewayApiKeyId.length,
      value: gatewayApiKeyValue,
      valueLength: gatewayApiKeyValue.length,
      name: createKeyResponse.name,
      tags: allTags
    });

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
 * API Gateway からAPIキーの値を取得
 */
async function getAPIGatewayKeyValue(apiKeyId: string): Promise<string> {
  try {
    const getKeyCommand = new GetApiKeyCommand({
      apiKey: apiKeyId,
      includeValue: true  // 値を含める
    });
    
    const response = await apiGatewayClient.send(getKeyCommand);
    
    if (!response.value) {
      throw new Error('API key value not found');
    }
    
    console.log('API Gateway key value retrieved:', {
      id: response.id,
      name: response.name,
      valueLength: response.value.length
    });
    
    return response.value;
  } catch (error: any) {
    console.error('Error getting API Gateway key value:', error);
    throw new Error(`Failed to get API key value: ${error.message}`);
  }
}

/**
 * API Gateway でAPIキーの有効/無効を切り替える
 */
async function updateAPIGatewayKeyStatus(gatewayApiKeyId: string, enabled: boolean): Promise<void> {
  try {
    console.log('updateAPIGatewayKeyStatus called with:', {
      gatewayApiKeyId,
      enabled,
      gatewayApiKeyIdType: typeof gatewayApiKeyId,
      gatewayApiKeyIdLength: gatewayApiKeyId?.length
    });

    if (!gatewayApiKeyId || gatewayApiKeyId.trim() === '') {
      throw new Error('Gateway API Key ID is empty or undefined');
    }

    // まずAPIキーが存在するか確認
    try {
      const getKeyCommand = new GetApiKeyCommand({
        apiKey: gatewayApiKeyId,
        includeValue: false
      });
      const existingKey = await apiGatewayClient.send(getKeyCommand);
      console.log('API Gateway key found:', {
        id: existingKey.id,
        name: existingKey.name,
        enabled: existingKey.enabled,
        createdDate: existingKey.createdDate
      });
    } catch (getError: any) {
      if (getError.name === 'NotFoundException') {
        console.warn('API Gateway key not found:', gatewayApiKeyId);
        throw new Error(`API Gateway key does not exist: ${gatewayApiKeyId}. The key may have been deleted or never created.`);
      }
      throw getError;
    }

    const updateKeyCommand = new UpdateApiKeyCommand({
      apiKey: gatewayApiKeyId,
      patchOperations: [
        {
          op: 'replace',
          path: '/enabled',
          value: String(enabled),
        },
      ],
    });

    console.log('Sending UpdateApiKeyCommand:', {
      apiKey: gatewayApiKeyId,
      enabled: String(enabled)
    });

    await apiGatewayClient.send(updateKeyCommand);
    
    console.log('API Gateway key status updated successfully');
  } catch (error: any) {
    console.error('Error updating API Gateway key status:', {
      gatewayApiKeyId,
      enabled,
      errorName: error.name,
      errorMessage: error.message,
      error
    });
    throw new Error(`Failed to update API Gateway key status: ${error.message}`);
  }
}

/**
 * APIキーを作成
 */
export async function createAPIKeyAction(request: CreateAPIKeyRequest): Promise<APIKeyResponse & { gatewayApiKeyValue?: string }> {
  try {
    const userAttributes = await getUserCustomAttributes();
    if (!userAttributes || !userAttributes['custom:customerId']) {
      await logFailureAction('CREATE', 'APIKey', 'User not authenticated or customer ID not found', 'apiName');
      return {
        success: false,
        message: 'User not authenticated or customer ID not found'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    const timestamp = new Date().toISOString();

    let apiKeyId: string;
    let gatewayApiKeyValue: string;

    // 新しいAPI Gateway キーを作成（タグ付き）
    try {
      const gatewayKeyResult = await createAPIGatewayKey(request.apiName, customerId, request.tags);
      apiKeyId = gatewayKeyResult.gatewayApiKeyId; // API GatewayのIDをDynamoDBのPKとして使用
      gatewayApiKeyValue = gatewayKeyResult.gatewayApiKeyValue;
    } catch (gatewayError: any) {
      await logFailureAction('CREATE', 'APIKey', gatewayError.message || 'Failed to create API Gateway key', 'apiName', '', request.apiName);
      return {
        success: false,
        message: gatewayError.message || 'Failed to create API Gateway key'
      };
    }

    const apiKeyEntry: APIKeyEntry = {
      apiKeyId: apiKeyId, // API GatewayのIDを使用
      apiName: request.apiName,
      description: request.description,
      policyId: request.policyId,
      customerId,
      status: 'active',
      tags: request.tags, // タグをDynamoDBにも保存
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const command = new PutCommand({
      TableName: API_KEY_TABLE_NAME,
      Item: apiKeyEntry,
      ConditionExpression: 'attribute_not_exists(#apiKeysId)', // 重複防止
      ExpressionAttributeNames: {
        '#apiKeysId': apiKeyId
      }
    });

    try {
      await docClient.send(command);
    } catch (dbError: any) {
      // DynamoDB保存に失敗した場合、作成したAPI Gateway キーを削除
      try {
        await deleteAPIGatewayKey(apiKeyId);
      } catch (cleanupError) {
        console.error('Failed to cleanup API Gateway key:', cleanupError);
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
    await logFailureAction('CREATE', 'APIKey', error.message || 'Failed to create API key', 'apiName', '', request.apiName || '');
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

    const response = await docClient.send(command);
    console.log('Query successful, items count:', response.Items?.length || 0);

    return {
      success: true,
      apiKeys: response.Items as APIKeyEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching API keys by customer ID:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to fetch API keys', 'customerId');
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

    return {
      success: true,
      apiKeys: response.Items as APIKeyEntry[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error: any) {
    console.error('Error fetching API keys by policy ID:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to fetch API keys', 'policyId', policyId);
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
        apiKeyId: apiKeyId,
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

    return { success: true, apiKey };
  } catch (error: any) {
    console.error('Error fetching API key by ID:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to fetch API key', apiKeyId, apiKeyId);
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
    // 既存のAPIキーを取得して権限確認
    const existingApiKey = await getAPIKeyByIdAction(request.apiKeyId);
    if (!existingApiKey.success || !existingApiKey.apiKey) {
      return existingApiKey;
    }

    console.log('Existing API Key data from DynamoDB:', {
      apiKeyId: existingApiKey.apiKey.apiKeyId,
      apiName: existingApiKey.apiKey.apiName
    });

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    let warningMessage: string | undefined = undefined;

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
      
      // API Gatewayのステータスも更新
      try {
        const enabled = request.status === 'active';
        console.log('Attempting to update API Gateway key status:', {
          apiKeyId: request.apiKeyId,
          newStatus: request.status,
          enabled
        });
        await updateAPIGatewayKeyStatus(request.apiKeyId, enabled);
      } catch (gatewayError: any) {
        console.warn('Failed to update API Gateway key status:', gatewayError.message);
        // API Gateway更新に失敗してもDynamoDB更新は続行（警告のみ）
        // ユーザーには警告メッセージを返す
        if (gatewayError.message && gatewayError.message.includes('does not exist')) {
          // API Gatewayキーが存在しない場合は、後でユーザーに通知
          console.warn('⚠️ API Gateway key does not exist. Only DynamoDB status will be updated.');
          warningMessage = 'API Gatewayのキーが見つかりません。DynamoDBのステータスのみ更新されました。新しいAPIキーを作成することをお勧めします。';
        }
      }
    }
    
    // タグの更新
    if (request.tags !== undefined) {
      updateExpressions.push('tags = :tags');
      expressionAttributeValues[':tags'] = request.tags;
      
      // API Gatewayのタグも更新
      // 注意: API Gatewayでは、UpdateApiKeyCommandでタグを完全に置き換えることはできません
      // タグはAPIキー作成時に設定され、個別の更新はpatchOperationsで行います
      try {
        // タグの更新をpatchOperationsで実行
        const patchOperations = Object.entries(request.tags).map(([key, value]) => ({
          op: 'replace' as const,
          path: `/tags/${key}`,
          value: value
        }));
        
        if (patchOperations.length > 0) {
          const updateTagCommand = new UpdateApiKeyCommand({
            apiKey: request.apiKeyId,
            patchOperations
          });
          
          await apiGatewayClient.send(updateTagCommand);
          console.log('API Gateway key tags updated successfully');
        }
      } catch (gatewayError: any) {
        console.warn('Failed to update API Gateway key tags:', gatewayError.message);
        // タグ更新に失敗してもDynamoDB更新は続行（警告のみ）
        // API Gatewayのタグ更新は制限があるため、DynamoDBのタグを信頼できるソースとして使用
      }
    }

    if (updateExpressions.length === 0) {
      return { success: false, message: 'No fields to update' };
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: API_KEY_TABLE_NAME,
      Key: { apiKeyId: request.apiKeyId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);

    // 監査ログ記録（成功） - 各フィールドごとに記録
    if (request.apiName !== undefined) {
      await logSuccessAction(
        'UPDATE', 
        'APIKey', 
        'apiName', 
        existingApiKey.apiKey.apiName, 
        request.apiName
      );
    }
    
    if (request.description !== undefined) {
      await logSuccessAction(
        'UPDATE', 
        'APIKey', 
        'description', 
        existingApiKey.apiKey.description || '', 
        request.description
      );
    }
    
    if (request.status !== undefined) {
      await logSuccessAction(
        'UPDATE', 
        'APIKey', 
        'status', 
        existingApiKey.apiKey.status, 
        request.status
      );
    }
    
    if (request.tags !== undefined) {
      await logSuccessAction(
        'UPDATE', 
        'APIKey', 
        'tags', 
        JSON.stringify(existingApiKey.apiKey.tags || {}), 
        JSON.stringify(request.tags)
      );
    }

    return {
      success: true,
      message: 'API key updated successfully',
      warning: warningMessage,
      apiKey: response.Attributes as APIKeyEntry
    };
  } catch (error: any) {
    console.error('Error updating API key:', error);
    await logFailureAction('UPDATE', 'APIKey', error.message || 'Failed to update API key', 'apiKeyId', '', request.apiKeyId);
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
  let existingApiKeyName = '';
  try {
    // 既存のAPIキーを取得して権限確認
    const existingApiKey = await getAPIKeyByIdAction(apiKeyId);
    if (!existingApiKey.success || !existingApiKey.apiKey) {
      return existingApiKey;
    }
    
    existingApiKeyName = existingApiKey.apiKey.apiName;

    // DynamoDBからAPIキーを削除
    const command = new DeleteCommand({
      TableName: API_KEY_TABLE_NAME,
      Key: { apiKeyId: apiKeyId }
    });

    await docClient.send(command);

    // API Gateway からもAPIキーを削除
    try {
      await deleteAPIGatewayKey(apiKeyId);
    } catch (gatewayError: any) {
      console.warn('Failed to delete API Gateway key, but DynamoDB deletion succeeded:', gatewayError);
      // API Gateway削除に失敗してもDynamoDB削除は成功しているので、警告のみ
    }

    await logSuccessAction('DELETE', 'APIKey', 'apiName', existingApiKeyName, '');

    return {
      success: true,
      message: 'API key deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting API key:', error);
    await logFailureAction('DELETE', 'APIKey', error.message || 'Failed to delete API key', 'apiName', existingApiKeyName, '');
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
  let existingStatus = '';
  try {
    const existingApiKey = await getAPIKeyByIdAction(apiKeyId);
    if (!existingApiKey.success || !existingApiKey.apiKey) {
      return existingApiKey;
    }
    
    existingStatus = existingApiKey.apiKey.status;
    const newStatus: APIKeyStatus = existingApiKey.apiKey.status === 'active' ? 'inactive' : 'active';

    return await updateAPIKeyAction({
      apiKeyId: apiKeyId,
      status: newStatus
    });
  } catch (error: any) {
    console.error('Error toggling API key status:', error);
    await logFailureAction('UPDATE', 'APIKey', error.message || 'Failed to toggle API key status', 'status', existingStatus, '');
    return {
      success: false,
      message: error.message || 'Failed to toggle API key status'
    };
  }
}

/**
 * APIキーの値を取得（セキュリティ重視：必要な時だけAPI Gatewayから取得）
 */
export async function getAPIKeyValueAction(apiKeyId: string): Promise<{
  success: boolean;
  value?: string;
  message?: string;
}> {
  try {
    // DynamoDBで権限確認（このAPIキーが自分のcustomerIdに属しているか）
    const apiKeyResult = await getAPIKeyByIdAction(apiKeyId);
    if (!apiKeyResult.success || !apiKeyResult.apiKey) {
      await logFailureAction('READ', 'APIKey', 'API key not found or access denied', apiKeyId, apiKeyId);
      return { success: false, message: 'API key not found or access denied' };
    }

    // API Gatewayから値を取得
    const value = await getAPIGatewayKeyValue(apiKeyId);

    // 監査ログに記録（セキュリティ重要：誰がいつAPIキー値を取得したか）
    // READアクションでも、APIキー値の取得は重要なセキュリティイベントなので記録する
    await logSuccessAction('READ', 'APIKey', 'value', '', `${apiKeyResult.apiKey.apiName} (length: ${value.length})`);

    return { success: true, value };
  } catch (error: any) {
    console.error('Error getting API key value:', error);
    await logFailureAction('READ', 'APIKey', error.message || 'Failed to get API key value', apiKeyId, apiKeyId);
    return { 
      success: false, 
      message: error.message || 'Failed to get API key value' 
    };
  }
}

/**
 * APIキーのタグを取得
 */
export async function getAPIKeyTagsAction(apiKeyId: string): Promise<{
  success: boolean;
  tags?: Record<string, string>;
  message?: string;
}> {
  try {
    // DynamoDBで権限確認
    const apiKeyResult = await getAPIKeyByIdAction(apiKeyId);
    if (!apiKeyResult.success || !apiKeyResult.apiKey) {
      return { success: false, message: 'API key not found or access denied' };
    }

    // API Gatewayからタグを取得
    const tags = await getAPIGatewayKeyTags(apiKeyId);

    return { success: true, tags };
  } catch (error: any) {
    console.error('Error getting API key tags:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to get API key tags' 
    };
  }
}
