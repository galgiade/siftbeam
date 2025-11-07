'use client'

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Input, Textarea, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Alert, Spinner, Divider, SortDescriptor } from "@heroui/react"
import { APIKeyEntry, APIKeyStatus, updateAPIKeyAction, deleteAPIKeyAction, toggleAPIKeyStatusAction, getAPIKeyValueAction } from "@/app/lib/actions/api-key-actions"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { APIKeyLocale } from '@/app/dictionaries/apiKey/apiKey.d.ts';
import { KeyIcon, PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ClipboardDocumentIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface ApiKeyManagementPresentationProps {
  apiKeys: APIKeyEntry[];
  userAttributes: UserAttributesDTO;
  dictionary: APIKeyLocale;
}

// 編集可能なフィールドの型定義
type EditableField = 'apiName' | 'description' | 'status';

export default function ApiKeyManagementPresentation({
  apiKeys: initialApiKeys,
  userAttributes,
  dictionary
}: ApiKeyManagementPresentationProps) {
  const [apiKeys, setApiKeys] = useState<APIKeyEntry[]>(initialApiKeys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // APIキーステータスの表示設定を動的に生成
  const getStatusConfig = (status: APIKeyStatus) => {
    const configs = {
      active: { color: 'success' as const, icon: CheckCircleIcon, label: dictionary.status.active },
      inactive: { color: 'warning' as const, icon: ClockIcon, label: dictionary.status.inactive },
      expired: { color: 'danger' as const, icon: XCircleIcon, label: dictionary.status.expired },
      revoked: { color: 'danger' as const, icon: XCircleIcon, label: dictionary.status.revoked },
    };
    return configs[status];
  };

  // APIキーの表示/非表示管理
  const [visibleApiKeys, setVisibleApiKeys] = useState<Record<string, string>>({});
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});

  // モーダル管理
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();

  // フォーム状態
  const [editForm, setEditForm] = useState({
    id: '',
    apiName: '',
    description: '',
    status: 'active' as APIKeyStatus
  });

  const [selectedApiKey, setSelectedApiKey] = useState<APIKeyEntry | null>(null);

  // フィルター状態
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<APIKeyStatus | 'all'>('all');
  
  // ソート状態
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'createdAt',
    direction: 'descending'
  });

  // フィルタリングされたAPIキー
  const filteredApiKeys = apiKeys.filter(apiKey => {
    const matchesSearch = searchText === '' || 
      apiKey.apiName.toLowerCase().includes(searchText.toLowerCase()) ||
      (apiKey.description && apiKey.description.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || apiKey.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // ソートされたAPIキー
  const sortedApiKeys = [...filteredApiKeys].sort((a, b) => {
    const { column, direction } = sortDescriptor;
    let comparison = 0;

    switch (String(column)) {
      case 'apiName':
        comparison = a.apiName.localeCompare(b.apiName);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }

    return direction === 'ascending' ? comparison : -comparison;
  });

  // 通知をクリア
  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  // APIキーの表示/非表示を切り替え
  const handleShowApiKey = async (apiKeyId: string) => {
    if (visibleApiKeys[apiKeyId]) {
      // 既に表示されている場合は非表示にする
      setVisibleApiKeys(prev => {
        const newState = { ...prev };
        delete newState[apiKeyId];
        return newState;
      });
      return;
    }

    setLoadingKeys(prev => ({ ...prev, [apiKeyId]: true }));
    clearNotifications();
    
    try {
      const result = await getAPIKeyValueAction(apiKeyId);
      
      if (result.success && result.value) {
        setVisibleApiKeys(prev => ({ ...prev, [apiKeyId]: result.value! }));
      } else {
        setError(result.message || dictionary.messages.getApiFailed);
      }
    } catch (error: any) {
      setError(dictionary.messages.getApiError);
      console.error('Show API key error:', error);
    } finally {
      setLoadingKeys(prev => ({ ...prev, [apiKeyId]: false }));
    }
  };

  // APIキーをクリップボードにコピー
  const handleCopyApiKey = async (apiKeyId: string) => {
    setLoadingKeys(prev => ({ ...prev, [apiKeyId]: true }));
    clearNotifications();
    
    try {
      const result = await getAPIKeyValueAction(apiKeyId);
      
      if (result.success && result.value) {
        await navigator.clipboard.writeText(result.value);
        setSuccess(dictionary.messages.apiKeyCopied);
      } else {
        setError(result.message || dictionary.messages.getApiFailed);
      }
    } catch (error: any) {
      setError(dictionary.messages.getApiError);
      console.error('Copy API key error:', error);
    } finally {
      setLoadingKeys(prev => ({ ...prev, [apiKeyId]: false }));
    }
  };

  // クリップボードにコピー（汎用）
  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${label}${dictionary.messages.copySuccess}`);
    } catch (err) {
      setError(dictionary.messages.copyFailed);
    }
  };


  // APIキー編集
  const handleEditApiKey = async () => {
    if (!editForm.apiName.trim()) {
      setError(dictionary.messages.apiNameRequired);
      return;
    }

    setLoading(true);
    clearNotifications();

    try {
      const result = await updateAPIKeyAction({
        apiKeyId: editForm.id,
        apiName: editForm.apiName.trim(),
        description: editForm.description.trim() || undefined
        // ステータスは編集モーダルから削除されたため、更新しない
      });

      if (result.success && result.apiKey) {
        setApiKeys(prev => prev.map(apiKey => 
          apiKey.apiKeyId === editForm.id ? result.apiKey! : apiKey
        ));
        setSuccess(dictionary.messages.updateSuccess);
        onEditOpenChange();
      } else {
        setError(result.message || dictionary.messages.updateFailed);
      }
    } catch (error: any) {
      setError(dictionary.messages.updateFailed);
      console.error('Update API key error:', error);
    } finally {
      setLoading(false);
    }
  };

  // APIキー削除
  const handleDeleteApiKey = async () => {
    if (!selectedApiKey) return;

    setLoading(true);
    clearNotifications();

    try {
      const result = await deleteAPIKeyAction(selectedApiKey.apiKeyId);

      if (result.success) {
        setApiKeys(prev => prev.filter(apiKey => apiKey.apiKeyId !== selectedApiKey.apiKeyId));
        setSuccess(dictionary.messages.deleteSuccess);
        onDeleteOpenChange();
      } else {
        setError(result.message || dictionary.messages.deleteFailed);
      }
    } catch (error: any) {
      setError(dictionary.messages.deleteFailed);
      console.error('Delete API key error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ステータス切り替え
  const handleToggleStatus = async (apiKey: APIKeyEntry) => {
    setLoading(true);
    clearNotifications();

    try {
      const result = await toggleAPIKeyStatusAction(apiKey.apiKeyId);

      if (result.success && result.apiKey) {
        setApiKeys(prev => prev.map(key => 
          key.apiKeyId === apiKey.apiKeyId ? result.apiKey! : key
        ));
        
        const statusLabel = result.apiKey.status === 'active' ? dictionary.messages.statusActive : dictionary.messages.statusInactive;
        let successMessage = `${dictionary.messages.statusChangeSuccess}${statusLabel}${dictionary.messages.statusChangedTo}`;
        
        // 警告メッセージがある場合は追加
        if (result.warning) {
          successMessage += `\n\n⚠️ ${dictionary.messages.warning} ${result.warning}`;
        }
        
        setSuccess(successMessage);
      } else {
        setError(result.message || dictionary.messages.statusChangeFailed);
      }
    } catch (error: any) {
      setError(dictionary.messages.statusChangeError);
      console.error('Toggle status error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 編集モーダルを開く
  const openEditModal = (apiKey: APIKeyEntry) => {
    setEditForm({
      id: apiKey.apiKeyId,
      apiName: apiKey.apiName,
      description: apiKey.description || '',
      status: apiKey.status
    });
    onEditOpen();
  };

  // 削除モーダルを開く
  const openDeleteModal = (apiKey: APIKeyEntry) => {
    setSelectedApiKey(apiKey);
    onDeleteOpen();
  };

  // ステータスチップの表示
  const renderStatusChip = (status: APIKeyStatus) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    
    return (
      <Chip
        color={config.color}
        variant="flat"
        startContent={<Icon className="w-4 h-4" />}
        size="sm"
      >
        {config.label}
      </Chip>
    );
  };

  // 通知の自動クリア
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearNotifications();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // APIキーの自動非表示（セキュリティ強化：30秒後に自動的に非表示）
  useEffect(() => {
    if (Object.keys(visibleApiKeys).length > 0) {
      const timer = setTimeout(() => {
        setVisibleApiKeys({});
        console.log('API keys automatically hidden after 30 seconds');
      }, 30000); // 30秒
      return () => clearTimeout(timer);
    }
  }, [visibleApiKeys]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <KeyIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dictionary.title}</h1>
            <p className="text-sm text-gray-600">{dictionary.subtitle}</p>
          </div>
        </div>
        <Button
          as={Link}
          href={`/${userAttributes.locale}/account/api-keys/create`}
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          {dictionary.createButton}
        </Button>
      </div>

      {/* 通知 */}
      {error && (
        <Alert color="danger" title={dictionary.messages.errorTitle} description={error} onClose={clearNotifications} />
      )}
      {success && (
        <Alert color="success" title={dictionary.messages.successTitle} description={success} onClose={clearNotifications} />
      )}

      {/* フィルター */}
      <Card className="shadow-sm">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder={dictionary.filter.searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              startContent={<KeyIcon className="w-4 h-4 text-gray-400" />}
            />
            <Select
              placeholder={dictionary.filter.filterByStatus}
              selectedKeys={statusFilter === 'all' ? [] : [statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as APIKeyStatus || 'all')}
              className="w-full md:w-48"
            >
              <SelectItem key="all">{dictionary.filter.allStatuses}</SelectItem>
              <SelectItem key="active">{dictionary.status.active}</SelectItem>
              <SelectItem key="inactive">{dictionary.status.inactive}</SelectItem>
              <SelectItem key="expired">{dictionary.status.expired}</SelectItem>
              <SelectItem key="revoked">{dictionary.status.revoked}</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* APIキー一覧 */}
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold">{dictionary.messages.apiKeyListTitle} {dictionary.messages.apiKeyCount.replace('{count}', sortedApiKeys.length.toString())}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          {loading && apiKeys.length === 0 ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredApiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <KeyIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{dictionary.messages.noApiKeys}</p>
            </div>
          ) : (
            <Table 
              aria-label={dictionary.messages.apiKeyListTitle}
              selectionMode="none"
              sortDescriptor={sortDescriptor}
              onSortChange={(descriptor) => setSortDescriptor(descriptor)}
            >
              <TableHeader>
                <TableColumn key="apiName" allowsSorting>{dictionary.table.apiName}</TableColumn>
                <TableColumn key="apiKey">{dictionary.table.apiKey}</TableColumn>
                <TableColumn key="description">{dictionary.table.description}</TableColumn>
                <TableColumn key="status" allowsSorting>{dictionary.table.status}</TableColumn>
                <TableColumn key="createdAt" allowsSorting>{dictionary.table.createdAt}</TableColumn>
                <TableColumn key="actions">{dictionary.table.actions}</TableColumn>
              </TableHeader>
              <TableBody>
                {sortedApiKeys.map((apiKey) => (
                  <TableRow key={apiKey.apiKeyId}>
                    <TableCell>
                      <p className="font-medium">{apiKey.apiName}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {loadingKeys[apiKey.apiKeyId] ? (
                          <Spinner size="sm" />
                        ) : visibleApiKeys[apiKey.apiKeyId] ? (
                          <p className="text-xs font-mono text-gray-900 max-w-[200px] truncate" 
                             title={visibleApiKeys[apiKey.apiKeyId]}>
                            {visibleApiKeys[apiKey.apiKeyId]}
                          </p>
                        ) : (
                          <p className="text-xs font-mono text-gray-400">
                            ••••••••••••••••••••••••••••••••••••••••
                          </p>
                        )}
                        
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleShowApiKey(apiKey.apiKeyId)}
                          isDisabled={loadingKeys[apiKey.apiKeyId]}
                          className="min-w-unit-8 w-8 h-8"
                          title={visibleApiKeys[apiKey.apiKeyId] ? dictionary.messages.hideApiKey : dictionary.messages.showApiKey}
                        >
                          {visibleApiKeys[apiKey.apiKeyId] ? (
                            <EyeSlashIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                          ) : (
                            <EyeIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                          )}
                        </Button>
                        
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleCopyApiKey(apiKey.apiKeyId)}
                          isDisabled={loadingKeys[apiKey.apiKeyId]}
                          className="min-w-unit-8 w-8 h-8"
                          title={dictionary.messages.copyApiKeyToClipboard}
                        >
                          <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {apiKey.description || dictionary.modal.noDescription}
                      </p>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(apiKey.status)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(apiKey.createdAt).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<PencilIcon className="w-4 h-4" />}
                          onPress={() => openEditModal(apiKey)}
                        >
                          {dictionary.actions.edit}
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color={apiKey.status === 'active' ? 'warning' : 'success'}
                          onPress={() => handleToggleStatus(apiKey)}
                          isLoading={loading}
                        >
                          {apiKey.status === 'active' ? dictionary.actions.disable : dictionary.actions.enable}
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          startContent={<TrashIcon className="w-4 h-4" />}
                          onPress={() => openDeleteModal(apiKey)}
                        >
                          {dictionary.actions.delete}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>


      {/* 編集モーダル */}
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange} size="2xl">
        <ModalContent className="bg-white">
          {(onClose) => (
            <>
              <ModalHeader className="bg-white">
                <h2 className="text-xl font-bold">{dictionary.modal.editTitle}</h2>
              </ModalHeader>
              <ModalBody className="bg-white">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {dictionary.modal.apiName} <span className="text-red-500">{dictionary.modal.required}</span>
                    </label>
                    <Input
                      placeholder={dictionary.modal.apiNamePlaceholder}
                      value={editForm.apiName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, apiName: e.target.value }))}
                      variant="bordered"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {dictionary.modal.description}
                    </label>
                    <Textarea
                      placeholder={dictionary.modal.descriptionPlaceholder}
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      variant="bordered"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="bg-white">
                <Button variant="light" onPress={onClose}>
                  {dictionary.actions.cancel}
                </Button>
                <Button
                  color="primary"
                  onPress={handleEditApiKey}
                  isLoading={loading}
                >
                  {dictionary.actions.update}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 削除確認モーダル */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent className="bg-white">
          {(onClose) => (
            <>
              <ModalHeader className="bg-white">
                <h2 className="text-xl font-bold text-red-600">{dictionary.modal.deleteConfirmTitle}</h2>
              </ModalHeader>
              <ModalBody className="bg-white">
                <p>{dictionary.modal.deleteConfirmMessage}</p>
                {selectedApiKey && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p><strong>{dictionary.modal.apiNameLabel}</strong> {selectedApiKey.apiName}</p>
                    <p><strong>{dictionary.modal.descriptionLabel}</strong> {selectedApiKey.description || dictionary.modal.noDescription}</p>
                    <p><strong>{dictionary.modal.statusLabel}</strong> {getStatusConfig(selectedApiKey.status).label}</p>
                  </div>
                )}
                <Alert
                  color="warning"
                  title={dictionary.modal.deleteWarningTitle}
                  description={dictionary.modal.deleteWarningMessage}
                />
              </ModalBody>
              <ModalFooter className="bg-white">
                <Button variant="light" onPress={onClose}>
                  {dictionary.actions.cancel}
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteApiKey}
                  isLoading={loading}
                >
                  {dictionary.actions.delete}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}
