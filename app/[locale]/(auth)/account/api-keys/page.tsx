import ApiKeyManagementContainer from '@/app/_containers/ApiKeys/ApiKeyManagementContainer'

interface ApiKeysPageProps {
  params: {
    locale: string;
  };
}

/**
 * APIキー管理ページ
 * 管理者がAPIキーの作成、編集、削除を行うためのページ
 */
export default function ApiKeysPage({ params }: ApiKeysPageProps) {
  return <ApiKeyManagementContainer locale={params.locale} />;
}

export const metadata = {
  title: 'APIキー管理 | SiftBeam',
  description: 'APIキーの作成、編集、削除を行います。管理者のみアクセス可能です。',
};
