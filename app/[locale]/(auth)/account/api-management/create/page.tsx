import CreateApiKeyManagementContainer from "@/app/_containers/ApiKeys/create/CreateApiKeyManagementContainer"

export default function CreateAPIManagementPage({ locale }: { locale: string }) {
    return (
        <CreateApiKeyManagementContainer locale={locale} />
    )
}