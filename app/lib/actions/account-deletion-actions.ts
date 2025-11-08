'use server'

import Stripe from 'stripe';
import { getUserCustomAttributes, updateUserCustomAttribute } from '@/app/utils/cognito-utils';
import { AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';
import { logSuccessAction, logFailureAction } from '@/app/lib/actions/audit-log-actions';
import { queryUsers } from '@/app/lib/actions/user-api';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface DeletionRequestResponse {
  success: boolean;
  message?: string;
  deletionRequestedAt?: string;
}

export interface DeletionStatusResponse {
  success: boolean;
  isDeleted: boolean;
  deletionRequestedAt?: string;
  affectedUsers?: number;
  message?: string;
}

export interface RestoreAccountResponse {
  success: boolean;
  message?: string;
  restoredUsers?: number;
}

// アカウント削除リクエストを実行（管理者のみ）
export async function requestAccountDeletionAction(): Promise<DeletionRequestResponse> {
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

    const deletionRequestedAt = new Date().toISOString();

    // 1. Stripeカスタマーのmetadataに削除リクエスト情報を追加
    await stripe.customers.update(customerId, {
      metadata: {
        deletionRequestedAt: deletionRequestedAt
      }
    });

    // 2. 同一customerIdを持つ全てのCognitoユーザーに削除フラグを追加
    const affectedUsers = await updateAllUsersWithCustomerId(customerId, deletionRequestedAt);

    // 3. 監査ログを記録
    await logSuccessAction(
      'UPDATE',
      'Account',
      'deletionRequestedAt',
      undefined,
      deletionRequestedAt
    );

    return {
      success: true,
      message: `Account deletion requested successfully. ${affectedUsers} users affected.`,
      deletionRequestedAt: deletionRequestedAt
    };
  } catch (error) {
    errorLog('Error requesting account deletion:', error);
    
    // 失敗の監査ログを記録
    await logFailureAction(
      'UPDATE',
      'Account',
      error instanceof Error ? error.message : 'Failed to request account deletion',
      'deletionRequestedAt'
    );
    
    return {
      success: false,
      message: 'Failed to request account deletion'
    };
  }
}

// アカウント削除リクエストを復旧（管理者のみ）
export async function restoreAccountAction(): Promise<RestoreAccountResponse> {
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

    // 1. Stripeカスタマーのmetadataから削除リクエスト情報を削除
    await stripe.customers.update(customerId, {
      metadata: {
        deletionRequestedAt: null
      }
    });

    // 2. 同一customerIdを持つ全てのCognitoユーザーから削除フラグを削除
    const restoredUsers = await removeAllUsersCustomerIdDeletionFlag(customerId);

    // 3. 監査ログを記録
    await logSuccessAction(
      'UPDATE',
      'Account',
      'deletionRequestedAt',
      'set',
      'null'
    );

    return {
      success: true,
      message: `Account restored successfully. ${restoredUsers} users restored.`,
      restoredUsers: restoredUsers
    };
  } catch (error) {
    errorLog('Error restoring account:', error);
    
    // 失敗の監査ログを記録
    await logFailureAction(
      'UPDATE',
      'Account',
      error instanceof Error ? error.message : 'Failed to restore account',
      'deletionRequestedAt'
    );
    
    return {
      success: false,
      message: 'Failed to restore account'
    };
  }
}

// 削除ステータスを確認
export async function checkDeletionStatusAction(): Promise<DeletionStatusResponse> {
  try {
    const userAttributes = await getUserCustomAttributes();
    
    if (!userAttributes) {
      return {
        success: false,
        isDeleted: false,
        message: 'User not authenticated'
      };
    }

    const customerId = userAttributes['custom:customerId'];
    
    if (!customerId) {
      return {
        success: false,
        isDeleted: false,
        message: 'Customer ID not found'
      };
    }

    // Stripeカスタマーの削除ステータスを確認
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return {
        success: true,
        isDeleted: true,
        message: 'Customer has been permanently deleted'
      };
    }

    const deletionRequestedAt = customer.metadata?.deletionRequestedAt;

    if (deletionRequestedAt) {
      // 同一customerIdのユーザー数を取得
      const affectedUsers = await countUsersWithCustomerId(customerId);
      
      return {
        success: true,
        isDeleted: true,
        deletionRequestedAt: deletionRequestedAt,
        affectedUsers: affectedUsers,
        message: 'Account deletion is pending'
      };
    }

    return {
      success: true,
      isDeleted: false,
      message: 'Account is active'
    };
  } catch (error) {
    errorLog('Error checking deletion status:', error);
    return {
      success: false,
      isDeleted: false,
      message: 'Failed to check deletion status'
    };
  }
}

// 同一customerIdを持つ全てのユーザーに削除フラグを追加
async function updateAllUsersWithCustomerId(customerId: string, deletionRequestedAt: string): Promise<number> {
  try {
    let affectedUsers = 0;
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      // DynamoDBのUserテーブルからcustomerIdでユーザーを取得
      const result = await queryUsers({
        customerId,
        limit: 100,
        lastEvaluatedKey
      });

      if (!result.success || !result.data) {
        throw new Error('Failed to query users from DynamoDB');
      }

      const users = result.data.users;
      lastEvaluatedKey = result.data.lastEvaluatedKey;

      // 各ユーザーのCognito属性を更新
      const updatePromises = users.map(async (user) => {
        try {
          const updateCommand = new AdminUpdateUserAttributesCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID!,
            Username: user.userId, // DynamoDBのuserIdはCognitoのsub
            UserAttributes: [
              {
                Name: 'custom:deletionRequestedAt',
                Value: deletionRequestedAt
              }
            ]
          });
          
          await cognitoClient.send(updateCommand);
          return 1;
        } catch (error) {
          errorLog(`Failed to update user ${user.userId}:`, error);
          return 0;
        }
      });

      const results = await Promise.all(updatePromises);
      affectedUsers += results.reduce((sum: number, count: number) => sum + count, 0);

    } while (lastEvaluatedKey);

    return affectedUsers;
  } catch (error) {
    errorLog('Error updating users with deletion flag:', error);
    throw error;
  }
}

// 同一customerIdを持つ全てのユーザーから削除フラグを削除
async function removeAllUsersCustomerIdDeletionFlag(customerId: string): Promise<number> {
  try {
    let restoredUsers = 0;
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      // DynamoDBのUserテーブルからcustomerIdでユーザーを取得
      const result = await queryUsers({
        customerId,
        limit: 100,
        lastEvaluatedKey
      });

      if (!result.success || !result.data) {
        throw new Error('Failed to query users from DynamoDB');
      }

      const users = result.data.users;
      lastEvaluatedKey = result.data.lastEvaluatedKey;

      // 各ユーザーのCognito属性を更新（削除フラグを削除）
      const updatePromises = users.map(async (user) => {
        try {
          const updateCommand = new AdminUpdateUserAttributesCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID!,
            Username: user.userId, // DynamoDBのuserIdはCognitoのsub
            UserAttributes: [
              {
                Name: 'custom:deletionRequestedAt',
                Value: '' // 空文字で削除
              }
            ]
          });
          
          await cognitoClient.send(updateCommand);
          return 1;
        } catch (error) {
          errorLog(`Failed to restore user ${user.userId}:`, error);
          return 0;
        }
      });

      const results = await Promise.all(updatePromises);
      restoredUsers += results.reduce((sum: number, count: number) => sum + count, 0);

    } while (lastEvaluatedKey);

    return restoredUsers;
  } catch (error) {
    errorLog('Error removing deletion flag from users:', error);
    throw error;
  }
}

// 同一customerIdを持つユーザー数をカウント
async function countUsersWithCustomerId(customerId: string): Promise<number> {
  try {
    let userCount = 0;
    let lastEvaluatedKey: Record<string, any> | undefined;

    do {
      // DynamoDBのUserテーブルからcustomerIdでユーザーを取得
      const result = await queryUsers({
        customerId,
        limit: 1000, // カウントなので大きめの値
        lastEvaluatedKey
      });

      if (!result.success || !result.data) {
        throw new Error('Failed to query users from DynamoDB');
      }

      userCount += result.data.users.length;
      lastEvaluatedKey = result.data.lastEvaluatedKey;

    } while (lastEvaluatedKey);

    return userCount;
  } catch (error) {
    errorLog('Error counting users with customerId:', error);
    return 0;
  }
}

