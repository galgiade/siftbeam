import ServicePresentation from './ServicePresentation'
import ServiceErrorDisplay from './ServiceErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { serviceDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { queryProcessingHistory } from '@/app/lib/actions/processing-history-api';
import { getPoliciesForUser } from '@/app/lib/actions/policy-api';
import { getCustomerUsageLimits } from '@/app/lib/actions/usage-limits-api';

interface ServiceContainerProps {
  locale: string;
}

/**
 * サービスページのコンテナコンポーネント
 * ユーザーがポリシーを選択してファイルをアップロードし、処理履歴を確認するためのコンポーネント
 */
export default async function ServiceContainer({ locale }: ServiceContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(serviceDictionaries, locale, 'en'))
    ]);
    
    // 認証済みユーザーであることを確認
    if (!userProfile.sub) {
      return (
        <ServiceErrorDisplay 
          error={dictionary.error.loginRequired}
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
    
    // データを並列取得（処理履歴、ポリシー、利用制限）
    // ポリシーはユーザーが所属するグループに紐づくもののみを取得
    // 管理者の場合、customerIdでクエリしてAPI経由のデータも含めて取得
    const [processingHistoryResult, policiesResult, usageLimitsResult] = await Promise.all([
      queryProcessingHistory(
        userProfile.role === 'admin'
          ? { customerId: userProfile.customerId, limit: 20 }  // 管理者: 顧客全体のデータ
          : { userId: userProfile.sub, limit: 20 }             // 一般ユーザー: 自分のデータのみ
      ),
      getPoliciesForUser(
        userProfile.sub,
        userProfile.customerId
      ),
      getCustomerUsageLimits(userProfile.customerId)
    ]);
    
    // 処理履歴の取得エラーチェック
    if (!processingHistoryResult.success) {
      console.error('Processing history fetch error:', processingHistoryResult.errors);
      return (
        <ServiceErrorDisplay 
          error={processingHistoryResult.message || dictionary.error.processingHistoryFetchFailed}
          dictionary={dictionary} 
        />
      );
    }
    
    // ポリシーの取得エラーチェック
    // 注: グループに所属していない、またはグループにポリシーが紐づいていない場合は
    // success=true で policies=[] が返されるため、ここではエラーとして扱わない
    if (!policiesResult.success) {
      console.error('Policies fetch error:', policiesResult.errors);
      return (
        <ServiceErrorDisplay 
          error={policiesResult.message || dictionary.error.policiesFetchFailed}
          dictionary={dictionary} 
        />
      );
    }
    
    // 利用制限の取得エラーチェック
    if (!usageLimitsResult.success) {
      console.error('Usage limits fetch error:', usageLimitsResult.errors);
      return (
        <ServiceErrorDisplay 
          error={usageLimitsResult.message || dictionary.error.usageLimitsFetchFailed}
          dictionary={dictionary} 
        />
      );
    }
    
    const processingHistory = processingHistoryResult.data?.processingHistory || [];
    const policies = policiesResult.data?.policies || [];
    const usageLimits = usageLimitsResult.data || { notifyLimits: [], restrictLimits: [] };
    
    console.log('=== Service page loaded successfully ===');
    console.log('ユーザー情報:', {
      userId: userProfile.sub,
      userName: userProfile.preferred_username,
      customerId: userProfile.customerId,
      role: userProfile.role
    });
    console.log('取得データ:', {
      processingHistoryCount: processingHistory.length,
      processingHistoryQueryType: userProfile.role === 'admin' ? 'customerId (全データ)' : 'userId (個人データのみ)',
      policiesCount: policies.length,
      notifyLimitsCount: usageLimits.notifyLimits.length,
      restrictLimitsCount: usageLimits.restrictLimits.length
    });
    
    if (policies.length === 0) {
      console.log('⚠️ ユーザーが使用できるポリシーがありません');
      console.log('理由: ユーザーがグループに所属していない、またはグループにポリシーが紐づいていない可能性があります');
    } else {
      console.log('✅ ユーザーが使用できるポリシー:', policies.map(p => ({
        policyId: p.policyId,
        policyName: p.policyName
      })));
    }
    console.log('=====================================');
    
    return (
      <ServicePresentation
        userAttributes={userAttributesDTO}
        processingHistory={processingHistory}
        policies={policies}
        usageLimits={usageLimits}
        dictionary={dictionary}
        locale={locale}
      />
    );
    
  } catch (error: any) {
    // NEXT_REDIRECTエラーの場合は再スロー（Next.jsの正常なリダイレクト動作）
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message === 'NEXT_REDIRECT') {
      throw error;
    }
    
    console.error('Service container error:', error);
    
    // フォールバック辞書を使用
    const fallbackDictionary = pickDictionary(serviceDictionaries, 'en', 'en');
    
    return (
      <ServiceErrorDisplay 
        error={error?.message || fallbackDictionary.error.pageLoadFailed}
        dictionary={fallbackDictionary} 
      />
    );
  }
}
