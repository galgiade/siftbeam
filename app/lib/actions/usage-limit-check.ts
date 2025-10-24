'use server'

import { UsageLimit } from '@/app/lib/actions/usage-limits-api';
import { queryProcessingHistory } from '@/app/lib/actions/processing-history-api';
import { ApiResponse } from '@/app/lib/types/TypeAPIs';
import { convertLimitToBytes } from '@/app/lib/utils/usage-limit-utils';

/**
 * 利用制限チェック結果のインターフェース
 */
export interface UsageLimitCheckResult {
  canUpload: boolean;
  shouldNotify: boolean;
  notifyEmails: string[];
  restrictReason?: string;
  currentUsageBytes: number;
  exceedingLimits: {
    notify: UsageLimit[];
    restrict: UsageLimit[];
  };
}

/**
 * 利用制限をチェックする関数
 * 
 * @param customerId - 企業ID
 * @param additionalBytes - 追加予定のバイト数（新しくアップロードするファイルのサイズ）
 * @param notifyLimits - 通知制限のリスト
 * @param restrictLimits - 利用停止制限のリスト
 * @returns 利用制限チェック結果
 */
export async function checkUsageLimits(
  customerId: string,
  additionalBytes: number,
  notifyLimits: UsageLimit[],
  restrictLimits: UsageLimit[]
): Promise<ApiResponse<UsageLimitCheckResult>> {
  try {
    console.log('checkUsageLimits called with:', {
      customerId,
      additionalBytes,
      notifyLimitsCount: notifyLimits.length,
      restrictLimitsCount: restrictLimits.length
    });

    // 現在の月の処理履歴から使用量を計算
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthISO = startOfMonth.toISOString();
    
    const historyResult = await queryProcessingHistory({
      customerId,
      limit: 1000 // 月次データ全て取得
    });
    
    if (!historyResult.success) {
      return {
        success: false,
        message: '使用量の取得に失敗しました。',
        errors: historyResult.errors
      };
    }

    // 現在の月のデータのみフィルタリング
    const monthlyHistory = historyResult.data?.processingHistory.filter(
      h => h.createdAt >= startOfMonthISO
    ) || [];
    
    // 合計バイト数を計算
    const currentUsageBytes = monthlyHistory.reduce(
      (sum, h) => sum + (h.usageAmountBytes || 0), 
      0
    );
    const projectedUsageBytes = currentUsageBytes + additionalBytes;

    console.log('Usage check:', {
      currentUsageBytes,
      additionalBytes,
      projectedUsageBytes
    });

    // 利用停止制限のチェック
    const exceedingRestrictLimits: UsageLimit[] = [];
    for (const limit of restrictLimits) {
      const limitBytes = convertLimitToBytes(limit);
      if (limitBytes !== null && projectedUsageBytes > limitBytes) {
        exceedingRestrictLimits.push(limit);
      }
    }

    // 利用停止制限に達している場合
    if (exceedingRestrictLimits.length > 0) {
      const minExceedingLimit = exceedingRestrictLimits.reduce((min, current) => {
        const minBytes = convertLimitToBytes(min) || Infinity;
        const currentBytes = convertLimitToBytes(current) || Infinity;
        return currentBytes < minBytes ? current : min;
      });

      const limitBytes = convertLimitToBytes(minExceedingLimit);
      const limitDescription = minExceedingLimit.usageLimitValue && minExceedingLimit.usageUnit
        ? `${minExceedingLimit.usageLimitValue} ${minExceedingLimit.usageUnit}`
        : minExceedingLimit.amountLimitValue
        ? `$${minExceedingLimit.amountLimitValue}`
        : '設定値';

      return {
        success: true,
        message: '利用停止制限に達しています。',
        data: {
          canUpload: false,
          shouldNotify: false,
          notifyEmails: [],
          restrictReason: `利用停止制限（${limitDescription}）を超過するため、アップロードできません。`,
          currentUsageBytes,
          exceedingLimits: {
            notify: [],
            restrict: exceedingRestrictLimits
          }
        }
      };
    }

    // 通知制限のチェック
    const exceedingNotifyLimits: UsageLimit[] = [];
    const notifyEmailsSet = new Set<string>();

    for (const limit of notifyLimits) {
      const limitBytes = convertLimitToBytes(limit);
      if (limitBytes !== null && projectedUsageBytes > limitBytes) {
        exceedingNotifyLimits.push(limit);
        // メールアドレスを収集
        limit.emails.forEach(email => notifyEmailsSet.add(email));
      }
    }

    const shouldNotify = exceedingNotifyLimits.length > 0;
    const notifyEmails = Array.from(notifyEmailsSet);

    console.log('Usage limit check result:', {
      canUpload: true,
      shouldNotify,
      notifyEmailsCount: notifyEmails.length,
      exceedingNotifyLimitsCount: exceedingNotifyLimits.length
    });

    return {
      success: true,
      message: 'アップロード可能です。',
      data: {
        canUpload: true,
        shouldNotify,
        notifyEmails,
        currentUsageBytes,
        exceedingLimits: {
          notify: exceedingNotifyLimits,
          restrict: []
        }
      }
    };

  } catch (error: any) {
    console.error('Error checking usage limits:', error);
    return {
      success: false,
      message: `利用制限チェックに失敗しました: ${error.message}`,
      errors: { 
        general: [error.message || '不明なエラーが発生しました。']
      }
    };
  }
}

