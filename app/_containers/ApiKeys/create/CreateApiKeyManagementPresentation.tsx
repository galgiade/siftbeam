'use client'

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Input, Textarea, Alert, Spinner, Divider } from "@heroui/react"
import { createAPIKeyAction } from "@/app/lib/actions/api-key-actions"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { KeyIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CreateApiKeyManagementPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

export default function CreateApiKeyManagementPresentation({
  userAttributes,
  dictionary
}: CreateApiKeyManagementPresentationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // フォーム状態
  const [createForm, setCreateForm] = useState({
    apiName: '',
    description: '',
    gatewayApiKeyId: '',
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

    if (!createForm.gatewayApiKeyId.trim()) {
      errors.gatewayApiKeyId = 'Gateway APIキーIDは必須です';
    }

    if (!createForm.policyId.trim()) {
      errors.policyId = 'ポリシーIDは必須です';
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
        gatewayApiKeyId: createForm.gatewayApiKeyId.trim(),
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
      gatewayApiKeyId: '',
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
              <Input
                label="API名"
                placeholder="APIキーの名前を入力してください"
                value={createForm.apiName}
                onChange={(e) => setCreateForm(prev => ({ ...prev, apiName: e.target.value }))}
                isRequired
                isInvalid={!!validationErrors.apiName}
                errorMessage={validationErrors.apiName}
                description="APIキーを識別するための名前です（3文字以上）"
              />
            </div>

            {/* 説明 */}
            <div>
              <Textarea
                label="説明"
                placeholder="APIキーの用途や説明を入力してください（任意）"
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                isInvalid={!!validationErrors.description}
                errorMessage={validationErrors.description}
                description="APIキーの用途や詳細な説明（500文字以内）"
                maxRows={4}
              />
            </div>

            {/* Gateway APIキーID */}
            <div>
              <Input
                label="Gateway APIキーID"
                placeholder="AWS API GatewayのAPIキーIDを入力してください"
                value={createForm.gatewayApiKeyId}
                onChange={(e) => setCreateForm(prev => ({ ...prev, gatewayApiKeyId: e.target.value }))}
                isRequired
                isInvalid={!!validationErrors.gatewayApiKeyId}
                errorMessage={validationErrors.gatewayApiKeyId}
                description="AWS API Gatewayで生成されたAPIキーのIDです"
              />
            </div>

            {/* ポリシーID */}
            <div>
              <Input
                label="ポリシーID"
                placeholder="関連するポリシーのIDを入力してください"
                value={createForm.policyId}
                onChange={(e) => setCreateForm(prev => ({ ...prev, policyId: e.target.value }))}
                isRequired
                isInvalid={!!validationErrors.policyId}
                errorMessage={validationErrors.policyId}
                description="このAPIキーに関連付けるポリシーのIDです"
              />
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
                <li>• APIキーは作成後、有効状態で開始されます</li>
                <li>• Gateway APIキーIDは事前にAWS API Gatewayで作成しておく必要があります</li>
                <li>• ポリシーIDは既存のポリシーのIDを指定してください</li>
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
