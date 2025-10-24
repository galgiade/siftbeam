import GroupManagementPresentation from './GroupManagementPresentation'
import GroupErrorDisplay from './GroupErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { queryGroups } from '@/app/lib/actions/group-api'
import { queryUsers } from '@/app/lib/actions/user-api'
import { queryPolicies } from '@/app/lib/actions/policy-api'

interface GroupManagementContainerProps {
  locale: string;
}

/**
 * グループ管理のコンテナコンポーネント
 * 管理者が自社のグループ一覧を取得・管理するためのコンポーネント
 */
export default async function GroupManagementContainer({ locale }: GroupManagementContainerProps) {
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
        <GroupErrorDisplay 
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
    
    // グループ、ユーザー、ポリシーのデータを並列取得
    const [groupsResult, usersResult, policiesResult] = await Promise.all([
      queryGroups({
        customerId: userProfile.customerId,
        limit: 100 // 最大100グループまで表示
      }),
      queryUsers({ customerId: userProfile.customerId }),
      queryPolicies({ customerId: userProfile.customerId })
    ]);
    
    if (!groupsResult.success || !groupsResult.data) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: groupsResult.success,
        message: groupsResult.message,
        errors: groupsResult.errors,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get groups from API:', errorDetails);
      
      const errorMessage = groupsResult.message || 'グループ一覧の取得に失敗しました。';
      let detailedError = `エラー: ${errorMessage}\n`;
      detailedError += `カスタマーID: ${userProfile.customerId}\n`;
      detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
      
      if (groupsResult.errors) {
        detailedError += `\n詳細エラー:\n${JSON.stringify(groupsResult.errors, null, 2)}`;
      }
      
      return (
        <GroupErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }

    // ユーザーとポリシーのデータ取得エラーをログに記録（グループ管理は継続）
    if (!usersResult.success) {
      console.warn('Failed to fetch users:', usersResult.message);
    }
    
    if (!policiesResult.success) {
      console.warn('Failed to fetch policies:', policiesResult.message);
    }
    
    const groups = groupsResult.data.groups;
    const users = usersResult.success ? usersResult.data?.users || [] : [];
    const policies = policiesResult.success ? policiesResult.data?.policies || [] : [];
    
    return (
      <GroupManagementPresentation 
        groups={groups}
        users={users}
        policies={policies}
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
    
    console.error('Error in GroupManagementContainer:', errorDetails);
    
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
      <GroupErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
