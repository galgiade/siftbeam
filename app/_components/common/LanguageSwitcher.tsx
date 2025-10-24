'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { useAuth } from "@/app/lib/auth/auth-client";
import { updateUser } from "@/app/lib/actions/user-api";

// サポートされている言語の設定（9カ国）
const LOCALES = [
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
];

type LanguageSwitcherProps = {
  currentLocale: string;
  translations?: {
    languageSelector?: string;
  };
};

export default function LanguageSwitcher({ 
  currentLocale, 
  translations = {} 
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // 現在の言語を取得
  const currentLocaleObj = LOCALES.find(locale => locale.code === currentLocale) || LOCALES[0]!;

  // 言語を切り替える関数
  const handleLocaleChange = async (newLocale: string) => {
    console.log('=== 言語変更開始 ===');
    console.log('新しい言語:', newLocale);
    console.log('認証状態:', isAuthenticated);
    
    // URLの言語部分を置き換え（即座に反映）
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newUrl = segments.join('/');
    
    // Next.jsのルーターを使用してナビゲーション（最優先）
    router.push(newUrl);
    setIsOpen(false);
    
    // 認証済みの場合、バックグラウンドでCognitoの属性も更新
    if (isAuthenticated && user) {
      try {
        console.log('Cognitoのlocale属性を更新中:', { newLocale, userId: user.sub });
        
        const updateInput = {
          userId: user.sub,
          locale: newLocale
        };

        const userAttributes = {
          sub: user.sub,
          preferred_username: user.preferred_username || '',
          customerId: user.customerId || '',
          role: user.role || 'user',
          locale: newLocale,
          paymentMethodId: user.paymentMethodId || ''
        };

        const result = await updateUser(updateInput, userAttributes);
        
        if (result.success) {
          console.log('✅ Cognitoのlocale属性が正常に更新されました');
        } else {
          console.error('❌ Cognitoのlocale属性の更新に失敗:', result.message);
          // エラーが発生してもページ遷移は既に完了しているため問題なし
        }
      } catch (e: any) {
        console.error('❌ Cognitoのlocale属性の更新でエラー:', e);
        // エラーが発生してもページ遷移は既に完了しているため問題なし
      }
    } else {
      console.log('未認証ユーザー: Cognitoの更新はスキップ');
    }
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button 
          variant="light" 
          className="min-w-0 px-2 text-white hover:bg-blue-800 transition-colors"
        >
          <span className="mr-1">{currentLocaleObj.flag}</span>
          <span className="hidden sm:inline">{currentLocaleObj.label}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label={translations.languageSelector || "Select Language"}
        onAction={(key) => { handleLocaleChange(key as string); }}
        classNames={{
          base: "bg-white shadow-lg border border-gray-200",
        }}
      >
        {LOCALES.map(locale => (
          <DropdownItem 
            key={locale.code} 
            className={`bg-white hover:bg-gray-100 ${locale.code === currentLocale ? 'font-bold bg-blue-50' : ''}`}
          >
            <div className="flex items-center">
              <span className="mr-2">{locale.flag}</span>
              <span>{locale.label}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
} 