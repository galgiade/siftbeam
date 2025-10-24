'use client'

import { useState, useEffect } from "react"
import { Button, Card, Input, Select, SelectItem, Chip } from "@heroui/react"
import { SupportRequest } from "@/app/lib/types/TypeAPIs"
import Link from "next/link"
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs"
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import { FaPlus, FaLifeRing, FaEye, FaClock, FaCircleCheck, FaCircleExclamation } from "react-icons/fa6"

interface SupportManagementPresentationProps {
  supportRequests: SupportRequest[];
  userAttributes: UserAttributesDTO;
  dictionary: UserProfileLocale;
}

// 問題タイプのラベル
const issueTypeLabels = {
  'technical': '技術的な問題',
  'billing': '請求・支払い',
  'feature': '機能追加',
  'bug': 'バグ報告',
  'other': 'その他'
} as const;

// ステータスのラベルとアイコン
const statusConfig = {
  'open': { 
    label: '未対応', 
    color: 'danger' as const, 
    icon: FaCircleExclamation,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  'in_progress': { 
    label: '対応中', 
    color: 'warning' as const, 
    icon: FaClock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  },
  'resolved': { 
    label: '解決済み', 
    color: 'success' as const, 
    icon: FaCircleCheck,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  'closed': { 
    label: 'クローズ', 
    color: 'default' as const, 
    icon: FaCircleCheck,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  }
} as const;

export default function SupportManagementPresentation({ 
  supportRequests: initialSupportRequests, 
  userAttributes, 
  dictionary 
}: SupportManagementPresentationProps) {
  // サポートリクエスト一覧の状態管理
  const [supportRequests] = useState<SupportRequest[]>(initialSupportRequests);
  
  // フィルタリング状態
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState<'all' | 'technical' | 'billing' | 'feature' | 'bug' | 'other'>('all');
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 検索・フィルタリング
  const filteredSupportRequests = supportRequests.filter(request => {
    const matchesSearch = request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesIssueType = issueTypeFilter === 'all' || request.issueType === issueTypeFilter;
    
    return matchesSearch && matchesStatus && matchesIssueType;
  });

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ステータスチップコンポーネント
  const StatusChip = ({ status }: { status: SupportRequest['status'] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
        <Icon size={12} />
        {config.label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <FaLifeRing className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold">サポートリクエスト管理</h1>
          </div>
          <Button
            color="primary"
            as={Link}
            href={`/${userAttributes.locale}/account/support/create`}
            startContent={<FaPlus size={16} />}
            className="font-medium"
          >
            新しいリクエストを作成
          </Button>
        </div>
        
        {/* フィルター・検索エリア */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 検索 */}
            <div>
              {isMounted ? (
                <Input
                  placeholder="件名、説明、ユーザー名で検索..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  variant="bordered"
                />
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* ステータスフィルター */}
            <div>
              {isMounted ? (
                <Select
                  selectedKeys={[statusFilter]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as typeof statusFilter;
                    setStatusFilter(selectedKey);
                  }}
                  variant="bordered"
                  placeholder="ステータスでフィルター"
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">すべて</SelectItem>
                  <SelectItem key="open" className="bg-white hover:bg-gray-100">未対応</SelectItem>
                  <SelectItem key="in_progress" className="bg-white hover:bg-gray-100">対応中</SelectItem>
                  <SelectItem key="resolved" className="bg-white hover:bg-gray-100">解決済み</SelectItem>
                  <SelectItem key="closed" className="bg-white hover:bg-gray-100">クローズ</SelectItem>
                </Select>
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
            
            {/* 問題タイプフィルター */}
            <div>
              {isMounted ? (
                <Select
                  selectedKeys={[issueTypeFilter]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as typeof issueTypeFilter;
                    setIssueTypeFilter(selectedKey);
                  }}
                  variant="bordered"
                  placeholder="問題タイプでフィルター"
                  classNames={{
                    listbox: "bg-white shadow-lg border border-gray-200",
                    popoverContent: "bg-white shadow-lg border border-gray-200"
                  }}
                >
                  <SelectItem key="all" className="bg-white hover:bg-gray-100">すべて</SelectItem>
                  <SelectItem key="technical" className="bg-white hover:bg-gray-100">技術的な問題</SelectItem>
                  <SelectItem key="billing" className="bg-white hover:bg-gray-100">請求・支払い</SelectItem>
                  <SelectItem key="feature" className="bg-white hover:bg-gray-100">機能追加</SelectItem>
                  <SelectItem key="bug" className="bg-white hover:bg-gray-100">バグ報告</SelectItem>
                  <SelectItem key="other" className="bg-white hover:bg-gray-100">その他</SelectItem>
                </Select>
              ) : (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>
          </div>
        </Card>

        {/* サポートリクエスト一覧 */}
        <Card className="p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              リクエスト一覧 ({filteredSupportRequests.length}件)
            </h2>
          </div>
          
          {filteredSupportRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaLifeRing size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">サポートリクエストが見つかりません</p>
              <p className="text-sm">
                {supportRequests.length === 0 
                  ? '新しいサポートリクエストを作成してください'
                  : '検索条件を変更してください'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSupportRequests.map((request) => (
                <div
                  key={request['support-requestId']}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {request.subject}
                        </h3>
                        <StatusChip status={request.status} />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>問題タイプ: {issueTypeLabels[request.issueType]}</span>
                        <span>作成者: {request.userName}</span>
                        <span>作成日: {formatDate(request.createdAt)}</span>
                        {request.updatedAt !== request.createdAt && (
                          <span>更新日: {formatDate(request.updatedAt)}</span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                        {request.description}
                      </p>
                      
                      {request.fileKeys.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-500">添付ファイル:</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {request.fileKeys.length}件
                          </Chip>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        as={Link}
                        href={`/${userAttributes.locale}/account/support/request/${request['support-requestId']}`}
                        startContent={<FaEye size={14} />}
                      >
                        詳細を見る
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 border-t pt-2">
                    リクエストID: {request['support-requestId']}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
