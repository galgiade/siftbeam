'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Chip } from '@heroui/react';
import { FaExclamationTriangle, FaCog, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { createUsageLimit } from '@/app/lib/actions/usage-limits-api';
import { useRouter } from 'next/navigation';
import type { UsageLimitLocale } from '@/app/dictionaries/usageLimit/usage-limit.d';

interface UsageLimitPresentationProps {
  userAttributes: {
    sub: string;
    preferred_username: string;
    customerId: string;
    role: string;
    locale: string;
    paymentMethodId?: string;
  };
  dictionary: UsageLimitLocale;
  locale: string;
}

interface UsageLimitFormData {
  exceedAction: 'notify' | 'restrict' | '';
  limitType: 'usage' | 'amount' | ''; // データ量 or 金額の排他選択
  usageLimitValue?: number;
  usageUnit?: 'MB' | 'GB' | 'TB';
  amountLimitValue?: number;
  emails: string[];
}

// 料金計算用の定数（PricingPresentation.tsxから）
const PRICING_RATES = {
  processing: 0.00001, // $0.00001 per B
  storage: 0.000001,   // $0.000001 per B
};

// 単位変換用の定数
const UNIT_TO_BYTES = {
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
};

/**
 * 使用量制限作成ページのプレゼンテーションコンポーネント
 */
export default function UsageLimitPresentation({ 
  userAttributes, 
  dictionary, 
  locale 
}: UsageLimitPresentationProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UsageLimitFormData>({
    exceedAction: 'notify', // 初期値：通知のみ
    limitType: 'usage', // 初期値：データ量制限
    usageLimitValue: undefined,
    usageUnit: 'MB',
    amountLimitValue: undefined,
    emails: []
  });
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // データ量から金額を計算する関数
  const calculateAmountFromUsage = (value: number, unit: 'MB' | 'GB' | 'TB'): number => {
    const bytes = value * UNIT_TO_BYTES[unit];
    // 処理料金のみで計算（保管料は月額なので除外）
    return bytes * PRICING_RATES.processing;
  };

  // 金額からデータ量を計算する関数
  const calculateUsageFromAmount = (amount: number, unit: 'MB' | 'GB' | 'TB'): number => {
    // 処理料金のみで計算
    const bytes = amount / PRICING_RATES.processing;
    return bytes / UNIT_TO_BYTES[unit];
  };

  // 換算値を表示する関数
  const getConversionText = (): string => {
    if (formData.limitType === 'usage' && formData.usageLimitValue && formData.usageUnit) {
      const amount = calculateAmountFromUsage(formData.usageLimitValue, formData.usageUnit);
      return `${dictionary.label.conversionApproximate} $${amount.toFixed(6)} (${dictionary.label.processingFeeOnly})`;
    } else if (formData.limitType === 'amount' && formData.amountLimitValue) {
      const usage = calculateUsageFromAmount(formData.amountLimitValue, formData.usageUnit || 'MB');
      return `${dictionary.label.conversionApproximate} ${usage.toFixed(2)} ${formData.usageUnit || 'MB'} (${dictionary.label.processingFeeOnly})`;
    }
    return '';
  };

  // バリデーション
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 超過時のアクションのチェック（初期値があるので基本的にはエラーにならない）
    if (!formData.exceedAction) {
      newErrors.exceedAction = dictionary.alert.selectExceedAction;
    }

    // 制限タイプのチェック（初期値があるので基本的にはエラーにならない）
    if (!formData.limitType) {
      newErrors.limitType = dictionary.alert.selectLimitType;
    }

    // 制限値のチェック（選択したタイプに応じて）
    if (formData.limitType === 'usage') {
      if (!formData.usageLimitValue || formData.usageLimitValue <= 0) {
        newErrors.usageLimitValue = dictionary.alert.dataLimitValueRequired;
      } else if (formData.usageLimitValue > 1000000) {
        newErrors.usageLimitValue = dictionary.alert.dataLimitValueMax;
      }
    } else if (formData.limitType === 'amount') {
      if (!formData.amountLimitValue || formData.amountLimitValue <= 0) {
        newErrors.amountLimitValue = dictionary.alert.amountLimitValueRequired;
      } else if (formData.amountLimitValue > 100000) {
        newErrors.amountLimitValue = dictionary.alert.amountLimitValueMax;
      }
    }

    // メールアドレスのチェック
    if (formData.emails.length === 0) {
      newErrors.emails = dictionary.alert.minOneEmailRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // メールアドレス追加
  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    // より厳密なメールアドレス形式チェック
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, emailInput: dictionary.alert.invalidEmail }));
      return;
    }

    // 重複チェック（大文字小文字を区別しない）
    if (formData.emails.some(existingEmail => existingEmail.toLowerCase() === email.toLowerCase())) {
      setErrors(prev => ({ ...prev, emailInput: dictionary.alert.emailAlreadyAdded }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, email]
    }));
    setEmailInput('');
    setErrors(prev => ({ ...prev, emailInput: '', emails: '' }));
  };

  // メールアドレス削除
  const handleRemoveEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter(e => e !== email)
    }));
    if (formData.emails.length <= 1) {
      setErrors(prev => ({ ...prev, emails: '' }));
    }
  };

  // 保存処理
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await createUsageLimit({
        customerId: userAttributes.customerId,
        usageLimitValue: formData.limitType === 'usage' ? formData.usageLimitValue : undefined,
        usageUnit: formData.limitType === 'usage' ? formData.usageUnit : undefined,
        amountLimitValue: formData.limitType === 'amount' ? formData.amountLimitValue : undefined,
        exceedAction: formData.exceedAction as 'notify' | 'restrict',
        emails: formData.emails
      });

      if (result.success) {
        const successMessage = formData.exceedAction === 'notify' 
          ? dictionary.alert.notifyLimitCreated 
          : dictionary.alert.restrictLimitCreated;
        // より良いUXのためにtoastやモーダルを使用することを推奨
        alert(successMessage);
        router.push(`/${locale}/account/limit-usage`); // 制限管理ページに戻る
      } else {
        console.error('Usage limit creation failed:', result.message);
        alert(`${dictionary.alert.errorPrefix} ${result.message}`);
      }
    } catch (error: any) {
      console.error('Unexpected error during usage limit creation:', error);
      alert(`${dictionary.alert.unexpectedError} ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 戻る処理
  const handleBack = () => {
    router.push(`/${locale}/account/limit-usage`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              isIconOnly
              variant="light"
              onPress={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
            </Button>
            <FaExclamationTriangle className="text-3xl text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">
              {dictionary.label.createUsageLimitTitle}
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-12">
            {dictionary.label.createUsageLimitDescription}
          </p>
        </div>

        {/* フォームカード */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FaCog className="text-primary" />
              <h2 className="text-xl font-semibold">{dictionary.label.usageLimitSettings}</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* 超過時のアクション選択 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.label.exceedActionTitle}</h3>
              <Select
                placeholder={dictionary.label.selectAction}
                selectedKeys={formData.exceedAction ? [formData.exceedAction] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData(prev => ({ ...prev, exceedAction: selectedKey as 'notify' | 'restrict' | '' }));
                  setErrors(prev => ({ ...prev, exceedAction: '' }));
                }}
                isInvalid={!!errors.exceedAction}
                errorMessage={errors.exceedAction}
                disallowEmptySelection
                variant="bordered"
                className="max-w-md"
              >
                <SelectItem key="notify" className="bg-white">{dictionary.label.notifyOnlyOption}</SelectItem>
                <SelectItem key="restrict" className="bg-white">{dictionary.label.restrictOption}</SelectItem>
              </Select>
              {formData.exceedAction && (
                <p className="text-sm text-gray-500 mt-2">
                  {formData.exceedAction === 'notify' 
                    ? dictionary.label.notifyOnlyDescription
                    : dictionary.label.restrictDescription
                  }
                </p>
              )}
            </div>

            {/* 制限タイプ選択 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.label.limitTypeTitle}</h3>
              <Select
                placeholder={dictionary.label.selectLimitType}
                selectedKeys={formData.limitType ? [formData.limitType] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData(prev => ({ 
                    ...prev, 
                    limitType: selectedKey as 'usage' | 'amount' | '',
                    // 選択が変わったら他の値をクリア
                    usageLimitValue: selectedKey === 'usage' ? prev.usageLimitValue : undefined,
                    amountLimitValue: selectedKey === 'amount' ? prev.amountLimitValue : undefined
                  }));
                  setErrors(prev => ({ ...prev, limitType: '', usageLimitValue: '', amountLimitValue: '' }));
                }}
                isInvalid={!!errors.limitType}
                errorMessage={errors.limitType}
                disallowEmptySelection
                variant="bordered"
                className="max-w-md"
              >
                <SelectItem key="usage" className="bg-white">{dictionary.label.dataLimitOption}</SelectItem>
                <SelectItem key="amount" className="bg-white">{dictionary.label.amountLimitOption}</SelectItem>
              </Select>
              {formData.limitType && (
                <p className="text-sm text-gray-500 mt-2">
                  {formData.limitType === 'usage' 
                    ? dictionary.label.dataLimitDescription
                    : dictionary.label.amountLimitDescription
                  }
                </p>
              )}
            </div>

            {/* 制限値設定（選択されたタイプのみ表示） */}
            {formData.limitType === 'usage' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.label.dataLimitTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder={dictionary.label.enterLimitValue}
                    value={formData.usageLimitValue?.toString() || ''}
                    onValueChange={(value) => {
                      const numValue = value ? Number(value) : undefined;
                      // マイナス値を防ぐ
                      if (numValue !== undefined && numValue < 0) {
                        return;
                      }
                      setFormData(prev => ({ 
                        ...prev, 
                        usageLimitValue: numValue
                      }));
                      setErrors(prev => ({ ...prev, usageLimitValue: '' }));
                    }}
                    isInvalid={!!errors.usageLimitValue}
                    errorMessage={errors.usageLimitValue}
                    min="0"
                  />
                  <Select
                    placeholder={dictionary.label.unit}
                    selectedKeys={formData.usageUnit ? [formData.usageUnit] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setFormData(prev => ({ ...prev, usageUnit: selectedKey as 'MB' | 'GB' | 'TB' }));
                    }}
                    disallowEmptySelection
                    variant="bordered"
                  >
                    <SelectItem key="MB" className="bg-white">{dictionary.label.unitMB}</SelectItem>
                    <SelectItem key="GB" className="bg-white">{dictionary.label.unitGB}</SelectItem>
                    <SelectItem key="TB" className="bg-white">{dictionary.label.unitTB}</SelectItem>
                  </Select>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    {dictionary.label.monthlyDataLimitDescription}
                  </p>
                  {getConversionText() && (
                    <p className="text-sm text-blue-600 font-medium">
                      {getConversionText()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {formData.limitType === 'amount' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.label.amountLimitTitle}</h3>
                <Input
                  type="number"
                  placeholder={dictionary.label.enterAmountValue}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  value={formData.amountLimitValue?.toString() || ''}
                  onValueChange={(value) => {
                    const numValue = value ? Number(value) : undefined;
                    // マイナス値を防ぐ
                    if (numValue !== undefined && numValue < 0) {
                      return;
                    }
                    setFormData(prev => ({ 
                      ...prev, 
                      amountLimitValue: numValue
                    }));
                    setErrors(prev => ({ ...prev, amountLimitValue: '' }));
                  }}
                  isInvalid={!!errors.amountLimitValue}
                  errorMessage={errors.amountLimitValue}
                  className="max-w-md"
                  min="0"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    {dictionary.label.monthlyAmountLimitDescription}
                  </p>
                  {formData.amountLimitValue && (
                    <p className="text-sm text-blue-600 font-medium">
                      {dictionary.label.conversionApproximate} {calculateUsageFromAmount(formData.amountLimitValue, 'MB').toFixed(2)} MB ({dictionary.label.processingFeeOnly})
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 通知先メールアドレス */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{dictionary.label.notificationSettingsTitle}</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={dictionary.label.enterEmailPlaceholder}
                    value={emailInput}
                    onValueChange={(value) => {
                      setEmailInput(value);
                      setErrors(prev => ({ ...prev, emailInput: '' }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                    isInvalid={!!errors.emailInput}
                    errorMessage={errors.emailInput}
                    className="flex-1"
                  />
                  <Button 
                    onPress={handleAddEmail}
                    color="primary"
                    variant="flat"
                  >
                    {dictionary.label.add}
                  </Button>
                </div>

                {/* 追加されたメールアドレス一覧 */}
                {formData.emails.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {dictionary.label.notificationEmailCount.replace('{count}', formData.emails.length.toString())}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.emails.map((email) => (
                        <Chip
                          key={email}
                          onClose={() => handleRemoveEmail(email)}
                          variant="flat"
                          color="primary"
                          className="max-w-xs"
                        >
                          <span className="truncate">{email}</span>
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {errors.emails && (
                  <p className="text-danger-600 text-sm">{errors.emails}</p>
                )}

                <p className="text-sm text-gray-500">
                  {formData.exceedAction === 'notify' 
                    ? dictionary.label.notifyOnlyEmailDescription
                    : dictionary.label.restrictEmailDescription
                  }
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* アクションボタン */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="light" 
            onPress={handleBack}
            startContent={<FaTimes />}
          >
            {dictionary.label.cancelButton}
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            isLoading={isLoading}
            startContent={!isLoading && <FaSave />}
          >
            {formData.exceedAction === 'notify' ? dictionary.label.createNotifyLimit : dictionary.label.createRestrictLimit}
          </Button>
        </div>
      </div>
    </div>
  );
}