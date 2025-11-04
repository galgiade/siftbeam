'use client'

import { useState, useEffect } from "react"
import { Button, Card, Input, Textarea, Chip, Select, SelectItem, Accordion, AccordionItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Autocomplete, AutocompleteItem, Checkbox } from "@heroui/react"
import { Group } from "@/app/lib/types/TypeAPIs"
import { updateGroup, deleteGroup, getUsersByGroupId, getPoliciesByGroupId, assignUsersToGroup, assignPoliciesToGroup, removeUsersFromGroup, removePoliciesFromGroup } from "@/app/lib/actions/group-api"
import Link from "next/link"
import { UserAttributesDTO, User, Policy, UserGroup, PolicyGroup } from "@/app/lib/types/TypeAPIs"
import type { GroupManagementLocale } from '@/app/dictionaries/group-management/group-management.d.ts';
import { RiEdit2Fill } from "react-icons/ri"
import { FaCheck, FaXmark, FaPlus, FaTrash, FaUsers, FaFile } from "react-icons/fa6"

interface GroupManagementPresentationProps {
  groups: Group[];
  users: User[];
  policies: Policy[];
  userAttributes: UserAttributesDTO;
  dictionary: GroupManagementLocale;
}

// 編集可能なフィールドの型定義
type EditableField = 'groupName' | 'description';

// 個別フィールド更新関数
async function updateSingleFieldForGroup(
  fieldName: EditableField,
  value: string,
  targetGroup: Group,
  dictionary: GroupManagementLocale
): Promise<{ success: boolean; message: string; errors?: Record<string, string>; updatedGroup?: Group }> {
  try {
    console.log('updateSingleFieldForGroup called with:', { fieldName, value, groupId: targetGroup.groupId });
    
    const input = {
      groupId: targetGroup.groupId,
      [fieldName]: value,
    };

    console.log('Calling updateGroup with:', input);
    const result = await updateGroup(input);
    console.log('updateGroup returned:', result);
    
    if (result.success) {
      return {
        success: true,
        message: result.message || `${fieldName}${dictionary.label.updatedSuccessfully}`,
        updatedGroup: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || dictionary.alert.updateFail,
        errors: result.errors ? Object.fromEntries(
          Object.entries(result.errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
        ) : {},
      };
    }
  } catch (error: any) {
    console.error('Error in updateSingleFieldForGroup:', error);
    return {
      success: false,
      message: error?.message || dictionary.alert.updateError,
      errors: { [fieldName]: error?.message || dictionary.alert.updateError }
    };
  }
}

export default function GroupManagementPresentation({ 
  groups: initialGroups,
  users: initialUsers,
  policies: initialPolicies,
  userAttributes, 
  dictionary 
}: GroupManagementPresentationProps) {
  // グループ一覧の状態管理
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  
  // グループ選択とフィルタリング状態
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 各フィールドの編集状態管理
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValues, setFieldValues] = useState({
    groupName: "",
    description: "",
  });
  const [tempValues, setTempValues] = useState(fieldValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // 削除確認モーダルの状態管理
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ユーザー・ポリシー管理のインライン表示状態管理（常に表示するため削除）
  // const [showUsersSection, setShowUsersSection] = useState(false);
  // const [showPoliciesSection, setShowPoliciesSection] = useState(false);
  
  // ユーザー・ポリシー関連の状態
  const [groupUsers, setGroupUsers] = useState<UserGroup[]>([]);
  const [groupPolicies, setGroupPolicies] = useState<PolicyGroup[]>([]);
  const [availableUsers] = useState<User[]>(initialUsers); // 事前取得したデータを使用
  const [availablePolicies] = useState<Policy[]>(initialPolicies); // 事前取得したデータを使用
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  
  // 検索フィルタリング用の状態
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  
  // バリデーションエラー用の状態
  const [selectionErrors, setSelectionErrors] = useState<Record<string, string>>({});

  // グループ選択時にフィールド値を更新
  const selectGroup = async (group: Group) => {
    setSelectedGroup(group);
    const newFieldValues = {
      groupName: group.groupName ?? "",
      description: group.description ?? "",
    };
    setFieldValues(newFieldValues);
    setTempValues(newFieldValues);
    setEditingField(null);
    setFieldErrors({});
    
    // ユーザーとポリシーのデータを取得
    await loadGroupUsersAndPolicies(group.groupId);
    
    // 検索状態をリセット
    setUserSearchTerm("");
    setPolicySearchTerm("");
    
    // 選択状態とエラーをリセット
    setSelectedUserIds([]);
    setSelectedPolicyIds([]);
    setSelectionErrors({});
  };

  // グループのユーザーとポリシーを読み込む
  const loadGroupUsersAndPolicies = async (groupId: string) => {
    setIsLoadingUsers(true);
    setIsLoadingPolicies(true);
    
    try {
      // 並行してユーザーとポリシーを取得
      const [usersResult, policiesResult] = await Promise.all([
        getUsersByGroupId(groupId),
        getPoliciesByGroupId(groupId)
      ]);
      
      if (usersResult.success) {
        setGroupUsers(usersResult.data || []);
      }
      
      if (policiesResult.success) {
        setGroupPolicies(policiesResult.data || []);
      }
    } catch (error) {
      console.error('Error loading group users and policies:', error);
    } finally {
      setIsLoadingUsers(false);
      setIsLoadingPolicies(false);
    }
  };

  // 検索フィルタリング
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // ユーザー・ポリシーのフィルタリング
  const filteredAvailableUsers = availableUsers
    .filter(user => !groupUsers.some(ug => ug.userId === user.userId))
    .filter(user => {
      const userName = user.userName || user.email || dictionary.label.nameNotSet;
      return userName.toLowerCase().includes(userSearchTerm.toLowerCase());
    });

  const filteredAvailablePolicies = availablePolicies
    .filter(policy => !groupPolicies.some(pg => pg.policyId === policy.policyId))
    .filter(policy => {
      return policy.policyName.toLowerCase().includes(policySearchTerm.toLowerCase());
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
    // グループ名のみ必須、説明はオプション
    if (field === 'groupName' && (!value || !value.trim())) {
      return dictionary.alert.requiredGroupName;
    }
    return null;
  };

  // 更新実行
  const saveField = async (field: EditableField) => {
    if (!selectedGroup) {
      setFieldErrors({ ...fieldErrors, [field]: dictionary.label.groupNotSelected });
      return;
    }

    const value = tempValues[field];
    const error = validateField(field, value);
    
    if (error) {
      setFieldErrors({ ...fieldErrors, [field]: error });
      return;
    }

    setIsUpdating(true);
    setFieldErrors({ ...fieldErrors, [field]: '' });

    try {
      console.log('Updating field:', { field, value, groupId: selectedGroup.groupId });
      const result = await updateSingleFieldForGroup(field, value, selectedGroup, dictionary);
      console.log('Update result:', result);
      
      if (result.success && result.updatedGroup) {
        // 成功時は表示値を更新し、編集モードを終了
        setFieldValues({ ...fieldValues, [field]: value });
        setEditingField(null);
        setTempValues({ ...tempValues, [field]: value });
        
        // 選択されたグループ情報も更新
        setSelectedGroup(result.updatedGroup);
        
        // グループ一覧も更新
        setGroups(groups.map(g => 
          g.groupId === result.updatedGroup!.groupId ? result.updatedGroup! : g
        ));
        
        console.log('Field updated successfully:', field);
      } else {
        // エラー時はエラーメッセージを表示
        const errorMessage = result.message || dictionary.alert.updateFail;
        setFieldErrors({ ...fieldErrors, [field]: errorMessage });
        console.error('Update failed:', result);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMessage = error?.message || dictionary.alert.updateError;
      setFieldErrors({ ...fieldErrors, [field]: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  // 削除処理
  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    setIsDeleting(true);

    try {
      const result = await deleteGroup(groupToDelete.groupId);

      if (result.success) {
        // 成功時はグループ一覧から削除
        setGroups(groups.filter(g => g.groupId !== groupToDelete.groupId));
        
        // 選択されたグループが削除対象の場合は選択を解除
        if (selectedGroup?.groupId === groupToDelete.groupId) {
          setSelectedGroup(null);
          setEditingField(null);
          setFieldErrors({});
        }
        
        // モーダルを閉じる
        onDeleteModalClose();
        setGroupToDelete(null);
        
        console.log('Group deleted successfully');
      } else {
        console.error('Delete failed:', result.message);
      }
    } catch (error: any) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 削除確認モーダルを開く
  const openDeleteModal = (group: Group) => {
    setGroupToDelete(group);
    onDeleteModalOpen();
  };

  // 不要になったトグル関数を削除
  // const toggleUsersSection = async () => { ... };
  // const togglePoliciesSection = async () => { ... };

  // ユーザーをグループに追加
  const handleAddUsersToGroup = async () => {
    if (!selectedGroup) return;
    
    if (selectedUserIds.length === 0) {
      setSelectionErrors(prev => ({ ...prev, users: dictionary.alert.selectAtLeastOneUser }));
      return;
    }

    try {
      const result = await assignUsersToGroup({
        groupId: selectedGroup.groupId,
        userIds: selectedUserIds,
        customerId: userAttributes.customerId
      });

      if (result.success) {
        // グループのユーザー一覧を再取得
        await loadGroupUsersAndPolicies(selectedGroup.groupId);
        setSelectedUserIds([]);
        // エラーをクリア
        setSelectionErrors(prev => ({ ...prev, users: '' }));
      }
    } catch (error) {
      console.error('Error adding users to group:', error);
    }
  };

  // ポリシーをグループに追加
  const handleAddPoliciesToGroup = async () => {
    if (!selectedGroup) return;
    
    if (selectedPolicyIds.length === 0) {
      setSelectionErrors(prev => ({ ...prev, policies: dictionary.alert.selectAtLeastOnePolicy }));
      return;
    }

    try {
      const result = await assignPoliciesToGroup({
        groupId: selectedGroup.groupId,
        policyIds: selectedPolicyIds,
        customerId: userAttributes.customerId
      });

      if (result.success) {
        // グループのポリシー一覧を再取得
        await loadGroupUsersAndPolicies(selectedGroup.groupId);
        setSelectedPolicyIds([]);
        // エラーをクリア
        setSelectionErrors(prev => ({ ...prev, policies: '' }));
      }
    } catch (error) {
      console.error('Error adding policies to group:', error);
    }
  };

  // ユーザーをグループから削除
  const handleRemoveUserFromGroup = async (userId: string) => {
    if (!selectedGroup) return;

    // 最後の1人を削除しようとした場合はエラーを表示
    if (groupUsers.length <= 1) {
      setSelectionErrors(prev => ({ ...prev, users: dictionary.label.minUserRequired }));
      return;
    }

    try {
      const result = await removeUsersFromGroup(selectedGroup.groupId, [userId]);
      if (result.success) {
        // グループのユーザー一覧を再取得
        await loadGroupUsersAndPolicies(selectedGroup.groupId);
        // エラーをクリア
        setSelectionErrors(prev => ({ ...prev, users: '' }));
      }
    } catch (error) {
      console.error('Error removing user from group:', error);
    }
  };

  // ポリシーをグループから削除
  const handleRemovePolicyFromGroup = async (policyId: string) => {
    if (!selectedGroup) return;

    // 最後の1つを削除しようとした場合はエラーを表示
    if (groupPolicies.length <= 1) {
      setSelectionErrors(prev => ({ ...prev, policies: dictionary.label.minPolicyRequired }));
      return;
    }

    try {
      const result = await removePoliciesFromGroup(selectedGroup.groupId, [policyId]);
      if (result.success) {
        // グループのポリシー一覧を再取得
        await loadGroupUsersAndPolicies(selectedGroup.groupId);
        // エラーをクリア
        setSelectionErrors(prev => ({ ...prev, policies: '' }));
      }
    } catch (error) {
      console.error('Error removing policy from group:', error);
    }
  };

  // フィールド表示コンポーネント
  const renderField = (
    field: EditableField,
    label: string,
    type: 'text' | 'textarea' = 'text',
    required: boolean = true
  ) => {
    const isEditing = editingField === field;
    const value = isEditing ? tempValues[field] : fieldValues[field];
    const error = fieldErrors[field];

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
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
            {type === 'textarea' ? (
              <Textarea
                value={tempValues[field] as string}
                onValueChange={(val) => {
                  setTempValues({ ...tempValues, [field]: val });
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                isDisabled={isUpdating}
                variant="bordered"
                placeholder={label}
                isInvalid={!!error}
                minRows={3}
              />
            ) : (
              <Input
                type="text"
                value={tempValues[field] as string}
                onValueChange={(val) => {
                  setTempValues({ ...tempValues, [field]: val });
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                isDisabled={isUpdating}
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
              {value || dictionary.label.notSet}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{dictionary.label.groupManagementTitle}</h1>
          <Button
            color="primary"
            as={Link}
            href={`/${userAttributes.locale}/account/group-management/create`}
            startContent={<FaPlus size={16} />}
            className="font-medium"
          >
            {dictionary.label.createNewGroup}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: グループ一覧 */}
          <Card className="lg:col-span-1 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{dictionary.label.groupListTitle.replace('{count}', filteredGroups.length.toString())}</h2>
            
            {/* 検索 */}
            <div className="mb-6">
              {isMounted ? (
                <Input
                  placeholder={dictionary.label.searchPlaceholder}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  variant="bordered"
                />
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg border border-gray-300 flex items-center px-3">
                  <span className="text-gray-500 text-sm">{dictionary.label.search}</span>
                </div>
              )}
            </div>
            
            {/* グループリスト */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {dictionary.label.groupNotFound}
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div
                    key={group.groupId}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.groupId === group.groupId
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => selectGroup(group)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{group.groupName}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* 右側: グループ編集フォーム */}
          <Card className="lg:col-span-2 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedGroup ? dictionary.label.editingGroup.replace('{groupName}', selectedGroup.groupName) : dictionary.label.selectGroupPrompt}
              </h2>
              
              {selectedGroup && (
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  startContent={<FaTrash size={14} />}
                  onPress={() => openDeleteModal(selectedGroup)}
                  className="text-sm"
                >
                  {dictionary.label.delete}
                </Button>
              )}
            </div>
            
            {selectedGroup ? (
              <div className="flex flex-col gap-6">
                {/* グループ名フィールド */}
                {renderField('groupName', dictionary.label.groupName, 'text', true)}

                {/* 説明フィールド（オプション） */}
                {renderField('description', dictionary.label.description, 'textarea', false)}
                
                {/* ユーザー管理セクション */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    <FaUsers className="inline mr-2" />
                    {dictionary.label.groupUsers}
                    <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
                  </label>
                  
                  {isLoadingUsers ? (
                    <div className="text-center py-4 text-gray-500">{dictionary.label.loadingUsers}</div>
                  ) : (
                    <>
                      {/* 現在のユーザー表示（Chip形式） */}
                      {groupUsers.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 mb-2">
                            {dictionary.label.currentUsers.replace('{count}', groupUsers.length.toString())}
                            {groupUsers.length <= 1 && (
                              <span className="text-red-500 ml-2 text-xs">{dictionary.label.lastUserCannotRemove}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {groupUsers.map((userGroup) => {
                              const user = availableUsers.find(u => u.userId === userGroup.userId);
                              const isLastUser = groupUsers.length <= 1;
                              return (
                                <Chip
                                  key={userGroup['user-groupId']}
                                  size="sm"
                                  variant="flat"
                                  color="primary"
                                  onClose={isLastUser ? undefined : () => handleRemoveUserFromGroup(userGroup.userId)}
                                  className={isLastUser ? 'cursor-not-allowed' : ''}
                                >
                                  {user?.userName || user?.email || dictionary.label.unknownUser}
                                </Chip>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* ユーザー追加 */}
                      <Autocomplete
                        placeholder={dictionary.label.searchAndSelectUser}
                        variant="bordered"
                        allowsCustomValue={false}
                        inputValue={userSearchTerm}
                        onInputChange={(value) => setUserSearchTerm(value)}
                        isInvalid={!!(selectionErrors.users)}
                        errorMessage={selectionErrors.users}
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
                              if (selectionErrors.users) {
                                setSelectionErrors(prev => ({ ...prev, users: '' }));
                              }
                            }
                            // 選択後に検索をクリア
                            setUserSearchTerm("");
                          }
                        }}
                      >
                        {filteredAvailableUsers.map((user) => (
                          <AutocompleteItem 
                            key={user.userId} 
                            className="bg-white hover:bg-gray-100"
                            textValue={user.userName || user.email || dictionary.label.nameNotSet}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Checkbox
                                isSelected={selectedUserIds.includes(user.userId)}
                                onValueChange={(isSelected) => {
                                  if (isSelected) {
                                    setSelectedUserIds(prev => [...prev, user.userId]);
                                    // エラーをクリア
                                    if (selectionErrors.users) {
                                      setSelectionErrors(prev => ({ ...prev, users: '' }));
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
                                {user.userName || user.email || dictionary.label.nameNotSet}
                              </span>
                            </div>
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                      
                      {/* 選択されたユーザー表示 */}
                      {selectedUserIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedUserIds.map((userId) => {
                            const user = availableUsers.find(u => u.userId === userId);
                            return (
                              <Chip
                                key={userId}
                                size="sm"
                                variant="flat"
                                color="success"
                                onClose={() => setSelectedUserIds(prev => prev.filter(id => id !== userId))}
                              >
                                {user?.userName || user?.email || dictionary.label.unknownUser}
                              </Chip>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* 追加ボタン */}
                      <Button
                        color="primary"
                        onPress={handleAddUsersToGroup}
                        size="sm"
                        className="mt-2"
                        isDisabled={selectedUserIds.length === 0}
                      >
                        {dictionary.label.addSelectedUsers}
                      </Button>
                    </>
                  )}
                </div>

                {/* ポリシー管理セクション */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    <FaFile className="inline mr-2" />
                    {dictionary.label.groupPolicies}
                    <span className="text-red-500 ml-1">{dictionary.label.requiredMark}</span>
                  </label>
                  
                  {isLoadingPolicies ? (
                    <div className="text-center py-4 text-gray-500">{dictionary.label.loadingPolicies}</div>
                  ) : (
                    <>
                      {/* 現在のポリシー表示（Chip形式） */}
                      {groupPolicies.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 mb-2">
                            {dictionary.label.currentPolicies.replace('{count}', groupPolicies.length.toString())}
                            {groupPolicies.length <= 1 && (
                              <span className="text-red-500 ml-2 text-xs">{dictionary.label.lastPolicyCannotRemove}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {groupPolicies.map((policyGroup) => {
                              const policy = availablePolicies.find(p => p.policyId === policyGroup.policyId);
                              const isLastPolicy = groupPolicies.length <= 1;
                              return (
                                <Chip
                                  key={policyGroup['policy-groupId']}
                                  size="sm"
                                  variant="flat"
                                  color="secondary"
                                  onClose={isLastPolicy ? undefined : () => handleRemovePolicyFromGroup(policyGroup.policyId)}
                                  className={isLastPolicy ? 'cursor-not-allowed' : ''}
                                >
                                  {policy?.policyName || dictionary.label.unknownPolicy}
                                </Chip>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* ポリシー追加 */}
                      <Autocomplete
                        placeholder={dictionary.label.searchAndSelectPolicy}
                        variant="bordered"
                        allowsCustomValue={false}
                        inputValue={policySearchTerm}
                        onInputChange={(value) => setPolicySearchTerm(value)}
                        isInvalid={!!(selectionErrors.policies)}
                        errorMessage={selectionErrors.policies}
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
                              if (selectionErrors.policies) {
                                setSelectionErrors(prev => ({ ...prev, policies: '' }));
                              }
                            }
                            // 選択後に検索をクリア
                            setPolicySearchTerm("");
                          }
                        }}
                      >
                        {filteredAvailablePolicies.map((policy) => (
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
                                    if (selectionErrors.policies) {
                                      setSelectionErrors(prev => ({ ...prev, policies: '' }));
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
                      
                      {/* 選択されたポリシー表示 */}
                      {selectedPolicyIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedPolicyIds.map((policyId) => {
                            const policy = availablePolicies.find(p => p.policyId === policyId);
                            return (
                              <Chip
                                key={policyId}
                                size="sm"
                                variant="flat"
                                color="warning"
                                onClose={() => setSelectedPolicyIds(prev => prev.filter(id => id !== policyId))}
                              >
                                {policy?.policyName || dictionary.label.unknownPolicy}
                              </Chip>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* 追加ボタン */}
                      <Button
                        color="primary"
                        onPress={handleAddPoliciesToGroup}
                        size="sm"
                        className="mt-2"
                        isDisabled={selectedPolicyIds.length === 0}
                      >
                        {dictionary.label.addSelectedPolicies}
                      </Button>
                    </>
                  )}
                </div>
                
                {/* グループ情報 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{dictionary.label.groupInfo}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{dictionary.label.createdAt} {new Date(selectedGroup.createdAt).toLocaleDateString('ja-JP')}</p>
                    <p>{dictionary.label.updatedAt} {new Date(selectedGroup.updatedAt).toLocaleDateString('ja-JP')}</p>
                    <p>{dictionary.label.groupId} {selectedGroup.groupId}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>{dictionary.label.selectGroupToEdit}</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* 削除確認モーダル */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={onDeleteModalClose}
        classNames={{
          base: "bg-white",
          backdrop: "bg-black/50"
        }}
      >
        <ModalContent className="bg-white">
          <ModalHeader className="bg-white">{dictionary.label.deleteGroupTitle}</ModalHeader>
          <ModalBody className="bg-white">
            <p>
              {dictionary.label.deleteGroupConfirm.replace('{groupName}', groupToDelete?.groupName || '')}
            </p>
            <p className="text-sm text-gray-600">
              {dictionary.label.deleteGroupWarning}
            </p>
          </ModalBody>
          <ModalFooter className="bg-white">
            <Button
              variant="light"
              onPress={onDeleteModalClose}
              isDisabled={isDeleting}
            >
              {dictionary.label.cancelButton}
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteGroup}
              isLoading={isDeleting}
              isDisabled={isDeleting}
            >
              {dictionary.label.delete}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}
