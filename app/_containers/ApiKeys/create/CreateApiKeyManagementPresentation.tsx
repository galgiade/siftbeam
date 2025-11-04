'use client'

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Input, Textarea, Alert, Spinner, Divider, Autocomplete, AutocompleteItem } from "@heroui/react"
import { createAPIKeyAction } from "@/app/lib/actions/api-key-actions"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { APIKeyLocale } from '@/app/dictionaries/apiKey/apiKey.d.ts';
import type { Policy } from '@/app/lib/actions/policy-api';
import { KeyIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CreateApiKeyManagementPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: APIKeyLocale;
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
      errors.apiName = dictionary.create.validation.apiNameRequired;
    } else if (createForm.apiName.trim().length < 3) {
      errors.apiName = dictionary.create.validation.apiNameMinLength;
    }

    if (!createForm.policyId.trim()) {
      errors.policyId = dictionary.create.validation.policyRequired;
    }

    if (createForm.description.trim().length > 500) {
      errors.description = dictionary.create.validation.descriptionMaxLength;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // APIキー作成
  const handleCreateApiKey = async () => {
    if (!validateForm()) {
      setError(dictionary.create.validation.formHasErrors);
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
        setSuccess(dictionary.create.messages.createSuccess);
        
        // 3秒後にAPIキー管理ページにリダイレクト
        setTimeout(() => {
          router.push(`/${userAttributes.locale}/account/api-keys`);
        }, 3000);
      } else {
        setError(result.message || dictionary.create.messages.createFailed);
      }
    } catch (error: any) {
      setError(dictionary.create.messages.createError);
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
          <span>{dictionary.create.backToList}</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <KeyIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dictionary.create.pageTitle}</h1>
          <p className="text-sm text-gray-600">{dictionary.create.pageDescription}</p>
        </div>
      </div>

      {/* 通知 */}
      {error && (
        <Alert color="danger" title={dictionary.create.errorTitle} description={error} onClose={clearNotifications} />
      )}
      {success && (
        <Alert 
          color="success" 
          title={dictionary.create.successTitle} 
          description={`${success} ${dictionary.create.successDescription}`}
          startContent={<CheckCircleIcon className="w-5 h-5" />}
        />
      )}

      {/* 作成フォーム */}
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold">{dictionary.create.formTitle}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-6">
            {/* API名 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {dictionary.create.fields.apiName} <span className="text-red-500">{dictionary.create.required}</span>
              </label>
              <Input
                placeholder={dictionary.create.fields.apiNamePlaceholder}
                value={createForm.apiName}
                onChange={(e) => setCreateForm(prev => ({ ...prev, apiName: e.target.value }))}
                isInvalid={!!validationErrors.apiName}
                errorMessage={validationErrors.apiName}
                variant="bordered"
              />
              <p className="text-xs text-gray-500 mt-1">{dictionary.create.fields.apiNameHelp}</p>
            </div>

            {/* 説明 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {dictionary.create.fields.apiDescription}
              </label>
              <Textarea
                placeholder={dictionary.create.fields.apiDescriptionPlaceholder}
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                isInvalid={!!validationErrors.description}
                errorMessage={validationErrors.description}
                variant="bordered"
                maxRows={4}
              />
              <p className="text-xs text-gray-500 mt-1">{dictionary.create.fields.apiDescriptionHelp}</p>
            </div>

            {/* ポリシー選択 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {dictionary.create.fields.policy} <span className="text-red-500">{dictionary.create.required}</span>
              </label>
              <Autocomplete
                placeholder={dictionary.create.fields.policyPlaceholder}
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
              <p className="text-xs text-gray-500 mt-1">{dictionary.create.fields.policyHelp}</p>
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
              <h3 className="font-semibold text-blue-800 mb-2">{dictionary.create.noticeTitle}</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {dictionary.create.noticeItems.autoGenerated}</li>
                <li>• {dictionary.create.noticeItems.activeOnCreation}</li>
                <li>• {dictionary.create.noticeItems.selectExistingPolicy}</li>
                <li>• {dictionary.create.noticeItems.autoTags}</li>
                <li className="ml-4">- {dictionary.create.noticeItems.projectTag}</li>
                <li className="ml-4">- {dictionary.create.noticeItems.customerIdTag}</li>
                <li className="ml-4">- {dictionary.create.noticeItems.environmentTag}</li>
                <li className="ml-4">- {dictionary.create.noticeItems.versionTag}</li>
                <li>• {dictionary.create.noticeItems.editableAfterCreation}</li>
                <li>• {dictionary.create.noticeItems.auditLogged}</li>
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
          {dictionary.create.reset}
        </Button>
        <Button
          color="primary"
          onPress={handleCreateApiKey}
          isLoading={loading}
          startContent={!loading ? <KeyIcon className="w-4 h-4" /> : undefined}
          size="lg"
        >
          {loading ? dictionary.create.submitting : dictionary.create.submit}
        </Button>
      </div>

      {/* 成功時のローディング表示 */}
      {success && (
        <Card className="bg-green-50 border border-green-200">
          <CardBody>
            <div className="flex items-center justify-center gap-3">
              <Spinner color="success" size="sm" />
              <p className="text-green-700">{dictionary.create.redirecting}</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
