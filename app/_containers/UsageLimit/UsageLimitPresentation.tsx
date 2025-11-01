'use client'

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { FaExclamationTriangle, FaCog, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { UsageLimit } from '@/app/lib/actions/usage-limits-api';
import { createUsageLimit, updateUsageLimit, deleteUsageLimit } from '@/app/lib/actions/usage-limits-api';
import { useRouter } from 'next/navigation';

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
  dictionary: any;
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
      alert('有効なメールアドレスを入力してください。');
      return;
    }

    // 重複チェック
    if (formData.emails.some(existingEmail => existingEmail.toLowerCase() === email.toLowerCase())) {
      alert('このメールアドレスは既に追加されています。');
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
      alert('通知先メールアドレスは最低1つ必要です。');
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
      alert('通知先メールアドレスを1つ以上入力してください。');
      return;
    }

    // 制限値のバリデーション
    if (formData.limitType === 'usage') {
      if (!formData.usageLimitValue || formData.usageLimitValue <= 0) {
        alert('データ量制限値は0より大きい値を入力してください。');
        return;
      }
    } else if (formData.limitType === 'amount') {
      if (!formData.amountLimitValue || formData.amountLimitValue <= 0) {
        alert('金額制限値は0より大きい値を入力してください。');
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
          alert('使用量制限が正常に作成されました。');
          window.location.reload(); // ページをリロードして最新データを取得
        } else {
          alert(`エラー: ${result.message}`);
        }
      } else if (editingLimit) {
        // 更新
        const result = await updateUsageLimit({
          'usage-limitsId': editingLimit['usage-limitsId'],
          usageLimitValue: formData.limitType === 'usage' ? formData.usageLimitValue : undefined,
          usageUnit: formData.limitType === 'usage' ? formData.usageUnit : undefined,
          amountLimitValue: formData.limitType === 'amount' ? formData.amountLimitValue : undefined,
          exceedAction: formData.exceedAction,
          emails: formData.emails
        });

        if (result.success) {
          alert('使用量制限が正常に更新されました。');
          window.location.reload(); // ページをリロードして最新データを取得
        } else {
          alert(`エラー: ${result.message}`);
        }
      }
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
      onClose();
      resetForm();
    }
  };

  // 削除処理
  const handleDelete = async (limit: UsageLimit) => {
    if (!confirm('この使用量制限を削除しますか？')) {
      return;
    }

    try {
      const result = await deleteUsageLimit(limit['usage-limitsId']);
      if (result.success) {
        alert('使用量制限が正常に削除されました。');
        window.location.reload(); // ページをリロードして最新データを取得
      } else {
        alert(`エラー: ${result.message}`);
      }
    } catch (error: any) {
      alert(`エラー: ${error.message}`);
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
    return parts.length > 0 ? parts.join(' または ') : '制限なし';
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
                使用量制限管理
              </h1>
            </div>
            <Button
              color="primary"
              variant="solid"
              startContent={<FaPlus />}
              onPress={handleCreate}
            >
              制限を作成
            </Button>
          </div>
          <p className="text-gray-600 text-lg">
            データ処理量と金額の制限を設定し、超過時のアクションを管理できます。
          </p>
        </div>

        {/* 通知制限セクション */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FaCog className="text-warning" />
              <h2 className="text-xl font-semibold">通知制限</h2>
              <Chip size="sm" color="warning" variant="flat">通知</Chip>
            </div>
          </CardHeader>
          <CardBody>
            {usageLimits.notifyLimits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                <p>通知制限が設定されていません</p>
                <p className="text-sm">制限を設定すると、超過時に通知が送信されます。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usageLimits.notifyLimits.map((limit) => (
                  <div key={limit['usage-limitsId']} className="flex items-center justify-between p-4 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">制限値: {formatLimitValue(limit)}</p>
                          <p className="text-sm text-gray-600">
                            通知先: {limit.emails.join(', ')}
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
              <h2 className="text-xl font-semibold">利用停止制限</h2>
              <Chip size="sm" color="danger" variant="flat">利用停止</Chip>
            </div>
          </CardHeader>
          <CardBody>
            {usageLimits.restrictLimits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-4" />
                <p>利用停止制限が設定されていません</p>
                <p className="text-sm">制限を設定すると、超過時にサービスが停止されます。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usageLimits.restrictLimits.map((limit) => (
                  <div key={limit['usage-limitsId']} className="flex items-center justify-between p-4 bg-danger-50 rounded-lg border border-danger-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">制限値: {formatLimitValue(limit)}</p>
                          <p className="text-sm text-gray-600">
                            通知先: {limit.emails.join(', ')}
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
              {isCreating ? '新規使用量制限作成' : '使用量制限編集'}
            </ModalHeader>
            <ModalBody className="bg-white">
              <div className="space-y-4">
                {/* 制限タイプ選択 */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    制限タイプ
                  </label>
                  <Select
                    placeholder="制限タイプを選択"
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
                    <SelectItem key="usage" className="bg-white">データ量制限</SelectItem>
                    <SelectItem key="amount" className="bg-white">金額制限</SelectItem>
                  </Select>
                </div>

                {/* データ量制限（選択されたタイプのみ表示） */}
                {formData.limitType === 'usage' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      データ量制限値
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="例: 100"
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
                        <SelectItem key="MB" className="bg-white">MB</SelectItem>
                        <SelectItem key="GB" className="bg-white">GB</SelectItem>
                        <SelectItem key="TB" className="bg-white">TB</SelectItem>
                      </Select>
                    </div>
                  </div>
                )}

                {/* 金額制限（選択されたタイプのみ表示） */}
                {formData.limitType === 'amount' && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      金額制限値 (USD)
                    </label>
                    <Input
                      type="number"
                      placeholder="例: 50"
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
                    超過時のアクション
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
                    <SelectItem key="notify" className="bg-white">通知</SelectItem>
                    <SelectItem key="restrict" className="bg-white">利用停止</SelectItem>
                  </Select>
                </div>

                {/* 通知先メールアドレス */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    通知先メールアドレス
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="メールアドレスを入力"
                      value={emailInput}
                      onValueChange={setEmailInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                    />
                    <Button onPress={handleAddEmail}>追加</Button>
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
                      ※ 通知先メールアドレスは最低1つ必要です。
                    </p>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-white">
              <Button variant="light" onPress={onClose}>
                キャンセル
              </Button>
              <Button 
                color="primary" 
                onPress={handleSave}
                isLoading={isLoading}
                startContent={!isLoading && <FaSave />}
              >
                {isCreating ? '作成' : '更新'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}