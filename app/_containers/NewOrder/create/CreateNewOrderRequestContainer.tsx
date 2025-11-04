import CreateNewOrderRequestPresentation from './CreateNewOrderRequestPresentation'
import NewOrderErrorDisplay from '../NewOrderErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { newOrderDictionaries, commonDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

interface CreateNewOrderRequestContainerProps {
  locale: string;
}

/**
 * 新規オーダーリクエスト作成のコンテナコンポーネント
 * ユーザーが新しい新規オーダーリクエストを作成するためのコンポーネント
 */
export default async function CreateNewOrderRequestContainer({ locale }: CreateNewOrderRequestContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary, commonDictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(newOrderDictionaries, locale, 'en')),
      Promise.resolve(pickDictionary(commonDictionaries, locale, 'en'))
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
    
    return (
      <CreateNewOrderRequestPresentation
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
    
    console.error('Error in CreateNewOrderRequestContainer:', errorDetails);
    
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
