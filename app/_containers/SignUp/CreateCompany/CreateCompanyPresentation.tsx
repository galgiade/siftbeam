"use client"
import { Autocomplete, AutocompleteItem, Button, Input, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import countries from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";
import en from "i18n-iso-countries/langs/en.json";
import zh from "i18n-iso-countries/langs/zh.json";
import fr from "i18n-iso-countries/langs/fr.json";
import de from "i18n-iso-countries/langs/de.json";
import id from "i18n-iso-countries/langs/id.json";
import es from "i18n-iso-countries/langs/es.json";
import pt from "i18n-iso-countries/langs/pt.json";
import ko from "i18n-iso-countries/langs/ko.json";
import { useState, useEffect, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStripeCustomerAction } from '@/app/lib/actions/stripe-actions';
import type { CreateCompanyInfoLocale } from '@/app/dictionaries/createCompanyInfo/createCompanyInfo';
import PhoneInput from '@/app/_components/PhoneInput';

// 必要なロケールを登録
countries.registerLocale(ja);
countries.registerLocale(en);
countries.registerLocale(zh);
countries.registerLocale(fr);
countries.registerLocale(de);
countries.registerLocale(id);
countries.registerLocale(es);
countries.registerLocale(pt);
countries.registerLocale(ko);

export default function CreateCompanyPresentation({ locale, dictionary }: { locale: string, dictionary: CreateCompanyInfoLocale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await createStripeCustomerAction(formData);
    },
    {
      success: false,
      message: '',
      errors: {},
      customerId: undefined
    }
  );
  // ロケールをi18n-iso-countries用に変換
  const getCountryLocale = (appLocale: string): string => {
    const lower = appLocale.toLowerCase();
    // 中国語系の特別処理
    if (lower === 'zh-cn' || lower.startsWith('zh-cn')) return 'zh'; // 簡体字
    if (lower === 'zh-tw' || lower.startsWith('zh-tw')) return 'zh-TW'; // 繁体字
    // その他のロケールはベース言語を返す（地域コードを除去）
    if (lower.startsWith('en')) return 'en'; // en-US, en-GB -> en
    if (lower.startsWith('ja')) return 'ja'; // ja-JP -> ja
    if (lower.startsWith('ko')) return 'ko'; // ko-KR -> ko
    if (lower.startsWith('fr')) return 'fr'; // fr-FR, fr-CA -> fr
    if (lower.startsWith('de')) return 'de'; // de-DE, de-AT -> de
    if (lower.startsWith('es')) return 'es'; // es-ES, es-MX -> es
    if (lower.startsWith('pt')) return 'pt'; // pt-BR, pt-PT -> pt
    if (lower.startsWith('id')) return 'id'; // id-ID -> id
    // デフォルトは元のロケールを返す
    return appLocale;
  };

  // ロケールに応じて国名リストを取得
  const countryLocale = getCountryLocale(locale);
  const countryObj = countries.getNames(countryLocale, { select: "official" });
  const countryList = Object.entries(countryObj).map(([code, name]) => ({
    code,
    name,
  }));
  // 例: 日本の都道府県リストを取得
  const [address, setAddress] = useState({
    country: "JP", // デフォルトで日本の国コードを設定
    postalCode: "",
    state: "",
    city: "",
    line1: "",
    line2: "",
    name: "",
    phone: "",
    email: "",
  });

  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>({});

  // localStorageから初期値を復元
  useEffect(() => {
    const saved = localStorage.getItem("stripeCompanyInfoDraft");
    if (saved) {
      setAddress(JSON.parse(saved));
    }
  }, []);

  // addressが変わるたびlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("stripeCompanyInfoDraft", JSON.stringify(address));
  }, [address]);

  const handleChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // 国選択時の特別なハンドラー（国コードを保存）
  const handleCountryChange = (countryCode: string) => {
    console.log('=== 国選択デバッグ ===');
    console.log('選択された国コード:', countryCode);
    console.log('現在のaddress.country:', address.country);
    
    // 国コードの形式を検証
    if (countryCode.length === 2 && countryCode.match(/^[A-Z]{2}$/)) {
      console.log('✅ 正しい国コード形式:', countryCode);
    } else {
      console.warn('⚠️ 不正な国コード形式:', countryCode);
    }
    
    setAddress((prev) => {
      const newAddress = { ...prev, country: countryCode };
      console.log('更新後のaddress:', newAddress);
      return newAddress;
    });
  };

  const validateClient = () => {
    const newErrors: { [key: string]: string } = {};
    if (!address.country) newErrors.country = dictionary.alert.countryRequired;
    if (!address.postalCode) newErrors.postalCode = dictionary.alert.postalCodeRequired;
    if (!address.state) newErrors.state = dictionary.alert.stateRequired;
    if (!address.city) newErrors.city = dictionary.alert.cityRequired;
    if (!address.line1) newErrors.line1 = dictionary.alert.line1Required;
    if (!address.name) newErrors.name = dictionary.alert.nameRequired;
    if (!address.email) newErrors.email = dictionary.alert.emailRequired;
    if (!address.phone) newErrors.phone = dictionary.alert.phoneRequired;
    
    // メールアドレスの形式チェック
    if (address.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = dictionary.alert.emailRequired; // 適切なメッセージに変更可能
    }
    
    return newErrors;
  };

  // サーバーアクション成功時の処理をuseEffectで実行
  useEffect(() => {
    if (state.success && state.customerId && !isPending) {
      // ローカルストレージをクリア
      localStorage.removeItem("stripeCompanyInfoDraft");
      // 管理者作成ページへ遷移
      router.push(`/${locale}/signup/create-admin`);
    }
  }, [state.success, state.customerId, isPending, router, locale]);

  const handleClientValidation = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateClient();
    setClientErrors(newErrors);
    
    // デバッグ用ログ - フォーム送信前の状態確認
    console.log('=== フォーム送信前のデバッグ情報 ===');
    console.log('address state:', address);
    console.log('clientErrors:', newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // startTransitionを使用してフォーム送信
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // FormDataの内容をログ出力
      console.log('=== FormData内容 ===');
      console.log('送信される国コード:', address.country);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const inputFields = [
    { name: "name", label: dictionary.label.nameLabel, placeholder: dictionary.label.namePlaceholder},
    { name: "email", label: dictionary.label.emailLabel, placeholder: dictionary.label.emailPlaceholder},
    { name: "postalCode", label: dictionary.label.postalCodeLabel, placeholder: dictionary.label.postalCodePlaceholder},
    { name: "state", label: dictionary.label.stateLabel, placeholder: dictionary.label.statePlaceholder},
    { name: "city", label: dictionary.label.cityLabel, placeholder: dictionary.label.cityPlaceholder},
    { name: "line1", label: dictionary.label.line1Label, placeholder: dictionary.label.line1Placeholder},
    { name: "line2", label: dictionary.label.line2Label, placeholder: dictionary.label.line2Placeholder},
  ];

  return (
    <div className="min-h-screen  w-1/2 mx-auto flex flex-col items-center justify-center py-8">
      {/* 進行状況Breadcrumbs */}
      <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm  text-gray-500">{dictionary.label.accountCreation}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">{dictionary.label.companyInfo}</span>
            </div>
            <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">{dictionary.label.adminSetup}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-500">{dictionary.label.paymentSetup}</span>
            </div>
              
            </div>
          </div>
      </div>

      <div className="w-3/4 mx-auto flex flex-col gap-4 border-2 border-gray-300 rounded-md p-8 bg-white shadow-lg">
        <form onSubmit={handleClientValidation} className="flex flex-col gap-12">
          <input type="hidden" name="locale" value={locale} />
          <h1 className="text-2xl font-bold">{dictionary.label.companyInfoTitle}</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {dictionary.label.countryLabel}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Autocomplete
                placeholder={dictionary.label.countryPlaceholder}
                selectedKey={address.country}
                onSelectionChange={(key) => handleCountryChange(String(key))}
                isRequired
                isInvalid={!!(clientErrors.country || state.errors?.country)}
                errorMessage={clientErrors.country || state.errors?.country}
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
            </div>
            <input type="hidden" name="country" value={address.country} />
            {/* デバッグ用：隠しinputの値を確認 */}
            {(() => {
              console.log('隠しinputのcountry値:', address.country);
              return null;
            })()}
          </div>
          
          {/* 電話番号入力（特別なコンポーネント） */}
          <div className="flex flex-col gap-4">
            <PhoneInput
              name="phone"
              label={dictionary.label.phoneLabel}
              placeholder={dictionary.label.phonePlaceholder}
              value={address.phone}
              onChange={(value) => handleChange("phone", value)}
              selectedCountry={address.country}
              isRequired
              isInvalid={!!(clientErrors.phone || state.errors?.phone)}
              errorMessage={clientErrors.phone || state.errors?.phone}
              isDisabled={isPending}
            />
          </div>
          
          {inputFields.map((field) => (
            <div key={field.name} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={address[field.name as keyof typeof address]}
                  onChange={e => handleChange(field.name, e.target.value)}
                  isRequired
                  isInvalid={!!(clientErrors[field.name] || state.errors?.[field.name])}
                  errorMessage={clientErrors[field.name] || state.errors?.[field.name]}
                />
              </div>
            </div>
          ))}
          
          {/* サーバーアクションのメッセージ表示 */}
          {state.message && !state.success && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-normal leading-relaxed">{state.message}</p>
            </div>
          )}

          {state.success && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 text-sm font-normal leading-relaxed">{state.message}</p>
            </div>
          )}

          <div className="flex flex-row justify-center gap-40">
            <Button
              type="submit"
              isDisabled={isPending}
              isLoading={isPending}
              color="primary"
              size="lg"
              className="w-1/4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm"
            >
              {isPending ? dictionary.label.submitting : dictionary.label.next}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}