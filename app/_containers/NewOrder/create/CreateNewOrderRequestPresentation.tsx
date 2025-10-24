'use client'

import { useState, useActionState, useEffect, startTransition, useCallback } from "react"
import { Button, Card, Input, Textarea, Select, SelectItem } from "@heroui/react"
import { createNewOrderRequest } from "@/app/lib/actions/neworder-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { useRouter } from "next/navigation"
import { FaRocket } from "react-icons/fa6"
import FileUploader from "@/app/_components/FileUploader"
import { v4 as uuidv4 } from 'uuid'

interface CreateNewOrderRequestPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// 新規オーダーリクエスト作成フォームのデータ型
interface CreateNewOrderRequestFormData {
  newOrderRequestId: string;
  dataType: 'structured' | 'unstructured' | 'mixed' | 'other';
  modelType: 'classification' | 'regression' | 'clustering' | 'other';
  subject: string;
  description: string;
  fileKeys: string[];
}

// データタイプの選択肢
const dataTypeOptions = [
  { key: 'structured', label: '構造化データ（CSV、データベース等）' },
  { key: 'unstructured', label: '非構造化データ（テキスト、画像等）' },
  { key: 'mixed', label: '混合データ（構造化+非構造化）' },
  { key: 'other', label: 'その他' },
];

// モデルタイプの選択肢
const modelTypeOptions = [
  { key: 'classification', label: '分類・判定（良品/不良品、カテゴリ分け等）' },
  { key: 'regression', label: '予測・推定（売上予測、需要予測等）' },
  { key: 'clustering', label: 'グループ分け・パターン発見（顧客分類、異常検知等）' },
  { key: 'other', label: 'その他・相談したい' },
];

export default function CreateNewOrderRequestPresentation({ 
  userAttributes, 
  dictionary 
}: CreateNewOrderRequestPresentationProps) {
  const router = useRouter();
  
  // フォームデータの状態管理（UUIDをクライアントサイドで生成）
  const [formData, setFormData] = useState<CreateNewOrderRequestFormData>({
    newOrderRequestId: '', // 初期値は空文字
    dataType: 'structured',
    modelType: 'classification',
    subject: "",
    description: "",
    fileKeys: []
  });

  // クライアントサイドでUUIDを生成
  useEffect(() => {
    if (!formData.newOrderRequestId) {
      setFormData(prev => ({
        ...prev,
        newOrderRequestId: uuidv4()
      }));
    }
  }, [formData.newOrderRequestId]);

  // クライアントサイドバリデーションエラー
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  
  // ハイドレーション対応
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Server Actionの状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        // FormDataから値を取得
        const newOrderRequestIdStr = formData.get('newOrderRequestId') as string;
        const fileKeysStr = formData.get('fileKeys') as string;
        
        console.log('Raw FormData values:', {
          newOrderRequestId: newOrderRequestIdStr,
          fileKeys: fileKeysStr,
          dataType: formData.get('dataType'),
          modelType: formData.get('modelType'),
          subject: formData.get('subject'),
          description: formData.get('description')
        });

        const createNewOrderRequestInput = {
          'neworder-requestId': newOrderRequestIdStr ? JSON.parse(newOrderRequestIdStr) : undefined,
          customerId: userAttributes.customerId,
          userId: userAttributes.sub,
          userName: userAttributes.preferred_username || 'ユーザー',
          dataType: formData.get('dataType') as 'structured' | 'unstructured' | 'mixed' | 'other',
          modelType: formData.get('modelType') as 'classification' | 'regression' | 'clustering' | 'other',
          subject: formData.get('subject') as string,
          description: formData.get('description') as string,
          fileKeys: fileKeysStr ? JSON.parse(fileKeysStr) : [],
        };

        console.log('Creating new order request with data:', createNewOrderRequestInput);
        
        const result = await createNewOrderRequest(createNewOrderRequestInput);
        console.log('CreateNewOrderRequest result:', result);
        
        // 結果を明示的に返す
        if (result && typeof result === 'object') {
          return {
            success: result.success || false,
            message: result.message || '',
            errors: result.errors || {},
            data: result.data || undefined
          };
        }
        
        // 予期しない結果の場合
        console.error('Unexpected result format:', result);
        return {
          success: false,
          message: '予期しない応答形式です。',
          errors: { general: ['API応答の形式が正しくありません。'] },
          data: undefined
        };
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
    console.log('State changed:', state);
    if (state.success) {
      console.log('New order request created successfully:', state.data);
      // データがなくても成功の場合はリダイレクト
      handleNewOrderRequestCreationComplete();
    }
  }, [state.success, state.message, state.data]);
  
  // 新規オーダーリクエスト作成完了時の処理
  const handleNewOrderRequestCreationComplete = () => {
    // 作成成功後は新規オーダー管理ページにリダイレクト
    router.push(`/${userAttributes.locale}/account/new-order`);
  };

  // フォームフィールドの値変更ハンドラー
  const handleFieldChange = (field: keyof CreateNewOrderRequestFormData, value: string | string[]) => {
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
      errors.subject = '件名は必須です。';
    }

    if (!formData.description.trim()) {
      errors.description = 'プロジェクトの詳細は必須です。';
    }

    if (!formData.dataType) {
      errors.dataType = 'データタイプを選択してください。';
    }

    if (!formData.modelType) {
      errors.modelType = '分析タイプを選択してください。';
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
    
    // ファイルキーとnewOrderRequestIdをJSONとして追加
    formDataObj.set('fileKeys', JSON.stringify(formData.fileKeys));
    formDataObj.set('newOrderRequestId', JSON.stringify(formData.newOrderRequestId));
    
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
          <div className="flex items-center gap-3 mb-8">
            <FaRocket className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold">新規オーダーリクエストを作成</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* データタイプ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                データタイプ
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                name="dataType"
                selectedKeys={[formData.dataType]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as 'structured' | 'unstructured' | 'mixed' | 'other';
                  handleFieldChange('dataType', selectedKey);
                }}
                variant="bordered"
                placeholder="データタイプを選択"
                isInvalid={!!(clientErrors.dataType || getErrorMessage('dataType'))}
                errorMessage={clientErrors.dataType || getErrorMessage('dataType')}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {dataTypeOptions.map(option => (
                  <SelectItem key={option.key} className="bg-white hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* モデルタイプ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                どのような分析をご希望ですか？
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-1">
                実現したい内容に最も近いものをお選びください
              </p>
              <Select
                name="modelType"
                selectedKeys={[formData.modelType]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as 'classification' | 'regression' | 'clustering' | 'other';
                  handleFieldChange('modelType', selectedKey);
                }}
                variant="bordered"
                placeholder="分析タイプを選択してください"
                isInvalid={!!(clientErrors.modelType || getErrorMessage('modelType'))}
                errorMessage={clientErrors.modelType || getErrorMessage('modelType')}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {modelTypeOptions.map(option => (
                  <SelectItem key={option.key} className="bg-white hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* 件名 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                件名
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                name="subject"
                value={formData.subject}
                onValueChange={(value) => handleFieldChange('subject', value)}
                placeholder="プロジェクトの件名を入力"
                variant="bordered"
                isInvalid={!!(clientErrors.subject || getErrorMessage('subject'))}
                errorMessage={clientErrors.subject || getErrorMessage('subject')}
              />
            </div>

            {/* プロジェクトの詳細 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                プロジェクトの詳細
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onValueChange={(value) => handleFieldChange('description', value)}
                placeholder="プロジェクトの詳細を具体的に記述してください。目的、データの概要、期待する成果などを含めてください。"
                variant="bordered"
                minRows={5}
                isInvalid={!!(clientErrors.description || getErrorMessage('description'))}
                errorMessage={clientErrors.description || getErrorMessage('description')}
              />
            </div>

            {/* ファイル添付 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                ファイル添付
                <span className="text-gray-500 ml-2 text-xs">(任意)</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                データサンプル、仕様書、参考資料などをアップロードできます
              </p>
              {formData.newOrderRequestId && (
                <FileUploader
                  customerId={userAttributes.customerId}
                  userId={userAttributes.sub}
                  supportRequestId={formData.newOrderRequestId} // 事前生成されたUUID（neworder用パスで使用）
                  context="request" // リクエストファイル
                  onFilesUploaded={handleFilesUploaded}
                  maxFiles={10}
                  maxFileSize={50}
                  disabled={isPending}
                />
              )}
              {!formData.newOrderRequestId && (
                <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                  ファイルアップロード準備中...
                </div>
              )}
              {formData.fileKeys.length > 0 && (
                <p className="text-xs text-gray-600">
                  {formData.fileKeys.length}個のファイルが選択されています
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
                <div>
                  <p className="text-green-700 text-sm font-normal leading-relaxed">{state.message}</p>
                  <p className="text-green-600 text-xs mt-1">リダイレクト中...</p>
                </div>
              </div>
            )}

            {/* デバッグ情報（開発時のみ、クライアントサイドのみ） */}
            {process.env.NODE_ENV === 'development' && isMounted && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <details>
                  <summary className="cursor-pointer font-medium">デバッグ情報</summary>
                  <pre className="mt-2 overflow-auto">
                    {JSON.stringify({
                      isPending,
                      state: {
                        success: state.success,
                        message: state.message,
                        hasErrors: !!state.errors && Object.keys(state.errors).length > 0
                      },
                      formData: {
                        ...formData,
                        newOrderRequestId: formData.newOrderRequestId ? '[UUID Generated]' : '[Not Generated]'
                      }
                    }, null, 2)}
                  </pre>
                </details>
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
                startContent={!isPending ? <FaRocket size={16} /> : undefined}
              >
                {isPending ? '新規オーダーリクエスト作成中...' : '新規オーダーリクエストを作成'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
