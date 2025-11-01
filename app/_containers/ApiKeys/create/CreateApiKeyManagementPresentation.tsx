'use client'

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Input, Textarea, Alert, Spinner, Divider, Autocomplete, AutocompleteItem } from "@heroui/react"
import { createAPIKeyAction } from "@/app/lib/actions/api-key-actions"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import type { Policy } from '@/app/lib/actions/policy-api';
import { KeyIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CreateApiKeyManagementPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
  policies: Policy[];
}

export default function CreateApiKeyManagementPresentation({
  userAttributes,
  dictionary,
  policies
}: CreateApiKeyManagementPresentationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // フォーム状態
  const [createForm, setCreateForm] = useState({
    apiName: '',
    description: '',
    policyId: ''
  });

  // バリデーション状態
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 通知をクリア
  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  // フォームバリデーション
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!createForm.apiName.trim()) {
      errors.apiName = 'API名は必須です';
    } else if (createForm.apiName.trim().length < 3) {
      errors.apiName = 'API名は3文字以上で入力してください';
    }

    if (!createForm.policyId.trim()) {
      errors.policyId = 'ポリシーを選択してください';
    }

    if (createForm.description.trim().length > 500) {
      errors.description = '説明は500文字以内で入力してください';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // APIキー作成
  const handleCreateApiKey = async () => {
    if (!validateForm()) {
      setError('入力内容に不備があります。エラーを確認してください。');
      return;
    }

    setLoading(true);
    clearNotifications();

    try {
      const result = await createAPIKeyAction({
        apiName: createForm.apiName.trim(),
        description: createForm.description.trim() || undefined,
        policyId: createForm.policyId.trim()
      });

      if (result.success && result.apiKey) {
        setSuccess('APIキーが正常に作成されました');
        
        // 3秒後にAPIキー管理ページにリダイレクト
        setTimeout(() => {
          router.push(`/${userAttributes.locale}/account/api-keys`);
        }, 3000);
      } else {
        setError(result.message || 'APIキーの作成に失敗しました');
      }
    } catch (error: any) {
      setError('APIキーの作成中にエラーが発生しました');
      console.error('Create API key error:', error);
    } finally {
      setLoading(false);
    }
  };

  // フォームリセット
  const handleReset = () => {
    setCreateForm({
      apiName: '',
      description: '',
      policyId: ''
    });
    setValidationErrors({});
    clearNotifications();
  };

  // 通知の自動クリア
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/${userAttributes.locale}/account/api-keys`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>APIキー管理に戻る</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <KeyIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">新しいAPIキーを作成</h1>
          <p className="text-sm text-gray-600">新しいAPIキーの情報を入力してください</p>
        </div>
      </div>

      {/* 通知 */}
      {error && (
        <Alert color="danger" title="エラー" description={error} onClose={clearNotifications} />
      )}
      {success && (
        <Alert 
          color="success" 
          title="作成完了" 
          description={`${success} 3秒後にAPIキー管理ページに移動します...`}
          startContent={<CheckCircleIcon className="w-5 h-5" />}
        />
      )}

      {/* 作成フォーム */}
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold">APIキー情報</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-6">
            {/* API名 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                API名 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="APIキーの名前を入力してください"
                value={createForm.apiName}
                onChange={(e) => setCreateForm(prev => ({ ...prev, apiName: e.target.value }))}
                isInvalid={!!validationErrors.apiName}
                errorMessage={validationErrors.apiName}
                variant="bordered"
              />
              <p className="text-xs text-gray-500 mt-1">APIキーを識別するための名前です（3文字以上）</p>
            </div>

            {/* 説明 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                説明
              </label>
              <Textarea
                placeholder="APIキーの用途や説明を入力してください（任意）"
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                isInvalid={!!validationErrors.description}
                errorMessage={validationErrors.description}
                variant="bordered"
                maxRows={4}
              />
              <p className="text-xs text-gray-500 mt-1">APIキーの用途や詳細な説明（500文字以内）</p>
            </div>

            {/* ポリシー選択 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                ポリシー <span className="text-red-500">*</span>
              </label>
              <Autocomplete
                placeholder="ポリシーを選択してください"
                selectedKey={createForm.policyId}
                onSelectionChange={(key) => setCreateForm(prev => ({ ...prev, policyId: key as string }))}
                isInvalid={!!validationErrors.policyId}
                errorMessage={validationErrors.policyId}
                variant="bordered"
                defaultItems={policies}
                classNames={{
                  base: "bg-white",
                  listboxWrapper: "bg-white",
                  popoverContent: "bg-white"
                }}
              >
                {(policy) => (
                  <AutocompleteItem key={policy.policyId} textValue={policy.policyName} className="bg-white">
                    <div className="flex flex-col">
                      <span className="font-medium">{policy.policyName}</span>
                      {policy.description && (
                        <span className="text-xs text-gray-500">{policy.description}</span>
                      )}
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <p className="text-xs text-gray-500 mt-1">このAPIキーに関連付けるポリシーを選択してください</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 注意事項 */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardBody>
          <div className="flex items-start gap-3">
            <KeyIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">APIキー作成時の注意事項</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• APIキーは作成時にAWS API Gatewayで自動的に生成されます</li>
                <li>• APIキーは作成後、有効状態で開始されます</li>
                <li>• ポリシーは既存のポリシーから選択してください</li>
                <li>• 以下のタグが自動的に付与されます：</li>
                <li className="ml-4">- Project: siftbeam</li>
                <li className="ml-4">- customerId: お客様のID</li>
                <li className="ml-4">- environment: Production</li>
                <li className="ml-4">- version: v1.0</li>
                <li>• 作成後はAPIキー管理ページで編集・削除が可能です</li>
                <li>• APIキーの使用状況は監査ログで追跡されます</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* アクションボタン */}
      <div className="flex justify-end gap-4">
        <Button
          variant="light"
          onPress={handleReset}
          isDisabled={loading}
        >
          リセット
        </Button>
        <Button
          color="primary"
          onPress={handleCreateApiKey}
          isLoading={loading}
          startContent={!loading ? <KeyIcon className="w-4 h-4" /> : undefined}
          size="lg"
        >
          {loading ? 'APIキーを作成中...' : 'APIキーを作成'}
        </Button>
      </div>

      {/* 成功時のローディング表示 */}
      {success && (
        <Card className="bg-green-50 border border-green-200">
          <CardBody>
            <div className="flex items-center justify-center gap-3">
              <Spinner color="success" size="sm" />
              <p className="text-green-700">APIキー管理ページに移動中...</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
