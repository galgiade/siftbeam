import NewOrderManagementPresentation from './NewOrderManagementPresentation'
import NewOrderErrorDisplay from './NewOrderErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { newOrderDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { queryNewOrderRequests } from '@/app/lib/actions/neworder-api';

interface NewOrderManagementContainerProps {
  locale: string;
}

/**
 * 新規オーダーリクエスト管理のコンテナコンポーネント
 * ユーザーが自分の新規オーダーリクエスト一覧を取得・管理するためのコンポーネント
 */
export default async function NewOrderManagementContainer({ locale }: NewOrderManagementContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(newOrderDictionaries, locale, 'en'))
    ]);
    
    // 認証済みユーザーであることを確認（管理者権限は不要）
    if (!userProfile.sub) {
      return (
        <NewOrderErrorDisplay 
          error={dictionary.alert.loginRequired}
          dictionary={dictionary} 
        />
      );
    }
    
    // UserProfileをUserAttributesDTOに変換
    const userAttributesDTO = {
      sub: userProfile.sub,
      preferred_username: userProfile.preferred_username,
      customerId: userProfile.customerId,
      role: userProfile.role,
      locale: userProfile.locale,
      paymentMethodId: userProfile.paymentMethodId
    };
    
    // 同じcustomerIdの新規オーダーリクエスト一覧をDynamoDBから取得
    const newOrderRequestsResult = await queryNewOrderRequests({
      customerId: userProfile.customerId,
      limit: 100 // 最大100リクエストまで表示
    });
    
    if (!newOrderRequestsResult.success || !newOrderRequestsResult.data) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: newOrderRequestsResult.success,
        message: newOrderRequestsResult.message,
        errors: newOrderRequestsResult.errors,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get new order requests from API:', errorDetails);
      
      const errorMessage = newOrderRequestsResult.message || dictionary.alert.fetchOrdersFailed;
      let detailedError = `${dictionary.alert.errorLabel} ${errorMessage}\n`;
      detailedError += `${dictionary.alert.customerIdLabel} ${userProfile.customerId}\n`;
      detailedError += `${dictionary.alert.timestampLabel} ${errorDetails.timestamp}\n`;
      
      if (newOrderRequestsResult.errors) {
        detailedError += `\n${dictionary.alert.detailedErrorLabel}\n${JSON.stringify(newOrderRequestsResult.errors, null, 2)}`;
      }
      
      return (
        <NewOrderErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }
    
    const newOrderRequests = newOrderRequestsResult.data.newOrderRequests;
    
    return (
      <NewOrderManagementPresentation 
        newOrderRequests={newOrderRequests}
        userAttributes={userAttributesDTO} 
        dictionary={dictionary} 
      />
    );
  } catch (error: any) {
    const errorDetails = {
      message: error?.message || '不明なエラー',
      name: error?.name || 'UnknownError',
      stack: error?.stack || 'スタックトレースなし',
      locale,
      timestamp: new Date().toISOString()
    };
    
    console.error('Error in NewOrderManagementContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(newOrderDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.alert.unknownError;
    
    let detailedError = `${dictionary.alert.authError} ${errorMessage}\n`;
    detailedError += `${dictionary.alert.errorType} ${errorDetails.name}\n`;
    detailedError += `${dictionary.alert.localeLabel} ${locale}\n`;
    detailedError += `${dictionary.alert.timestampLabel} ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== dictionary.alert.noStackTrace) {
      detailedError += `\n${dictionary.alert.stackTrace}\n${errorDetails.stack}`;
    }
    
    return (
      <NewOrderErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
