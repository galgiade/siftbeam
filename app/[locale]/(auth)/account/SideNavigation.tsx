'use client';

import Link from "next/link";
import { Navbar, NavbarContent, Button, Chip } from "@heroui/react";
import { usePathname, useRouter } from 'next/navigation';
import { memo } from 'react';
import { signOutAction } from '@/app/lib/auth/auth-actions';

type NavigationItem = {
  href: string;
  label: string;
  isAction?: boolean;
};

type SideNavigationProps = {
  locale: string;
  navigationItems: readonly NavigationItem[];
  role?: string;
  modeLabel?: string;
};

// サイドナビゲーションをメモ化
export const SideNavigation = memo(function SideNavigation({ 
  locale,
  navigationItems,
  role,
  modeLabel,
}: SideNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutAction(locale);
    } catch (error) {
      console.error('Sign out error:', error);
      // エラーが発生してもホームページにリダイレクト
      router.push(`/${locale}`);
    }
  };

  return (
      <Navbar 
      className="w-64 h-[calc(100vh-4rem)] fixed top-16 left-0 border-r border-gray-200 flex-col justify-start overflow-y-auto"
      isBordered
    >
      <NavbarContent className="flex-col items-start gap-1">
       <Chip color={role === 'admin' ? 'success' : 'default'} variant="flat" size="lg" className="mx-auto">
         {modeLabel ?? (role === 'admin' ? 'Admin mode' : 'User mode')}
       </Chip>
        <nav className="flex flex-col space-y-3 w-full">
          {navigationItems.map((item) => {
            // サインアウトアクションの場合
            if (item.isAction && item.href === '/sign-out') {
              return (
                <Button
                  key={item.href}
                  onPress={handleSignOut}
                  variant="light"
                  className="p-3 text-base font-medium rounded-lg w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 border-none shadow-none"
                >
                  {item.label}
                </Button>
              );
            }

            // 通常のリンクの場合
            const fullPath = `/${locale}${item.href}`;
            const isActive = pathname === fullPath;
            
            return (
              <Link 
                key={item.href}
                href={fullPath}
                className={`p-3 text-base font-medium rounded-lg w-full transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                prefetch={true}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </NavbarContent>
    </Navbar>
  );
}); 