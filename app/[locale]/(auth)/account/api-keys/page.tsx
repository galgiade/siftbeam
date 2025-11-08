import ApiKeyManagementContainer from '@/app/_containers/ApiKeys/ApiKeyManagementContainer'

interface ApiKeysPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * APIキー管理ページ
 * 管理者がAPIキーの作成、編集、削除を行うためのページ
 */
export default async function ApiKeysPage({ params }: ApiKeysPageProps) {
  const { locale } = await params;
  return <ApiKeyManagementContainer locale={locale} />;
}

export const metadata = {
  title: 'APIキー管理 | SiftBeam',
  description: 'APIキーの作成、編集、削除を行います。管理者のみアクセス可能です。',
};
