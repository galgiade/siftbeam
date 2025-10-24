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
    setFormData({
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
    if (emailInput.trim() && !formData.emails.includes(emailInput.trim())) {
      setFormData(prev => ({
        ...prev,
        emails: [...prev.emails, emailInput.trim()]
      }));
      setEmailInput('');
    }
  };

  // メールアドレス削除
  const handleRemoveEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter(e => e !== email)
    }));
  };

  // 保存処理
  const handleSave = async () => {
    if (formData.emails.length === 0) {
      alert('通知先メールアドレスを1つ以上入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      if (isCreating) {
        // 新規作成
        const result = await createUsageLimit({
          customerId: userAttributes.customerId,
          usageLimitValue: formData.usageLimitValue,
          usageUnit: formData.usageUnit,
          amountLimitValue: formData.amountLimitValue,
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
          usageLimitValue: formData.usageLimitValue,
          usageUnit: formData.usageUnit,
          amountLimitValue: formData.amountLimitValue,
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
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader>
              {isCreating ? '新規使用量制限作成' : '使用量制限編集'}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* データ量制限 */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="データ量制限値"
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
                    label="単位"
                    selectedKeys={formData.usageUnit ? [formData.usageUnit] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setFormData(prev => ({ ...prev, usageUnit: selectedKey as 'MB' | 'GB' | 'TB' }));
                    }}
                  >
                    <SelectItem key="MB">MB</SelectItem>
                    <SelectItem key="GB">GB</SelectItem>
                    <SelectItem key="TB">TB</SelectItem>
                  </Select>
                </div>

                {/* 金額制限 */}
                <Input
                  label="金額制限値 (USD)"
                  type="number"
                  placeholder="例: 50"
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

                {/* アクション */}
                <Select
                  label="超過時のアクション"
                  selectedKeys={[formData.exceedAction]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setFormData(prev => ({ ...prev, exceedAction: selectedKey as 'notify' | 'restrict' }));
                  }}
                >
                  <SelectItem key="notify">通知</SelectItem>
                  <SelectItem key="restrict">利用停止</SelectItem>
                </Select>

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
                      onKeyPress={(e) => {
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
                        onClose={() => handleRemoveEmail(email)}
                        variant="flat"
                        color="primary"
                      >
                        {email}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
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