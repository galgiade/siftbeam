import UserManagementPresentation from './UserManagementPresentation'
import UserErrorDisplay from './UserErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { queryUsers } from '@/app/lib/actions/user-api';

interface UserManagementContainerProps {
  locale: string;
}

/**
 * ユーザー管理のコンテナコンポーネント
 * 管理者が自社のユーザー一覧を取得・管理するためのコンポーネント
 */
export default async function UserManagementContainer({ locale }: UserManagementContainerProps) {
  try {
    // 並列実行で高速化
    console.log('=== UserManagementContainer デバッグ ===');
    console.log('URLから渡されたlocale:', locale);
    
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(userDictionaries, locale, 'en'))
    ]);
    
    console.log('CognitoのuserProfile.locale:', userProfile.locale);
    console.log('pickDictionaryで使用したlocale:', locale);
    console.log('取得したdictionary:', Object.keys(dictionary).slice(0, 5)); // 最初の5つのキーを表示
    console.log('=========================================');
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      const errorMessage = 'このページにアクセスする権限がありません。管理者のみアクセス可能です。';
      return (
        <UserErrorDisplay 
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
    
    // 同じcustomerIdのユーザー一覧をDynamoDBから取得
    const usersResult = await queryUsers({
      customerId: userProfile.customerId,
      limit: 100 // 最大100ユーザーまで表示
    });
    
    if (!usersResult.success || !usersResult.data) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: usersResult.success,
        message: usersResult.message,
        errors: usersResult.errors,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get users from API:', errorDetails);
      
      const errorMessage = usersResult.message || 'ユーザー一覧の取得に失敗しました。';
      let detailedError = `エラー: ${errorMessage}\n`;
      detailedError += `カスタマーID: ${userProfile.customerId}\n`;
      detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
      
      if (usersResult.errors) {
        detailedError += `\n詳細エラー:\n${JSON.stringify(usersResult.errors, null, 2)}`;
      }
      
      return (
        <UserErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }
    
    const users = usersResult.data.users;
    
    return (
      <UserManagementPresentation 
        users={users}
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
