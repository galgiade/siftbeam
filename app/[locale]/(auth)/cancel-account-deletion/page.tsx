import type { Metadata } from 'next'
import { accountDeletionDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import CancelAccountDeletionContainer from '@/app/_containers/AccountDeletion/cancel/CancelAccountDeletionContainer'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(accountDeletionDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.pageTitle || 'Delete Account',
    description: dict.label.warningTitle || 'Permanently delete your account',
    openGraph: {
      title: dict.label.pageTitle || 'Delete Account',
      description: dict.label.warningTitle || 'Permanently delete your account',
    },
  }
}

export default async function CancelAccountDeletionPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  return <CancelAccountDeletionContainer locale={resolvedParams.locale} />
}

