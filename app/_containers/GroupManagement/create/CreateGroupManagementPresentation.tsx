'use client'

import { useState, useActionState, useEffect, startTransition } from "react"
import { Button, Card, Input, Textarea, Select, SelectItem, Chip, Autocomplete, AutocompleteItem, Checkbox } from "@heroui/react"
import { createGroup, assignUsersToGroup, assignPoliciesToGroup } from "@/app/lib/actions/group-api"
import { UserAttributesDTO, User, Policy } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { useRouter } from "next/navigation"
import { FaUser, FaFile } from "react-icons/fa6"

interface CreateGroupManagementPresentationProps {
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
  locale: string;
  users: User[];
  policies: Policy[];
}

// グループ作成フォームのデータ型
interface CreateGroupFormData {
  groupName: string;
  description: string;
}

// 拡張されたグループ作成データ型（リレーション含む）
interface ExtendedCreateGroupFormData extends CreateGroupFormData {
  selectedUserIds: string[];
  selectedPolicyIds: string[];
}

export default function CreateGroupManagementPresentation({ 
  userAttributes, 
  dictionary,
  locale,
  users,
  policies
}: CreateGroupManagementPresentationProps) {
  const router = useRouter();
  
  // フォームデータの状態管理
  const [formData, setFormData] = useState<CreateGroupFormData>({
    groupName: "",
    description: "",
  });

  // ユーザーとポリシーの選択状態
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);

  // 検索フィルタリング用の状態
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [policySearchTerm, setPolicySearchTerm] = useState("");

  // クライアントサイドバリデーションエラー
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Server Actionの状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const createGroupInput = {
          groupName: formData.get('groupName') as string,
          description: formData.get('description') as string,
          customerId: userAttributes.customerId,
        };

        console.log('Creating group with data:', createGroupInput);
        console.log('Selected users:', selectedUserIds);
        console.log('Selected policies:', selectedPolicyIds);
        
        // Step 1: グループを作成
        const groupResult = await createGroup(createGroupInput);
        console.log('CreateGroup result:', groupResult);
        
        if (!groupResult.success || !groupResult.data) {
          return groupResult;
        }

        const createdGroup = groupResult.data;
        console.log('Created group:', createdGroup);

        // Step 2: ユーザーをグループに関連付け（選択されている場合）
        if (selectedUserIds.length > 0) {
          console.log('Assigning users to group:', { groupId: createdGroup.groupId, userIds: selectedUserIds });
          
          const assignUsersResult = await assignUsersToGroup({
            groupId: createdGroup.groupId,
            userIds: selectedUserIds,
            customerId: userAttributes.customerId
          });

          if (!assignUsersResult.success) {
            console.error('Failed to assign users to group:', assignUsersResult);
            return {
              success: false,
              message: `グループは作成されましたが、ユーザーの関連付けに失敗しました: ${assignUsersResult.message}`,
              errors: assignUsersResult.errors || { general: ['ユーザーの関連付けに失敗しました。'] },
              data: createdGroup
            };
          }
        }

        // Step 3: ポリシーをグループに関連付け（選択されている場合）
        if (selectedPolicyIds.length > 0) {
          console.log('Assigning policies to group:', { groupId: createdGroup.groupId, policyIds: selectedPolicyIds });
          
          const assignPoliciesResult = await assignPoliciesToGroup({
            groupId: createdGroup.groupId,
            policyIds: selectedPolicyIds,
            customerId: userAttributes.customerId
          });

          if (!assignPoliciesResult.success) {
            console.error('Failed to assign policies to group:', assignPoliciesResult);
            return {
              success: false,
              message: `グループは作成されましたが、ポリシーの関連付けに失敗しました: ${assignPoliciesResult.message}`,
              errors: assignPoliciesResult.errors || { general: ['ポリシーの関連付けに失敗しました。'] },
              data: createdGroup
            };
          }
        }

        // 全て成功
        return {
          success: true,
          message: 'グループが正常に作成され、選択されたユーザーとポリシーが関連付けられました。',
          data: createdGroup
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
    if (state.success && state.data) {
      console.log('Group created successfully:', state.data);
      handleGroupCreationComplete();
    }
  }, [state.success, state.data]);
  
  // グループ作成完了時の処理
  const handleGroupCreationComplete = () => {
    // フォームをリセット
    setFormData({
      groupName: "",
      description: "",
    });
    setSelectedUserIds([]);
    setSelectedPolicyIds([]);
    setUserSearchTerm("");
    setPolicySearchTerm("");
    setClientErrors({});
    
    // グループ管理ページにリダイレクト
    router.push(`/${locale}/account/group-management`);
  };

  // ユーザー・ポリシーのフィルタリング
  const filteredUsers = users.filter(user => {
    const userName = user.userName || user.email || '名前未設定';
    return userName.toLowerCase().includes(userSearchTerm.toLowerCase());
  });

  const filteredPolicies = policies.filter(policy => {
    return policy.policyName.toLowerCase().includes(policySearchTerm.toLowerCase());
  });

  // フォームフィールドの値変更ハンドラー
  const handleFieldChange = (field: keyof CreateGroupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (clientErrors[field]) {
      setClientErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // クライアントサイドバリデーション
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.groupName.trim()) {
      errors.groupName = 'グループ名は必須です。';
    }

    if (selectedUserIds.length === 0) {
      errors.users = '最低1つ以上のユーザーを選択してください。';
    }

    if (selectedPolicyIds.length === 0) {
      errors.policies = '最低1つ以上のポリシーを選択してください。';
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">新しいグループを作成</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* グループ名 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                グループ名
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                name="groupName"
                value={formData.groupName}
                onValueChange={(value) => handleFieldChange('groupName', value)}
                placeholder="グループ名を入力"
                variant="bordered"
                isInvalid={!!(clientErrors.groupName || getErrorMessage('groupName'))}
                errorMessage={clientErrors.groupName || getErrorMessage('groupName')}
              />
            </div>

            {/* 説明（オプション） */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                説明
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onValueChange={(value) => handleFieldChange('description', value)}
                placeholder="グループの説明を入力（任意）"
                variant="bordered"
                minRows={4}
                isInvalid={!!(clientErrors.description || getErrorMessage('description'))}
                errorMessage={clientErrors.description || getErrorMessage('description')}
              />
            </div>

            {/* ユーザー選択 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                <FaUser className="inline mr-2" />
                グループに追加するユーザー
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Autocomplete
                placeholder="ユーザーを検索・選択してください"
                variant="bordered"
                allowsCustomValue={false}
                inputValue={userSearchTerm}
                onInputChange={(value) => setUserSearchTerm(value)}
                isInvalid={!!(clientErrors.users)}
                errorMessage={clientErrors.users}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
                onSelectionChange={(key) => {
                  if (key && typeof key === 'string') {
                    const userId = key as string;
                    if (!selectedUserIds.includes(userId)) {
                      setSelectedUserIds(prev => [...prev, userId]);
                      // エラーをクリア
                      if (clientErrors.users) {
                        setClientErrors(prev => ({ ...prev, users: '' }));
                      }
                    }
                    // 選択後に検索をクリア
                    setUserSearchTerm("");
                  }
                }}
              >
                {filteredUsers.map((user) => (
                  <AutocompleteItem 
                    key={user.userId} 
                    className="bg-white hover:bg-gray-100"
                    textValue={user.userName || user.email || '名前未設定'}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Checkbox
                        isSelected={selectedUserIds.includes(user.userId)}
                        onValueChange={(isSelected) => {
                          if (isSelected) {
                            setSelectedUserIds(prev => [...prev, user.userId]);
                            // エラーをクリア
                            if (clientErrors.users) {
                              setClientErrors(prev => ({ ...prev, users: '' }));
                            }
                            // オートコンプリートをリセット
                            setUserSearchTerm("");
                          } else {
                            setSelectedUserIds(prev => prev.filter(id => id !== user.userId));
                          }
                        }}
                        size="sm"
                      />
                      <span className="flex-1">
                        {user.userName || user.email || '名前未設定'}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {selectedUserIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUserIds.map((userId) => {
                    const user = users.find(u => u.userId === userId);
                    return (
                      <Chip
                        key={userId}
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClose={() => setSelectedUserIds(prev => prev.filter(id => id !== userId))}
                      >
                        {user?.userName || user?.email || '不明なユーザー'}
                      </Chip>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ポリシー選択 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                <FaFile className="inline mr-2" />
                グループに追加するポリシー
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Autocomplete
                placeholder="ポリシーを検索・選択してください"
                variant="bordered"
                allowsCustomValue={false}
                inputValue={policySearchTerm}
                onInputChange={(value) => setPolicySearchTerm(value)}
                isInvalid={!!(clientErrors.policies)}
                errorMessage={clientErrors.policies}
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
                onSelectionChange={(key) => {
                  if (key && typeof key === 'string') {
                    const policyId = key as string;
                    if (!selectedPolicyIds.includes(policyId)) {
                      setSelectedPolicyIds(prev => [...prev, policyId]);
                      // エラーをクリア
                      if (clientErrors.policies) {
                        setClientErrors(prev => ({ ...prev, policies: '' }));
                      }
                    }
                    // 選択後に検索をクリア
                    setPolicySearchTerm("");
                  }
                }}
              >
                {filteredPolicies.map((policy) => (
                  <AutocompleteItem 
                    key={policy.policyId} 
                    className="bg-white hover:bg-gray-100"
                    textValue={policy.policyName}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Checkbox
                        isSelected={selectedPolicyIds.includes(policy.policyId)}
                        onValueChange={(isSelected) => {
                          if (isSelected) {
                            setSelectedPolicyIds(prev => [...prev, policy.policyId]);
                            // エラーをクリア
                            if (clientErrors.policies) {
                              setClientErrors(prev => ({ ...prev, policies: '' }));
                            }
                            // オートコンプリートをリセット
                            setPolicySearchTerm("");
                          } else {
                            setSelectedPolicyIds(prev => prev.filter(id => id !== policy.policyId));
                          }
                        }}
                        size="sm"
                      />
                      <span className="flex-1">
                        {policy.policyName}
                      </span>
                    </div>
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              {selectedPolicyIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPolicyIds.map((policyId) => {
                    const policy = policies.find(p => p.policyId === policyId);
                    return (
                      <Chip
                        key={policyId}
                        size="sm"
                        variant="flat"
                        color="secondary"
                        onClose={() => setSelectedPolicyIds(prev => prev.filter(id => id !== policyId))}
                      >
                        {policy?.policyName || '不明なポリシー'}
                      </Chip>
                    );
                  })}
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
                グループを作成
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
