'use client'

import { useState, useActionState, useEffect, startTransition } from "react"
import { Button, Card, Input, Textarea, Chip } from "@heroui/react"
import { createPolicy } from "@/app/lib/actions/policy-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { useRouter } from "next/navigation"
import { FaPlus } from "react-icons/fa6"

interface CreatePolicyManagementPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// ポリシー作成フォームのデータ型
interface CreatePolicyFormData {
  policyName: string;
  description: string;
  acceptedFileTypes: string[];
}

// 一般的なファイル形式の選択肢
const commonFileTypes = [
  { key: 'image/jpeg', label: 'JPEG画像' },
  { key: 'image/png', label: 'PNG画像' },
  { key: 'image/gif', label: 'GIF画像' },
  { key: 'image/webp', label: 'WebP画像' },
  { key: 'application/pdf', label: 'PDFファイル' },
  { key: 'application/msword', label: 'Wordファイル (.doc)' },
  { key: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Wordファイル (.docx)' },
  { key: 'application/vnd.ms-excel', label: 'Excelファイル (.xls)' },
  { key: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excelファイル (.xlsx)' },
  { key: 'text/plain', label: 'テキストファイル' },
  { key: 'text/csv', label: 'CSVファイル' },
  { key: 'application/json', label: 'JSONファイル' },
  { key: 'application/zip', label: 'ZIPファイル' },
  { key: 'video/mp4', label: 'MP4動画' },
  { key: 'audio/mpeg', label: 'MP3音声' },
];

export default function CreatePolicyManagementPresentation({ 
  userAttributes, 
  dictionary 
}: CreatePolicyManagementPresentationProps) {
  const router = useRouter();
  
  // フォームデータの状態管理
  const [formData, setFormData] = useState<CreatePolicyFormData>({
    policyName: "",
    description: "",
    acceptedFileTypes: []
  });

  // クライアントサイドバリデーションエラー
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Server Actionの状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const createPolicyInput = {
          policyName: formData.get('policyName') as string,
          description: formData.get('description') as string,
          customerId: userAttributes.customerId,
          acceptedFileTypes: JSON.parse(formData.get('acceptedFileTypes') as string || '[]'),
        };

        console.log('Creating policy with data:', createPolicyInput);
        console.log('UserAttributes:', userAttributes);
        
        const result = await createPolicy(createPolicyInput);
        console.log('CreatePolicy result:', result);
        
        return result;
      } catch (error: any) {
        console.error('Error in form action:', error);
        return {
          success: false,
          message: 'フォーム送信中にエラーが発生しました。',
          errors: { general: [error?.message || '不明なエラー'] },
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
      console.log('Policy created successfully:', state.data);
      handlePolicyCreationComplete();
    }
  }, [state.success, state.data]);
  
  // ポリシー作成完了時の処理
  const handlePolicyCreationComplete = () => {
    // 作成成功後はポリシー管理ページにリダイレクト
    router.push(`/${userAttributes.locale}/account/policy-management`);
  };

  // フォームフィールドの値変更ハンドラー
  const handleFieldChange = (field: keyof CreatePolicyFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (clientErrors[field]) {
      setClientErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ファイル形式の追加
  const addFileType = (fileType: string) => {
    if (!formData.acceptedFileTypes.includes(fileType)) {
      const newFileTypes = [...formData.acceptedFileTypes, fileType];
      handleFieldChange('acceptedFileTypes', newFileTypes);
    }
  };

  // ファイル形式の削除
  const removeFileType = (fileType: string) => {
    const newFileTypes = formData.acceptedFileTypes.filter(type => type !== fileType);
    handleFieldChange('acceptedFileTypes', newFileTypes);
  };

  // クライアントサイドバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.policyName.trim()) {
      errors.policyName = 'ポリシー名は必須です。';
    }

    if (!formData.description.trim()) {
      errors.description = '説明は必須です。';
    }

    if (formData.acceptedFileTypes.length === 0) {
      errors.acceptedFileTypes = '許可するファイル形式を少なくとも1つ選択してください。';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // フォーム送信ハンドラー
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Client errors:', clientErrors);
    
    if (!validateForm()) {
      console.log('Validation failed, not submitting');
      return;
    }

    // FormDataを作成してServer Actionを実行
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    // acceptedFileTypesをJSONとして追加
    formDataObj.set('acceptedFileTypes', JSON.stringify(formData.acceptedFileTypes));
    
    // FormDataの内容をログ出力
    console.log('FormData contents:');
    for (const [key, value] of formDataObj.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // startTransition内でformActionを呼び出し
    startTransition(() => {
      formAction(formDataObj);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">新しいポリシーを作成</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ポリシー名 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                ポリシー名
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                name="policyName"
                value={formData.policyName}
                onValueChange={(value) => handleFieldChange('policyName', value)}
                placeholder="ポリシー名を入力"
                variant="bordered"
                isInvalid={!!(clientErrors.policyName || getErrorMessage('policyName'))}
                errorMessage={clientErrors.policyName || getErrorMessage('policyName')}
              />
            </div>

            {/* 説明 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                説明
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onValueChange={(value) => handleFieldChange('description', value)}
                placeholder="ポリシーの説明を入力"
                variant="bordered"
                minRows={3}
                isInvalid={!!(clientErrors.description || getErrorMessage('description'))}
                errorMessage={clientErrors.description || getErrorMessage('description')}
              />
            </div>

            {/* 許可するファイル形式 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                許可するファイル形式
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              {/* 選択されたファイル形式 */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem] p-2 border rounded-lg bg-gray-50">
                {formData.acceptedFileTypes.length > 0 ? (
                  formData.acceptedFileTypes.map((fileType) => (
                    <Chip
                      key={fileType}
                      onClose={() => removeFileType(fileType)}
                      variant="flat"
                      color="primary"
                    >
                      {commonFileTypes.find(ft => ft.key === fileType)?.label || fileType}
                    </Chip>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">ファイル形式を選択してください</span>
                )}
              </div>
              
              {/* ファイル形式選択 */}
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {commonFileTypes
                  .filter(ft => !formData.acceptedFileTypes.includes(ft.key))
                  .map((fileType) => (
                    <Button
                      key={fileType.key}
                      size="sm"
                      variant="light"
                      onPress={() => addFileType(fileType.key)}
                      className="justify-start text-left"
                    >
                      <FaPlus size={12} className="mr-2" />
                      {fileType.label}
                    </Button>
                  ))}
              </div>
              
              {(clientErrors.acceptedFileTypes || getErrorMessage('acceptedFileTypes')) && (
                <div className="text-red-500 text-sm">
                  {clientErrors.acceptedFileTypes || getErrorMessage('acceptedFileTypes')}
                </div>
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
                    <p className="text-red-600 text-xs font-medium">詳細エラー:</p>
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
                  <summary className="text-xs text-red-500 cursor-pointer">デバッグ情報を表示</summary>
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
                キャンセル
              </Button>
              <Button
                type="submit"
                color="primary"
                className="flex-1"
                isLoading={isPending}
                isDisabled={isPending}
              >
                ポリシーを作成
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
