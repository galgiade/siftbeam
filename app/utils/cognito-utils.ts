'use server'

import { cookies } from 'next/headers';
import { GetUserCommand, InitiateAuthCommand, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';

export interface UserAttributes {
  sub?: string;
  email?: string;
  email_verified?: string;
  preferred_username?: string;
  locale?: string;
  'custom:customerId'?: string;
  'custom:role'?: string;
  'custom:paymentMethodId'?: string;
  'custom:deletionRequestedAt'?: string;
  [key: string]: string | undefined;
}

export async function getUserCustomAttributes(): Promise<UserAttributes | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    console.log('getUserCustomAttributes - accessToken exists:', !!accessToken);
    console.log('getUserCustomAttributes - accessToken length:', accessToken?.length || 0);
    console.log('getUserCustomAttributes - refreshToken exists:', !!refreshToken);
    
    if (!accessToken) {
      console.log('No access token found in cookies');
      return null;
    }

    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      const response = await cognitoClient.send(command);
      
      if (!response.UserAttributes) {
        return null;
      }

      // UserAttributesを適切な形式に変換
      const attributes: UserAttributes = {};
      response.UserAttributes.forEach(attr => {
        if (attr.Name && attr.Value) {
          attributes[attr.Name] = attr.Value;
        }
      });

      console.log('getUserCustomAttributes - 取得した属性:', attributes);
      console.log('getUserCustomAttributes - custom:customerId:', attributes['custom:customerId']);
      console.log('getUserCustomAttributes - preferred_username:', attributes.preferred_username);
      console.log('getUserCustomAttributes - custom:paymentMethodId:', attributes['custom:paymentMethodId']);

      return attributes;
    } catch (tokenError: any) {
      // Access Tokenが期限切れの場合、Refresh Tokenで更新を試行
      if (tokenError.name === 'NotAuthorizedException' && refreshToken) {
        console.log('Access token expired, attempting to refresh...');
        
        try {
          const refreshCommand = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: process.env.COGNITO_CLIENT_ID!,
            AuthParameters: {
              REFRESH_TOKEN: refreshToken,
            },
          });

          const refreshResponse = await cognitoClient.send(refreshCommand);
          
          if (refreshResponse.AuthenticationResult?.AccessToken) {
            console.log('Token refreshed successfully');
            
            // 新しいトークンをCookieに保存
            cookieStore.set('accessToken', refreshResponse.AuthenticationResult.AccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });
            
            if (refreshResponse.AuthenticationResult.RefreshToken) {
              cookieStore.set('refreshToken', refreshResponse.AuthenticationResult.RefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30, // 30 days
              });
            }
            
            // 新しいトークンでユーザー属性を取得
            const newCommand = new GetUserCommand({
              AccessToken: refreshResponse.AuthenticationResult.AccessToken,
            });

            const newResponse = await cognitoClient.send(newCommand);
            
            if (!newResponse.UserAttributes) {
              return null;
            }

            // UserAttributesを適切な形式に変換
            const attributes: UserAttributes = {};
            newResponse.UserAttributes.forEach(attr => {
              if (attr.Name && attr.Value) {
                attributes[attr.Name] = attr.Value;
              }
            });

            console.log('getUserCustomAttributes (refresh) - 取得した属性:', attributes);
            console.log('getUserCustomAttributes (refresh) - custom:customerId:', attributes['custom:customerId']);
            console.log('getUserCustomAttributes (refresh) - preferred_username:', attributes.preferred_username);
            console.log('getUserCustomAttributes (refresh) - custom:paymentMethodId:', attributes['custom:paymentMethodId']);

            return attributes;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // リフレッシュに失敗した場合はnullを返す
          return null;
        }
      }
      
      throw tokenError;
    }
  } catch (error: any) {
    console.error('Error getting user attributes:', error);
    
    // トークンが無効な場合はnullを返す（Cookie削除はServer Actionで行う）
    if (error.name === 'NotAuthorizedException') {
      console.log('Access token is invalid, user needs to sign in again');
    }
    
    return null;
  }
}

// Cognitoのカスタム属性を更新
export async function updateUserCustomAttribute(attributeName: string, attributeValue: string): Promise<{ success: boolean; message?: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return {
        success: false,
        message: 'No access token found'
      };
    }

    const command = new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: [
        {
          Name: attributeName,
          Value: attributeValue,
        },
      ],
    });

    await cognitoClient.send(command);
    
    console.log(`Updated ${attributeName} to ${attributeValue}`);
    
    return {
      success: true,
      message: 'Attribute updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating user attribute:', error);
    return {
      success: false,
      message: error.message || 'Failed to update attribute'
    };
  }
}
