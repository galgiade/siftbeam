import ApiKeyManagementPresentation from './ApiKeyManagementPresentation'
import ApiKeyErrorDisplay from './ApiKeyErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { apiKeyDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getAPIKeysByCustomerIdAction } from '@/app/lib/actions/api-key-actions';

interface ApiKeyManagementContainerProps {
  locale: string;
}

/**
 * APIキー管理のコンテナコンポーネント
 * 管理者が自社のAPIキー一覧を取得・管理するためのコンポーネント
 */
export default async function ApiKeyManagementContainer({ locale }: ApiKeyManagementContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(apiKeyDictionaries, locale, 'en'))
    ]);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      return (
        <ApiKeyErrorDisplay 
          error={dictionary.error.accessDenied}
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
    
    // 同じcustomerIdのAPIキー一覧をDynamoDBから取得
    const apiKeysResult = await getAPIKeysByCustomerIdAction(100); // 最大100APIキーまで表示
    
    if (!apiKeysResult.success) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: apiKeysResult.success,
        message: apiKeysResult.message,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get API keys from API:', errorDetails);
      
      const errorMessage = apiKeysResult.message || dictionary.error.fetchFailed;
      let detailedError = `${dictionary.error.errorLabel} ${errorMessage}\n`;
      detailedError += `${dictionary.error.customerIdLabel} ${userProfile.customerId}\n`;
      detailedError += `${dictionary.error.timestampLabel} ${errorDetails.timestamp}\n`;
      
      return (
        <ApiKeyErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }
    
    const apiKeys = apiKeysResult.apiKeys || [];
    
    return (
      <ApiKeyManagementPresentation 
        apiKeys={apiKeys}
        userAttributes={userAttributesDTO} 
        dictionary={dictionary} 
      />
    );
  } catch (error: any) {
    const errorDetails = {
      message: error?.message || '',
      name: error?.name || 'UnknownError',
      stack: error?.stack || '',
      locale,
      timestamp: new Date().toISOString()
    };
    
    console.error('Error in ApiKeyManagementContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(apiKeyDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.error.unknownError;
    
    let detailedError = `${dictionary.error.authError} ${errorMessage}\n`;
    detailedError += `${dictionary.error.errorTypeLabel} ${errorDetails.name}\n`;
    detailedError += `${dictionary.error.localeLabel} ${locale}\n`;
    detailedError += `${dictionary.error.timestampLabel} ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack) {
      detailedError += `\n${dictionary.error.stackTraceLabel}\n${errorDetails.stack}`;
    } else {
      detailedError += `\n${dictionary.error.noStackTrace}`;
    }
    
    return (
      <ApiKeyErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
