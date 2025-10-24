import UserProfilePresentation from './UserPresentation'
import UserErrorDisplay from './UserErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getUserById } from '@/app/lib/actions/user-api';

interface UserContainerProps {
  locale: string;
}

/**
 * ユーザープロファイル更新のコンテナコンポーネント
 * 認証されたユーザーの情報を取得し、プレゼンテーションコンポーネントに渡す
 */
export default async function UserProfileContainer({ locale }: UserContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(userDictionaries, locale, 'en'))
    ]);
    
    // UserProfileをUserAttributesDTOに変換
    const userAttributesDTO = {
      sub: userProfile.sub,
      preferred_username: userProfile.preferred_username,
      customerId: userProfile.customerId,
      role: userProfile.role,
      locale: userProfile.locale,
      paymentMethodId: userProfile.paymentMethodId
    };
    
    // ユーザー情報をDynamoDBから取得
    const userResult = await getUserById(userProfile.sub, userAttributesDTO);
    
    if (!userResult.success || !userResult.data) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: userResult.success,
        message: userResult.message,
        errors: userResult.errors,
        userId: userProfile.sub,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get user from API:', errorDetails);
      
      const errorMessage = userResult.message || 'ユーザー情報の取得に失敗しました。';
      let detailedError = `エラー: ${errorMessage}\n`;
      detailedError += `ユーザーID: ${userProfile.sub}\n`;
      detailedError += `カスタマーID: ${userProfile.customerId}\n`;
      detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
      
      if (userResult.errors) {
        detailedError += `\n詳細エラー:\n${JSON.stringify(userResult.errors, null, 2)}`;
      }
      
      return (
        <UserErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }
    
    const user = userResult.data;
    
    return (
      <UserProfilePresentation 
        user={user} 
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
      <UserErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
