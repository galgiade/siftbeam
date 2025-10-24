import type { Metadata } from 'next'
import { userManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import CreateUserManagementContainer from '@/app/_containers/UserManagement/create/CreateUserManagementContainer';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(userManagementDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.createUser || 'Create User',
    description: dict.label.modalTitle || 'Create a new user and assign a role',
    openGraph: {
      title: dict.label.createUser || 'Create User',
      description: dict.label.modalTitle || 'Create a new user and assign a role',
    },
  }
}

export default async function CreateUserPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
    return (
        <CreateUserManagementContainer locale={locale} />
    );
}
