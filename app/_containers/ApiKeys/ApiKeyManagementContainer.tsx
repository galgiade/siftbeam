import ApiKeyManagementPresentation from './ApiKeyManagementPresentation'
import ApiKeyErrorDisplay from './ApiKeyErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
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
      Promise.resolve(pickDictionary(userDictionaries, locale, 'en'))
    ]);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      const errorMessage = 'このページにアクセスする権限がありません。管理者のみアクセス可能です。';
      return (
        <ApiKeyErrorDisplay 
          error={errorMessage}
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
      
      const errorMessage = apiKeysResult.message || 'APIキー一覧の取得に失敗しました。';
      let detailedError = `エラー: ${errorMessage}\n`;
      detailedError += `カスタマーID: ${userProfile.customerId}\n`;
      detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
      
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
      message: error?.message || '不明なエラー',
      name: error?.name || 'UnknownError',
      stack: error?.stack || 'スタックトレースなし',
      locale,
      timestamp: new Date().toISOString()
    };
    
    console.error('Error in ApiKeyManagementContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(userDictionaries, locale, 'en');
    const errorMessage = error?.message || '予期しないエラーが発生しました。';
    
    let detailedError = `認証エラー: ${errorMessage}\n`;
    detailedError += `エラータイプ: ${errorDetails.name}\n`;
    detailedError += `ロケール: ${locale}\n`;
    detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== 'スタックトレースなし') {
      detailedError += `\nスタックトレース:\n${errorDetails.stack}`;
    }
    
    return (
      <ApiKeyErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
