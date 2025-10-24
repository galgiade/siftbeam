"use client"

import { useState } from "react";
import { Button, Card, Input, Autocomplete, AutocompleteItem, Select, SelectItem } from "@heroui/react";
import { RiEdit2Fill } from "react-icons/ri";
import { FaCheck, FaXmark } from "react-icons/fa6";
import countries from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";
import en from "i18n-iso-countries/langs/en.json";
import fr from "i18n-iso-countries/langs/fr.json";
import de from "i18n-iso-countries/langs/de.json";
import es from "i18n-iso-countries/langs/es.json";
import pt from "i18n-iso-countries/langs/pt.json";
import ko from "i18n-iso-countries/langs/ko.json";
import id from "i18n-iso-countries/langs/id.json";
import zh from "i18n-iso-countries/langs/zh.json";
import { customerDTOProps } from "./UpdateCompanyInfoContainer";
import { updateStripeCustomerAction, CustomerUpdateInput } from "@/app/lib/actions/stripe-actions";
import PhoneInput from '@/app/_components/PhoneInput';

// 必要なロケールを登録
countries.registerLocale(ja);
countries.registerLocale(en);
countries.registerLocale(fr);
countries.registerLocale(de);
countries.registerLocale(es);
countries.registerLocale(pt);
countries.registerLocale(ko);
countries.registerLocale(id);
countries.registerLocale(zh);

// 編集可能なフィールドの型定義
type EditableField = 'name' | 'email' | 'phone' | 'country' | 'postal_code' | 'state' | 'city' | 'line1' | 'line2';

// 個別フィールド更新関数
async function updateSingleCustomerField(
  customerId: string,
  fieldName: EditableField,
  value: string
): Promise<{ success: boolean; message: string; errors?: Record<string, string>; data?: any }> {
  try {
    console.log('updateSingleCustomerField called with:', { customerId, fieldName, value });
    
    const updateData: CustomerUpdateInput = {};
    
    // 住所フィールドの場合
    if (['country', 'postal_code', 'state', 'city', 'line1', 'line2'].includes(fieldName)) {
      updateData.address = {
        [fieldName]: value,
      } as CustomerUpdateInput['address'];
    } else {
      // その他のフィールド
      if (fieldName === 'name') {
        updateData.name = value;
      } else if (fieldName === 'email') {
        updateData.email = value;
      } else if (fieldName === 'phone') {
        updateData.phone = value;
      }
    }

    console.log('Calling updateStripeCustomerAction with:', { customerId, updateData });
    const result = await updateStripeCustomerAction(customerId, updateData);
    console.log('updateStripeCustomerAction returned:', result);
    
    if (result.success) {
      return {
        success: true,
        message: result.message || `${fieldName}が正常に更新されました。`,
        data: result.data, // Stripeから返された最新データを含める
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
    console.error('Error in updateSingleCustomerField:', error);
    return {
      success: false,
      message: error?.message || '更新処理でエラーが発生しました。',
      errors: { [fieldName]: error?.message || '更新処理でエラーが発生しました。' }
    };
  }
}

export default function UpdateCompanyInfoPresentation({ customer, userAttributes, dictionary }: customerDTOProps) {
  // 管理者権限チェック
  const canEdit = userAttributes.role === 'admin';
  
  // デバッグ用ログ
  console.log('Customer data received:', customer);
  console.log('Customer address:', customer.address);
  console.log('Customer country:', customer.address.country);
  console.log('User role:', userAttributes.role, 'Can edit:', canEdit);

  // 国名リストのロケール切り替え
  const resolveCountryLocale = (locale?: string): string => {
    if (!locale) return 'en';
    const lower = locale.toLowerCase();
    if (lower.startsWith('ja')) return 'ja';
    if (lower.startsWith('fr')) return 'fr';
    if (lower.startsWith('de')) return 'de';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('pt')) return 'pt';
    if (lower.startsWith('ko')) return 'ko';
    if (lower.startsWith('id')) return 'id';
    if (lower.startsWith('zh')) return 'zh';
    if (lower.startsWith('en')) return 'en';
    return 'en';
  };

  const countryLocale = resolveCountryLocale(userAttributes.locale);
  const countryObj = countries.getNames(countryLocale, { select: "official" });
  const countryList = Object.entries(countryObj).map(([code, name]) => ({
    code,
    name,
  }));

  // 各フィールドの編集状態管理
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValues, setFieldValues] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    country: customer.address.country || "", // Stripeから取得した値をそのまま使用（stripe-actionsで変換処理）
    postal_code: customer.address.postal_code || "",
    state: customer.address.state || "",
    city: customer.address.city || "",
    line1: customer.address.line1 || "",
    line2: customer.address.line2 || "",
  });
  const [tempValues, setTempValues] = useState(fieldValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // 国選択時の特別なハンドラー（国コードを保存）
  const handleCountryChange = (countryCode: string) => {
    console.log('=== 国選択デバッグ ===');
    console.log('選択された国コード:', countryCode);
    console.log('現在のtempValues.country:', tempValues.country);
    
    // 国コードの形式を検証
    if (countryCode.length === 2 && countryCode.match(/^[A-Z]{2}$/)) {
      console.log('✅ 正しい国コード形式:', countryCode);
    } else {
      console.warn('⚠️ 不正な国コード形式:', countryCode);
    }
    
    setTempValues((prev) => {
      const newTempValues = { ...prev, country: countryCode };
      console.log('更新後のtempValues:', newTempValues);
      return newTempValues;
    });
    
    // エラーをクリア
    if (fieldErrors.country) {
      setFieldErrors({ ...fieldErrors, country: '' });
    }
  };

  // 編集開始
  const startEditing = (field: EditableField) => {
    if (!canEdit) return;
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
    if (!value || !value.trim()) {
      // フィールドごとのカスタムエラーメッセージ
      const fieldLabels: Record<EditableField, string> = {
        name: '会社名',
        email: 'メールアドレス',
        phone: '電話番号',
        country: '国',
        postal_code: '郵便番号',
        state: '都道府県',
        city: '市区町村',
        line1: '住所1',
        line2: '住所2'
      };
      return `${fieldLabels[field]}は必須です。`;
    }
    
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return '有効なメールアドレスを入力してください。';
      }
    }
    
    if (field === 'phone') {
      const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
      if (!phoneRegex.test(value)) {
        return '有効な電話番号を入力してください。';
      }
    }
    
    if (field === 'postal_code') {
      const postalCodeRegex = /^[0-9\-\s]+$/;
      if (!postalCodeRegex.test(value)) {
        return '有効な郵便番号を入力してください。';
      }
    }
    
    if (field === 'country') {
      // 国コードの形式チェック（2文字の大文字アルファベット）
      if (!value.match(/^[A-Z]{2}$/)) {
        return '有効な国を選択してください。';
      }
    }
    
    return null;
  };

  // 更新実行
  const saveField = async (field: EditableField) => {
    const value = tempValues[field];
    const error = validateField(field, value);
    
    if (error) {
      setFieldErrors({ ...fieldErrors, [field]: error });
      return;
    }

    setIsUpdating(true);
    setFieldErrors({ ...fieldErrors, [field]: '' });

    try {
      console.log('Updating field:', { field, value, customerId: customer.id });
      const result = await updateSingleCustomerField(customer.id, field, value);
      console.log('Update result:', result);
      
      if (result.success) {
        // 成功時は表示値を更新し、編集モードを終了
        setFieldValues({ ...fieldValues, [field]: value });
        setEditingField(null);
        setTempValues({ ...tempValues, [field]: value });
        console.log('Field updated successfully:', field);
        
        // Stripeから返された最新データがある場合は、それで状態を更新
        if (result.data) {
          console.log('Updating field values with latest Stripe data:', result.data);
          const updatedFieldValues = {
            name: result.data.name || "",
            email: result.data.email || "",
            phone: result.data.phone || "",
            country: result.data.address?.country || "",
            postal_code: result.data.address?.postal_code || "",
            state: result.data.address?.state || "",
            city: result.data.address?.city || "",
            line1: result.data.address?.line1 || "",
            line2: result.data.address?.line2 || "",
          };
          setFieldValues(updatedFieldValues);
          setTempValues(updatedFieldValues);
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
    type: 'text' | 'email' | 'tel' | 'select' = 'text',
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
            {field === 'country' ? (
              <Autocomplete
                placeholder={`${label}を選択してください`}
                selectedKey={tempValues[field]}
                onSelectionChange={(key) => {
                  // nullやundefinedの場合は何もしない
                  if (key) {
                    handleCountryChange(String(key));
                  } else {
                    // nullが設定されようとした場合はエラーを表示
                    setFieldErrors({ ...fieldErrors, country: '国は必須です。' });
                  }
                }}
                isDisabled={isUpdating}
                variant="bordered"
                isInvalid={!!error}
                allowsCustomValue={false}
                isClearable={false}
                isRequired
                classNames={{
                  listbox: "bg-white shadow-lg border border-gray-200",
                  popoverContent: "bg-white shadow-lg border border-gray-200"
                }}
              >
                {countryList.map((country) => (
                  <AutocompleteItem
                    key={country.code}
                    textValue={String(country.name)}
                    className="bg-white hover:bg-gray-100"
                  >
                    {String(country.name)}（{country.code}）
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            ) : field === 'phone' ? (
              <PhoneInput
                name="phone"
                label={label}
                placeholder="例: 90-3706-7654"
                value={tempValues[field]}
                onChange={(value) => {
                  setTempValues({ ...tempValues, [field]: value });
                  // エラーをクリア
                  if (fieldErrors[field]) {
                    setFieldErrors({ ...fieldErrors, [field]: '' });
                  }
                }}
                selectedCountry={tempValues.country || "JP"}
                isRequired
                isInvalid={!!error}
                isDisabled={isUpdating}
              />
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
              {field === 'country' 
                ? countryList.find(country => country.code === value)?.name || value || '未設定'
                : type === 'select' && selectOptions
                ? selectOptions?.find(opt => opt.key === value)?.label || value
                : value || '未設定'
              }
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen mx-auto flex flex-col items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{dictionary.label.title}</h2>
        
        {/* 権限に関する通知バナー */}
        {!canEdit && (
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
                  {dictionary.alert.adminOnlyEditMessage || '管理者のみが会社情報を編集できます。変更が必要な場合は管理者にお問い合わせください。'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {canEdit && (
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
                  会社情報のすべてのフィールドを編集できます
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-6">
          {/* 会社名 */}
          {renderField('name', dictionary.label.name)}

          {/* メールアドレス */}
          {renderField('email', dictionary.label.email, 'email')}

          {/* 電話番号 */}
          {renderField('phone', dictionary.label.phone, 'tel')}

          {/* 国 */}
          {renderField('country', dictionary.label.country)}

          {/* 郵便番号 */}
          {renderField('postal_code', dictionary.label.postal_code)}

          {/* 都道府県 */}
          {renderField('state', dictionary.label.state)}

          {/* 市区町村 */}
          {renderField('city', dictionary.label.city)}

          {/* 住所1 */}
          {renderField('line1', dictionary.label.line1)}

          {/* 住所2 */}
          {renderField('line2', dictionary.label.line2)}
        </div>
      </Card>
    </div>
  );
}