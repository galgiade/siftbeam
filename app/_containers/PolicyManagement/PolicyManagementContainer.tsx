import PolicyManagementPresentation from './PolicyManagementPresentation'
import PolicyErrorDisplay from './PolicyErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { queryPolicies, getAvailableModels } from '@/app/lib/actions/policy-api';
import { PolicyAnalysisEntry, getPolicyAnalysesByPolicyIdAction } from '@/app/lib/actions/policy-analysis-actions';

interface PolicyManagementContainerProps {
  locale: string;
}


/**
 * ポリシー管理のコンテナコンポーネント
 * 管理者が自社のポリシー一覧を取得・管理するためのコンポーネント
 */
export default async function PolicyManagementContainer({ locale }: PolicyManagementContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary, availableModels] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(userDictionaries, locale, 'en')),
      getAvailableModels()
    ]);
    
    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      const errorMessage = 'このページにアクセスする権限がありません。管理者のみアクセス可能です。';
      return (
        <PolicyErrorDisplay 
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
    
    // 同じcustomerIdのポリシー一覧をDynamoDBから取得
    const policiesResult = await queryPolicies({
      customerId: userProfile.customerId,
      limit: 100 // 最大100ポリシーまで表示
    });
    
    if (!policiesResult.success || !policiesResult.data) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: policiesResult.success,
        message: policiesResult.message,
        errors: policiesResult.errors,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get policies from API:', errorDetails);
      
      const errorMessage = policiesResult.message || 'ポリシー一覧の取得に失敗しました。';
      let detailedError = `エラー: ${errorMessage}\n`;
      detailedError += `カスタマーID: ${userProfile.customerId}\n`;
      detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
      
      if (policiesResult.errors) {
        detailedError += `\n詳細エラー:\n${JSON.stringify(policiesResult.errors, null, 2)}`;
      }
      
      return (
        <PolicyErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }
    
    const policies = policiesResult.data.policies;
    
    // 各ポリシーのPolicyAnalysisを実際のAPIから取得
    console.log('Fetching policy analyses for', policies.length, 'policies...');
    
    const policiesWithAnalyses = await Promise.all(
      policies.map(async (policy) => {
        try {
          const analysesResult = await getPolicyAnalysesByPolicyIdAction(policy.policyId, 100);
          
          if (analysesResult.success && analysesResult.analyses) {
            // 作成日時の降順でソート（新しい順）
            const sortedAnalyses = analysesResult.analyses.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            console.log(`✅ Policy ${policy.policyId}: ${sortedAnalyses.length} analyses found`);
            
            return {
              ...policy,
              analyses: sortedAnalyses
            };
          } else {
            console.warn(`⚠️ Policy ${policy.policyId}: Failed to fetch analyses -`, analysesResult.message);
            return {
              ...policy,
              analyses: [] // エラー時は空配列
            };
          }
        } catch (error: any) {
          console.error(`❌ Policy ${policy.policyId}: Error fetching analyses -`, error);
          return {
            ...policy,
            analyses: [] // エラー時は空配列
          };
        }
      })
    );
    
    console.log('✅ All policy analyses fetched successfully');
    
    return (
      <PolicyManagementPresentation 
        policies={policiesWithAnalyses}
        userAttributes={userAttributesDTO} 
        dictionary={dictionary}
        availableModels={availableModels}
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
    
    console.error('Error in PolicyManagementContainer:', errorDetails);
    
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
      <PolicyErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
