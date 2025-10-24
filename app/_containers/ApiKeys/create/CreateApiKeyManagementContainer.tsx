import CreateApiKeyManagementPresentation from './CreateApiKeyManagementPresentation'
import ApiKeyErrorDisplay from '../ApiKeyErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

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
    
    return (
      <CreateApiKeyManagementPresentation
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
    
    console.error('Error in CreateApiKeyManagementContainer:', errorDetails);
    
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
