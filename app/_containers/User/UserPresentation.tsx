'use client'

import { useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { Button, Card, Input, Select, SelectItem } from "@heroui/react"
import { User } from "@/app/lib/types/TypeAPIs"
import { updateUser } from "@/app/lib/actions/user-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { RiEdit2Fill } from "react-icons/ri"
import { FaCheck, FaXmark } from "react-icons/fa6"
import { sendVerificationEmailAction, storeVerificationCodeAction, verifyEmailCodeForUpdateAction } from "@/app/lib/actions/user-verification-actions"

interface UserPresentationProps {
  user: User;
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// 編集可能なフィールドの型定義
type EditableField = 'userName' | 'department' | 'position' | 'email' | 'locale';

// 個別フィールド更新関数
async function updateSingleField(
  fieldName: EditableField,
  value: string,
  user: User,
  userAttributes: UserAttributesDTO
): Promise<{ success: boolean; message: string; errors?: Record<string, string> }> {
  try {
    console.log('updateSingleField called with:', { fieldName, value, userId: user.userId });
    
    const input = {
      userId: user.userId,
      [fieldName]: value,
    };

    const updatedUserAttributes = {
      ...userAttributes,
      ...(fieldName === 'userName' && { preferred_username: value }),
      ...(fieldName === 'locale' && { locale: value }),
    };

    console.log('Calling updateUser with:', { input, updatedUserAttributes });
    const result = await updateUser(input, updatedUserAttributes);
    console.log('updateUser returned:', result);
    
    if (result.success) {
      return {
        success: true,
        message: result.message || `${fieldName}が正常に更新されました。`,
      };
    } else {
      return {
        success: false,
        message: result.message || `${fieldName}の更新に失敗しました。`,
        errors: result.errors ? Object.fromEntries(
          Object.entries(result.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        ) : {},
      };
    }
  } catch (error: any) {
    console.error('Error in updateSingleField:', error);
    return {
      success: false,
      message: error?.message || '更新処理でエラーが発生しました。',
      errors: { [fieldName]: error?.message || '更新処理でエラーが発生しました。' }
    };
  }
}

export default function UserProfilePresentation({ 
  user, 
  userAttributes, 
  dictionary 
}: UserPresentationProps) {
  // Next.jsルーター
  const pathname = usePathname();
  const router = useRouter();
  
  // 管理者権限チェック
  const isAdmin = userAttributes.role === 'admin';
  
  // 各フィールドの編集状態管理
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValues, setFieldValues] = useState({
    userName: user.userName || "",
    department: user.department || "",
    position: user.position || "",
    email: user.email || "",
    locale: userAttributes.locale || "ja",
  });
  const [tempValues, setTempValues] = useState(fieldValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // メール変更用の2段階認証状態
  const [emailVerificationState, setEmailVerificationState] = useState<{
    isVerifying: boolean;
    newEmail: string;
    verificationCode: string;
    isCodeSent: boolean;
    isSendingCode: boolean;
  }>({
    isVerifying: false,
    newEmail: "",
    verificationCode: "",
    isCodeSent: false,
    isSendingCode: false,
  });

  // フィールドごとの編集可否を判定
  const canEditField = (field: EditableField): boolean => {
    // 管理者以外が編集できるフィールド
    const userEditableFields: EditableField[] = ['userName', 'locale'];
    
    if (isAdmin) {
      // 管理者は全フィールド編集可能
      return true;
    } else {
      // 一般ユーザーは限定的なフィールドのみ編集可能
      return userEditableFields.includes(field);
    }
  };

  // 編集開始
  const startEditing = (field: EditableField) => {
    if (!canEditField(field)) {
      setFieldErrors({ 
        ...fieldErrors, 
        [field]: '管理者のみがこのフィールドを編集できます。' 
      });
      return;
    }
    setEditingField(field);
    setTempValues({ ...fieldValues });
    setFieldErrors({});
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditingField(null);
    setTempValues(fieldValues);
    setFieldErrors({});
  };

  // バリデーション
  const validateField = (field: EditableField, value: string): string | null => {
    if (!value.trim()) {
      return `${field}は必須です。`;
    }
    
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return '有効なメールアドレスを入力してください。';
      }
    }
    
    return null;
  };

  // メール変更用の認証コード送信
  const sendEmailVerificationCode = async (newEmail: string) => {
    setEmailVerificationState(prev => ({ ...prev, isSendingCode: true }));
    
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 認証コードをDynamoDBに保存
      const storeResult = await storeVerificationCodeAction(
        user.userId,
        newEmail,
        code,
        userAttributes.locale || 'ja'
      );
      
      if (!storeResult.success) {
        setFieldErrors({ ...fieldErrors, email: storeResult.error || 'コードの保存に失敗しました。' });
        return;
      }
      
      // 認証コードをメールで送信
      const emailResult = await sendVerificationEmailAction(
        newEmail,
        code,
        userAttributes.locale || 'ja'
      );
      
      if (emailResult.success) {
        setEmailVerificationState(prev => ({
          ...prev,
          isVerifying: true,
          newEmail,
          isCodeSent: true,
        }));
        setFieldErrors({ ...fieldErrors, email: '' });
      } else {
        setFieldErrors({ ...fieldErrors, email: emailResult.error || 'メール送信に失敗しました。' });
      }
    } catch (error: any) {
      setFieldErrors({ ...fieldErrors, email: error?.message || 'エラーが発生しました。' });
    } finally {
      setEmailVerificationState(prev => ({ ...prev, isSendingCode: false }));
    }
  };

  // メール変更用の認証コード検証（Cognitoユーザー作成なし）
  const verifyEmailCode = async () => {
    setIsUpdating(true);
    
    try {
      // 認証コードの検証のみ行う（Cognitoユーザー確認は行わない）
      const result = await verifyEmailCodeForUpdateAction(
        user.userId,
        emailVerificationState.newEmail,
        emailVerificationState.verificationCode,
        userAttributes.locale || 'ja'
      );
      
      if (result.success) {
        // 認証成功後、実際にメールアドレスを更新
        const updateResult = await updateSingleField('email', emailVerificationState.newEmail, user, userAttributes);
        
        if (updateResult.success) {
          setFieldValues({ ...fieldValues, email: emailVerificationState.newEmail });
          setTempValues({ ...tempValues, email: emailVerificationState.newEmail });
          setEditingField(null);
          setEmailVerificationState({
            isVerifying: false,
            newEmail: "",
            verificationCode: "",
            isCodeSent: false,
            isSendingCode: false,
          });
          setFieldErrors({ ...fieldErrors, email: '' });
        } else {
          setFieldErrors({ ...fieldErrors, email: updateResult.message || 'メールアドレスの更新に失敗しました。' });
        }
      } else {
        setFieldErrors({ ...fieldErrors, email: result.error || '認証コードが正しくありません。' });
      }
    } catch (error: any) {
      setFieldErrors({ ...fieldErrors, email: error?.message || 'エラーが発生しました。' });
    } finally {
      setIsUpdating(false);
    }
  };

  // 更新実行
  const saveField = async (field: EditableField) => {
    const value = tempValues[field];
    const error = validateField(field, value);
    
    if (error) {
      setFieldErrors({ ...fieldErrors, [field]: error });
      return;
    }

    // メールアドレスの場合は2段階認証を開始
    if (field === 'email' && value !== fieldValues.email) {
      await sendEmailVerificationCode(value);
      return;
    }

    setIsUpdating(true);
    setFieldErrors({ ...fieldErrors, [field]: '' }); // 該当フィールドのエラーのみクリア

    try {
      console.log('Updating field:', { field, value, userId: user.userId });
      const result = await updateSingleField(field, value, user, userAttributes);
      console.log('Update result:', result);
      
      if (result.success) {
        // 成功時は表示値を更新し、編集モードを終了
        setFieldValues({ ...fieldValues, [field]: value });
        setEditingField(null);
        setTempValues({ ...tempValues, [field]: value });
        console.log('Field updated successfully:', field);
        
        // 言語設定が変更された場合、URLの言語パスを変更して遷移
        if (field === 'locale') {
          console.log('Locale changed, navigating to new language path...');
          const segments = pathname.split('/');
          segments[1] = value; // 言語パスを新しいロケールに変更
          const newUrl = segments.join('/');
          router.push(newUrl);
        }
      } else {
        // エラー時はエラーメッセージを表示
        const errorMessage = result.message || `${field}の更新に失敗しました。`;
        setFieldErrors({ ...fieldErrors, [field]: errorMessage });
        console.error('Update failed:', result);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMessage = error?.message || '更新中にエラーが発生しました。';
      setFieldErrors({ ...fieldErrors, [field]: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  // フィールド表示コンポーネント
  const renderField = (
    field: EditableField,
    label: string,
    type: 'text' | 'email' | 'select' = 'text',
    selectOptions?: { key: string; label: string }[]
  ) => {
    const isEditing = editingField === field;
    const value = isEditing ? tempValues[field] : fieldValues[field];
    const error = fieldErrors[field];
    const canEdit = canEditField(field);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500 ml-1">*</span>
            {!canEdit && (
              <span className="ml-2 text-xs text-gray-500 font-normal">
                (管理者のみ編集可能)
              </span>
            )}
          </label>
          
          {/* 編集ボタンまたはアクションボタン */}
          <div className="flex gap-2">
            {!isEditing ? (
                  <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => startEditing(field)}
                className={`${canEdit ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                isDisabled={!canEdit}
              >
                <RiEdit2Fill size={16} />
                  </Button>
            ) : (
              <>
                  <Button
                  size="sm"
                  color="success"
                  isIconOnly
                  onPress={() => saveField(field)}
                  isDisabled={isUpdating}
                  isLoading={isUpdating}
                >
                  <FaCheck size={12} />
                  </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  isIconOnly
                  onPress={cancelEditing}
                  isDisabled={isUpdating}
                >
                  <FaXmark size={12} />
                </Button>
              </>
              )}
            </div>
      </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            {/* メール変更の2段階認証UI */}
            {field === 'email' && emailVerificationState.isVerifying ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800">
                    新しいメールアドレス「{emailVerificationState.newEmail}」に認証コードを送信しました。
                  </p>
                </div>
                <Input
                  type="text"
                  value={emailVerificationState.verificationCode}
                  onValueChange={(val) => setEmailVerificationState(prev => ({ ...prev, verificationCode: val }))}
                  placeholder="認証コード（6桁）"
                  variant="bordered"
                  isDisabled={isUpdating}
                  maxLength={6}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="success"
                    onPress={verifyEmailCode}
                    isDisabled={isUpdating || emailVerificationState.verificationCode.length !== 6}
                    isLoading={isUpdating}
                  >
                    認証して更新
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setEmailVerificationState({
                        isVerifying: false,
                        newEmail: "",
                        verificationCode: "",
                        isCodeSent: false,
                        isSendingCode: false,
                      });
                      cancelEditing();
                    }}
                    isDisabled={isUpdating}
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : type === 'select' && selectOptions ? (
              <Select
                selectedKeys={[tempValues[field]]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setTempValues({ ...tempValues, [field]: selectedKey });
                  // エラーをクリア
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                isDisabled={isUpdating}
                variant="bordered"
                placeholder={`${label}を選択してください`}
                isInvalid={!!error}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {selectOptions.map(option => (
                  <SelectItem key={option.key} className="bg-white hover:bg-gray-100">
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <Input
                type={type}
                value={tempValues[field]}
                onValueChange={(val) => {
                  setTempValues({ ...tempValues, [field]: val });
                  // エラーをクリア
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                isDisabled={isUpdating || (field === 'email' && emailVerificationState.isSendingCode)}
                variant="bordered"
                placeholder={label}
                isInvalid={!!error}
              />
            )}
            
            {/* エラーメッセージを独立して表示 */}
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-gray-900">
              {type === 'select' && field === 'locale' 
                ? selectOptions?.find(opt => opt.key === value)?.label || value
                : value
              }
            </span>
          </div>
        )}
      </div>
    );
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

  return (
    <div className="min-h-screen mx-auto flex flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{dictionary.label.title}</h2>
        
        {/* 権限に関する通知バナー */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-blue-800">
                  一般ユーザー権限
                </p>
                <p className="text-xs text-blue-700">
                  編集可能: ユーザー名、言語設定<br />
                  管理者のみ編集可能: メールアドレス、部署、役職
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isAdmin && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-green-800">
                  管理者権限
                </p>
                <p className="text-xs text-green-700">
                  すべてのフィールドを編集できます
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-6">
          {/* ユーザー名フィールド */}
          {renderField('userName', dictionary.label.userName)}

          {/* 部署フィールド */}
          {renderField('department', dictionary.label.department)}

          {/* 役職フィールド */}
          {renderField('position', dictionary.label.position)}

          {/* メールアドレスフィールド */}
          {renderField('email', dictionary.label.email, 'email')}

          {/* ロール表示（読み取り専用） */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              ロール
              <span className="ml-2 text-xs text-gray-500 font-normal">
                (変更不可)
              </span>
            </label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="flex items-center justify-between">
                <span className="text-gray-900">
                  {userAttributes.role === 'admin' ? '管理者' : 'ユーザー'}
                </span>
                {userAttributes.role === 'admin' && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    最後の管理者の場合、ロール変更は制限されます
                  </span>
                )}
              </div>
            </div>
            {userAttributes.role === 'admin' && (
              <p className="text-xs text-gray-500 mt-1">
                ※ 組織に管理者が1人しかいない場合、ロールを一般ユーザーに変更することはできません。
              </p>
            )}
          </div>

          {/* 言語設定フィールド */}
          {renderField('locale', '言語設定', 'select', localeOptions)}
        </div>
      </Card>
    </div>
  );
}