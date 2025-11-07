'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { FaExclamationTriangle, FaCog, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { UsageLimit } from '@/app/lib/actions/usage-limits-api';
import { createUsageLimit, updateUsageLimit, deleteUsageLimit } from '@/app/lib/actions/usage-limits-api';
import { useRouter } from 'next/navigation';
import { UsageLimitLocale } from '@/app/dictionaries/usageLimit/usage-limit.d';

interface UsageLimitPresentationProps {
  userAttributes: {
    sub: string;
    preferred_username: string;
    customerId: string;
    role: string;
    locale: string;
    paymentMethodId?: string;
  };
  usageLimits: {
    notifyLimits: UsageLimit[];
    restrictLimits: UsageLimit[];
  };
  dictionary: UsageLimitLocale;
  locale: string;
}

interface UsageLimitFormData {
  limitType: 'usage' | 'amount';
  usageLimitValue?: number;
  usageUnit?: 'MB' | 'GB' | 'TB';
  amountLimitValue?: number;
  exceedAction: 'notify' | 'restrict';
  emails: string[];
}

/**
 * 使用量制限管理ページのプレゼンテーションコンポーネント
 */
export default function UsageLimitPresentation({ 
  userAttributes, 
  usageLimits, 
  dictionary, 
  locale 
}: UsageLimitPresentationProps) {
  const router = useRouter();
  const [editingLimit, setEditingLimit] = useState<UsageLimit | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<UsageLimitFormData>({
    limitType: 'usage',
    usageLimitValue: undefined,
    usageUnit: 'MB',
    amountLimitValue: undefined,
    exceedAction: 'notify',
    emails: []
  });
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // フォームデータをリセット
  const resetForm = () => {
    setFormData({
      limitType: 'usage',
      usageLimitValue: undefined,
      usageUnit: 'MB',
      amountLimitValue: undefined,
      exceedAction: 'notify',
      emails: []
    });
    setEmailInput('');
    setEditingLimit(null);
    setIsCreating(false);
  };

  // 編集開始
  const handleEdit = (limit: UsageLimit) => {
    setEditingLimit(limit);
    // データ量制限か金額制限かを判定
    const limitType = limit.usageLimitValue !== undefined ? 'usage' : 'amount';
    setFormData({
      limitType,
      usageLimitValue: limit.usageLimitValue,
      usageUnit: limit.usageUnit || 'MB',
      amountLimitValue: limit.amountLimitValue,
      exceedAction: limit.exceedAction,
      emails: [...limit.emails]
    });
    setEmailInput('');
    setIsCreating(false);
    onOpen();
  };

  // 新規作成開始（統一された作成ページへ遷移）
  const handleCreate = () => {
    router.push(`/${locale}/account/limit-usage/create`);
  };

  // メールアドレス追加
  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    // メールアドレス形式チェック
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      alert(dictionary.alert.invalidEmail);
      return;
    }

    // 重複チェック
    if (formData.emails.some(existingEmail => existingEmail.toLowerCase() === email.toLowerCase())) {
      alert(dictionary.alert.emailAlreadyAdded);
      return;
    }

    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, email]
    }));
    setEmailInput('');
  };

  // メールアドレス削除（最低1つは必要）
  const handleRemoveEmail = (email: string) => {
    if (formData.emails.length <= 1) {
      alert(dictionary.alert.minOneEmail);
      return;
    }
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter(e => e !== email)
    }));
  };

  // 保存処理
  const handleSave = async () => {
    // バリデーション
    if (formData.emails.length === 0) {
      alert(dictionary.alert.minOneEmail);
      return;
    }

    // 制限値のバリデーション
    if (formData.limitType === 'usage') {
      if (!formData.usageLimitValue || formData.usageLimitValue <= 0) {
        alert(dictionary.alert.enterPositiveDataLimit);
        return;
      }
    } else if (formData.limitType === 'amount') {
      if (!formData.amountLimitValue || formData.amountLimitValue <= 0) {
        alert(dictionary.alert.enterPositiveAmountLimit);
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isCreating) {
        // 新規作成
        const result = await createUsageLimit({
          customerId: userAttributes.customerId,
          usageLimitValue: formData.limitType === 'usage' ? formData.usageLimitValue : undefined,
          usageUnit: formData.limitType === 'usage' ? formData.usageUnit : undefined,
          amountLimitValue: formData.limitType === 'amount' ? formData.amountLimitValue : undefined,
          exceedAction: formData.exceedAction,
          emails: formData.emails
        });

        if (result.success) {
          alert(dictionary.alert.createSuccess);
          window.location.reload(); // ページをリロードして最新データを取得
        } else {
          alert(`${dictionary.label.errorOccurred}: ${result.message}`);
        }
      } else if (editingLimit) {
        // 更新
        const result = await updateUsageLimit({
          usageLimitId: editingLimit.usageLimitId,
          usageLimitValue: formData.limitType === 'usage' ? formData.usageLimitValue : undefined,
          usageUnit: formData.limitType === 'usage' ? formData.usageUnit : undefined,
          amountLimitValue: formData.limitType === 'amount' ? formData.amountLimitValue : undefined,
          exceedAction: formData.exceedAction,
          emails: formData.emails
        });

        if (result.success) {
          alert(dictionary.alert.updateSuccess);
          window.location.reload(); // ページをリロードして最新データを取得
        } else {
          alert(`${dictionary.label.errorOccurred}: ${result.message}`);
        }
      }
    } catch (error: any) {
      alert(`${dictionary.label.errorOccurred}: ${error.message}`);
    } finally {
      setIsLoading(false);
      onClose();
      resetForm();
    }
  };

  // 削除処理
  const handleDelete = async (limit: UsageLimit) => {
    if (!confirm(dictionary.alert.deleteConfirm)) {
      return;
    }

    try {
      const result = await deleteUsageLimit(limit.usageLimitId);
      if (result.success) {
        alert(dictionary.alert.deleteSuccess);
        window.location.reload(); // ページをリロードして最新データを取得
      } else {
        alert(`${dictionary.label.errorOccurred}: ${result.message}`);
      }
    } catch (error: any) {
      alert(`${dictionary.label.errorOccurred}: ${error.message}`);
    }
  };

  // 制限値の表示フォーマット
  const formatLimitValue = (limit: UsageLimit) => {
    const parts = [];
    if (limit.usageLimitValue && limit.usageUnit) {
      parts.push(`${limit.usageLimitValue} ${limit.usageUnit}`);
    }
    if (limit.amountLimitValue) {
      parts.push(`$${limit.amountLimitValue}`);
    }
    return parts.length > 0 ? parts.join(` ${dictionary.label.orSeparator} `) : dictionary.label.noLimit;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-3xl text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">
                {dictionary.label.usageLimitManagement}
              </h1>
            </div>
            <Button
              color="primary"
              variant="solid"
              startContent={<FaPlus />}
              onPress={handleCreate}
            >
              {dictionary.label.createLimit}
            </Button>
          </div>
          <p className="text-gray-600 text-lg">
            {dictionary.label.usageLimitDescription}
          </p>
        </div>

        {/* 通知制限セクション */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FaCog className="text-warning" />
              <h2 className="text-xl font-semibold">{dictionary.label.notifyLimit}</h2>
              <Chip size="sm" color="warning" variant="flat">{dictionary.label.notify}</Chip>
            </div>
          </CardHeader>
          <CardBody>
            {usageLimits.notifyLimits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                <p>{dictionary.label.noNotifyLimits}</p>
                <p className="text-sm">{dictionary.label.notifyLimitDescription}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usageLimits.notifyLimits.map((limit) => (
                  <div key={limit.usageLimitId} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{dictionary.label.limitValue}: {formatLimitValue(limit)}</p>
                          <p className="text-sm text-gray-600">
                            {dictionary.label.notificationRecipients}: {limit.emails.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEdit(limit)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(limit)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* 利用停止制限セクション */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-danger" />
              <h2 className="text-xl font-semibold">{dictionary.label.restrictLimit}</h2>
              <Chip size="sm" color="danger" variant="flat">{dictionary.label.restrict}</Chip>
            </div>
          </CardHeader>
          <CardBody>
            {usageLimits.restrictLimits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                <p>{dictionary.label.noRestrictLimits}</p>
                <p className="text-sm">{dictionary.label.restrictLimitDescription}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usageLimits.restrictLimits.map((limit) => (
                  <div key={limit.usageLimitId} className="flex items-center justify-between p-4 bg-danger-50 rounded-lg border border-danger-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{dictionary.label.limitValue}: {formatLimitValue(limit)}</p>
                          <p className="text-sm text-gray-600">
                            {dictionary.label.notificationRecipients}: {limit.emails.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEdit(limit)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(limit)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* 編集/作成モーダル */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose} 
          size="2xl"
          classNames={{
            base: "bg-white",
            backdrop: "bg-black/50"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="bg-white">
              {isCreating ? dictionary.label.createNewLimit : dictionary.label.editLimit}
            </ModalHeader>
            <ModalBody className="bg-white">
              <div className="space-y-4">
                {/* 制限タイプ選択 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {dictionary.label.limitType}
                  </label>
                  <Select
                    placeholder={dictionary.label.selectLimitType}
                    selectedKeys={formData.limitType ? [formData.limitType] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setFormData(prev => ({ 
                        ...prev, 
                        limitType: selectedKey as 'usage' | 'amount',
                        // 選択が変わったら他の値をクリア
                        usageLimitValue: selectedKey === 'usage' ? prev.usageLimitValue : undefined,
                        amountLimitValue: selectedKey === 'amount' ? prev.amountLimitValue : undefined
                      }));
                    }}
                    disallowEmptySelection
                    variant="bordered"
                  >
                    <SelectItem key="usage" className="bg-white">{dictionary.label.dataLimit}</SelectItem>
                    <SelectItem key="amount" className="bg-white">{dictionary.label.amountLimit}</SelectItem>
                  </Select>
                </div>

                {/* データ量制限（選択されたタイプのみ表示） */}
                {formData.limitType === 'usage' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {dictionary.label.dataLimitValue}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder={dictionary.label.dataLimitPlaceholder}
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
                        }}
                        min="0"
                      />
                      <Select
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
                  </div>
                )}

                {/* 金額制限（選択されたタイプのみ表示） */}
                {formData.limitType === 'amount' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {dictionary.label.amountLimitValue}
                    </label>
                    <Input
                      type="number"
                      placeholder={dictionary.label.amountLimitPlaceholder}
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
                      }}
                      min="0"
                    />
                  </div>
                )}

                {/* アクション */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {dictionary.label.exceedAction}
                  </label>
                  <Select
                    selectedKeys={[formData.exceedAction]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setFormData(prev => ({ ...prev, exceedAction: selectedKey as 'notify' | 'restrict' }));
                    }}
                    disallowEmptySelection
                    variant="bordered"
                  >
                    <SelectItem key="notify" className="bg-white">{dictionary.label.notify}</SelectItem>
                    <SelectItem key="restrict" className="bg-white">{dictionary.label.restrict}</SelectItem>
                  </Select>
                </div>

                {/* 通知先メールアドレス */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {dictionary.label.addEmailAddress}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder={dictionary.label.emailPlaceholder}
                      value={emailInput}
                      onValueChange={setEmailInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                    />
                    <Button onPress={handleAddEmail}>{dictionary.label.add}</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.emails.map((email) => (
                      <Chip
                        key={email}
                        onClose={formData.emails.length > 1 ? () => handleRemoveEmail(email) : undefined}
                        variant="flat"
                        color="primary"
                      >
                        {email}
                      </Chip>
                    ))}
                  </div>
                  {formData.emails.length === 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {dictionary.label.minOneEmailRequired}
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-white">
              <Button variant="light" onPress={onClose}>
                {dictionary.label.cancel}
              </Button>
              <Button 
                color="primary" 
                onPress={handleSave}
                isLoading={isLoading}
                startContent={!isLoading && <FaSave />}
              >
                {isCreating ? dictionary.label.create : dictionary.label.update}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}