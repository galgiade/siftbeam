import SupportDetailPresentation from './SupportDetailPresentation'
import SupportErrorDisplay from '../SupportErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { supportCenterDictionaries, commonDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getSupportRequestById, querySupportReplies } from '@/app/lib/actions/support-api';

interface SupportDetailContainerProps {
  locale: string;
  supportRequestId: string;
}

/**
 * サポートリクエスト詳細のコンテナコンポーネント
 * ユーザーがサポートリクエストの詳細を表示・返信するためのコンポーネント
 */
export default async function SupportDetailContainer({ locale, supportRequestId }: SupportDetailContainerProps) {
  try {
    // 並列実行で高速化
    const [userProfile, dictionary, commonDictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(supportCenterDictionaries, locale, 'en')),
      Promise.resolve(pickDictionary(commonDictionaries, locale, 'en'))
    ]);
    
    // 認証済みユーザーであることを確認（管理者権限は不要）
    if (!userProfile.sub) {
      return (
        <SupportErrorDisplay 
          error={dictionary.alert.loginRequired}
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
    
    // サポートリクエストの詳細と返信一覧を並列取得
    const [supportRequestResult, repliesResult] = await Promise.all([
      getSupportRequestById(supportRequestId),
      querySupportReplies({
        'support-requestId': supportRequestId,
        limit: 100
      })
    ]);
    
    // サポートリクエストが見つからない場合
    if (!supportRequestResult.success || !supportRequestResult.data) {
      const errorMessage = supportRequestResult.message || dictionary.label.requestNotFound;
      return (
        <SupportErrorDisplay 
          error={errorMessage}
          dictionary={dictionary} 
        />
      );
    }
    
    // 権限チェック: 自分のカスタマーIDのリクエストのみアクセス可能
    if (supportRequestResult.data.customerId !== userProfile.customerId) {
      return (
        <SupportErrorDisplay 
          error={dictionary.label.accessDenied}
          dictionary={dictionary} 
        />
      );
    }
    
    // 返信一覧の取得（失敗しても空配列で続行）
    const replies = repliesResult.success && repliesResult.data ? repliesResult.data.supportReplies : [];
    
    return (
      <SupportDetailPresentation
        supportRequest={supportRequestResult.data}
        replies={replies}
        userAttributes={userAttributesDTO} 
        dictionary={dictionary}
        commonDictionary={commonDictionary}
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
    
    console.error('Error in SupportDetailContainer:', errorDetails);
    
    // 辞書を取得してエラー表示
    const dictionary = pickDictionary(supportCenterDictionaries, locale, 'en');
    const errorMessage = error?.message || dictionary.alert.unknownError;
    
    let detailedError = `${dictionary.alert.authError} ${errorMessage}\n`;
    detailedError += `${dictionary.alert.errorType} ${errorDetails.name}\n`;
    detailedError += `${dictionary.alert.localeLabel} ${locale}\n`;
    detailedError += `${dictionary.alert.timestampLabel} ${errorDetails.timestamp}\n`;
    
    if (errorDetails.stack !== dictionary.alert.noStackTrace) {
      detailedError += `\n${dictionary.alert.stackTrace}\n${errorDetails.stack}`;
    }
    
    return (
      <SupportErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
