'use client'

import { useState, useActionState, useEffect, startTransition } from "react"
import { Button, Card, Input, Select, SelectItem } from "@heroui/react"
import { createUser } from "@/app/lib/actions/user-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserManagementLocale } from '@/app/dictionaries/user-management/user-management.d.ts';
import { useRouter } from "next/navigation"
import VerificationForm from "@/app/_components/VerificationForm"

interface CreateUserManagementPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: UserManagementLocale;
}

// ユーザー作成フォームのデータ型
interface CreateUserFormData {
  userName: string;
  email: string;
  department: string;
  position: string;
  role: 'admin' | 'user';
  locale: string;
  password: string;
}

export default function CreateUserManagementPresentation({ 
  userAttributes, 
  dictionary 
}: CreateUserManagementPresentationProps) {
  const router = useRouter();
  
  // フォームデータの状態管理
  const [formData, setFormData] = useState<CreateUserFormData>({
    userName: "",
    email: "",
    department: "",
    position: "",
    role: "user",
    locale: userAttributes.locale || "en", // localeがundefinedの場合のフォールバック
    password: ""
  });

  // クライアントサイドバリデーションエラー
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  
  // 2段階認証の状態管理
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    verificationId: string;
    email: string;
  } | null>(null);

  // Server Actionの状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const createUserInput = {
          userName: formData.get('userName') as string,
          email: formData.get('email') as string,
          department: formData.get('department') as string,
          position: formData.get('position') as string,
          customerId: userAttributes.customerId,
          role: formData.get('role') as 'admin' | 'user',
          locale: formData.get('locale') as string,
          password: formData.get('password') as string,
        };

        console.log('Creating user with data:', createUserInput);
        console.log('UserAttributes:', userAttributes);
        
        const result = await createUser(createUserInput);
        console.log('CreateUser result:', result);
        
        return result;
      } catch (error: any) {
        console.error('Error in form action:', error);
        return {
          success: false,
          message: dictionary.label.errorOccurredGeneric,
          errors: { general: [error?.message || dictionary.label.unknownError] },
          data: undefined,
          verificationId: undefined,
          email: undefined
        };
      }
    },
    {
      success: false,
      message: '',
      errors: {},
      data: undefined,
      verificationId: undefined,
      email: undefined
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
      console.log('User created successfully:', state.data);
      
      // 2段階認証が必要な場合
      if (state.verificationId && state.email) {
        setVerificationData({
          verificationId: state.verificationId,
          email: state.email
        });
        setShowVerification(true);
      } else {
        // 2段階認証が不要な場合（既存の処理）
        handleUserCreationComplete();
      }
    }
  }, [state.success, state.data, state.verificationId, state.email, userAttributes.locale]);
  
  // ユーザー作成完了時の処理
  const handleUserCreationComplete = () => {
    // 2段階認証成功後は再読み込みしてクリーンな状態にする
    window.location.reload();
  };

  // フォームフィールドの値変更ハンドラー
  const handleFieldChange = (field: keyof CreateUserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (clientErrors[field]) {
      setClientErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // クライアントサイドバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      errors.userName = dictionary.alert.required.replace('{label}', dictionary.label.userName);
    }

    if (!formData.email.trim()) {
      errors.email = dictionary.alert.required.replace('{label}', dictionary.label.email);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = dictionary.alert.invalidEmail;
      }
    }

    if (!formData.department.trim()) {
      errors.department = dictionary.alert.required.replace('{label}', dictionary.label.department);
    }

    if (!formData.position.trim()) {
      errors.position = dictionary.alert.required.replace('{label}', dictionary.label.position);
    }

    if (!formData.password.trim()) {
      errors.password = dictionary.alert.passwordRequired;
    } else if (formData.password.length < 8) {
      errors.password = dictionary.alert.passwordPolicy;
    } else if (!/[a-z]/.test(formData.password)) {
      // 少なくとも1つの小文字を含む
      errors.password = dictionary.alert.passwordLower;
    } else if (!/[A-Z]/.test(formData.password)) {
      // 少なくとも1つの大文字を含む
      errors.password = dictionary.alert.passwordUpper;
    } else if (!/\d/.test(formData.password)) {
      // 少なくとも1つの数字を含む
      errors.password = dictionary.alert.passwordNumber;
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

  // ロケール選択肢
  const localeOptions = [
    { key: 'ja', label: '日本語' },
    { key: 'en', label: 'English' },
    { key: 'ko', label: '한국어' },
    { key: 'zh', label: '中文' },
    { key: 'es', label: 'Español' },
    { key: 'fr', label: 'Français' },
    { key: 'de', label: 'Deutsch' },
    { key: 'pt', label: 'Português' },
    { key: 'id', label: 'Bahasa Indonesia' },
  ];

  // ロール選択肢
  const roleOptions = [
    { key: 'user', label: dictionary.label.roleUser },
    { key: 'admin', label: dictionary.label.roleAdmin },
  ];

  // 2段階認証フォームを表示
  if (showVerification && verificationData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <VerificationForm
            verificationId={verificationData.verificationId}
            email={verificationData.email}
            locale={userAttributes.locale || "en"}
            onVerificationSuccess={{ type: 'reload' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">{dictionary.label.createNewUser}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ユーザー名 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.userName}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Input
                name="userName"
                value={formData.userName}
                onValueChange={(value) => handleFieldChange('userName', value)}
                placeholder={dictionary.label.userNamePlaceholder}
                variant="bordered"
                isInvalid={!!(clientErrors.userName || getErrorMessage('userName'))}
                errorMessage={clientErrors.userName || getErrorMessage('userName')}
              />
            </div>

            {/* メールアドレス */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.email}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onValueChange={(value) => handleFieldChange('email', value)}
                placeholder={dictionary.label.emailPlaceholder}
                variant="bordered"
                isInvalid={!!(clientErrors.email || getErrorMessage('email'))}
                errorMessage={clientErrors.email || getErrorMessage('email')}
              />
            </div>

            {/* 部署 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.department}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Input
                name="department"
                value={formData.department}
                onValueChange={(value) => handleFieldChange('department', value)}
                placeholder={dictionary.label.departmentPlaceholder}
                variant="bordered"
                isInvalid={!!(clientErrors.department || getErrorMessage('department'))}
                errorMessage={clientErrors.department || getErrorMessage('department')}
              />
            </div>

            {/* 役職 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.position}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Input
                name="position"
                value={formData.position}
                onValueChange={(value) => handleFieldChange('position', value)}
                placeholder={dictionary.label.positionPlaceholder}
                variant="bordered"
                isInvalid={!!(clientErrors.position || getErrorMessage('position'))}
                errorMessage={clientErrors.position || getErrorMessage('position')}
              />
            </div>

            {/* ロール */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.role}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Select
                name="role"
                selectedKeys={[formData.role]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as 'admin' | 'user';
                  handleFieldChange('role', selectedKey);
                }}
                variant="bordered"
                placeholder={dictionary.label.rolePlaceholder2}
                disallowEmptySelection={true}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {roleOptions.map(option => (
                  <SelectItem key={option.key} className="bg-white hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* 言語設定 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.locale}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Select
                name="locale"
                selectedKeys={[formData.locale]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleFieldChange('locale', selectedKey);
                }}
                variant="bordered"
                placeholder={dictionary.label.localePlaceholder}
                disallowEmptySelection={true}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {localeOptions.map(option => (
                  <SelectItem key={option.key} className="bg-white hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            
            {/* パスワード */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.password}
                <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
              </label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onValueChange={(value) => handleFieldChange('password', value)}
                placeholder={dictionary.label.passwordPlaceholder}
                variant="bordered"
                isInvalid={!!(clientErrors.password || getErrorMessage('password'))}
                errorMessage={clientErrors.password || getErrorMessage('password')}
              />
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
                {dictionary.label.createUserButton}
              </Button>
            </div>
          </form>
          </Card>
      </div>
    </div>
  );
}