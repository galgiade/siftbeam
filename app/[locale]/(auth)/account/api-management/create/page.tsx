import CreateApiKeyManagementContainer from "@/app/_containers/ApiKeys/create/CreateApiKeyManagementContainer"

interface CreateAPIManagementPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function CreateAPIManagementPage({ params }: CreateAPIManagementPageProps) {
    const { locale } = await params;
    return (
        <CreateApiKeyManagementContainer locale={locale} />
    )
}