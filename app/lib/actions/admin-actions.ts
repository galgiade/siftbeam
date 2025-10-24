'use server';

import { AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@/app/lib/aws-clients';
import { getCurrentUserAction } from '@/app/lib/auth/auth-actions';
import { createUserProfile } from './user-profile-actions';
import Stripe from 'stripe';
import { ApiResponse } from '@/app/lib/types/TypeAPIs';

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// Stripe顧客情報の型定義
interface StripeCustomer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state: string | null;
  } | null;
  created: number;
  description: string | null;
  metadata: Record<string, string>;
}

// 顧客情報更新用の型定義
interface CustomerUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  };
  description?: string;
  metadata?: Record<string, string>;
}

// Stripe顧客情報を取得
export async function getCustomerInfo(customerId: string): Promise<ApiResponse<StripeCustomer>> {
  try {
    console.log('Retrieving Stripe customer:', customerId);
    
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return {
        success: false,
        message: '顧客が削除されています。',
      };
    }
    
    const customerData: StripeCustomer = {
      id: customer.id,
      name: customer.name ?? null,
      email: customer.email ?? null,
      phone: customer.phone ?? null,
      address: customer.address ?? null,
      created: customer.created,
      description: customer.description ?? null,
      metadata: customer.metadata,
    };
    
    console.log('Customer retrieved successfully:', customer.id);
    
    return {
      success: true,
      message: '顧客情報を取得しました。',
      data: customerData,
    };
  } catch (error: any) {
    console.error('Error retrieving customer:', error);
    return {
      success: false,
      message: error?.message || '顧客情報の取得に失敗しました。',
    };
  }
}

// 国名から国コードへの変換（日本語名対応）
function convertCountryNameToCode(countryName: string): string {
  if (!countryName) return '';
  
  // 既に国コードの場合はそのまま返す
  if (countryName.length === 2 && countryName.match(/^[A-Z]{2}$/)) {
    return countryName;
  }
  
  // 日本語国名のマッピング
  const countryMapping: Record<string, string> = {
    '日本': 'JP',
    'アメリカ合衆国': 'US',
    'アメリカ': 'US',
    '中国': 'CN',
    '韓国': 'KR',
    '大韓民国': 'KR',
    'イギリス': 'GB',
    'フランス': 'FR',
    'ドイツ': 'DE',
    'イタリア': 'IT',
    'スペイン': 'ES',
    'カナダ': 'CA',
    'オーストラリア': 'AU',
    'インド': 'IN',
    'ブラジル': 'BR',
    'ロシア': 'RU',
  };
  
  // 日本語名からの変換を試行
  if (countryMapping[countryName]) {
    console.log(`Country name "${countryName}" converted to code "${countryMapping[countryName]}"`);
    return countryMapping[countryName];
  }
  
  console.warn(`Could not convert country name "${countryName}" to country code`);
  return countryName; // 変換できない場合はそのまま返す
}

// Stripe顧客情報を更新
export async function updateCustomerInfo(
  customerId: string,
  updateData: CustomerUpdateInput
): Promise<ApiResponse<StripeCustomer>> {
  try {
    console.log('Updating Stripe customer:', { customerId, updateData });
    
    // 住所の国フィールドを国コードに変換
    if (updateData.address?.country) {
      const originalCountry = updateData.address.country;
      updateData.address.country = convertCountryNameToCode(originalCountry);
      console.log('Country field converted:', { original: originalCountry, converted: updateData.address.country });
    }
    
    // バリデーション
    const errors: Record<string, string> = {};
    
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        errors.email = '有効なメールアドレスを入力してください。';
      }
    }
    
    if (updateData.phone) {
      const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
      if (!phoneRegex.test(updateData.phone)) {
        errors.phone = '有効な電話番号を入力してください。';
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: '入力内容に誤りがあります。',
        errors: Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, [value]])
        ),
      };
    }
    
    // Stripe顧客情報を更新
    const updatedCustomer = await stripe.customers.update(customerId, updateData);
    
    const customerData: StripeCustomer = {
      id: updatedCustomer.id,
      name: updatedCustomer.name ?? null,
      email: updatedCustomer.email ?? null,
      phone: updatedCustomer.phone ?? null,
      address: updatedCustomer.address ?? null,
      created: updatedCustomer.created,
      description: updatedCustomer.description ?? null,
      metadata: updatedCustomer.metadata,
    };
    
    console.log('Customer updated successfully:', updatedCustomer.id);
    
    return {
      success: true,
      message: '顧客情報が正常に更新されました。',
      data: customerData,
    };
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return {
      success: false,
      message: error?.message || '顧客情報の更新に失敗しました。',
    };
  }
}

export async function createAdminAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message: string; errors?: Record<string, string> }> {
  try {
    // 現在のユーザーを取得
    const currentUser = await getCurrentUserAction();
    if (!currentUser) {
      return {
        success: false,
        message: '認証が必要です。再度ログインしてください。',
      };
    }

    // フォームデータを取得
    const userName = formData.get('userName') as string;
    const department = formData.get('department') as string;
    const position = formData.get('position') as string;
    const locale = formData.get('locale') as string;

    // バリデーション
    const errors: Record<string, string> = {};
    
    if (!userName) errors.userName = 'ユーザー名は必須です';
    if (!department) errors.department = '部署は必須です';
    if (!position) errors.position = '役職は必須です';
    if (!locale) errors.locale = '言語は必須です';

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: '入力内容を確認してください',
        errors,
      };
    }

    // Cognitoユーザー属性を更新（roleのみ）
    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: currentUser.email!,
      UserAttributes: [
        { Name: 'preferred_username', Value: userName },
        { Name: 'custom:role', Value: 'admin' },
        { Name: 'locale', Value: locale },
      ],
    });

    await cognitoClient.send(updateCommand);

    // DynamoDBにユーザープロファイル情報を保存
    const customerId = currentUser.attributes?.['custom:customerId'] || currentUser.customerId || '';
    const profileResult = await createUserProfile(
      currentUser.sub,
      userName,
      currentUser.email,
      customerId,
      department,
      position
    );

    if (!profileResult.success) {
      console.warn('Failed to create user profile in DynamoDB, but Cognito update succeeded');
    }

    console.log(`Admin user created: ${userName} for user: ${currentUser.email}`);

    return {
      success: true,
      message: '管理者アカウントが正常に作成されました。',
    };
  } catch (error: any) {
    console.error('Admin creation error:', error);
    return {
      success: false,
      message: 'アカウント作成中にエラーが発生しました。もう一度お試しください。',
    };
  }
}
