import UserManagementPresentation from './UserManagementPresentation'
import UserErrorDisplay from './UserErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
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
      Promise.resolve(pickDictionary(userManagementDictionaries, locale, 'en'))
    ]);
    
    console.log('CognitoのuserProfile.locale:', userProfile.locale);
    console.log('pickDictionaryで使用したlocale:', locale);
    console.log('取得したdictionary:', Object.keys(dictionary).slice(0, 5)); // 最初の5つのキーを表示
    console.log('=========================================');
    
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
      
      const errorMessage = usersResult.message || dictionary.alert.fetchUsersFailed;
      let detailedError = `${dictionary.label.errorLabel}: ${errorMessage}\n`;
      detailedError += `${dictionary.label.customerIdLabel}: ${userProfile.customerId}\n`;
      detailedError += `${dictionary.label.timestampLabel}: ${errorDetails.timestamp}\n`;
      
      if (usersResult.errors) {
        detailedError += `\n${dictionary.label.detailedErrorLabel}:\n${JSON.stringify(usersResult.errors, null, 2)}`;
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
