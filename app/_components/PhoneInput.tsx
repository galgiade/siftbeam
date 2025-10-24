'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, Select, SelectItem } from '@heroui/react';
import { getPhoneCodeByCountry, COUNTRY_PHONE_CODES } from '@/app/lib/utils/phone-utils';

interface PhoneInputProps {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  selectedCountry?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

export default function PhoneInput({
  name,
  label,
  placeholder = "例: 90-3706-7654",
  value,
  onChange,
  selectedCountry = 'JP',
  isRequired = false,
  isInvalid = false,
  errorMessage,
  isDisabled = false,
}: PhoneInputProps) {
  const [phoneCode, setPhoneCode] = useState(getPhoneCodeByCountry(selectedCountry));
  const [phoneNumber, setPhoneNumber] = useState('');
  const isInitialized = useRef(false);
  const lastSelectedCountry = useRef(selectedCountry);

  // 初期化時のみ実行
  useEffect(() => {
    if (!isInitialized.current) {
      const initialPhoneCode = getPhoneCodeByCountry(selectedCountry);
      setPhoneCode(initialPhoneCode);
      
      if (value && value.startsWith('+')) {
        // 既存の国際形式の電話番号を分解
        if (value.startsWith(initialPhoneCode)) {
          setPhoneNumber(value.slice(initialPhoneCode.length));
        }
      } else if (value) {
        // 国内形式の電話番号
        setPhoneNumber(value);
      }
      
      isInitialized.current = true;
      lastSelectedCountry.current = selectedCountry;
    }
  }, [value, selectedCountry]);

  // 国が変更された時のみ国番号を自動更新
  useEffect(() => {
    if (isInitialized.current && selectedCountry !== lastSelectedCountry.current) {
      const newPhoneCode = getPhoneCodeByCountry(selectedCountry);
      setPhoneCode(newPhoneCode);
      lastSelectedCountry.current = selectedCountry;
      
      // 電話番号がある場合は新しい国番号で更新
      if (phoneNumber) {
        const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
        onChange(`${newPhoneCode}${cleanNumber}`);
      }
    }
  }, [selectedCountry]);

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    
    // 数字のみを抽出
    const cleanNumber = newPhoneNumber.replace(/[^\d]/g, '');
    
    // 完全な国際形式の電話番号を生成
    const fullPhoneNumber = cleanNumber ? `${phoneCode}${cleanNumber}` : '';
    
    console.log('=== 電話番号入力デバッグ ===');
    console.log('入力された番号:', newPhoneNumber);
    console.log('クリーンな番号:', cleanNumber);
    console.log('国番号:', phoneCode);
    console.log('完全な電話番号:', fullPhoneNumber);
    
    onChange(fullPhoneNumber);
  };

  const handlePhoneCodeChange = (newPhoneCode: string) => {
    setPhoneCode(newPhoneCode);
    
    // 完全な電話番号を更新
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    if (cleanNumber) {
      onChange(`${newPhoneCode}${cleanNumber}`);
    } else {
      // 電話番号が空の場合は国番号のみ更新
      onChange('');
    }
  };

  // 国番号のオプションを生成（重複する国番号をグループ化）
  const phoneCodeMap = new Map<string, string[]>();
  
  // 国番号ごとに国コードをグループ化
  Object.entries(COUNTRY_PHONE_CODES).forEach(([countryCode, phoneCode]) => {
    if (!phoneCodeMap.has(phoneCode)) {
      phoneCodeMap.set(phoneCode, []);
    }
    phoneCodeMap.get(phoneCode)!.push(countryCode);
  });
  
  // ユニークなオプションを生成してソート
  const phoneCodeOptions = Array.from(phoneCodeMap.entries())
    .map(([phoneCode, countryCodes]) => {
      const label = countryCodes.length === 1 
        ? `${phoneCode} (${countryCodes[0]})`
        : `${phoneCode} (${countryCodes.slice(0, 3).join(', ')}${countryCodes.length > 3 ? '...' : ''})`;
      
      return {
        key: phoneCode,
        label,
        phoneCode,
      };
    })
    .sort((a, b) => {
      // 数値部分でソート
      const aNum = parseInt(a.phoneCode.replace('+', ''));
      const bNum = parseInt(b.phoneCode.replace('+', ''));
      return aNum - bNum;
    });

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex gap-2">
        {/* 国番号選択 */}
        <Select
          selectedKeys={new Set([phoneCode])}
          onSelectionChange={(keys) => {
            const selectedCode = Array.from(keys)[0] as string;
            handlePhoneCodeChange(selectedCode);
          }}
          className="w-52 flex-shrink-0"
          isDisabled={isDisabled}
          aria-label="国番号選択"
          placeholder="国番号"
          classNames={{
            listbox: "bg-white shadow-lg border border-gray-200",
            popoverContent: "bg-white shadow-lg border border-gray-200"
          }}
        >
          {phoneCodeOptions.map((option) => (
            <SelectItem 
              key={option.key}
              className="bg-white hover:bg-gray-100 data-[selected=true]:bg-blue-50"
            >
              {option.label}
            </SelectItem>
          ))}
        </Select>

        {/* 電話番号入力 */}
        <Input
          name={name}
          placeholder={placeholder}
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          isRequired={isRequired}
          isInvalid={isInvalid}
          errorMessage={errorMessage}
          isDisabled={isDisabled}
          className="flex-1"
          type="tel"
        />
      </div>
      
      {/* 完全な電話番号のプレビュー */}
      {phoneNumber && phoneCode && (
        <div className="text-xs text-gray-500">
          完全な電話番号: {phoneCode}{phoneNumber.replace(/[^\d]/g, '')}
        </div>
      )}
    </div>
  );
}
