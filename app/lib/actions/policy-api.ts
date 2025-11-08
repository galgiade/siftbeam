'use server'

import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';
import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { dynamoDocClient } from '@/app/lib/aws-clients';
import { ApiResponse } from '@/app/lib/types/TypeAPIs';
import { 
  PolicyAnalysisEntry, 
  createPolicyAnalysisAction, 
  getPolicyAnalysesByPolicyIdAction,
  updatePolicyAnalysisAction 
} from './policy-analysis-actions';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';
import { getGroupsByUserId, getPoliciesByGroupId } from './group-api';

const POLICY_TABLE_NAME = process.env.POLICY_TABLE_NAME || 'siftbeam-policies';

/**
 * ポリシーの型定義
 */
export interface Policy {
  policyId: string;
  policyName: string;
  description: string;
  customerId: string;
  acceptedFileTypes: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // ソフト削除用
}

/**
 * ポリシー作成用のインターフェース
 */
export interface CreatePolicyInput {
  policyName: string;
  description: string;
  customerId: string;
  acceptedFileTypes: string[];
}

/**
 * ポリシー更新用のインターフェース
 */
export interface UpdatePolicyInput {
  policyId: string;
  policyName?: string;
  description?: string;
  acceptedFileTypes?: string[];
}

/**
 * ポリシークエリ用のインターフェース
 */
export interface QueryPoliciesInput {
  customerId: string; // 必須
  policyName?: string; // ソートキーでの絞り込み用（部分一致）
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
      message: 'ポリシーが見つかりません。',
      errors: { dynamodb: ['指定されたポリシーIDが存在しないか、条件が満たされませんでした。'] }
    };
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return {
      success: false,
      message: 'DynamoDBテーブルが見つかりません。',
      errors: { 
        dynamodb: ['テーブル名を確認してください。'],
        config: [`環境変数 POLICY_TABLE_NAME: ${POLICY_TABLE_NAME}`]
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
 * ポリシーIDを生成する関数（UUIDv4）
 */
function generatePolicyId(): string {
  return crypto.randomUUID();
}

/**
 * ポリシーをIDで取得 (getItem)
 */
export async function getPolicyById(policyId: string): Promise<ApiResponse<Policy>> {
  try {
    if (!policyId) {
      return {
        success: false,
        message: 'ポリシーIDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: POLICY_TABLE_NAME,
      Key: { policyId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: 'ポリシーが見つかりません。',
      };
    }

    // ソフト削除されたポリシーは除外
    if (result.Item.deletedAt) {
      return {
        success: false,
        message: 'ポリシーが見つかりません。',
      };
    }

    debugLog('Policy retrieved successfully:', { policyId });

    return {
      success: true,
      message: 'ポリシー情報を取得しました。',
      data: result.Item as Policy
    };

  } catch (error: any) {
    return handleError(error, 'ポリシー取得');
  }
}

/**
 * ユーザーが所属するグループに紐づくポリシーを取得
 * サービスページで使用（一般ユーザー向け）
 */
export async function getPoliciesForUser(
  userId: string,
  customerId: string
): Promise<ApiResponse<{ policies: Policy[] }>> {
  try {
    debugLog('=== getPoliciesForUser開始 ===');
    debugLog('userId:', userId);
    debugLog('customerId:', customerId);

    // 1. ユーザーが所属するグループを取得
    const userGroupsResult = await getGroupsByUserId(userId);
    
    if (!userGroupsResult.success) {
      debugLog('⚠️ ユーザーグループの取得に失敗:', userGroupsResult.message);
      return {
        success: true,
        message: 'ユーザーはグループに所属していません。',
        data: { policies: [] }
      };
    }

    const userGroups = userGroupsResult.data || [];
    const groupIds = userGroups.map(ug => ug.groupId);
    
    debugLog('ユーザーが所属するグループ数:', groupIds.length);
    debugLog('グループID一覧:', groupIds);

    if (groupIds.length === 0) {
      debugLog('✅ ユーザーはグループに所属していません');
      return {
        success: true,
        message: 'ユーザーはグループに所属していません。',
        data: { policies: [] }
      };
    }

    // 2. 各グループに紐づくポリシーIDを取得
    const policyGroupsResults = await Promise.all(
      groupIds.map(groupId => getPoliciesByGroupId(groupId))
    );

    // 成功したポリシーグループのみを抽出
    const allPolicyGroups = policyGroupsResults
      .filter(result => result.success && result.data)
      .flatMap(result => result.data!);

    // 重複を排除してポリシーIDの配列を作成
    const uniquePolicyIds = Array.from(new Set(allPolicyGroups.map(pg => pg.policyId)));
    
    debugLog('グループに紐づくポリシー数（重複除外後）:', uniquePolicyIds.length);
    debugLog('ポリシーID一覧:', uniquePolicyIds);

    if (uniquePolicyIds.length === 0) {
      debugLog('✅ グループにポリシーが紐づいていません');
      return {
        success: true,
        message: 'グループにポリシーが紐づいていません。',
        data: { policies: [] }
      };
    }

    // 3. ポリシーの詳細情報を取得
    const policiesResults = await Promise.all(
      uniquePolicyIds.map(policyId => getPolicyById(policyId))
    );

    // 成功したポリシーのみを抽出
    const validPolicies = policiesResults
      .filter(result => result.success && result.data)
      .map(result => result.data!);

    debugLog('✅ 取得成功したポリシー数:', validPolicies.length);
    debugLog('=== getPoliciesForUser完了 ===');

    // 監査ログ記録（成功）
    await logSuccessAction('READ', 'Policy', 'policies', '', `${validPolicies.length} policies for user ${userId}`);

    return {
      success: true,
      message: `${validPolicies.length}件のポリシーを取得しました。`,
      data: { policies: validPolicies }
    };

  } catch (error: any) {
    errorLog('❌ getPoliciesForUserエラー:', error);
    
    // 監査ログ記録（失敗）
    await logFailureAction('READ', 'Policy', error?.message || 'ユーザーポリシー取得に失敗しました', 'policies', '', userId);
    
    return handleError(error, 'ユーザーポリシー取得');
  }
}

/**
 * ポリシーをクエリで検索 (query)
 */
export async function queryPolicies(
  input: QueryPoliciesInput
): Promise<ApiResponse<{ policies: Policy[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    // customerIdでクエリ（GSI使用）- customerIdは必須
    let keyConditionExpression = 'customerId = :customerId';
    const expressionAttributeValues: Record<string, any> = {
      ':customerId': input.customerId
    };

    // policyNameでの絞り込みが指定されている場合（オプション）
    if (input.policyName) {
      keyConditionExpression += ' AND begins_with(policyName, :policyName)';
      expressionAttributeValues[':policyName'] = input.policyName;
    }

    const command = new QueryCommand({
      TableName: POLICY_TABLE_NAME,
      IndexName: 'customerId-policyName-index', // GSIの名前
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: 'attribute_not_exists(deletedAt)', // ソフト削除されたものを除外
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: input.limit || 1000,
      ExclusiveStartKey: input.lastEvaluatedKey
    });

    const result = await dynamoDocClient.send(command);
    const policies = result.Items as Policy[];

    debugLog('Policies queried successfully:', { 
      count: policies.length, 
      customerId: input.customerId,
      policyName: input.policyName
    });

    return {
      success: true,
      message: 'ポリシー一覧を取得しました。',
      data: {
        policies,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, 'ポリシークエリ');
  }
}

/**
 * ポリシーを作成 (create)
 */
export async function createPolicy(input: CreatePolicyInput): Promise<ApiResponse<Policy>> {
  try {
    debugLog('createPolicy called with input:', input);
    
    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.policyName?.trim()) {
      errors.policyName = ['ポリシー名は必須です。'];
    }
    
    if (!input.description?.trim()) {
      errors.description = ['説明は必須です。'];
    }
    
    if (!input.customerId?.trim()) {
      errors.customerId = ['カスタマーIDは必須です。'];
    }
    
    if (!input.acceptedFileTypes || input.acceptedFileTypes.length === 0) {
      errors.acceptedFileTypes = ['許可するファイル形式を少なくとも1つ選択してください。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // ポリシーIDを生成
    const policyId = generatePolicyId();
    const now = new Date().toISOString();
    
    const newPolicy: Policy = {
      policyId,
      policyName: input.policyName.trim(),
      description: input.description.trim(),
      customerId: input.customerId,
      acceptedFileTypes: input.acceptedFileTypes,
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: POLICY_TABLE_NAME,
      Item: newPolicy,
      ConditionExpression: 'attribute_not_exists(policyId)' // 重複防止
    });

    await dynamoDocClient.send(putCommand);

    debugLog('Policy created successfully:', { 
      policyId,
      policyName: input.policyName,
      customerId: input.customerId 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'Policy', 'policyName', '', input.policyName);

    return {
      success: true,
      message: 'ポリシーが正常に作成されました。',
      data: newPolicy
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'Policy', error?.message || 'ポリシー作成に失敗しました', 'policyName', '', input.policyName || '');
    
    return handleError(error, 'ポリシー作成');
  }
}

/**
 * ポリシーを更新 (update)
 */
export async function updatePolicy(input: UpdatePolicyInput): Promise<ApiResponse<Policy>> {
  try {
    debugLog('updatePolicy called with:', input);
    
    // 更新前の値を取得（監査ログ用）
    const existingResult = await getPolicyById(input.policyId);
    if (!existingResult.success || !existingResult.data) {
      return {
        success: false,
        message: 'ポリシーが見つかりません。',
      };
    }
    const existingPolicy = existingResult.data;
    
    // acceptedFileTypesの更新を禁止（会社が決定するため）
    if (input.acceptedFileTypes !== undefined) {
      warnLog('⚠️ acceptedFileTypesの更新が試みられましたが、拒否されました:', input.policyId);
      return {
        success: false,
        message: '許可するファイル形式は変更できません。',
        errors: {
          acceptedFileTypes: ['許可するファイル形式は当社が決定しているため、変更できません。']
        }
      };
    }
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    if (input.policyName !== undefined && !input.policyName.trim()) {
      errors.policyName = ['ポリシー名は必須です。'];
    }
    
    if (input.description !== undefined && !input.description.trim()) {
      errors.description = ['説明は必須です。'];
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
    
    if (input.policyName) {
      updateExpression.push('#policyName = :policyName');
      expressionAttributeNames['#policyName'] = 'policyName';
      expressionAttributeValues[':policyName'] = input.policyName.trim();
    }
    
    if (input.description) {
      updateExpression.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = input.description.trim();
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
      TableName: POLICY_TABLE_NAME,
      Key: { policyId: input.policyId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(policyId) AND attribute_not_exists(deletedAt)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('Policy updated successfully:', {
      policyId: input.policyId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    // 監査ログ記録（成功） - 各フィールドごとに記録
    if (input.policyName) {
      await logSuccessAction('UPDATE', 'Policy', 'policyName', existingPolicy.policyName, input.policyName.trim());
    }
    if (input.description) {
      await logSuccessAction('UPDATE', 'Policy', 'description', existingPolicy.description, input.description.trim());
    }

    return {
      success: true,
      message: 'ポリシー情報が正常に更新されました。',
      data: result.Attributes as Policy
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'Policy', error?.message || 'ポリシー更新に失敗しました', 'policyId', '', input.policyId);
    
    return handleError(error, 'ポリシー更新');
  }
}

/**
 * ポリシーを削除 (delete)
 */
export async function deletePolicy(
  policyId: string,
  softDelete: boolean = true
): Promise<ApiResponse<void>> {
  try {
    if (!policyId) {
      return {
        success: false,
        message: 'ポリシーIDが必要です。',
      };
    }

    // 削除前のポリシー情報を取得（監査ログ用）
    const existingResult = await getPolicyById(policyId);
    if (!existingResult.success || !existingResult.data) {
      return {
        success: false,
        message: 'ポリシーが見つかりません。',
      };
    }
    const existingPolicy = existingResult.data;

    if (softDelete) {
      // ソフト削除（削除フラグを設定）
      const updateCommand = new UpdateCommand({
        TableName: POLICY_TABLE_NAME,
        Key: { policyId },
        UpdateExpression: 'SET #deletedAt = :deletedAt, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':deletedAt': new Date().toISOString(),
          ':updatedAt': new Date().toISOString()
        },
        ConditionExpression: 'attribute_exists(policyId) AND attribute_not_exists(deletedAt)',
      });

      await dynamoDocClient.send(updateCommand);
    } else {
      // ハード削除
      const deleteCommand = new DeleteCommand({
        TableName: POLICY_TABLE_NAME,
        Key: { policyId },
        ConditionExpression: 'attribute_exists(policyId)',
      });

      await dynamoDocClient.send(deleteCommand);
    }

    debugLog('Policy deleted successfully:', { 
      policyId, 
      softDelete 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('DELETE', 'Policy', 'policyName', existingPolicy.policyName, '');

    return {
      success: true,
      message: 'ポリシーが削除されました。',
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('DELETE', 'Policy', error?.message || 'ポリシー削除に失敗しました', 'policyName', '', '');
    
    return handleError(error, 'ポリシー削除');
  }
}

/**
 * 削除されたポリシーを復元
 */
export async function restorePolicy(policyId: string): Promise<ApiResponse<Policy>> {
  try {
    if (!policyId) {
      return {
        success: false,
        message: 'ポリシーIDが必要です。',
      };
    }

    const updateCommand = new UpdateCommand({
      TableName: POLICY_TABLE_NAME,
      Key: { policyId },
      UpdateExpression: 'REMOVE #deletedAt SET #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': new Date().toISOString()
      },
      ConditionExpression: 'attribute_exists(policyId) AND attribute_exists(deletedAt)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('Policy restored successfully:', { policyId });

    return {
      success: true,
      message: 'ポリシーが復元されました。',
      data: result.Attributes as Policy
    };

  } catch (error: any) {
    return handleError(error, 'ポリシー復元');
  }
}

/**
 * ポリシーに関連するPolicyAnalysisを取得
 */
export async function getPolicyAnalysesForPolicy(policyId: string): Promise<ApiResponse<{ analyses: PolicyAnalysisEntry[] }>> {
  try {
    debugLog('Getting policy analyses for policy:', { policyId });

    const result = await getPolicyAnalysesByPolicyIdAction(policyId, 50);

    if (!result.success) {
      return {
        success: false,
        message: result.message || 'ポリシー分析の取得に失敗しました。',
        errors: { policyId: [result.message || 'ポリシー分析の取得に失敗しました。'] }
      };
    }

    return {
      success: true,
      message: 'ポリシー分析を正常に取得しました。',
      data: { analyses: result.analyses || [] }
    };

  } catch (error: any) {
    return handleError(error, 'ポリシー分析取得');
  }
}

/**
 * ポリシーに対して新しい分析を開始
 */
export async function startPolicyAnalysis(
  policyId: string, 
  model: string
): Promise<ApiResponse<PolicyAnalysisEntry>> {
  try {
    debugLog('Starting policy analysis:', { policyId, model });

    const result = await createPolicyAnalysisAction({
      policyId,
      model
    });

    if (!result.success || !result.analysis) {
      return {
        success: false,
        message: result.message || 'ポリシー分析の開始に失敗しました。',
        errors: { policyId: [result.message || 'ポリシー分析の開始に失敗しました。'] }
      };
    }

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'PolicyAnalysis', 'analysis', '', `${model} for policy ${policyId}`);

    return {
      success: true,
      message: 'ポリシー分析を開始しました。',
      data: result.analysis
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'PolicyAnalysis', error?.message || 'ポリシー分析開始に失敗しました', 'analysis', '', `${model} for policy ${policyId}`);
    
    return handleError(error, 'ポリシー分析開始');
  }
}

/**
 * 利用可能なモデル一覧を取得
 */
export async function getAvailableModels(): Promise<{ key: string; label: string; description: string }[]> {
  return [
    {
      key: 'gpt-4-vision-preview',
      label: 'GPT-4 Vision Preview',
      description: '画像とテキストの両方を処理できる最新のGPT-4モデル'
    },
    {
      key: 'gpt-4-turbo',
      label: 'GPT-4 Turbo',
      description: '高速で効率的なGPT-4の改良版'
    },
    {
      key: 'claude-3-opus',
      label: 'Claude 3 Opus',
      description: 'Anthropic社の最高性能モデル'
    },
    {
      key: 'claude-3-sonnet',
      label: 'Claude 3 Sonnet',
      description: 'バランスの取れた性能と速度を持つモデル'
    },
    {
      key: 'gemini-pro-vision',
      label: 'Gemini Pro Vision',
      description: 'Google社のマルチモーダルモデル'
    },
    {
      key: 'custom-model-v1',
      label: 'Custom Model v1.0',
      description: '独自開発されたカスタムモデル'
    }
  ];
}

/**
 * customerIdでポリシー一覧を取得
 */
export async function getPoliciesByCustomerIdAction(customerId: string): Promise<ApiResponse<Policy[]>> {
  try {
    // 既存のqueryPolicies関数を使用
    const result = await queryPolicies({
      customerId,
      limit: 1000 // APIキー作成時は全ポリシーを取得
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.message || 'ポリシー一覧の取得に失敗しました。',
        data: []
      };
    }

    return {
      success: true,
      message: 'ポリシー一覧を取得しました。',
      data: result.data.policies
    };
  } catch (error: any) {
    await logFailureAction('READ', 'Policy', error?.message || 'ポリシー一覧取得に失敗しました');
    return handleError(error, 'ポリシー一覧取得');
  }
}
