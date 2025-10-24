'use client'

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Alert, Spinner, Input, Select, SelectItem, DatePicker } from '@heroui/react';
import { CreditCardIcon, PlusIcon, DocumentArrowDownIcon, CheckIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline';
import { parseDate, type DateValue } from '@internationalized/date';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getPaymentMethodsAction, createSetupIntentAction, confirmSetupIntentAction, setDefaultPaymentMethodAction, getInvoicesAction, getInvoicePdfAction, getDefaultPaymentMethodAction, deletePaymentMethodAction } from '@/app/lib/actions/payment-actions';
import type { PaymentMethodsLocale } from '@/app/dictionaries/paymentMethods/paymentMethods.d.ts';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

interface PaymentPresentationProps {
  customerId?: string;
  dictionary: PaymentMethodsLocale;
  paymentMethods?: any[] | null;
  defaultPaymentMethodId?: string | null;
  invoices?: any[] | null;
}

interface Invoice {
  id: string;
  number: string | null;
  amount_paid: number;
  currency: string;
  status: string;
  created: number;
  invoice_pdf: string | null;
}

// カード追加フォームコンポーネント
function AddCardForm({ onSuccess, onCancel, dictionary }: { onSuccess: () => void; onCancel: () => void; dictionary: PaymentMethodsLocale }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Setup Intentを作成
      const setupIntentResult = await createSetupIntentAction();
      
      if (!setupIntentResult.success || !setupIntentResult.data) {
        throw new Error(setupIntentResult.message || dictionary.alert.setupIntentFailed);
      }

      const { client_secret } = setupIntentResult.data;

      // Payment Methodを作成
      const cardNumberElement = elements.getElement(CardNumberElement);
      
      if (!cardNumberElement) {
        throw new Error(dictionary.alert.cardInfoMissing);
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // Setup Intentを確認
      const confirmResult = await confirmSetupIntentAction(client_secret, paymentMethod.id);

      if (!confirmResult.success) {
        throw new Error(confirmResult.error?.message || dictionary.alert.paymentMethodCreationFailed);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : dictionary.alert.unknownError);
    } finally {
      setLoading(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {dictionary.label.cardNumber}
        </label>
        <div className="border border-gray-300 rounded-md px-3 py-2 bg-white">
          <CardNumberElement options={elementOptions} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {dictionary.label.expiryDate}
          </label>
          <div className="border border-gray-300 rounded-md px-3 py-2 bg-white">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {dictionary.label.securityCode}
          </label>
          <div className="border border-gray-300 rounded-md px-3 py-2 bg-white">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="light" onPress={onCancel} disabled={loading}>
          {dictionary.label.cancel}
        </Button>
        <Button type="submit" color="primary" disabled={!stripe || loading}>
          {loading ? <Spinner size="sm" /> : dictionary.label.addCardButton}
        </Button>
      </div>
    </form>
  );
}

export default function PaymentPresentation({ 
  customerId, 
  dictionary,
  paymentMethods: serverPaymentMethods,
  defaultPaymentMethodId: serverDefaultPaymentMethodId,
  invoices: serverInvoices
}: PaymentPresentationProps) {
  // ダミーカードデータを追加
  const dummyPaymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1234567890',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      }
    },
    {
      id: 'pm_0987654321',
      card: {
        brand: 'mastercard',
        last4: '5555',
        exp_month: 8,
        exp_year: 2026
      }
    }
  ];

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    serverPaymentMethods ? serverPaymentMethods as PaymentMethod[] : dummyPaymentMethods
  );
  // ダミーデータを追加
  const dummyInvoices: Invoice[] = [
    {
      id: 'in_1234567890',
      number: 'INV-2024-001',
      amount_paid: 15000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-01-15').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice1.pdf'
    },
    {
      id: 'in_0987654321',
      number: 'INV-2024-002',
      amount_paid: 8500,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-02-10').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice2.pdf'
    },
    {
      id: 'in_1122334455',
      number: 'INV-2024-003',
      amount_paid: 22000,
      currency: 'jpy',
      status: 'paid',
      created: Math.floor(new Date('2024-03-05').getTime() / 1000),
      invoice_pdf: 'https://example.com/invoice3.pdf'
    }
  ];

  const [invoices, setInvoices] = useState<Invoice[]>(
    serverInvoices ? serverInvoices as Invoice[] : dummyInvoices
  );
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(
    serverInvoices ? serverInvoices as Invoice[] : dummyInvoices
  );
  const [loading, setLoading] = useState(!serverPaymentMethods);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useState<string | null>(
    serverDefaultPaymentMethodId || 'pm_1234567890' // ダミーデータの最初のカードをデフォルトに
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // フィルター状態
  const [showFilters, setShowFilters] = useState(false);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);

  // 支払い方法を取得
  const fetchPaymentMethods = async () => {
    if (!customerId) {
      setError(dictionary.alert.customerInfoNotFound);
      setLoading(false);
      return;
    }

    try {
      const [paymentMethodsResult, defaultPaymentMethodResult] = await Promise.all([
        getPaymentMethodsAction(customerId),
        getDefaultPaymentMethodAction(customerId)
      ]);
      
      if (paymentMethodsResult.success && paymentMethodsResult.paymentMethods) {
        setPaymentMethods(paymentMethodsResult.paymentMethods as PaymentMethod[]);
      } else {
        setError(paymentMethodsResult.message || dictionary.alert.errorOccurred);
      }

      if (defaultPaymentMethodResult.success) {
        setDefaultPaymentMethodId(defaultPaymentMethodResult.defaultPaymentMethodId || null);
      }
    } catch (err) {
      setError(dictionary.alert.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // サーバーから初期データがない場合のみフェッチ
    if (!serverPaymentMethods && customerId) {
      fetchPaymentMethods();
    }
  }, [customerId, serverPaymentMethods]);

  // デフォルト支払い方法を設定
  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      const result = await setDefaultPaymentMethodAction(paymentMethodId);
      
      if (result.success) {
        setDefaultPaymentMethodId(paymentMethodId);
      } else {
        setError(result.message || dictionary.alert.defaultSettingFailed);
      }
    } catch (err) {
      setError(dictionary.alert.errorOccurred);
    }
  };

  // 支払い方法を削除（デフォルト以外のみ）
  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (paymentMethodId === defaultPaymentMethodId) {
      setError('デフォルトの支払い方法は削除できません。先に別のカードをデフォルトに設定してください。');
      return;
    }

    if (!confirm('このカードを削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      setLoading(true);
      const result = await deletePaymentMethodAction(paymentMethodId);
      
      if (result.success) {
        // 支払い方法リストから削除
        setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
        setError(null);
      } else {
        setError(result.message || dictionary.alert.errorOccurred);
      }
    } catch (err) {
      setError(dictionary.alert.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  // カード追加成功時の処理
  const handleAddCardSuccess = () => {
    onOpenChange();
    fetchPaymentMethods();
  };

  // カードブランドのアイコンを取得
  const getCardBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'jcb':
        return '💳';
      default:
        return '💳';
    }
  };

  // 請求書一覧を取得
  const fetchInvoices = async () => {
    if (!customerId) {
      // customerIdがない場合はダミーデータを使用
      setInvoices(dummyInvoices);
      return;
    }

    // サーバーから初期データがある場合はスキップ
    if (serverInvoices) {
      return;
    }

    setInvoicesLoading(true);
    try {
      const result = await getInvoicesAction(customerId);
      
      if (result.success && result.invoices) {
        setInvoices(result.invoices as Invoice[]);
      } else {
        // エラーの場合もダミーデータを表示（UI確認用）
        setInvoices(dummyInvoices);
      }
    } catch (err) {
      // エラーの場合もダミーデータを表示（UI確認用）
      setInvoices(dummyInvoices);
    } finally {
      setInvoicesLoading(false);
    }
  };

  // 領収書ダウンロード
  const handleDownloadReceipt = async (invoiceId: string) => {
    // ダミーデータの場合は直接PDFを開く（UI確認用）
    const isDummyData = dummyInvoices.some(invoice => invoice.id === invoiceId);
    
    if (isDummyData) {
      // ダミーデータの場合はサンプルPDFを開く
      alert('ダミーデータのため、実際のPDFダウンロードは行われません。\n本番環境では実際の領収書PDFがダウンロードされます。');
      return;
    }

    try {
      const result = await getInvoicePdfAction(invoiceId);
      
      if (result.success && result.pdfUrl) {
        // 新しいタブでPDFを開く
        window.open(result.pdfUrl, '_blank');
      } else {
        setError(result.message || dictionary.alert.errorOccurred);
      }
    } catch (err) {
      setError(dictionary.alert.errorOccurred);
    }
  };

  // フィルター機能
  const applyFilters = () => {
    let filtered = [...invoices];

    // 金額フィルター
    if (minAmount) {
      const min = parseFloat(minAmount) * 100; // 円を銭に変換
      filtered = filtered.filter(invoice => invoice.amount_paid >= min);
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount) * 100; // 円を銭に変換
      filtered = filtered.filter(invoice => invoice.amount_paid <= max);
    }

    // 日付フィルター
    if (startDate) {
      const startTimestamp = new Date(startDate.year, startDate.month - 1, startDate.day).getTime() / 1000;
      filtered = filtered.filter(invoice => invoice.created >= startTimestamp);
    }
    if (endDate) {
      const endTimestamp = new Date(endDate.year, endDate.month - 1, endDate.day, 23, 59, 59).getTime() / 1000;
      filtered = filtered.filter(invoice => invoice.created <= endTimestamp);
    }

    setFilteredInvoices(filtered);
  };

  // フィルターをクリア
  const clearFilters = () => {
    setMinAmount('');
    setMaxAmount('');
    setStartDate(null);
    setEndDate(null);
    setFilteredInvoices(invoices);
  };

  // フィルター値が変更されたときに自動適用
  useEffect(() => {
    applyFilters();
  }, [minAmount, maxAmount, startDate, endDate, invoices]);

  // invoicesが更新されたときにfilteredInvoicesも更新
  useEffect(() => {
    setFilteredInvoices(invoices);
  }, [invoices]);

  // 初回ロード時に請求書を取得
  useEffect(() => {
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{dictionary.label.pageTitle}</h1>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onPress={onOpen}
        >
          {dictionary.label.addNewCard}
        </Button>
      </div>

      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* 登録されているカード一覧 */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5" />
            <h2 className="text-lg font-semibold">{dictionary.label.registeredPaymentMethods}</h2>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCardIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{dictionary.label.noPaymentMethods}</p>
              <Button
                color="primary"
                variant="light"
                className="mt-4"
                onPress={onOpen}
              >
                {dictionary.label.addNewCard}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getCardBrandIcon(method.card.brand)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {method.card.brand.toUpperCase()} •••• {method.card.last4}
                        </span>
                        {defaultPaymentMethodId === method.id && (
                          <Chip color="primary" size="sm" startContent={<CheckIcon className="w-3 h-3" />}>
                            {dictionary.label.defaultLabel}
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {dictionary.label.expiryLabel}: {method.card.exp_month.toString().padStart(2, '0')}/{method.card.exp_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {defaultPaymentMethodId !== method.id && (
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => handleSetDefault(method.id)}
                      >
                        {dictionary.label.setDefault}
                      </Button>
                    )}
                    {defaultPaymentMethodId !== method.id && (
                      <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        startContent={<TrashIcon className="w-4 h-4" />}
                        onPress={() => handleDeletePaymentMethod(method.id)}
                      >
                        削除
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* 領収書ダウンロード */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <DocumentArrowDownIcon className="w-5 h-5" />
              <h2 className="text-lg font-semibold">{dictionary.label.invoicesTitle}</h2>
              <Chip size="sm" variant="flat">
                {filteredInvoices.length}/{invoices.length}件
              </Chip>
            </div>
            <Button
              size="sm"
              variant="light"
              startContent={<FunnelIcon className="w-4 h-4" />}
              onPress={() => setShowFilters(!showFilters)}
            >
              フィルター
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {/* フィルターセクション */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最小金額 (円)</label>
                  <Input
                    placeholder="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    type="number"
                    size="sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最大金額 (円)</label>
                  <Input
                    placeholder="100000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    type="number"
                    size="sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    size="sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    size="sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="light"
                  onPress={clearFilters}
                >
                  クリア
                </Button>
              </div>
            </div>
          )}

          <div>
            {invoicesLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DocumentArrowDownIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{invoices.length === 0 ? dictionary.message.noInvoices : 'フィルター条件に一致する請求書がありません'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice, index) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {dictionary.label.invoiceId} #{invoice.number || invoice.id.slice(-8)}
                        </span>
                        <Chip color="success" size="sm">
                          {dictionary.label.statusPaid}
                        </Chip>
                      </div>
                      <p className="text-sm text-gray-500">
                        {dictionary.label.totalAmount}: ¥{(invoice.amount_paid / 100).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dictionary.label.issueDate}: {new Date(invoice.created * 1000).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      color="primary"
                      variant="light"
                      startContent={<DocumentArrowDownIcon className="w-4 h-4" />}
                      onPress={() => handleDownloadReceipt(invoice.id)}
                      disabled={!invoice.invoice_pdf}
                    >
                      {dictionary.label.download}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* カード追加モーダル */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent className="bg-white">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {dictionary.label.addCardTitle}
              </ModalHeader>
              <ModalBody>
                <Elements stripe={stripePromise}>
                  <AddCardForm
                    onSuccess={handleAddCardSuccess}
                    onCancel={onClose}
                    dictionary={dictionary}
                  />
                </Elements>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}