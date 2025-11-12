
'use client';

import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@heroui/react";
import { useRouter } from 'next/navigation';
import LanguageSwitcher from "@/app/_components/common/LanguageSwitcher";
import { useAuth } from "@/app/lib/auth/auth-client";
import type { CommonLocale } from "@/app/dictionaries/common/common.d.ts";
import { useEffect, useState } from 'react';

// ナビゲーションリンクの定義を配列として外出し
export const NAVIGATION_ITEMS = [
  { href: "/pricing", key: "pricing" },
  { href: "/flow", key: "flow" },
  { href: "/faq", key: "faq" },
  { href: "/announcement", key: "announcement" },
  { href: "/service", key: "services" },
  { href: "/account/user", key: "myPage" }
] as const;

type NavigationBarProps = {
  locale: string;
  dictionary: CommonLocale["common"]["navigation"];
};

export default function NavigationBar({ locale, dictionary }: NavigationBarProps) {
  const navigation = dictionary;
  const router = useRouter();
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ナビゲーション項目の翻訳されたラベルを含む配列を作成
  const localizedNavItems = NAVIGATION_ITEMS.map(item => ({
    ...item,
    label: navigation[item.key] || item.key // フォールバック
  }));

  // サインアウト処理
  const handleSignOut = async () => {
    try {
      await signOut();
      // ホームページにリダイレクト
      router.push(`/${locale}`);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Navbar className="bg-blue-900 shadow-sm">
      {/* ブランド領域：ロゴやアプリ名を配置 */}
      <NavbarBrand>
        <Link href={`/${locale}`} className="text-xl font-bold text-white hover:opacity-80 transition-opacity">
          siftbeam
        </Link>
      </NavbarBrand>
      
      <NavbarContent className="hidden md:flex gap-4">
        {localizedNavItems.map(({ href, label }) => (
          <NavbarItem key={href}>
            <Link 
              href={`/${locale}${href}`} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              {label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      
      <NavbarContent justify="end">
        {!mounted ? (
          <>
            <NavbarItem>
              <div className="w-20 h-10" />
            </NavbarItem>
            <NavbarItem>
              <div className="w-10 h-10" />
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              {/* 認証状態に応じて表示を切り替え */}
              {loading ? (
                <div className="w-20 h-10" />
              ) : isAuthenticated ? (
                <Button
                  onPress={handleSignOut}
                  variant="light"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {navigation.signOut}
                </Button>
              ) : (
                <Button
                  as={Link}
                  href={`/${locale}/signin`}
                  variant="light"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {navigation.signIn}
                </Button>
              )}
            </NavbarItem>
            <NavbarItem>
              <LanguageSwitcher currentLocale={locale} />
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}