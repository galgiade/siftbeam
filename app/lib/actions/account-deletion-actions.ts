'use server'

import Stripe from 'stripe';
import { getUserCustomAttributes, updateUserCustomAttribute } from '@/app/utils/cognito-utils';
import { ListUsersCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';

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

    return {
      success: true,
      message: `Account deletion requested successfully. ${affectedUsers} users affected.`,
      deletionRequestedAt: deletionRequestedAt
    };
  } catch (error) {
    console.error('Error requesting account deletion:', error);
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

    return {
      success: true,
      message: `Account restored successfully. ${restoredUsers} users restored.`,
      restoredUsers: restoredUsers
    };
  } catch (error) {
    console.error('Error restoring account:', error);
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
    console.error('Error checking deletion status:', error);
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
    let nextToken: string | undefined;
    let affectedUsers = 0;

    do {
      const command = new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Filter: `"custom:customerId" = "${customerId}"`,
        PaginationToken: nextToken,
        Limit: 60 // Cognitoの制限
      });

      const response = await cognitoClient.send(command);
      
      if (response.Users) {
        // 各ユーザーに削除フラグを追加
        const updatePromises = response.Users.map(async (user) => {
          if (user.Username) {
            const updateCommand = new AdminUpdateUserAttributesCommand({
              UserPoolId: process.env.COGNITO_USER_POOL_ID!,
              Username: user.Username,
              UserAttributes: [
                {
                  Name: 'custom:deletionRequestedAt',
                  Value: deletionRequestedAt
                }
              ]
            });
            
            await cognitoClient.send(updateCommand);
            return 1;
          }
          return 0;
        });

        const results = await Promise.all(updatePromises);
        affectedUsers += results.reduce((sum: number, count: number) => sum + count, 0);
      }

      nextToken = response.PaginationToken;
    } while (nextToken);

    return affectedUsers;
  } catch (error) {
    console.error('Error updating users with deletion flag:', error);
    throw error;
  }
}

// 同一customerIdを持つ全てのユーザーから削除フラグを削除
async function removeAllUsersCustomerIdDeletionFlag(customerId: string): Promise<number> {
  try {
    let nextToken: string | undefined;
    let restoredUsers = 0;

    do {
      const command = new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Filter: `"custom:customerId" = "${customerId}"`,
        PaginationToken: nextToken,
        Limit: 60
      });

      const response = await cognitoClient.send(command);
      
      if (response.Users) {
        // 各ユーザーから削除フラグを削除
        const updatePromises = response.Users.map(async (user) => {
          if (user.Username) {
            const updateCommand = new AdminUpdateUserAttributesCommand({
              UserPoolId: process.env.COGNITO_USER_POOL_ID!,
              Username: user.Username,
              UserAttributes: [
                {
                  Name: 'custom:deletionRequestedAt',
                  Value: '' // 空文字で削除
                }
              ]
            });
            
            await cognitoClient.send(updateCommand);
            return 1;
          }
          return 0;
        });

        const results = await Promise.all(updatePromises);
        restoredUsers += results.reduce((sum: number, count: number) => sum + count, 0);
      }

      nextToken = response.PaginationToken;
    } while (nextToken);

    return restoredUsers;
  } catch (error) {
    console.error('Error removing deletion flag from users:', error);
    throw error;
  }
}

// 同一customerIdを持つユーザー数をカウント
async function countUsersWithCustomerId(customerId: string): Promise<number> {
  try {
    let nextToken: string | undefined;
    let userCount = 0;

    do {
      const command = new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Filter: `"custom:customerId" = "${customerId}"`,
        PaginationToken: nextToken,
        Limit: 60
      });

      const response = await cognitoClient.send(command);
      
      if (response.Users) {
        userCount += response.Users.length;
      }

      nextToken = response.PaginationToken;
    } while (nextToken);

    return userCount;
  } catch (error) {
    console.error('Error counting users with customerId:', error);
    return 0;
  }
}

// 削除予定日を計算（90日後）
export function calculateDeletionDate(deletionRequestedAt: string): Date {
  const requestDate = new Date(deletionRequestedAt);
  const deletionDate = new Date(requestDate);
  deletionDate.setDate(deletionDate.getDate() + 90);
  return deletionDate;
}

// 削除までの残り日数を計算
export function calculateDaysUntilDeletion(deletionRequestedAt: string): number {
  const deletionDate = calculateDeletionDate(deletionRequestedAt);
  const now = new Date();
  const diffTime = deletionDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
