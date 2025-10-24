import { UsageLimit } from '@/app/lib/actions/usage-limits-api';

// 単位変換用の定数
export const UNIT_TO_BYTES = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
};

// 料金計算用の定数（処理料金）
export const PRICING_RATES = {
  processing: 0.00001, // $0.00001 per Byte
};

/**
 * 制限値をバイト数に変換
 */
export function convertLimitToBytes(limit: UsageLimit): number | null {
  // データ量制限の場合
  if (limit.usageLimitValue && limit.usageUnit) {
    return limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit];
  }
  
  // 金額制限の場合
  if (limit.amountLimitValue) {
    return limit.amountLimitValue / PRICING_RATES.processing;
  }
  
  return null;
}

/**
 * 通知が必要な制限値を文字列で返す
 */
export function formatExceedingLimits(limits: UsageLimit[]): string {
  if (limits.length === 0) return '';
  
  return limits.map(limit => {
    if (limit.usageLimitValue && limit.usageUnit) {
      return `${limit.usageLimitValue} ${limit.usageUnit}`;
    } else if (limit.amountLimitValue) {
      return `$${limit.amountLimitValue}`;
    }
    return '制限値';
  }).join(', ');
}

