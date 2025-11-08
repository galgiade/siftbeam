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
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';
import { getPolicyById } from '@/app/lib/actions/policy-api';
import { getUserById } from '@/app/lib/actions/user-api';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

const GROUP_TABLE_NAME = process.env.GROUP_TABLE_NAME || 'siftbeam-groups';
const USER_GROUP_TABLE_NAME = process.env.USER_GROUP_TABLE_NAME || 'siftbeam-user-groups';
const POLICY_GROUP_TABLE_NAME = process.env.POLICY_GROUP_TABLE_NAME || 'siftbeam-policy-groups';

/**
 * グループの型定義
 */
export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // ソフト削除用
}

/**
 * ユーザーグループの型定義
 */
export interface UserGroup {
  userGroupId: string; // DynamoDBのPKに合わせる
  userId: string;
  groupId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ポリシーグループの型定義
 */
export interface PolicyGroup {
  policyGroupId: string; // DynamoDBのPKに合わせる
  groupId: string;
  policyId: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * グループ作成用のインターフェース
 */
export interface CreateGroupInput {
  groupName: string;
  description: string;
  customerId: string;
}

/**
 * グループ更新用のインターフェース
 */
export interface UpdateGroupInput {
  groupId: string;
  groupName?: string;
  description?: string;
}

/**
 * グループクエリ用のインターフェース
 */
export interface QueryGroupsInput {
  customerId: string; // 必須
  groupName?: string; // ソートキーでの絞り込み用（部分一致）
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}

/**
 * ユーザーグループ関連付け用のインターフェース
 */
export interface AssignUsersToGroupInput {
  groupId: string;
  userIds: string[];
  customerId: string;
}

/**
 * ポリシーグループ関連付け用のインターフェース
 */
export interface AssignPoliciesToGroupInput {
  groupId: string;
  policyIds: string[];
  customerId: string;
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
      message: 'グループが見つかりません。',
      errors: { dynamodb: ['指定されたグループIDが存在しないか、条件が満たされませんでした。'] }
    };
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return {
      success: false,
      message: 'DynamoDBテーブルが見つかりません。',
      errors: { 
        dynamodb: ['テーブル名を確認してください。'],
        config: [
          `GROUP_TABLE_NAME: ${GROUP_TABLE_NAME}`,
          `USER_GROUP_TABLE_NAME: ${USER_GROUP_TABLE_NAME}`,
          `POLICY_GROUP_TABLE_NAME: ${POLICY_GROUP_TABLE_NAME}`
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

// ==================== グループ管理 ====================

/**
 * グループをIDで取得 (getItem)
 */
export async function getGroupById(groupId: string): Promise<ApiResponse<Group>> {
  try {
    if (!groupId) {
      return {
        success: false,
        message: 'グループIDが必要です。',
      };
    }

    const command = new GetCommand({
      TableName: GROUP_TABLE_NAME,
      Key: { groupId }
    });

    const result = await dynamoDocClient.send(command);

    if (!result.Item) {
      return {
        success: false,
        message: 'グループが見つかりません。',
      };
    }

    // ソフト削除されたグループは除外
    if (result.Item.deletedAt) {
      return {
        success: false,
        message: 'グループが見つかりません。',
      };
    }

    debugLog('Group retrieved successfully:', { groupId });

    return {
      success: true,
      message: 'グループ情報を取得しました。',
      data: result.Item as Group
    };

  } catch (error: any) {
    return handleError(error, 'グループ取得');
  }
}

/**
 * グループをクエリで検索 (query)
 */
export async function queryGroups(
  input: QueryGroupsInput
): Promise<ApiResponse<{ groups: Group[]; lastEvaluatedKey?: Record<string, any> }>> {
  try {
    // customerIdでクエリ（GSI使用）- customerIdは必須
    let keyConditionExpression = 'customerId = :customerId';
    const expressionAttributeValues: Record<string, any> = {
      ':customerId': input.customerId
    };

    // groupNameでの絞り込みが指定されている場合（オプション）
    if (input.groupName) {
      keyConditionExpression += ' AND begins_with(groupName, :groupName)';
      expressionAttributeValues[':groupName'] = input.groupName;
    }

    const command = new QueryCommand({
      TableName: GROUP_TABLE_NAME,
      IndexName: 'customerId-groupName-index', // GSIの名前
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: 'attribute_not_exists(deletedAt)', // ソフト削除されたものを除外
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: input.limit || 1000,
      ExclusiveStartKey: input.lastEvaluatedKey
    });

    const result = await dynamoDocClient.send(command);
    const groups = result.Items as Group[];

    debugLog('Groups queried successfully:', { 
      count: groups.length, 
      customerId: input.customerId,
      groupName: input.groupName
    });

    return {
      success: true,
      message: 'グループ一覧を取得しました。',
      data: {
        groups,
        lastEvaluatedKey: result.LastEvaluatedKey
      }
    };

  } catch (error: any) {
    return handleError(error, 'グループクエリ');
  }
}

/**
 * グループを作成 (create)
 */
export async function createGroup(input: CreateGroupInput): Promise<ApiResponse<Group>> {
  try {
    debugLog('createGroup called with input:', input);
    
    // 入力バリデーション
    const errors: Record<string, string[]> = {};
    
    if (!input.groupName?.trim()) {
      errors.groupName = ['グループ名は必須です。'];
    }
    
    if (!input.customerId?.trim()) {
      errors.customerId = ['カスタマーIDは必須です。'];
    }
    
    if (Object.keys(errors).length > 0) {
      debugLog('Validation errors:', errors);
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors
      };
    }

    // グループIDを生成
    const groupId = generateId();
    const now = new Date().toISOString();
    
    const newGroup: Group = {
      groupId,
      groupName: input.groupName.trim(),
      description: input.description?.trim() || '', // 空文字列を許可
      customerId: input.customerId,
      createdAt: now,
      updatedAt: now
    };

    const putCommand = new PutCommand({
      TableName: GROUP_TABLE_NAME,
      Item: newGroup,
      ConditionExpression: 'attribute_not_exists(groupId)' // 重複防止
    });

    await dynamoDocClient.send(putCommand);

    debugLog('Group created successfully:', { 
      groupId,
      groupName: input.groupName,
      customerId: input.customerId 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('CREATE', 'Group', 'groupName', '', input.groupName);

    return {
      success: true,
      message: 'グループが正常に作成されました。',
      data: newGroup
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('CREATE', 'Group', error?.message || 'グループ作成に失敗しました', 'groupName', '', input.groupName || '');
    
    return handleError(error, 'グループ作成');
  }
}

/**
 * グループを更新 (update)
 */
export async function updateGroup(input: UpdateGroupInput): Promise<ApiResponse<Group>> {
  try {
    debugLog('updateGroup called with:', input);
    
    // 個別フィールドバリデーション（提供されたフィールドのみ）
    const errors: Record<string, string[]> = {};
    
    if (input.groupName !== undefined && !input.groupName.trim()) {
      errors.groupName = ['グループ名は必須です。'];
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

    // 更新前の値を取得（監査ログ用）
    const getCommand = new GetCommand({
      TableName: GROUP_TABLE_NAME,
      Key: { groupId: input.groupId }
    });
    const existingResult = await dynamoDocClient.send(getCommand);
    
    if (!existingResult.Item) {
      return {
        success: false,
        message: 'グループが見つかりません。',
      };
    }
    
    const existingGroup = existingResult.Item as Group;

    // 更新するフィールドを動的に構築
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    if (input.groupName) {
      updateExpression.push('#groupName = :groupName');
      expressionAttributeNames['#groupName'] = 'groupName';
      expressionAttributeValues[':groupName'] = input.groupName.trim();
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
      TableName: GROUP_TABLE_NAME,
      Key: { groupId: input.groupId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(groupId) AND attribute_not_exists(deletedAt)',
      ReturnValues: 'ALL_NEW'
    });

    const result = await dynamoDocClient.send(updateCommand);

    debugLog('Group updated successfully:', {
      groupId: input.groupId,
      updatedFields: Object.keys(expressionAttributeValues).filter(key => key !== ':updatedAt')
    });

    // 監査ログ記録（成功） - 各フィールドごとに記録
    if (input.groupName) {
      await logSuccessAction(
        'UPDATE', 
        'Group', 
        'groupName', 
        existingGroup.groupName, 
        input.groupName.trim()
      );
    }
    
    if (input.description !== undefined) {
      await logSuccessAction(
        'UPDATE', 
        'Group', 
        'description', 
        existingGroup.description || '', 
        input.description.trim()
      );
    }

    return {
      success: true,
      message: 'グループ情報が正常に更新されました。',
      data: result.Attributes as Group
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('UPDATE', 'Group', error?.message || 'グループ更新に失敗しました', 'groupId', '', input.groupId);
    
    return handleError(error, 'グループ更新');
  }
}

/**
 * グループを削除 (delete) - リレーションも削除
 */
export async function deleteGroup(
  groupId: string,
  softDelete: boolean = true
): Promise<ApiResponse<void>> {
  try {
    if (!groupId) {
      return {
        success: false,
        message: 'グループIDが必要です。',
      };
    }

    // 削除前のグループ情報を取得（監査ログ用）
    const getCommand = new GetCommand({
      TableName: GROUP_TABLE_NAME,
      Key: { groupId }
    });
    const existingResult = await dynamoDocClient.send(getCommand);
    
    if (!existingResult.Item) {
      return {
        success: false,
        message: 'グループが見つかりません。',
      };
    }
    
    const existingGroup = existingResult.Item as Group;

    // ハード削除の場合はリレーションも削除
    if (!softDelete) {
      debugLog('Deleting group relations for:', { groupId });
      
      // Step 1: ユーザーグループリレーションを削除
      try {
        const userGroupsResult = await getUsersByGroupId(groupId);
        if (userGroupsResult.success && userGroupsResult.data && userGroupsResult.data.length > 0) {
          const userIds = userGroupsResult.data.map(ug => ug.userId);
          debugLog('Removing users from group:', { groupId, userIds });
          await removeUsersFromGroup(groupId, userIds);
        }
      } catch (error) {
        errorLog('Error removing users from group:', error);
      }

      // Step 2: ポリシーグループリレーションを削除
      try {
        const policyGroupsResult = await getPoliciesByGroupId(groupId);
        if (policyGroupsResult.success && policyGroupsResult.data && policyGroupsResult.data.length > 0) {
          const policyIds = policyGroupsResult.data.map(pg => pg.policyId);
          debugLog('Removing policies from group:', { groupId, policyIds });
          await removePoliciesFromGroup(groupId, policyIds);
        }
      } catch (error) {
        errorLog('Error removing policies from group:', error);
      }
    }

    if (softDelete) {
      // ソフト削除（削除フラグを設定）
      const updateCommand = new UpdateCommand({
        TableName: GROUP_TABLE_NAME,
        Key: { groupId },
        UpdateExpression: 'SET #deletedAt = :deletedAt, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':deletedAt': new Date().toISOString(),
          ':updatedAt': new Date().toISOString()
        },
        ConditionExpression: 'attribute_exists(groupId) AND attribute_not_exists(deletedAt)',
      });

      await dynamoDocClient.send(updateCommand);
    } else {
      // ハード削除
      const deleteCommand = new DeleteCommand({
        TableName: GROUP_TABLE_NAME,
        Key: { groupId },
        ConditionExpression: 'attribute_exists(groupId)',
      });

      await dynamoDocClient.send(deleteCommand);
    }

    debugLog('Group deleted successfully:', { 
      groupId, 
      softDelete 
    });

    // 監査ログ記録（成功）
    await logSuccessAction('DELETE', 'Group', 'groupName', existingGroup.groupName, '');

    return {
      success: true,
      message: 'グループが削除されました。',
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('DELETE', 'Group', error?.message || 'グループ削除に失敗しました', 'groupName', '', '');
    
    return handleError(error, 'グループ削除');
  }
}

// ==================== ユーザーグループ関連付け ====================

/**
 * グループにユーザーを関連付け
 */
export async function assignUsersToGroup(input: AssignUsersToGroupInput): Promise<ApiResponse<UserGroup[]>> {
  try {
    debugLog('assignUsersToGroup called with:', input);
    
    if (!input.groupId || !input.userIds || input.userIds.length === 0) {
      return {
        success: false,
        message: 'グループIDとユーザーIDが必要です。',
      };
    }

    const now = new Date().toISOString();
    const userGroups: UserGroup[] = [];
    const skippedUsers: string[] = [];

    // 各ユーザーに対して重複チェックを行い、ユーザーグループレコードを作成
    for (const userId of input.userIds) {
      // 既存の関連付けをチェック
      const existingQuery = new QueryCommand({
        TableName: USER_GROUP_TABLE_NAME,
        IndexName: 'groupId-userId-index',
        KeyConditionExpression: 'groupId = :groupId AND userId = :userId',
        ExpressionAttributeValues: {
          ':groupId': input.groupId,
          ':userId': userId
        }
      });

      const existingResult = await dynamoDocClient.send(existingQuery);
      
      if (existingResult.Items && existingResult.Items.length > 0) {
        // 既に関連付けが存在する場合はスキップ
        skippedUsers.push(userId);
        continue;
      }

      const userGroupId = generateId();
      const userGroup: UserGroup = {
        userGroupId: userGroupId, // DynamoDBのPKフィールド名に合わせる
        userId,
        groupId: input.groupId,
        customerId: input.customerId,
        createdAt: now,
        updatedAt: now
      };
      userGroups.push(userGroup);
    }

    // 新しく追加するユーザーがある場合のみバッチ書き込み
    if (userGroups.length > 0) {
      const putRequests = userGroups.map(userGroup => ({
        PutRequest: {
          Item: userGroup
        }
      }));

      const batchCommand = new BatchWriteCommand({
        RequestItems: {
          [USER_GROUP_TABLE_NAME]: putRequests
        }
      });

      await dynamoDocClient.send(batchCommand);
    }

    debugLog('Users assigned to group successfully:', { 
      groupId: input.groupId,
      newUserCount: userGroups.length,
      skippedUserCount: skippedUsers.length
    });

    let message = `${userGroups.length}人のユーザーをグループに追加しました。`;
    if (skippedUsers.length > 0) {
      message += ` ${skippedUsers.length}人のユーザーは既にグループに所属しているためスキップされました。`;
    }

    // 監査ログ記録（成功） - ユーザー名を取得して記録
    if (userGroups.length > 0) {
      const userNames: string[] = [];
      for (const userId of input.userIds) {
        try {
          const userResult = await getUserById(userId);
          if (userResult.success && userResult.data) {
            userNames.push(userResult.data.userName || userResult.data.email || userId);
          } else {
            userNames.push(userId);
          }
        } catch (error) {
          errorLog('Error getting user name:', error);
          userNames.push(userId);
        }
      }
      
      await logSuccessAction(
        'ATTACH', 
        'UserGroup', 
        'userName', 
        '', 
        userNames.join(', ')
      );
    }

    return {
      success: true,
      message,
      data: userGroups
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('ATTACH', 'UserGroup', error?.message || 'ユーザーグループ関連付けに失敗しました', 'userName', '', '');
    
    return handleError(error, 'ユーザーグループ関連付け');
  }
}

/**
 * グループからユーザーを削除
 */
export async function removeUsersFromGroup(groupId: string, userIds: string[]): Promise<ApiResponse<void>> {
  try {
    debugLog('removeUsersFromGroup called with:', { groupId, userIds });
    
    if (!groupId || !userIds || userIds.length === 0) {
      return {
        success: false,
        message: 'グループIDとユーザーIDが必要です。',
      };
    }

    // 各ユーザーのユーザーグループレコードを検索して削除
    for (const userId of userIds) {
      // まずユーザーグループレコードを検索
      const queryCommand = new QueryCommand({
        TableName: USER_GROUP_TABLE_NAME,
        IndexName: 'groupId-userId-index', // GSI使用
        KeyConditionExpression: 'groupId = :groupId AND userId = :userId',
        ExpressionAttributeValues: {
          ':groupId': groupId,
          ':userId': userId
        }
      });

      const queryResult = await dynamoDocClient.send(queryCommand);
      
      if (queryResult.Items && queryResult.Items.length > 0) {
        const userGroup = queryResult.Items[0] as UserGroup;
        
        // レコードを削除
        const deleteCommand = new DeleteCommand({
          TableName: USER_GROUP_TABLE_NAME,
          Key: { userGroupId: userGroup.userGroupId } // DynamoDBのPKフィールド名に合わせる
        });

        await dynamoDocClient.send(deleteCommand);
      }
    }

    debugLog('Users removed from group successfully:', { 
      groupId,
      userCount: userIds.length
    });

    // 監査ログ記録（成功） - ユーザー名を取得して記録
    const userNames: string[] = [];
    for (const userId of userIds) {
      try {
        const userResult = await getUserById(userId);
        if (userResult.success && userResult.data) {
          userNames.push(userResult.data.userName || userResult.data.email || userId);
        } else {
          userNames.push(userId);
        }
      } catch (error) {
        errorLog('Error getting user name:', error);
        userNames.push(userId);
      }
    }
    
    await logSuccessAction('DETACH', 'UserGroup', 'userName', userNames.join(', '), '');

    return {
      success: true,
      message: `${userIds.length}人のユーザーをグループから削除しました。`,
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('DETACH', 'UserGroup', error?.message || 'ユーザーグループ削除に失敗しました', 'userName', '', '');
    
    return handleError(error, 'ユーザーグループ削除');
  }
}

/**
 * グループのユーザー一覧を取得
 */
export async function getUsersByGroupId(groupId: string): Promise<ApiResponse<UserGroup[]>> {
  try {
    if (!groupId) {
      return {
        success: false,
        message: 'グループIDが必要です。',
      };
    }

    const command = new QueryCommand({
      TableName: USER_GROUP_TABLE_NAME,
      IndexName: 'groupId-userId-index', // GSI使用
      KeyConditionExpression: 'groupId = :groupId',
      ExpressionAttributeValues: {
        ':groupId': groupId
      }
    });

    const result = await dynamoDocClient.send(command);
    const userGroups = result.Items as UserGroup[];

    debugLog('Users in group retrieved successfully:', { 
      groupId,
      userCount: userGroups.length
    });

    return {
      success: true,
      message: 'グループのユーザー一覧を取得しました。',
      data: userGroups
    };

  } catch (error: any) {
    return handleError(error, 'グループユーザー取得');
  }
}

/**
 * ユーザーが参加するグループ一覧を取得（新しいGSI使用）
 */
export async function getGroupsByUserId(userId: string): Promise<ApiResponse<UserGroup[]>> {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'ユーザーIDが必要です。',
      };
    }

    const command = new QueryCommand({
      TableName: USER_GROUP_TABLE_NAME,
      IndexName: 'userId-groupId-index', // 新しいGSI使用
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });

    const result = await dynamoDocClient.send(command);
    const userGroups = result.Items as UserGroup[];

    debugLog('Groups for user retrieved successfully:', { 
      userId,
      groupCount: userGroups.length
    });

    return {
      success: true,
      message: 'ユーザーが参加するグループ一覧を取得しました。',
      data: userGroups
    };

  } catch (error: any) {
    return handleError(error, 'ユーザーグループ取得');
  }
}

// ==================== ポリシーグループ関連付け ====================

/**
 * グループにポリシーを関連付け
 */
export async function assignPoliciesToGroup(input: AssignPoliciesToGroupInput): Promise<ApiResponse<PolicyGroup[]>> {
  try {
    debugLog('assignPoliciesToGroup called with:', input);
    
    if (!input.groupId || !input.policyIds || input.policyIds.length === 0) {
      return {
        success: false,
        message: 'グループIDとポリシーIDが必要です。',
      };
    }

    const now = new Date().toISOString();
    const policyGroups: PolicyGroup[] = [];
    const skippedPolicies: string[] = [];

    // 各ポリシーに対して重複チェックを行い、ポリシーグループレコードを作成
    for (const policyId of input.policyIds) {
      // 既存の関連付けをチェック
      const existingQuery = new QueryCommand({
        TableName: POLICY_GROUP_TABLE_NAME,
        IndexName: 'groupId-policyId-index',
        KeyConditionExpression: 'groupId = :groupId AND policyId = :policyId',
        ExpressionAttributeValues: {
          ':groupId': input.groupId,
          ':policyId': policyId
        }
      });

      const existingResult = await dynamoDocClient.send(existingQuery);
      
      if (existingResult.Items && existingResult.Items.length > 0) {
        // 既に関連付けが存在する場合はスキップ
        skippedPolicies.push(policyId);
        continue;
      }

      const policyGroupId = generateId();
      const policyGroup: PolicyGroup = {
        policyGroupId: policyGroupId, // DynamoDBのPKフィールド名に合わせる
        groupId: input.groupId,
        policyId,
        customerId: input.customerId,
        createdAt: now,
        updatedAt: now
      };
      policyGroups.push(policyGroup);
    }

    // 新しく追加するポリシーがある場合のみバッチ書き込み
    if (policyGroups.length > 0) {
      const putRequests = policyGroups.map(policyGroup => ({
        PutRequest: {
          Item: policyGroup
        }
      }));

      const batchCommand = new BatchWriteCommand({
        RequestItems: {
          [POLICY_GROUP_TABLE_NAME]: putRequests
        }
      });

      await dynamoDocClient.send(batchCommand);
    }

    debugLog('Policies assigned to group successfully:', { 
      groupId: input.groupId,
      newPolicyCount: policyGroups.length,
      skippedPolicyCount: skippedPolicies.length
    });

    let message = `${policyGroups.length}個のポリシーをグループに追加しました。`;
    if (skippedPolicies.length > 0) {
      message += ` ${skippedPolicies.length}個のポリシーは既にグループに適用されているためスキップされました。`;
    }

    // 監査ログ記録（成功） - ポリシー名を取得して記録
    if (policyGroups.length > 0) {
      const policyNames: string[] = [];
      for (const policyId of input.policyIds) {
        try {
          const policyResult = await getPolicyById(policyId);
          if (policyResult.success && policyResult.data) {
            policyNames.push(policyResult.data.policyName);
          } else {
            policyNames.push(policyId);
          }
        } catch (error) {
          errorLog('Error getting policy name:', error);
          policyNames.push(policyId);
        }
      }
      
      await logSuccessAction(
        'ATTACH', 
        'PolicyGroup', 
        'policyName', 
        '', 
        policyNames.join(', ')
      );
    }

    return {
      success: true,
      message,
      data: policyGroups
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('ATTACH', 'PolicyGroup', error?.message || 'ポリシーグループ関連付けに失敗しました', 'policyName', '', '');
    
    return handleError(error, 'ポリシーグループ関連付け');
  }
}

/**
 * グループからポリシーを削除
 */
export async function removePoliciesFromGroup(groupId: string, policyIds: string[]): Promise<ApiResponse<void>> {
  try {
    debugLog('removePoliciesFromGroup called with:', { groupId, policyIds });
    
    if (!groupId || !policyIds || policyIds.length === 0) {
      return {
        success: false,
        message: 'グループIDとポリシーIDが必要です。',
      };
    }

    // 各ポリシーのポリシーグループレコードを検索して削除
    for (const policyId of policyIds) {
      // まずポリシーグループレコードを検索
      const queryCommand = new QueryCommand({
        TableName: POLICY_GROUP_TABLE_NAME,
        IndexName: 'groupId-policyId-index', // GSI使用
        KeyConditionExpression: 'groupId = :groupId AND policyId = :policyId',
        ExpressionAttributeValues: {
          ':groupId': groupId,
          ':policyId': policyId
        }
      });

      const queryResult = await dynamoDocClient.send(queryCommand);
      
      if (queryResult.Items && queryResult.Items.length > 0) {
        const policyGroup = queryResult.Items[0] as PolicyGroup;
        
        // レコードを削除
        const deleteCommand = new DeleteCommand({
          TableName: POLICY_GROUP_TABLE_NAME,
          Key: { policyGroupId: policyGroup.policyGroupId } // DynamoDBのPKフィールド名に合わせる
        });

        await dynamoDocClient.send(deleteCommand);
      }
    }

    debugLog('Policies removed from group successfully:', { 
      groupId,
      policyCount: policyIds.length
    });

    // 監査ログ記録（成功） - ポリシー名を取得して記録
    const policyNames: string[] = [];
    for (const policyId of policyIds) {
      try {
        const policyResult = await getPolicyById(policyId);
        if (policyResult.success && policyResult.data) {
          policyNames.push(policyResult.data.policyName);
        } else {
          policyNames.push(policyId);
        }
      } catch (error) {
        errorLog('Error getting policy name:', error);
        policyNames.push(policyId);
      }
    }
    
    await logSuccessAction('DETACH', 'PolicyGroup', 'policyName', policyNames.join(', '), '');

    return {
      success: true,
      message: `${policyIds.length}個のポリシーをグループから削除しました。`,
    };

  } catch (error: any) {
    // 監査ログ記録（失敗）
    await logFailureAction('DETACH', 'PolicyGroup', error?.message || 'ポリシーグループ削除に失敗しました', 'policyName', '', '');
    
    return handleError(error, 'ポリシーグループ削除');
  }
}

/**
 * グループのポリシー一覧を取得
 */
export async function getPoliciesByGroupId(groupId: string): Promise<ApiResponse<PolicyGroup[]>> {
  try {
    if (!groupId) {
      return {
        success: false,
        message: 'グループIDが必要です。',
      };
    }

    const command = new QueryCommand({
      TableName: POLICY_GROUP_TABLE_NAME,
      IndexName: 'groupId-policyId-index', // GSI使用
      KeyConditionExpression: 'groupId = :groupId',
      ExpressionAttributeValues: {
        ':groupId': groupId
      }
    });

    const result = await dynamoDocClient.send(command);
    const policyGroups = result.Items as PolicyGroup[];

    debugLog('Policies in group retrieved successfully:', { 
      groupId,
      policyCount: policyGroups.length
    });

    return {
      success: true,
      message: 'グループのポリシー一覧を取得しました。',
      data: policyGroups
    };

  } catch (error: any) {
    return handleError(error, 'グループポリシー取得');
  }
}
