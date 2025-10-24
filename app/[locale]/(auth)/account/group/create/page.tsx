import type { Metadata } from 'next'
import CreateGroupContainer from "@/app/_containers/GroupManagement/CreateGroup/CreateGroupContainer";
import { groupManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(groupManagementDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.createGroup || 'Create Group',
    description: dict.label.groupDescription || 'Create a new group and assign users/policies',
    openGraph: {
      title: dict.label.createGroup || 'Create Group',
      description: dict.label.groupDescription || 'Create a new group and assign users/policies',
    },
  }
}

export default function CreateGroupPage() {
    return <CreateGroupContainer />
}

