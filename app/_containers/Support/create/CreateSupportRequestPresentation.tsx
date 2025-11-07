'use client'

import { useState, useActionState, useEffect, startTransition, useCallback } from "react"
import { Button, Card, Input, Textarea, Select, SelectItem } from "@heroui/react"
import { createSupportRequest } from "@/app/lib/actions/support-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { SupportCenterLocale } from '@/app/dictionaries/supportCenter/supportCenter.d.ts';
import type { CommonLocale } from '@/app/dictionaries/common/common.d.ts';
import { useRouter } from "next/navigation"
import { FaLifeRing } from "react-icons/fa6"
import FileUploader from "@/app/_components/FileUploader"
import { v4 as uuidv4 } from 'uuid'

interface CreateSupportRequestPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: SupportCenterLocale;
  commonDictionary: CommonLocale;
}

// サポートリクエスト作成フォームのデータ型
interface CreateSupportRequestFormData {
  supportRequestId: string;
  issueType: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  subject: string;
  description: string;
  fileKeys: string[];
}

// 問題タイプの選択肢を取得する関数
const getIssueTypeOptions = (dictionary: SupportCenterLocale) => [
  { key: 'technical', label: dictionary.label.issueTypeTechnicalOption },
  { key: 'billing', label: dictionary.label.issueTypeBillingOption },
  { key: 'feature', label: dictionary.label.issueTypeFeatureOption },
  { key: 'bug', label: dictionary.label.issueTypeBugOption },
  { key: 'other', label: dictionary.label.issueTypeOtherOption },
];

export default function CreateSupportRequestPresentation({ 
  userAttributes, 
  dictionary,
  commonDictionary
}: CreateSupportRequestPresentationProps) {
  const router = useRouter();
  
  // フォームデータの状態管理（UUIDを事前生成）
  const [formData, setFormData] = useState<CreateSupportRequestFormData>(() => ({
    supportRequestId: uuidv4(),
    issueType: 'technical',
    subject: "",
    description: "",
    fileKeys: []
  }));

  // クライアントサイドバリデーションエラー
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Server Actionの状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const createSupportRequestInput = {
          supportRequestId: JSON.parse(formData.get('supportRequestId') as string),
          customerId: userAttributes.customerId,
          userId: userAttributes.sub,
          userName: userAttributes.preferred_username || dictionary.label.customer,
          issueType: formData.get('issueType') as 'technical' | 'billing' | 'feature' | 'bug' | 'other',
          subject: formData.get('subject') as string,
          description: formData.get('description') as string,
          fileKeys: JSON.parse(formData.get('fileKeys') as string || '[]'),
        };

        console.log('Creating support request with data:', createSupportRequestInput);
        console.log('UserAttributes:', userAttributes);
        
        const result = await createSupportRequest(createSupportRequestInput);
        console.log('CreateSupportRequest result:', result);
        
        return result;
      } catch (error: any) {
        console.error('Error in form action:', error);
        return {
          success: false,
          message: dictionary.alert.formSubmissionError,
          errors: { general: [error?.message || dictionary.alert.unknownError] },
          data: undefined
        };
      }
    },
    {
      success: false,
      message: '',
      errors: {},
      data: undefined
    }
  );

  // エラーメッセージを安全に取得するヘルパー関数
  const getErrorMessage = (field: string): string => {
    if (state.errors && typeof state.errors === 'object' && field in state.errors) {
      const error = state.errors[field as keyof typeof state.errors];
      return Array.isArray(error) ? error[0] : String(error);
    }
    return '';
  };

  // 成功時の処理
  useEffect(() => {
    if (state.success && state.data) {
      console.log('Support request created successfully:', state.data);
      handleSupportRequestCreationComplete();
    }
  }, [state.success, state.data]);
  
  // サポートリクエスト作成完了時の処理
  const handleSupportRequestCreationComplete = () => {
    // 作成成功後はサポート管理ページにリダイレクト
    router.push(`/${userAttributes.locale}/account/support`);
  };

  // フォームフィールドの値変更ハンドラー
  const handleFieldChange = (field: keyof CreateSupportRequestFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (clientErrors[field]) {
      setClientErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ファイルアップロード完了ハンドラー（メモ化）
  const handleFilesUploaded = useCallback((fileKeys: string[]) => {
    setFormData(prev => ({ ...prev, fileKeys }));
  }, []);

  // クライアントサイドバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      errors.subject = dictionary.alert.subjectRequired;
    }

    if (!formData.description.trim()) {
      errors.description = dictionary.alert.descriptionRequired;
    }

    if (!formData.issueType) {
      errors.issueType = dictionary.alert.issueTypeRequired;
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // FormDataを作成してServer Actionを実行
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    // ファイルキーとsupportRequestIdをJSONとして追加
    formDataObj.set('fileKeys', JSON.stringify(formData.fileKeys));
    formDataObj.set('supportRequestId', JSON.stringify(formData.supportRequestId));
    
    // startTransition内でformActionを呼び出し
    startTransition(() => {
      formAction(formDataObj);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold">{dictionary.label.createSupportRequest}</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 問題タイプ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.issueTypeLabel2}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Select
                name="issueType"
                selectedKeys={[formData.issueType]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as 'technical' | 'billing' | 'feature' | 'bug' | 'other';
                  handleFieldChange('issueType', selectedKey);
                }}
                variant="bordered"
                placeholder={dictionary.label.selectIssueType}
                isInvalid={!!(clientErrors.issueType || getErrorMessage('issueType'))}
                errorMessage={clientErrors.issueType || getErrorMessage('issueType')}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {getIssueTypeOptions(dictionary).map(option => (
                  <SelectItem key={option.key} className="bg-white hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* 件名 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.subjectLabel}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Input
                name="subject"
                value={formData.subject}
                onValueChange={(value) => handleFieldChange('subject', value)}
                placeholder={dictionary.label.subjectPlaceholder2}
                variant="bordered"
                isInvalid={!!(clientErrors.subject || getErrorMessage('subject'))}
                errorMessage={clientErrors.subject || getErrorMessage('subject')}
              />
            </div>

            {/* 問題の詳細 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.problemDetailsLabel}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onValueChange={(value) => handleFieldChange('description', value)}
                placeholder={dictionary.label.problemDetailsPlaceholder}
                variant="bordered"
                minRows={5}
                isInvalid={!!(clientErrors.description || getErrorMessage('description'))}
                errorMessage={clientErrors.description || getErrorMessage('description')}
              />
            </div>

            {/* ファイル添付 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.fileAttachment}
                <span className="text-gray-500 ml-2 text-xs">{dictionary.label.optionalLabel}</span>
              </label>
              <FileUploader
                customerId={userAttributes.customerId}
                userId={userAttributes.sub}
                supportRequestId={formData.supportRequestId} // 事前生成されたUUID
                context="request" // リクエストファイル
                onFilesUploaded={handleFilesUploaded}
                maxFiles={5}
                maxFileSize={10}
                disabled={isPending}
                commonDictionary={commonDictionary}
                uploadType="support"
              />
              {formData.fileKeys.length > 0 && (
                <p className="text-xs text-gray-600">
                  {formData.fileKeys.length}{dictionary.label.filesSelected}
                </p>
              )}
            </div>

            {/* エラーメッセージ */}
            {state.message && !state.success && (
              <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm font-normal leading-relaxed">{state.message}</p>
                </div>
                
                {/* 詳細エラー表示 */}
                {state.errors && Object.keys(state.errors).length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-red-600 text-xs font-medium">{dictionary.label.detailedErrors}</p>
                    {Object.entries(state.errors).map(([field, fieldErrors]) => (
                      <div key={field} className="text-xs text-red-600">
                        <span className="font-medium">{field}:</span>
                        <span className="ml-2">
                          {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* デバッグ情報 */}
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer">{dictionary.label.showDebugInfo}</summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                    {JSON.stringify(state, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* 成功メッセージ */}
            {state.success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 text-sm font-normal leading-relaxed">{state.message}</p>
              </div>
            )}

            {/* ボタン */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="bordered"
                onPress={() => router.back()}
                className="flex-1"
              >
                {dictionary.label.cancelButton}
              </Button>
              <Button
                type="submit"
                color="primary"
                className="flex-1"
                isLoading={isPending}
                isDisabled={isPending}
              >
                {isPending ? dictionary.label.creatingRequest : dictionary.label.createRequestButton}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
