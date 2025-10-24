import CreateGroupManagementPresentation from './CreateGroupManagementPresentation'
import GroupErrorDisplay from '../GroupErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
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
          error={`ユーザー情報の取得に失敗しました: ${usersResult.message}`}
          dictionary={dictionary} 
        />
      );
    }

    if (!policiesResult.success) {
      console.error('Failed to fetch policies:', policiesResult);
      return (
        <GroupErrorDisplay 
          error={`ポリシー情報の取得に失敗しました: ${policiesResult.message}`}
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
