import NewOrderDetailPresentation from './NewOrderDetailPresentation'
import NewOrderErrorDisplay from '../NewOrderErrorDisplay'
import { requireUserProfile } from '@/app/lib/utils/require-auth'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getNewOrderRequestById, queryNewOrderReplies } from '@/app/lib/actions/neworder-api';

interface NewOrderDetailContainerProps {
  locale: string;
  newOrderRequestId: string;
}

/**
 * 新規オーダーリクエスト詳細のコンテナコンポーネント
 * ユーザーが新規オーダーリクエストの詳細を表示・返信するためのコンポーネント
 */
export default async function NewOrderDetailContainer({ locale, newOrderRequestId }: NewOrderDetailContainerProps) {
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
        <NewOrderErrorDisplay 
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
    
    // 新規オーダーリクエストの詳細を取得
    const newOrderRequestResult = await getNewOrderRequestById(newOrderRequestId);
    
    // 返信一覧を取得（エラーが発生しても続行）
    let repliesResult;
    try {
      repliesResult = await queryNewOrderReplies({
        'neworder-requestId': newOrderRequestId,
        limit: 100
      });
    } catch (error) {
      console.error('Error querying replies:', error);
      repliesResult = { success: false, data: { newOrderReplies: [] } };
    }
    
    // 新規オーダーリクエストが見つからない場合
    if (!newOrderRequestResult.success || !newOrderRequestResult.data) {
      const errorMessage = newOrderRequestResult.message || '新規オーダーリクエストが見つかりません。';
      return (
        <NewOrderErrorDisplay 
          error={errorMessage}
          dictionary={dictionary} 
        />
      );
    }
    
    // 権限チェック: 自分のカスタマーIDのリクエストのみアクセス可能
    if (newOrderRequestResult.data.customerId !== userProfile.customerId) {
      const errorMessage = 'この新規オーダーリクエストにアクセスする権限がありません。';
      return (
        <NewOrderErrorDisplay 
          error={errorMessage}
          dictionary={dictionary} 
        />
      );
    }
    
    // 返信一覧の取得（失敗しても空配列で続行）
    const replies = repliesResult.success && repliesResult.data ? repliesResult.data.newOrderReplies : [];
    
    return (
      <NewOrderDetailPresentation
        newOrderRequest={newOrderRequestResult.data}
        replies={replies}
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
    
    console.error('Error in NewOrderDetailContainer:', errorDetails);
    
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
      <NewOrderErrorDisplay 
        error={detailedError}
        dictionary={dictionary} 
      />
    );
  }
}
