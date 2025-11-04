import CreateSupportRequestPresentation from './CreateSupportRequestPresentation'
import SupportErrorDisplay from '../SupportErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { supportCenterDictionaries, commonDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

interface CreateSupportRequestContainerProps {
  locale: string;
}

/**
 * サポートリクエスト作成のコンテナコンポーネント
 * ユーザーが新しいサポートリクエストを作成するためのコンポーネント
 */
export default async function CreateSupportRequestContainer({ locale }: CreateSupportRequestContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary, commonDictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(supportCenterDictionaries, locale, 'en')),
      Promise.resolve(pickDictionary(commonDictionaries, locale, 'en'))
    ]);
    
    // 認証済みユーザーであることを確認（管理者権限は不要）
    if (!userProfile.sub) {
      return (
        <SupportErrorDisplay 
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
    
    return (
      <CreateSupportRequestPresentation
        userAttributes={userAttributesDTO} 
        dictionary={dictionary}
        commonDictionary={commonDictionary}
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
    
    console.error('Error in CreateSupportRequestContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(supportCenterDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.alert.unknownError;
    
    let detailedError = `${dictionary.alert.authError} ${errorMessage}\n`;
    detailedError += `${dictionary.alert.errorType} ${errorDetails.name}\n`;
    detailedError += `${dictionary.alert.localeLabel} ${locale}\n`;
    detailedError += `${dictionary.alert.timestampLabel} ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== dictionary.alert.noStackTrace) {
      detailedError += `\n${dictionary.alert.stackTrace}\n${errorDetails.stack}`;
    }
    
    return (
      <SupportErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
