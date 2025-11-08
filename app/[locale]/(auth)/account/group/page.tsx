import type { Metadata } from 'next'
import GroupManagementContainer from '@/app/_containers/GroupManagement/GroupManagementContainer'
import { groupManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(groupManagementDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.groupList || 'Groups',
    description: dict.label.groupDescription || 'Manage user groups and policies',
    openGraph: {
      title: dict.label.groupList || 'Groups',
      description: dict.label.groupDescription || 'Manage user groups and policies',
    },
  }
}

export default async function GroupProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GroupManagementContainer locale={locale} />
}
