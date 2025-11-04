'use client'

import { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Divider, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Input,
  Select,
  SelectItem,
  DatePicker,
  Spinner,
  Pagination
} from '@heroui/react';
import { 
  DocumentTextIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { type DateValue } from '@internationalized/date';
import { 
  getAuditLogsByCustomerIdAction,
  type AuditLogEntry,
  type GetAuditLogsResponse
} from '@/app/lib/actions/audit-log-actions';
import { UserAttributesDTO } from '@/app/lib/types/TypeAPIs';
import type { AuditLogLocale } from '@/app/dictionaries/auditLog/auditLog.d.ts';

interface AuditLogPresentationProps {
  userAttributes: UserAttributesDTO;
  initialAuditLogs: GetAuditLogsResponse;
  locale: string;
  dictionary: AuditLogLocale;
}

export default function AuditLogPresentation({
  userAttributes,
  initialAuditLogs,
  locale,
  dictionary,
}: AuditLogPresentationProps) {
  // State管理
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs.data || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // DynamoDBページネーション用
  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>(undefined);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(initialAuditLogs.nextToken);
  const [pageTokenHistory, setPageTokenHistory] = useState<(string | undefined)[]>([undefined]); // ページトークンの履歴
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  // フィルター状態
  const [showFilters, setShowFilters] = useState(false);
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterResource, setFilterResource] = useState<string>('');
  const [filterUserId, setFilterUserId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // ソート状態
  const [sortDescriptor, setSortDescriptor] = useState<{column: string; direction: 'ascending' | 'descending'}>({
    column: 'createdAt',
    direction: 'descending'
  });
  

  // フィルタリングされたデータ
  const filteredLogs = auditLogs.filter(log => {
    // 検索語でフィルタ
    if (searchTerm && !log.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.resource.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.changedField?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // アクションでフィルタ
    if (filterAction && log.action !== filterAction) {
      return false;
    }
    
    // リソースでフィルタ
    if (filterResource && log.resource !== filterResource) {
      return false;
    }
    
    // ユーザーIDでフィルタ
    if (filterUserId && log.userId !== filterUserId) {
      return false;
    }
    
    // ステータスでフィルタ
    if (filterStatus && log.status !== filterStatus) {
      return false;
    }
    
    // 日付範囲でフィルタ
    if (startDate || endDate) {
      const logDate = new Date(log.createdAt);
      
      if (startDate) {
        const start = new Date(startDate.year, startDate.month - 1, startDate.day);
        if (logDate < start) return false;
      }
      
      if (endDate) {
        const end = new Date(endDate.year, endDate.month - 1, endDate.day + 1);
        if (logDate >= end) return false;
      }
    }
    
    return true;
  });

  // ソート処理
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue: any = a[sortDescriptor.column as keyof AuditLogEntry];
    let bValue: any = b[sortDescriptor.column as keyof AuditLogEntry];
    
    // 日付の場合
    if (sortDescriptor.column === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // 文字列の場合
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortDescriptor.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDescriptor.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // ページネーション: 次のページを取得
  const loadPage = async (pageToken: string | undefined) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAuditLogsByCustomerIdAction(itemsPerPage, pageToken);
      if (result.success && result.data) {
        setAuditLogs(result.data);
        setNextPageToken(result.nextToken);
        setCurrentPageToken(pageToken);
      } else {
        setError(result.message || dictionary.alert.fetchError);
      }
    } catch (err) {
      setError(dictionary.alert.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  // ページ変更ハンドラー
  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;
    
    // 次のページへ
    if (page > currentPage) {
      if (nextPageToken) {
        // 新しいページトークンを履歴に追加
        const newHistory = [...pageTokenHistory];
        if (page > newHistory.length) {
          newHistory.push(nextPageToken);
        }
        setPageTokenHistory(newHistory);
        setCurrentPage(page);
        await loadPage(nextPageToken);
      }
    } 
    // 前のページへ
    else {
      const targetToken = pageTokenHistory[page - 1];
      setCurrentPage(page);
      await loadPage(targetToken);
    }
  };

  // データを再読み込み
  const refreshData = async () => {
    setCurrentPage(1);
    setPageTokenHistory([undefined]);
    setCurrentPageToken(undefined);
    await loadPage(undefined);
  };

  // フィルターをクリア
  const clearFilters = () => {
    setFilterAction('');
    setFilterResource('');
    setFilterUserId('');
    setFilterStatus('');
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setCurrentPage(1);
  };


  // ステータスチップの色を取得
  const getStatusColor = (status: string) => {
    return status === 'SUCCESS' ? 'success' : 'danger';
  };

  // アクションチップの色を取得
  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'danger';
      case 'READ': return 'default';
      case 'ATTACH': return 'primary';
      case 'DETACH': return 'secondary';
      default: return 'default';
    }
  };

  // 日時フォーマット
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // ユニークな値を取得（フィルター用）
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];
  const uniqueResources = [...new Set(auditLogs.map(log => log.resource))];
  const uniqueUserIds = [...new Set(auditLogs.map(log => log.userId))];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6" />
            {dictionary.label.pageTitle}
          </h1>
          <p className="text-gray-600 mt-1">{dictionary.label.pageDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="light"
            startContent={<FunnelIcon className="w-4 h-4" />}
            onPress={() => setShowFilters(!showFilters)}
          >
            {dictionary.label.filterButton}
          </Button>
          <Button
            color="primary"
            variant="light"
            onPress={refreshData}
            isLoading={loading}
          >
            {dictionary.label.refreshButton}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardBody>
            <div className="flex items-center gap-2 text-red-700">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* フィルターセクション */}
      {showFilters && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{dictionary.label.filterTitle}</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder={dictionary.label.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
              />
              
              <Select
                placeholder={dictionary.label.actionPlaceholder}
                selectedKeys={filterAction ? [filterAction] : []}
                onSelectionChange={(keys) => setFilterAction(Array.from(keys)[0] as string || '')}
              >
                {uniqueActions.map((action) => (
                  <SelectItem key={action}>
                    {action}
                  </SelectItem>
                ))}
              </Select>
              
              <Select
                placeholder={dictionary.label.resourcePlaceholder}
                selectedKeys={filterResource ? [filterResource] : []}
                onSelectionChange={(keys) => setFilterResource(Array.from(keys)[0] as string || '')}
              >
                {uniqueResources.map((resource) => (
                  <SelectItem key={resource}>
                    {resource}
                  </SelectItem>
                ))}
              </Select>
              
              <Select
                placeholder={dictionary.label.statusPlaceholder}
                selectedKeys={filterStatus ? [filterStatus] : []}
                onSelectionChange={(keys) => setFilterStatus(Array.from(keys)[0] as string || '')}
              >
                <SelectItem key="SUCCESS">{dictionary.label.statusSuccess}</SelectItem>
                <SelectItem key="FAILED">{dictionary.label.statusFailed}</SelectItem>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DatePicker
                label={dictionary.label.startDateLabel}
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label={dictionary.label.endDateLabel}
                value={endDate}
                onChange={setEndDate}
              />
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="light" onPress={clearFilters}>
                {dictionary.label.clearButton}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">{auditLogs.length}</div>
            <div className="text-sm text-gray-600">{dictionary.label.statsTotal}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {auditLogs.filter(log => log.status === 'SUCCESS').length}
            </div>
            <div className="text-sm text-gray-600">{dictionary.label.statsSuccess}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {auditLogs.filter(log => log.status === 'FAILED').length}
            </div>
            <div className="text-sm text-gray-600">{dictionary.label.statsFailed}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-purple-600">{filteredLogs.length}</div>
            <div className="text-sm text-gray-600">{dictionary.label.statsFiltered}</div>
          </CardBody>
        </Card>
      </div>

      {/* テーブル */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold">{dictionary.label.tableTitle}</h3>
            <div className="text-sm text-gray-600">
              {dictionary.label.pageLabel} {currentPage} ({sortedLogs.length}{dictionary.label.itemsCount})
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table 
              aria-label={dictionary.label.tableAriaLabel}
              sortDescriptor={sortDescriptor}
              onSortChange={(descriptor: any) => setSortDescriptor(descriptor)}
            >
              <TableHeader>
                <TableColumn key="createdAt" allowsSorting>{dictionary.label.columnDateTime}</TableColumn>
                <TableColumn key="userName" allowsSorting>{dictionary.label.columnUser}</TableColumn>
                <TableColumn key="action" allowsSorting>{dictionary.label.columnAction}</TableColumn>
                <TableColumn key="resource" allowsSorting>{dictionary.label.columnResource}</TableColumn>
                <TableColumn key="changedField" allowsSorting>{dictionary.label.columnChangedField}</TableColumn>
                <TableColumn>{dictionary.label.columnOldValue}</TableColumn>
                <TableColumn>{dictionary.label.columnNewValue}</TableColumn>
                <TableColumn key="status" allowsSorting>{dictionary.label.columnStatus}</TableColumn>
                <TableColumn>{dictionary.label.columnErrorDetail}</TableColumn>
              </TableHeader>
              <TableBody emptyContent={dictionary.label.noData}>
                {sortedLogs.map((log) => (
                  <TableRow key={log['audit-logsId']}>
                    <TableCell>
                      <div className="text-sm">
                        {formatDateTime(log.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-xs text-gray-500">{log.userId.slice(0, 8)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getActionColor(log.action)}
                        variant="flat"
                        size="sm"
                      >
                        {log.action}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{log.resource}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        {log.changedField || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 max-w-[150px] truncate" title={log.oldValue || '-'}>
                        {log.oldValue || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 max-w-[150px] truncate" title={log.newValue || '-'}>
                        {log.newValue || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getStatusColor(log.status)}
                        variant="flat"
                        size="sm"
                        startContent={
                          log.status === 'SUCCESS' ? 
                            <CheckCircleIcon className="w-3 h-3" /> : 
                            <XCircleIcon className="w-3 h-3" />
                        }
                      >
                        {log.status === 'SUCCESS' ? dictionary.label.statusSuccess : dictionary.label.statusFailed}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {log.errorDetail ? (
                        <div className="text-sm text-red-600 max-w-[200px]" title={log.errorDetail}>
                          {log.errorDetail}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* ページネーション */}
      <div className="flex justify-center items-center gap-4">
        <Button
          size="sm"
          variant="flat"
          isDisabled={currentPage === 1 || loading}
          onPress={() => handlePageChange(currentPage - 1)}
        >
          {dictionary.label.previousPage}
        </Button>
        <span className="text-sm text-gray-600">
          {dictionary.label.pageLabel} {currentPage}
        </span>
        <Button
          size="sm"
          variant="flat"
          isDisabled={!nextPageToken || loading}
          onPress={() => handlePageChange(currentPage + 1)}
        >
          {dictionary.label.nextPage}
        </Button>
      </div>
    </div>
  );
}
