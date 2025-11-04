import CreateGroupManagementPresentation from './CreateGroupManagementPresentation'
import GroupErrorDisplay from '../GroupErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { groupManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import { queryUsers } from '@/app/lib/actions/user-api'
import { queryPolicies } from '@/app/lib/actions/policy-api'

interface CreateGroupManagementContainerProps {
  locale: string;
}

/**
 * グループ作成のコンテナコンポーネント
 * 管理者が新しいグループを作成するためのコンポーネント
 */
export default async function CreateGroupManagementContainer({ locale }: CreateGroupManagementContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(groupManagementDictionaries, locale, 'en'))
    ]);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      return (
        <GroupErrorDisplay 
          error={dictionary.alert.accessDenied}
          dictionary={dictionary} 
        />
      );
    }
    
    // ユーザーとポリシーのデータを並列取得
    const [usersResult, policiesResult] = await Promise.all([
      queryUsers({ customerId: userProfile.customerId }),
      queryPolicies({ customerId: userProfile.customerId })
    ]);

    // エラーハンドリング
    if (!usersResult.success) {
      console.error('Failed to fetch users:', usersResult);
      return (
        <GroupErrorDisplay 
          error={`${dictionary.alert.fetchUsersFailed} ${usersResult.message}`}
          dictionary={dictionary} 
        />
      );
    }

    if (!policiesResult.success) {
      console.error('Failed to fetch policies:', policiesResult);
      return (
        <GroupErrorDisplay 
          error={`${dictionary.alert.fetchPoliciesFailed} ${policiesResult.message}`}
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
      <CreateGroupManagementPresentation 
        userAttributes={userAttributesDTO} 
        dictionary={dictionary} 
        locale={locale}
        users={usersResult.data?.users || []}
        policies={policiesResult.data?.policies || []}
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
    
    console.error('Error in CreateGroupManagementContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(groupManagementDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.alert.unknownError;
    
    let detailedError = `${dictionary.alert.authError} ${errorMessage}\n`;
    detailedError += `${dictionary.alert.errorType} ${errorDetails.name}\n`;
    detailedError += `${dictionary.alert.localeLabel} ${locale}\n`;
    detailedError += `${dictionary.alert.timestampLabel} ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== dictionary.alert.noStackTrace) {
      detailedError += `\n${dictionary.alert.stackTrace}\n${errorDetails.stack}`;
    }
    
    return (
      <GroupErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
