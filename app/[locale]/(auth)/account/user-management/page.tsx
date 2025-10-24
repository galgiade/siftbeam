import type { Metadata } from 'next'
import UserManagementContainer from '@/app/_containers/UserManagement/UserManagementContainer'
import { userManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(userManagementDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.userList || 'Users',
    description: dict.label.adminList || 'Manage users and admins',
    openGraph: {
      title: dict.label.userList || 'Users',
      description: dict.label.adminList || 'Manage users and admins',
    },
  }
}

export default async function UserManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params
  return <UserManagementContainer locale={resolvedParams.locale} />
}


