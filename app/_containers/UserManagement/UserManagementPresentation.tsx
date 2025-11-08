'use client'

import { useState, useEffect } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { Button, Card, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react"
import { User } from "@/app/lib/types/TypeAPIs"
import { updateUser, deleteUser } from "@/app/lib/actions/user-api"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserManagementLocale } from '@/app/dictionaries/user-management/user-management.d.ts';
import { RiEdit2Fill } from "react-icons/ri"
import { FaCheck, FaXmark, FaPlus, FaTrash } from "react-icons/fa6"
import { sendVerificationEmailAction, verifyEmailCodeForUpdateAction } from "@/app/lib/actions/user-verification-actions"
import Link from "next/link"

interface UserManagementPresentationProps {
  users: User[];
  userAttributes: UserAttributesDTO;
  dictionary: UserManagementLocale;
}

// 編集可能なフィールドの型定義
type EditableField = 'userName' | 'department' | 'position' | 'email' | 'locale' | 'role';

// 個別フィールド更新関数（管理者用）
async function updateSingleFieldForUser(
  fieldName: EditableField,
  value: string,
  targetUser: User,
  adminUserAttributes: UserAttributesDTO,
  dictionary: UserManagementLocale
): Promise<{ success: boolean; message: string; errors?: Record<string, string>; updatedUser?: User }> {
  try {
    console.log('updateSingleFieldForUser called with:', { fieldName, value, userId: targetUser.userId });
    
    const input = {
      userId: targetUser.userId,
      [fieldName]: value,
    };

    // 管理者の属性情報を使用（Cognito更新用）
    const updatedUserAttributes = {
      ...adminUserAttributes,
      ...(fieldName === 'userName' && { preferred_username: value }),
      ...(fieldName === 'locale' && { locale: value }),
    };

    console.log('Calling updateUser with:', { input, updatedUserAttributes });
    const result = await updateUser(input, updatedUserAttributes);
    console.log('updateUser returned:', result);
    
    if (result.success) {
      return {
        success: true,
        message: result.message || dictionary.label.fieldUpdateSuccess.replace('{fieldName}', fieldName),
        updatedUser: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || dictionary.label.fieldUpdateFail.replace('{fieldName}', fieldName),
        errors: result.errors ? Object.fromEntries(
          Object.entries(result.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        ) : {},
      };
    }
  } catch (error: any) {
    console.error('Error in updateSingleFieldForUser:', error);
    return {
      success: false,
      message: error?.message || dictionary.label.updateError,
      errors: { [fieldName]: error?.message || dictionary.label.updateError }
    };
  }
}

export default function UserManagementPresentation({ 
  users, 
  userAttributes, 
  dictionary 
}: UserManagementPresentationProps) {
  // Next.jsルーター
  const pathname = usePathname();
  const router = useRouter();
  
  // 管理者数をカウント
  const adminCount = users.filter(u => u.role === 'admin').length;
  console.log('Total admin count:', adminCount);
  
  // ユーザー選択とフィルタリング状態
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  
  // デバッグ用: ユーザー一覧とフィルター状態をログ出力
  console.log('ユーザー管理デバッグ:', {
    totalUsers: users.length,
    roleFilter,
    searchTerm,
    users: users.map(u => ({ userName: u.userName, role: u.role }))
  });
  
  // 各フィールドの編集状態管理
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValues, setFieldValues] = useState({
    userName: "",
    department: "",
    position: "",
    email: "",
    locale: "",
    role: "" as 'admin' | 'user' | "",
  });
  const [tempValues, setTempValues] = useState(fieldValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // 削除機能の状態管理
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ success: boolean; message: string; deletedGroupIds?: string[] } | null>(null);

  // ハイドレーション対応
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ユーザー選択時にフィールド値を更新
  const selectUser = (user: User) => {
    setSelectedUser(user);
    const newFieldValues = {
      userName: user.userName ?? "",
      department: user.department ?? "",
      position: user.position ?? "",
      email: user.email ?? "",
      locale: user.locale ?? "",
      role: user.role as 'admin' | 'user',
    };
    setFieldValues(newFieldValues);
    setTempValues(newFieldValues);
    setEditingField(null);
    setFieldErrors({});
  };

  // フィルター変更時に選択ユーザーを解除
  const handleRoleFilterChange = (newRoleFilter: 'all' | 'admin' | 'user') => {
    setRoleFilter(newRoleFilter);
    // 選択されたユーザーが新しいフィルターに一致しない場合は選択を解除
    if (selectedUser) {
      const matchesNewFilter = newRoleFilter === 'all' || selectedUser.role === newRoleFilter;
      if (!matchesNewFilter) {
        setSelectedUser(null);
        setEditingField(null);
        setFieldErrors({});
      }
    }
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    // 選択されたユーザーが新しい検索条件に一致しない場合は選択を解除
    if (selectedUser) {
      const matchesNewSearch = (selectedUser.userName && selectedUser.userName.toLowerCase().includes(newSearchTerm.toLowerCase())) ||
                              (selectedUser.email && selectedUser.email.toLowerCase().includes(newSearchTerm.toLowerCase())) ||
                              (selectedUser.department && selectedUser.department.toLowerCase().includes(newSearchTerm.toLowerCase()));
      if (!matchesNewSearch) {
        setSelectedUser(null);
        setEditingField(null);
        setFieldErrors({});
      }
    }
  };

  // ユーザーリストのフィルタリング
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.userName && user.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // デバッグログ
    console.log('フィルタリング:', {
      userName: user.userName,
      userRole: user.role,
      roleFilter,
      matchesSearch,
      matchesRole,
      finalResult: matchesSearch && matchesRole
    });
    
    return matchesSearch && matchesRole;
  });

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

  // 編集開始
  const startEditing = (field: EditableField) => {
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
      return dictionary.alert.required.replace('{label}', field);
    }
    
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return dictionary.alert.invalidEmail;
      }
    }
    
    if (field === 'role') {
      if (!['admin', 'user'].includes(value)) {
        return dictionary.label.validRole;
      }
    }
    
    return null;
  };

  // メール変更用の認証コード送信
  const sendEmailVerificationCode = async (newEmail: string) => {
    if (!selectedUser) return;
    
    setEmailVerificationState(prev => ({ ...prev, isSendingCode: true }));
    
    try {
      // sendVerificationEmailAction内で認証コード生成、保存、送信を全て行う
      const emailResult = await sendVerificationEmailAction(
        newEmail,
        selectedUser.userId,
        userAttributes.locale || 'en'
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
        // ✅ 新しいAPI: messageKey を使用（ロケール対応）
        let errorMessage = dictionary.label.emailSendFailed;
        
        if (emailResult.messageKey) {
          // レート制限エラーの場合、辞書から取得
          errorMessage = emailResult.error || dictionary.label.emailSendFailed;
          
          // リセット時刻も表示（ロケール対応）
          if (emailResult.resetAt) {
            const formattedTime = emailResult.resetAt.toLocaleString(userAttributes.locale || 'en');
            errorMessage = `${errorMessage} (${formattedTime} ${dictionary.label.retryAfter})`;
          }
        } else if (emailResult.error) {
          errorMessage = emailResult.error;
        }
        
        setFieldErrors({ ...fieldErrors, email: errorMessage });
      }
    } catch (error: any) {
      setFieldErrors({ ...fieldErrors, email: error?.message || dictionary.label.errorOccurredGeneric });
    } finally {
      setEmailVerificationState(prev => ({ ...prev, isSendingCode: false }));
    }
  };

  // メール変更用の認証コード検証（Cognitoユーザー作成なし）
  const verifyEmailCode = async () => {
    if (!selectedUser) return;
    
    setIsUpdating(true);
    
    try {
      // 認証コードの検証のみ行う（Cognitoユーザー確認は行わない）
      const result = await verifyEmailCodeForUpdateAction(
        selectedUser.userId,
        emailVerificationState.newEmail,
        emailVerificationState.verificationCode,
        userAttributes.locale || 'en'
      );
      
      if (result.success) {
        // 認証成功後、実際にメールアドレスを更新
        const updateResult = await updateSingleFieldForUser('email', emailVerificationState.newEmail, selectedUser, userAttributes, dictionary);
        
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
          setFieldErrors({ ...fieldErrors, email: updateResult.message || dictionary.label.emailUpdateFailed });
        }
      } else {
        // ✅ 新しいAPI: messageKey を使用（ロケール対応）
        let errorMessage = dictionary.label.invalidVerificationCode;
        
        if (result.messageKey) {
          // レート制限エラーの場合
          errorMessage = result.error || dictionary.label.invalidVerificationCode;
          
          // リセット時刻も表示（ロケール対応）
          if (result.resetAt) {
            const formattedTime = result.resetAt.toLocaleString(userAttributes.locale || 'en');
            errorMessage = `${errorMessage} (${formattedTime} ${dictionary.label.retryAfter})`;
          }
        } else if (result.error) {
          errorMessage = result.error;
        }
        
        setFieldErrors({ ...fieldErrors, email: errorMessage });
      }
    } catch (error: any) {
      setFieldErrors({ ...fieldErrors, email: error?.message || dictionary.label.errorOccurredGeneric });
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除確認ダイアログを開く
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteResult(null);
    onDeleteModalOpen();
  };

  // ユーザー削除実行
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(userToDelete.userId, false); // ハード削除
      
      setDeleteResult({
        success: result.success,
        message: result.message || '',
        deletedGroupIds: result.data?.deletedGroupIds
      });

      if (result.success) {
        // 削除成功時は少し待ってからページを再読み込み
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      setDeleteResult({
        success: false,
        message: error?.message || dictionary.label.errorOccurredGeneric
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // 削除モーダルを閉じる
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setUserToDelete(null);
      setDeleteResult(null);
      onDeleteModalClose();
    }
  };

  // 更新実行
  const saveField = async (field: EditableField) => {
    if (!selectedUser) {
      setFieldErrors({ ...fieldErrors, [field]: dictionary.label.userNotSelected });
      return;
    }

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
      console.log('Updating field:', { field, value, userId: selectedUser.userId });
      const result = await updateSingleFieldForUser(field, value, selectedUser, userAttributes, dictionary);
      console.log('Update result:', result);
      
      if (result.success && result.updatedUser) {
        // 成功時は表示値を更新し、編集モードを終了
        setFieldValues({ ...fieldValues, [field]: value });
        setEditingField(null);
        setTempValues({ ...tempValues, [field]: value });
        
        // 選択されたユーザー情報も更新
        setSelectedUser(result.updatedUser);
        
        console.log('Field updated successfully:', field);
        
        // 自分自身の言語設定を変更した場合、URLの言語パスを変更して遷移
        if (field === 'locale' && selectedUser.userId === userAttributes.sub) {
          console.log('Own locale changed, navigating to new language path...');
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
      const errorMessage = error?.message || dictionary.label.errorOccurredGeneric;
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

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          {/* 編集ボタンまたはアクションボタン */}
          <div className="flex gap-2">
            {!isEditing ? (
                  <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => startEditing(field)}
                className="text-blue-600 hover:text-blue-800"
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
                    {dictionary.label.newEmailSent.replace('{email}', emailVerificationState.newEmail)}
                  </p>
                </div>
                <Input
                  type="text"
                  value={emailVerificationState.verificationCode}
                  onValueChange={(val) => setEmailVerificationState(prev => ({ ...prev, verificationCode: val }))}
                  placeholder={dictionary.label.verificationCodePlaceholder}
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
                    {dictionary.label.verifyAndUpdate}
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
                    {dictionary.label.cancel}
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
                disallowEmptySelection={true}
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
              {field === 'locale' 
                ? (value ? localeOptions.find(opt => opt.key === value)?.label || value : dictionary.label.notSet)
                : field === 'role'
                ? (value ? roleOptions.find(opt => opt.key === value)?.label || value : dictionary.label.notSet)
                : type === 'select' && selectOptions
                ? (value ? selectOptions?.find(opt => opt.key === value)?.label || value : dictionary.label.notSet)
                : value || dictionary.label.notSet
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

  // ロール選択肢
  const roleOptions = [
    { key: 'user', label: dictionary.label.roleUser },
    { key: 'admin', label: dictionary.label.roleAdmin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{dictionary.label.userManagement}</h1>
            <Button
              color="primary"
              as={Link}
              href={`/${userAttributes.locale}/account/user-management/create-user`}
              startContent={<FaPlus size={16} />}
              className="font-medium"
            >
              {dictionary.label.createNewUser}
            </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: ユーザー一覧 */}
          <Card className="lg:col-span-1 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{dictionary.label.userListTitle} ({dictionary.label.userCount.replace('{count}', filteredUsers.length.toString())})</h2>
            
            {/* 検索・フィルター */}
            <div className="flex flex-col gap-4 mb-6">
              {isMounted ? (
                <Input
                  placeholder={dictionary.label.searchPlaceholder}
                  value={searchTerm}
                  onValueChange={handleSearchChange}
                  variant="bordered"
                />
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
              {isMounted ? (
                <Select
                  selectedKeys={[roleFilter]}
                  onSelectionChange={(keys) => handleRoleFilterChange(Array.from(keys)[0] as 'all' | 'admin' | 'user')}
                  variant="bordered"
                  placeholder={dictionary.label.filterByRole}
                  disallowEmptySelection={true}
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">{dictionary.label.all}</SelectItem>
                  <SelectItem key="admin" className="bg-white hover:bg-gray-100">{dictionary.label.admin}</SelectItem>
                  <SelectItem key="user" className="bg-white hover:bg-gray-100">{dictionary.label.user}</SelectItem>
                </Select>
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* ユーザーリスト */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {dictionary.label.noUsersFound}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.userId}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.userId === user.userId
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => selectUser(user)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.userName || dictionary.label.nameNotSet}</h3>
                        <p className="text-sm text-gray-600">{user.email || dictionary.label.emailNotSet}</p>
                        <p className="text-sm text-gray-500">
                          {user.department || dictionary.label.departmentNotSet} - {user.position || dictionary.label.positionNotSet}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.role === 'user'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? dictionary.label.roleAdmin : user.role === 'user' ? dictionary.label.roleUser : dictionary.label.roleNotSet} ({user.role || dictionary.label.notSet})
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* 右側: ユーザー編集フォーム */}
          <Card className="lg:col-span-2 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedUser ? dictionary.label.editingUser.replace('{userName}', selectedUser.userName) : dictionary.label.selectUser}
              </h2>
              {selectedUser && (
                <div className="flex flex-col items-end gap-2">
                  <Button
                    color="danger"
                    variant="bordered"
                    startContent={<FaTrash size={14} />}
                    onPress={() => openDeleteModal(selectedUser)}
                    size="sm"
                    isDisabled={selectedUser.role === 'admin' && adminCount === 1}
                  >
                    {dictionary.label.deleteUser}
                  </Button>
                  {selectedUser.role === 'admin' && adminCount === 1 && (
                    <span className="text-xs text-yellow-600">
                      {dictionary.label.lastAdminCannotDelete}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {selectedUser ? (
        <div className="flex flex-col gap-6">
          {/* ユーザー名フィールド */}
          {renderField('userName', dictionary.label.userName)}

          {/* 部署フィールド */}
          {renderField('department', dictionary.label.department)}

          {/* 役職フィールド */}
          {renderField('position', dictionary.label.position)}

          {/* メールアドレスフィールド */}
          {renderField('email', dictionary.label.email, 'email')}

                {/* ロールフィールド（編集可能） */}
                <div className="flex flex-col gap-2">
                  {renderField('role', dictionary.label.role, 'select', roleOptions)}
                  {selectedUser.role === 'admin' && adminCount === 1 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-xs text-yellow-800">
                          {dictionary.label.lastAdminRoleWarning}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

          {/* 言語設定フィールド */}
          {renderField('locale', dictionary.label.locale, 'select', localeOptions)}
                
                {/* ユーザー情報 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{dictionary.label.userInfo}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{dictionary.label.createdAt}: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('ja-JP') : dictionary.label.unknown}</p>
                    <p>{dictionary.label.updatedAt}: {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString('ja-JP') : dictionary.label.unknown}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>{dictionary.label.selectUserToEdit}</p>
              </div>
            )}
          </Card>
        </div>

        {/* 削除確認モーダル */}
        <Modal 
          isOpen={isDeleteModalOpen} 
          onClose={closeDeleteModal}
          size="lg"
          classNames={{
            backdrop: "bg-black/50",
            base: "bg-white",
            header: "border-b border-gray-200",
            body: "py-6",
            footer: "border-t border-gray-200"
          }}
        >
          <ModalContent className="bg-white">
            <ModalHeader className="flex flex-col gap-1 bg-white">
              <h3 className="text-lg font-semibold text-red-600">{dictionary.label.deleteConfirmationTitle}</h3>
            </ModalHeader>
            <ModalBody className="bg-white">
              {userToDelete && !deleteResult && (
                <div className="space-y-4">
                  {/* 最後の管理者の場合の警告 */}
                  {userToDelete.role === 'admin' && adminCount === 1 && (
                    <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <p className="text-red-900 font-bold text-lg">
                            {dictionary.label.cannotDelete}
                          </p>
                          <p className="text-red-800 text-sm mt-1">
                            {dictionary.label.lastAdminCannotDeleteMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FaTrash className="text-red-500 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-red-800 font-medium">
                          {dictionary.label.confirmDeleteUser}
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          {dictionary.label.cannotUndo}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{dictionary.label.deleteTargetUser}</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">{dictionary.label.name}:</span> {userToDelete.userName}</p>
                      <p><span className="font-medium">{dictionary.label.email}:</span> {userToDelete.email}</p>
                      <p><span className="font-medium">{dictionary.label.department}:</span> {userToDelete.department}</p>
                      <p><span className="font-medium">{dictionary.label.position}:</span> {userToDelete.position}</p>
                      <p><span className="font-medium">{dictionary.label.role}:</span> {userToDelete.role === 'admin' ? dictionary.label.roleAdmin : dictionary.label.roleUser}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-yellow-800 font-medium">{dictionary.label.deleteImpact}</p>
                        <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                          <li>• {dictionary.label.deleteImpact1}</li>
                          <li>• {dictionary.label.deleteImpact2}</li>
                          <li>• {dictionary.label.deleteImpact3}</li>
                          <li>• {dictionary.label.deleteImpact4}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {deleteResult && (
                <div className={`p-4 rounded-lg border ${
                  deleteResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {deleteResult.success ? (
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <div>
                      <p className={`font-medium ${
                        deleteResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {deleteResult.success ? dictionary.label.deleteCompleted : dictionary.label.deleteFailed}
                      </p>
                      <p className={`text-sm mt-1 ${
                        deleteResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {deleteResult.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-white">
              {!deleteResult ? (
                <>
                  <Button 
                    variant="light" 
                    onPress={closeDeleteModal}
                    isDisabled={isDeleting}
                  >
                    {dictionary.label.cancel}
                  </Button>
                  <Button 
                    color="danger" 
                    onPress={handleDeleteUser}
                    isLoading={isDeleting}
                    isDisabled={isDeleting || (userToDelete?.role === 'admin' && adminCount === 1)}
                    startContent={!isDeleting ? <FaTrash size={14} /> : undefined}
                  >
                    {isDeleting ? dictionary.label.deleting : dictionary.label.executeDelete}
                  </Button>
                </>
              ) : (
                <Button 
                  color="primary" 
                  onPress={closeDeleteModal}
                  isDisabled={deleteResult.success && isDeleting}
                >
                  {dictionary.label.close}
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}