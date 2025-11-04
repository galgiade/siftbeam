import CreatePolicyManagementPresentation from './CreatePolicyManagementPresentation'
import PolicyErrorDisplay from '../PolicyErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { policyManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

interface CreatePolicyManagementContainerProps {
  locale: string;
}

/**
 * ポリシー作成のコンテナコンポーネント
 * 管理者が新しいポリシーを作成するためのコンポーネント
 */
export default async function CreatePolicyManagementContainer({ locale }: CreatePolicyManagementContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(policyManagementDictionaries, locale, 'en'))
    ]);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      return (
        <PolicyErrorDisplay 
          error={dictionary.alert.accessDenied}
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
    
    return (
      <CreatePolicyManagementPresentation
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
    
    console.error('Error in CreatePolicyManagementContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(policyManagementDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.alert.unknownError;
    
    let detailedError = `${dictionary.alert.authError}: ${errorMessage}\n`;
    detailedError += `${dictionary.alert.errorType}: ${errorDetails.name}\n`;
    detailedError += `${dictionary.alert.localeLabel}: ${locale}\n`;
    detailedError += `${dictionary.alert.timestampLabel}: ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== dictionary.alert.noStackTrace) {
      detailedError += `\n${dictionary.alert.stackTrace}:\n${errorDetails.stack}`;
    }
    
    return (
      <PolicyErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
