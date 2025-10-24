'use client'

import { useState, useCallback, useEffect } from 'react';
import { Card, CardBody, CardHeader, Select, SelectItem, Chip } from '@heroui/react';
import { FaRocket, FaCog, FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import { ProcessingHistory } from '@/app/lib/actions/processing-history-api';
import { Policy } from '@/app/lib/actions/policy-api';
import { UsageLimit } from '@/app/lib/actions/usage-limits-api';
import { formatFileSize } from '@/app/lib/utils/s3-utils';
import ServiceFileUploader from './ServiceFileUploader';
import ProcessingHistoryList from './ProcessingHistoryList';

interface ServicePresentationProps {
  userAttributes: {
    sub: string;
    preferred_username: string;
    customerId: string;
    role: string;
    locale: string;
    paymentMethodId?: string;
  };
  processingHistory: ProcessingHistory[];
  policies: Policy[];
  usageLimits: {
    notifyLimits: UsageLimit[];
    restrictLimits: UsageLimit[];
  };
  dictionary: any;
  locale: string;
}

// 単位変換用の定数
const UNIT_TO_BYTES = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
};

// 料金計算用の定数（処理料金、1年間保管込み）
const PRICING_RATES = {
  processing: 0.00001, // $0.00001 per B (includes 1-year storage)
};

/**
 * サービスページのプレゼンテーションコンポーネント
 */
export default function ServicePresentation({ 
  userAttributes, 
  processingHistory, 
  policies,
  usageLimits,
  dictionary, 
  locale 
}: ServicePresentationProps) {
  // すべてのHooksをコンポーネントの最上部で呼び出す
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 処理開始ハンドラー
  const handleProcessingStarted = useCallback(() => {
    // 処理履歴を再取得するためにトリガーを更新
    setRefreshTrigger(prev => prev + 1);
    console.log('Processing started, refresh trigger updated');
  }, []);

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setIsClient(true);
    
    // デバッグ: 処理履歴データを確認
    console.log('ServicePresentation - Processing History:', {
      count: processingHistory.length,
      sample: processingHistory.length > 0 ? {
        id: processingHistory[0]['processing-historyId'],
        userName: processingHistory[0].userName,
        aiTrainingUsage: processingHistory[0].aiTrainingUsage,
        status: processingHistory[0].status
      } : null
    });
  }, [processingHistory]);

  // 処理履歴から現在の利用量を計算（バイト単位）
  // 注: 月次使用量として、成功した処理のusageAmountBytesを合計
  const calculateCurrentUsage = (): number => {
    // 現在の月の開始日時を取得
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthISO = startOfMonth.toISOString();
    
    return processingHistory
      .filter(history => 
        history.createdAt >= startOfMonthISO && // 今月のデータのみ
        history.status === 'success' // 成功したもののみ
      )
      .reduce((total, history) => total + (history.usageAmountBytes || 0), 0);
  };

  // 金額制限をデータ量制限に変換する関数
  const convertAmountToDataLimit = (amountLimit: number): { value: number; unit: 'MB' | 'GB' | 'TB' } => {
    // 金額から処理可能なバイト数を計算
    const bytes = amountLimit / PRICING_RATES.processing;
    
    // 適切な単位に変換
    if (bytes >= UNIT_TO_BYTES.TB) {
      return { value: Math.round((bytes / UNIT_TO_BYTES.TB) * 100) / 100, unit: 'TB' };
    } else if (bytes >= UNIT_TO_BYTES.GB) {
      return { value: Math.round((bytes / UNIT_TO_BYTES.GB) * 100) / 100, unit: 'GB' };
    } else {
      return { value: Math.round((bytes / UNIT_TO_BYTES.MB) * 100) / 100, unit: 'MB' };
    }
  };

  // 利用制限から最小の未達成制限を取得（データ量制限と金額制限の両方対応）
  const getNextUsageLimit = (limits: UsageLimit[], currentUsageBytes: number): UsageLimit | null => {
    // データ量制限と金額制限の両方をフィルタリング
    const validLimits = limits.filter(limit => {
      // データ量制限の場合
      if (limit.usageLimitValue && limit.usageUnit) {
        const limitBytes = limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit];
        return limitBytes > currentUsageBytes;
      }
      // 金額制限の場合
      if (limit.amountLimitValue) {
        const limitBytes = limit.amountLimitValue / PRICING_RATES.processing;
        return limitBytes > currentUsageBytes;
      }
      return false;
    });

    if (validLimits.length === 0) return null;

    // 最小の制限値を持つものを返す
    return validLimits.reduce((min, current) => {
      // minのバイト数を計算
      let minBytes: number;
      if (min.usageLimitValue && min.usageUnit) {
        minBytes = min.usageLimitValue * UNIT_TO_BYTES[min.usageUnit];
      } else if (min.amountLimitValue) {
        minBytes = min.amountLimitValue / PRICING_RATES.processing;
      } else {
        return current;
      }

      // currentのバイト数を計算
      let currentBytes: number;
      if (current.usageLimitValue && current.usageUnit) {
        currentBytes = current.usageLimitValue * UNIT_TO_BYTES[current.usageUnit];
      } else if (current.amountLimitValue) {
        currentBytes = current.amountLimitValue / PRICING_RATES.processing;
      } else {
        return min;
      }

      return currentBytes < minBytes ? current : min;
    });
  };

  // 任意の制限（データ量制限または金額制限）を取得
  const getAnyUsageLimit = (limits: UsageLimit[]): UsageLimit | null => {
    if (limits.length === 0) return null;
    
    // データ量制限を優先して返す
    const dataLimits = limits.filter(limit => limit.usageLimitValue && limit.usageUnit);
    if (dataLimits.length > 0) {
      return dataLimits[0]; // 最初のデータ量制限を返す
    }
    
    // データ量制限がない場合は金額制限を返す
    const amountLimits = limits.filter(limit => limit.amountLimitValue);
    if (amountLimits.length > 0) {
      return amountLimits[0]; // 最初の金額制限を返す
    }
    
    return null;
  };

  const currentUsageBytes = calculateCurrentUsage();
  const nextNotifyLimit = getNextUsageLimit(usageLimits.notifyLimits, currentUsageBytes);
  const nextRestrictLimit = getNextUsageLimit(usageLimits.restrictLimits, currentUsageBytes);
  
  // フォールバック: データ量制限がない場合は任意の制限を表示
  const anyNotifyLimit = getAnyUsageLimit(usageLimits.notifyLimits);
  const anyRestrictLimit = getAnyUsageLimit(usageLimits.restrictLimits);

  // デバッグ用ログ
  useEffect(() => {
    console.log('ServicePresentation Debug:', {
      currentUsageBytes,
      processingHistoryCount: processingHistory.length,
      successfulHistoryCount: processingHistory.filter(h => h.status === 'success').length,
      notifyLimitsCount: usageLimits.notifyLimits.length,
      restrictLimitsCount: usageLimits.restrictLimits.length,
      nextNotifyLimit,
      nextRestrictLimit,
      usageLimits: {
        notifyLimits: usageLimits.notifyLimits,
        restrictLimits: usageLimits.restrictLimits
      }
    });

    // 各利用制限の詳細をログ出力
    console.log('通知制限の詳細:');
    usageLimits.notifyLimits.forEach((limit, index) => {
      console.log(`通知制限 ${index + 1}:`, {
        'usage-limitsId': limit['usage-limitsId'],
        usageLimitValue: limit.usageLimitValue,
        usageUnit: limit.usageUnit,
        amountLimitValue: limit.amountLimitValue,
        exceedAction: limit.exceedAction,
        emails: limit.emails,
        createdAt: limit.createdAt,
        hasUsageLimit: !!(limit.usageLimitValue && limit.usageUnit),
        hasAmountLimit: !!limit.amountLimitValue,
        calculatedBytes: limit.usageLimitValue && limit.usageUnit ? 
          limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit] : null,
        isGreaterThanCurrent: limit.usageLimitValue && limit.usageUnit ? 
          (limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit]) > currentUsageBytes : false
      });
    });

    console.log('利用停止制限の詳細:');
    usageLimits.restrictLimits.forEach((limit, index) => {
      console.log(`利用停止制限 ${index + 1}:`, {
        'usage-limitsId': limit['usage-limitsId'],
        usageLimitValue: limit.usageLimitValue,
        usageUnit: limit.usageUnit,
        amountLimitValue: limit.amountLimitValue,
        exceedAction: limit.exceedAction,
        emails: limit.emails,
        createdAt: limit.createdAt,
        hasUsageLimit: !!(limit.usageLimitValue && limit.usageUnit),
        hasAmountLimit: !!limit.amountLimitValue,
        calculatedBytes: limit.usageLimitValue && limit.usageUnit ? 
          limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit] : null,
        isGreaterThanCurrent: limit.usageLimitValue && limit.usageUnit ? 
          (limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit]) > currentUsageBytes : false
      });
    });
  }, [currentUsageBytes, processingHistory, usageLimits, nextNotifyLimit, nextRestrictLimit]);

  // ハイドレーション完了前は基本的なレイアウトのみ表示
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                サービス
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              ポリシーを選択してファイルをアップロードし、処理を実行できます。
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              サービス
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            ポリシーを選択してファイルをアップロードし、処理を実行できます。処理後のデータは1年間無料で保管されます。
          </p>
        </div>

        {/* 利用制限カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 通知制限 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaExclamationTriangle className="text-warning" />
                通知制限
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {nextNotifyLimit || anyNotifyLimit ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">制限値:</span>
                    <span className="font-medium">
                      {(() => {
                        const limit = nextNotifyLimit || anyNotifyLimit;
                        if (!limit) return '設定なし';
                        
                        if (limit.usageLimitValue && limit.usageUnit) {
                          return `${limit.usageLimitValue} ${limit.usageUnit}/月`;
                        } else if (limit.amountLimitValue) {
                          const converted = convertAmountToDataLimit(limit.amountLimitValue);
                          return `${converted.value} ${converted.unit}/月 ($${limit.amountLimitValue})`;
                        }
                        return '設定なし';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">超過時のアクション:</span>
                    <Chip size="sm" color="warning" variant="flat">通知</Chip>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">現在の利用量:</span>
                    <span className="font-medium">
                      {(() => {
                        const limit = nextNotifyLimit || anyNotifyLimit;
                        if (!limit) return formatFileSize(currentUsageBytes);
                        
                        if (limit.usageLimitValue && limit.usageUnit) {
                          return `${formatFileSize(currentUsageBytes)}/${limit.usageLimitValue} ${limit.usageUnit}`;
                        } else if (limit.amountLimitValue) {
                          const converted = convertAmountToDataLimit(limit.amountLimitValue);
                          return `${formatFileSize(currentUsageBytes)}/${converted.value} ${converted.unit}`;
                        }
                        return formatFileSize(currentUsageBytes);
                      })()}
                    </span>
                  </div>
                  {!nextNotifyLimit && anyNotifyLimit && anyNotifyLimit.amountLimitValue && (
                    <div className="text-xs text-blue-600 mt-2">
                      ※ 金額制限をデータ量に換算して表示しています（処理料金: $0.00001/Byte、1年間保管込み）
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>通知制限が設定されていません</p>
                  <p className="text-sm">現在の利用量: {formatFileSize(currentUsageBytes)}</p>
                  <p className="text-xs mt-2">
                    設定済み通知制限: {usageLimits.notifyLimits.length}件
                  </p>
                  {usageLimits.notifyLimits.length > 0 && (
                    <div className="text-xs mt-1">
                      {usageLimits.notifyLimits.map((limit, index) => (
                        <div key={index} className="mb-1">
                          {limit.usageLimitValue && limit.usageUnit ? (
                            <>
                              データ量制限: {limit.usageLimitValue} {limit.usageUnit} 
                              ({formatFileSize(limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit])})
                            </>
                          ) : limit.amountLimitValue ? (
                            <>
                              金額制限: ${limit.amountLimitValue}
                            </>
                          ) : (
                            '制限値が設定されていません'
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* 利用停止制限 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaExclamationTriangle className="text-danger" />
                利用停止制限
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {nextRestrictLimit || anyRestrictLimit ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">制限値:</span>
                    <span className="font-medium">
                      {(() => {
                        const limit = nextRestrictLimit || anyRestrictLimit;
                        if (!limit) return '設定なし';
                        
                        if (limit.usageLimitValue && limit.usageUnit) {
                          return `${limit.usageLimitValue} ${limit.usageUnit}/月`;
                        } else if (limit.amountLimitValue) {
                          const converted = convertAmountToDataLimit(limit.amountLimitValue);
                          return `${converted.value} ${converted.unit}/月 ($${limit.amountLimitValue})`;
                        }
                        return '設定なし';
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">超過時のアクション:</span>
                    <Chip size="sm" color="danger" variant="flat">利用停止</Chip>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">現在の利用量:</span>
                    <span className="font-medium">
                      {(() => {
                        const limit = nextRestrictLimit || anyRestrictLimit;
                        if (!limit) return formatFileSize(currentUsageBytes);
                        
                        if (limit.usageLimitValue && limit.usageUnit) {
                          return `${formatFileSize(currentUsageBytes)}/${limit.usageLimitValue} ${limit.usageUnit}`;
                        } else if (limit.amountLimitValue) {
                          const converted = convertAmountToDataLimit(limit.amountLimitValue);
                          return `${formatFileSize(currentUsageBytes)}/${converted.value} ${converted.unit}`;
                        }
                        return formatFileSize(currentUsageBytes);
                      })()}
                    </span>
                  </div>
                  {!nextRestrictLimit && anyRestrictLimit && anyRestrictLimit.amountLimitValue && (
                    <div className="text-xs text-blue-600 mt-2">
                      ※ 金額制限をデータ量に換算して表示しています（処理料金: $0.00001/Byte、1年間保管込み）
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>利用停止制限が設定されていません</p>
                  <p className="text-sm">現在の利用量: {formatFileSize(currentUsageBytes)}</p>
                  <p className="text-xs mt-2">
                    設定済み利用停止制限: {usageLimits.restrictLimits.length}件
                  </p>
                  {usageLimits.restrictLimits.length > 0 && (
                    <div className="text-xs mt-1">
                      {usageLimits.restrictLimits.map((limit, index) => (
                        <div key={index} className="mb-1">
                          {limit.usageLimitValue && limit.usageUnit ? (
                            <>
                              データ量制限: {limit.usageLimitValue} {limit.usageUnit} 
                              ({formatFileSize(limit.usageLimitValue * UNIT_TO_BYTES[limit.usageUnit])})
                            </>
                          ) : limit.amountLimitValue ? (
                            <>
                              金額制限: ${limit.amountLimitValue}
                            </>
                          ) : (
                            '制限値が設定されていません'
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ポリシー選択 */}
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaCog className="text-primary" />
              ポリシー選択
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                処理ポリシーを選択してください
              </label>
              {policies.length > 0 ? (
                <Select
                  placeholder="ポリシーを選択してください"
                  selectedKeys={selectedPolicyId ? [selectedPolicyId] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setSelectedPolicyId(selectedKey || '');
                  }}
                  startContent={<FaCog className="text-primary" />}
                  size="lg"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white border-gray-300 hover:border-primary-400 focus:border-primary-500",
                    value: "text-gray-900",
                    popoverContent: "bg-white border border-gray-200 shadow-lg"
                  }}
                  renderValue={(items) => {
                    if (items.length === 0) return "ポリシーを選択してください";
                    const selectedPolicy = policies.find(p => p.policyId === selectedPolicyId);
                    return selectedPolicy ? selectedPolicy.policyName : "ポリシーを選択してください";
                  }}
                >
                  {policies.map((policy) => (
                    <SelectItem key={policy.policyId}>
                      <div className="flex flex-col">
                        <span className="font-medium">{policy.policyName}</span>
                        <span className="text-sm text-gray-500">{policy.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-yellow-800">
                        使用できるポリシーがありません
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* ファイルアップロード */}
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaDownload className="text-primary" />
              ファイルアップロード
            </h3>
          </CardHeader>
          <CardBody>
            {selectedPolicyId && policies.length > 0 ? (
              <ServiceFileUploader
                customerId={userAttributes.customerId}
                userId={userAttributes.sub}
                userName={userAttributes.preferred_username}
                policyId={selectedPolicyId}
                policyName={policies.find(p => p.policyId === selectedPolicyId)?.policyName || 'Unknown Policy'}
                notifyLimits={usageLimits.notifyLimits}
                restrictLimits={usageLimits.restrictLimits}
                onProcessingStarted={handleProcessingStarted}
                dictionary={dictionary}
                locale={locale}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaCog className="text-4xl text-gray-400 mx-auto mb-4" />
                {policies.length === 0 ? (
                  <div>
                    <p className="text-lg font-medium mb-2">使用できるポリシーがありません</p>
                  </div>
                ) : (
                  <p>まずポリシーを選択してください</p>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* 処理履歴 */}
        <ProcessingHistoryList
          processingHistory={processingHistory}
          dictionary={dictionary}
          refreshKey={refreshTrigger}
        />
      </div>
    </div>
  );
}
