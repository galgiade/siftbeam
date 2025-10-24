import CreateApiKeyManagementContainer from '@/app/_containers/ApiKeys/create/CreateApiKeyManagementContainer'

interface CreateApiKeyPageProps {
  params: {
    locale: string;
  };
}

/**
 * APIキー作成ページ
 * 管理者が新しいAPIキーを作成するためのページ
 */
export default function CreateApiKeyPage({ params }: CreateApiKeyPageProps) {
  return <CreateApiKeyManagementContainer locale={params.locale} />;
}

export const metadata = {
  title: 'APIキー作成 | SiftBeam',
  description: '新しいAPIキーを作成します。管理者のみアクセス可能です。',
};
