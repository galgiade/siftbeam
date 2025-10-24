import CreateSupportRequestPresentation from './CreateSupportRequestPresentation'
import SupportErrorDisplay from '../SupportErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

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
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(userDictionaries, locale, 'en'))
    ]);
    
    // 認証済みユーザーであることを確認（管理者権限は不要）
    if (!userProfile.sub) {
      const errorMessage = 'ログインが必要です。';
      return (
        <SupportErrorDisplay 
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
      <CreateSupportRequestPresentation
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
      <SupportErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
