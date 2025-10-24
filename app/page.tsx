import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getPreferredLocale } from '@/app/utils/locale-utils';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // 共通の言語決定ロジックを使用
  const locale = getPreferredLocale(acceptLanguage);
  
  // 決定されたロケールにリダイレクト
  redirect(`/${locale}`);
} 