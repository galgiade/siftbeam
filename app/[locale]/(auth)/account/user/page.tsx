import type { Metadata } from 'next'
import UserProfileContainer from '@/app/_containers/User/UserContainer'
import { userDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(userDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.title || 'My Profile',
    description: dict.modal.modalTitle || 'View and update your profile information',
    openGraph: {
      title: dict.label.title || 'My Profile',
      description: dict.modal.modalTitle || 'View and update your profile information',
    },
  }
}

export default async function UserProfilePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  return <UserProfileContainer locale={params.locale} />
}


