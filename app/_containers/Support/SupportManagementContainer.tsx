import SupportManagementPresentation from './SupportManagementPresentation'
import SupportErrorDisplay from './SupportErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { querySupportRequests } from '@/app/lib/actions/support-api';

interface SupportManagementContainerProps {
  locale: string;
}

/**
 * サポートリクエスト管理のコンテナコンポーネント
 * ユーザーが自分のサポートリクエスト一覧を取得・管理するためのコンポーネント
 */
export default async function SupportManagementContainer({ locale }: SupportManagementContainerProps) {
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
    
    // 同じcustomerIdのサポートリクエスト一覧をDynamoDBから取得
    const supportRequestsResult = await querySupportRequests({
      customerId: userProfile.customerId,
      limit: 100 // 最大100リクエストまで表示
    });
    
    if (!supportRequestsResult.success || !supportRequestsResult.data) {
      // APIが失敗した場合、詳細なエラー情報を表示
      const errorDetails = {
        success: supportRequestsResult.success,
        message: supportRequestsResult.message,
        errors: supportRequestsResult.errors,
        customerId: userProfile.customerId,
        timestamp: new Date().toISOString()
      };
      
      console.error('Failed to get support requests from API:', errorDetails);
      
      const errorMessage = supportRequestsResult.message || 'サポートリクエスト一覧の取得に失敗しました。';
      let detailedError = `エラー: ${errorMessage}\n`;
      detailedError += `カスタマーID: ${userProfile.customerId}\n`;
      detailedError += `タイムスタンプ: ${errorDetails.timestamp}\n`;
      
      if (supportRequestsResult.errors) {
        detailedError += `\n詳細エラー:\n${JSON.stringify(supportRequestsResult.errors, null, 2)}`;
      }
      
      return (
        <SupportErrorDisplay 
          error={detailedError}
          dictionary={dictionary} 
        />
      );
    }
    
    const supportRequests = supportRequestsResult.data.supportRequests;
    
    return (
      <SupportManagementPresentation 
        supportRequests={supportRequests}
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
      <SupportErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
