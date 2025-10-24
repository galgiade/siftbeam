'use client'

import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, Input, Textarea, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Alert, Spinner, Divider } from "@heroui/react"
import { APIKeyEntry, APIKeyStatus, updateAPIKeyAction, deleteAPIKeyAction, toggleAPIKeyStatusAction } from "@/app/lib/actions/api-key-actions"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { KeyIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface ApiKeyManagementPresentationProps {
  apiKeys: APIKeyEntry[];
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// 編集可能なフィールドの型定義
type EditableField = 'apiName' | 'description' | 'status';

// APIキーステータスの表示設定
const statusConfig = {
  active: { color: 'success' as const, icon: CheckCircleIcon, label: '有効' },
  inactive: { color: 'warning' as const, icon: ClockIcon, label: '無効' },
  expired: { color: 'danger' as const, icon: XCircleIcon, label: '期限切れ' },
  revoked: { color: 'danger' as const, icon: XCircleIcon, label: '取り消し済み' },
};

export default function ApiKeyManagementPresentation({
  apiKeys: initialApiKeys,
  userAttributes,
  dictionary
}: ApiKeyManagementPresentationProps) {
  const [apiKeys, setApiKeys] = useState<APIKeyEntry[]>(initialApiKeys);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // モーダル管理
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onOpenChange: onDetailOpenChange } = useDisclosure();

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

  // フィルタリングされたAPIキー
  const filteredApiKeys = apiKeys.filter(apiKey => {
    const matchesSearch = searchText === '' || 
      apiKey.apiName.toLowerCase().includes(searchText.toLowerCase()) ||
      (apiKey.description && apiKey.description.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || apiKey.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 通知をクリア
  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };


  // APIキー編集
  const handleEditApiKey = async () => {
    if (!editForm.apiName.trim()) {
      setError('API名は必須です');
      return;
    }

    setLoading(true);
    clearNotifications();

    try {
      const result = await updateAPIKeyAction({
        'api-keysId': editForm.id,
        apiName: editForm.apiName.trim(),
        description: editForm.description.trim() || undefined,
        status: editForm.status
      });

      if (result.success && result.apiKey) {
        setApiKeys(prev => prev.map(apiKey => 
          apiKey['api-keysId'] === editForm.id ? result.apiKey! : apiKey
        ));
        setSuccess('APIキーが正常に更新されました');
        onEditOpenChange();
      } else {
        setError(result.message || 'APIキーの更新に失敗しました');
      }
    } catch (error: any) {
      setError('APIキーの更新中にエラーが発生しました');
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
      const result = await deleteAPIKeyAction(selectedApiKey['api-keysId']);

      if (result.success) {
        setApiKeys(prev => prev.filter(apiKey => apiKey['api-keysId'] !== selectedApiKey['api-keysId']));
        setSuccess('APIキーが正常に削除されました');
        onDeleteOpenChange();
      } else {
        setError(result.message || 'APIキーの削除に失敗しました');
      }
    } catch (error: any) {
      setError('APIキーの削除中にエラーが発生しました');
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
      const result = await toggleAPIKeyStatusAction(apiKey['api-keysId']);

      if (result.success && result.apiKey) {
        setApiKeys(prev => prev.map(key => 
          key['api-keysId'] === apiKey['api-keysId'] ? result.apiKey! : key
        ));
        setSuccess(`APIキーのステータスが${result.apiKey.status === 'active' ? '有効' : '無効'}に変更されました`);
      } else {
        setError(result.message || 'ステータスの変更に失敗しました');
      }
    } catch (error: any) {
      setError('ステータスの変更中にエラーが発生しました');
      console.error('Toggle status error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 編集モーダルを開く
  const openEditModal = (apiKey: APIKeyEntry) => {
    setEditForm({
      id: apiKey['api-keysId'],
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

  // 詳細モーダルを開く
  const openDetailModal = (apiKey: APIKeyEntry) => {
    setSelectedApiKey(apiKey);
    onDetailOpen();
  };

  // ステータスチップの表示
  const renderStatusChip = (status: APIKeyStatus) => {
    const config = statusConfig[status];
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <KeyIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">APIキー管理</h1>
            <p className="text-sm text-gray-600">APIキーの作成、編集、削除を行います</p>
          </div>
        </div>
        <Button
          as={Link}
          href={`/${userAttributes.locale}/account/api-keys/create`}
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
        >
          新しいAPIキーを作成
        </Button>
      </div>

      {/* 通知 */}
      {error && (
        <Alert color="danger" title="エラー" description={error} onClose={clearNotifications} />
      )}
      {success && (
        <Alert color="success" title="成功" description={success} onClose={clearNotifications} />
      )}

      {/* フィルター */}
      <Card className="shadow-sm">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="APIキー名または説明で検索"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              startContent={<KeyIcon className="w-4 h-4 text-gray-400" />}
            />
            <Select
              placeholder="ステータスで絞り込み"
              selectedKeys={statusFilter === 'all' ? [] : [statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as APIKeyStatus || 'all')}
              className="w-full md:w-48"
            >
              <SelectItem key="all">すべてのステータス</SelectItem>
              <SelectItem key="active">有効</SelectItem>
              <SelectItem key="inactive">無効</SelectItem>
              <SelectItem key="expired">期限切れ</SelectItem>
              <SelectItem key="revoked">取り消し済み</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* APIキー一覧 */}
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-lg font-semibold">APIキー一覧 ({filteredApiKeys.length}件)</h2>
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
              <p>表示するAPIキーがありません。</p>
            </div>
          ) : (
            <Table aria-label="APIキーテーブル" selectionMode="none">
              <TableHeader>
                <TableColumn>API名</TableColumn>
                <TableColumn>説明</TableColumn>
                <TableColumn>ステータス</TableColumn>
                <TableColumn>作成日</TableColumn>
                <TableColumn>アクション</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredApiKeys.map((apiKey) => (
                  <TableRow key={apiKey['api-keysId']}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{apiKey.apiName}</p>
                        <p className="text-xs text-gray-500">ID: {apiKey['api-keysId'].substring(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {apiKey.description || '説明なし'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(apiKey.status)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {new Date(apiKey.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onPress={() => openDetailModal(apiKey)}
                        >
                          詳細
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<PencilIcon className="w-4 h-4" />}
                          onPress={() => openEditModal(apiKey)}
                        >
                          編集
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color={apiKey.status === 'active' ? 'warning' : 'success'}
                          onPress={() => handleToggleStatus(apiKey)}
                          isLoading={loading}
                        >
                          {apiKey.status === 'active' ? '無効化' : '有効化'}
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          startContent={<TrashIcon className="w-4 h-4" />}
                          onPress={() => openDeleteModal(apiKey)}
                        >
                          削除
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-bold">APIキーを編集</h2>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="API名"
                    placeholder="APIキーの名前を入力"
                    value={editForm.apiName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, apiName: e.target.value }))}
                    isRequired
                  />
                  <Textarea
                    label="説明"
                    placeholder="APIキーの説明を入力（任意）"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Select
                    label="ステータス"
                    selectedKeys={[editForm.status]}
                    onSelectionChange={(keys) => setEditForm(prev => ({ ...prev, status: Array.from(keys)[0] as APIKeyStatus }))}
                  >
                    <SelectItem key="active">有効</SelectItem>
                    <SelectItem key="inactive">無効</SelectItem>
                    <SelectItem key="expired">期限切れ</SelectItem>
                    <SelectItem key="revoked">取り消し済み</SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="primary"
                  onPress={handleEditApiKey}
                  isLoading={loading}
                >
                  更新
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 削除確認モーダル */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-bold text-red-600">APIキーを削除</h2>
              </ModalHeader>
              <ModalBody>
                <p>以下のAPIキーを削除してもよろしいですか？</p>
                {selectedApiKey && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p><strong>API名:</strong> {selectedApiKey.apiName}</p>
                    <p><strong>説明:</strong> {selectedApiKey.description || '説明なし'}</p>
                    <p><strong>ステータス:</strong> {statusConfig[selectedApiKey.status].label}</p>
                  </div>
                )}
                <Alert
                  color="warning"
                  title="注意"
                  description="この操作は取り消すことができません。APIキーを使用しているアプリケーションがある場合、アクセスできなくなります。"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteApiKey}
                  isLoading={loading}
                >
                  削除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 詳細モーダル */}
      <Modal isOpen={isDetailOpen} onOpenChange={onDetailOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-xl font-bold">APIキー詳細</h2>
              </ModalHeader>
              <ModalBody>
                {selectedApiKey && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">API名</p>
                        <p className="text-lg">{selectedApiKey.apiName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">ステータス</p>
                        {renderStatusChip(selectedApiKey.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">APIキーID</p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedApiKey['api-keysId']}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Gateway APIキーID</p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedApiKey.gatewayApiKeyId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">ポリシーID</p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedApiKey.policyId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">顧客ID</p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedApiKey.customerId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">作成日時</p>
                        <p className="text-sm">{new Date(selectedApiKey.createdAt).toLocaleString('ja-JP')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">更新日時</p>
                        <p className="text-sm">{new Date(selectedApiKey.updatedAt).toLocaleString('ja-JP')}</p>
                      </div>
                    </div>
                    {selectedApiKey.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">説明</p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApiKey.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  閉じる
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
