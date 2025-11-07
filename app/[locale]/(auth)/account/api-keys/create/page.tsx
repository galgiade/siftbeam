import CreateApiKeyManagementContainer from '@/app/_containers/ApiKeys/create/CreateApiKeyManagementContainer'

interface CreateApiKeyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * APIキー作成ページ
 * 管理者が新しいAPIキーを作成するためのページ
 */
export default async function CreateApiKeyPage({ params }: CreateApiKeyPageProps) {
  const { locale } = await params;
  return <CreateApiKeyManagementContainer locale={locale} />;
}

export const metadata = {
  title: 'APIキー作成 | SiftBeam',
  description: '新しいAPIキーを作成します。管理者のみアクセス可能です。',
};
