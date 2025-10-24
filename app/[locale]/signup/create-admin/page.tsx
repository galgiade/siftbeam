import type { Metadata } from 'next'
import CreateAdminContainer from "@/app/_containers/SignUp/CreateAdmin/CreateAdminContainer";
import { createAdminDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(createAdminDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.createAdminTitle || 'Create Admin',
    description: dict.label.accountCreation || 'Set up your admin account',
    openGraph: {
      title: dict.label.createAdminTitle || 'Create Admin',
      description: dict.label.accountCreation || 'Set up your admin account',
    },
  }
}

export default async function SignUpAccountPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    return (
        <CreateAdminContainer params={params} />
    )
}