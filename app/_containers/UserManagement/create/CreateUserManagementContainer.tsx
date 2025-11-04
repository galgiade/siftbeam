import CreateUserManagementPresentation from './CreateUserManagementPresentation'
import UserErrorDisplay from '../UserErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

interface CreateUserManagementContainerProps {
  locale: string;
}

/**
 * ユーザー作成のコンテナコンポーネント
 * 管理者が新しいユーザーを作成するためのコンポーネント
 */
export default async function CreateUserManagementContainer({ locale }: CreateUserManagementContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(userManagementDictionaries, locale, 'en'))
    ]);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      return (
        <UserErrorDisplay 
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
      <CreateUserManagementPresentation
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
    
    console.error('Error in UserProfileContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(userManagementDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.label.unknownError;
    
    let detailedError = `${dictionary.label.authError}: ${errorMessage}\n`;
    detailedError += `${dictionary.label.errorType}: ${errorDetails.name}\n`;
    detailedError += `${dictionary.label.localeLabel}: ${locale}\n`;
    detailedError += `${dictionary.label.timestampLabel}: ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== dictionary.label.noStackTrace) {
      detailedError += `\n${dictionary.label.stackTrace}:\n${errorDetails.stack}`;
    }
    
    return (
      <UserErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
