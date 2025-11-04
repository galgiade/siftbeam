import CreateApiKeyManagementPresentation from './CreateApiKeyManagementPresentation'
import ApiKeyErrorDisplay from '../ApiKeyErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { apiKeyDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getPoliciesByCustomerIdAction } from '@/app/lib/actions/policy-api';

interface CreateApiKeyManagementContainerProps {
  locale: string;
}

/**
 * APIキー作成のコンテナコンポーネント
 * 管理者が新しいAPIキーを作成するためのコンポーネント
 */
export default async function CreateApiKeyManagementContainer({ locale }: CreateApiKeyManagementContainerProps) {
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
    
    // ポリシー一覧を取得
    const policiesResult = await getPoliciesByCustomerIdAction(userProfile.customerId);
    const policies = policiesResult.success && policiesResult.data ? policiesResult.data : [];
    
    return (
      <CreateApiKeyManagementPresentation
        userAttributes={userAttributesDTO} 
        dictionary={dictionary}
        policies={policies}
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
    
    console.error('Error in CreateApiKeyManagementContainer:', errorDetails);
    
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
