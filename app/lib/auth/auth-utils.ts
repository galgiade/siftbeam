// 認証ユーティリティ（サーバーサイド用）
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';

export interface AuthUser {
  sub: string;
  email: string;
  email_verified: boolean;
  attributes?: Record<string, string>;
  [key: string]: any;
}

// サーバーサイドでユーザー情報を取得する関数
export async function getCurrentUserServer(accessToken: string): Promise<AuthUser | null> {
  try {
    if (!accessToken) {
      return null;
    }

    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await cognitoClient.send(command);
    
    if (!response.Username) {
      return null;
    }

    // ユーザー属性をマッピング
    const user: AuthUser = {
      sub: response.Username,
      email: '',
      email_verified: false,
      attributes: {},
    };

    // 属性をマッピング
    response.UserAttributes?.forEach(attr => {
      if (attr.Name && attr.Value) {
        // 基本属性
        if (attr.Name === 'email') {
          user.email = attr.Value;
        } else if (attr.Name === 'email_verified') {
          user.email_verified = attr.Value === 'true';
        } else {
          // カスタム属性は attributes オブジェクトに保存
          user.attributes![attr.Name] = attr.Value;
          // 後方互換性のため、custom: プレフィックスを削除したキーでも保存
          if (attr.Name.startsWith('custom:')) {
            const key = attr.Name.replace('custom:', '');
            user[key] = attr.Value;
          }
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuthServer(accessToken: string): Promise<AuthUser> {
  const user = await getCurrentUserServer(accessToken);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
