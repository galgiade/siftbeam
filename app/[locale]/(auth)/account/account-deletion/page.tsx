import type { Metadata } from 'next'
import AccountDeletionContainer from '@/app/_containers/AccountDeletion/AccountDeletionContainer'
import { deleteAccountDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(deleteAccountDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.pageTitle || 'Delete Account',
    description: dict.label.warningTitle || 'Permanently delete your account',
    openGraph: {
      title: dict.label.pageTitle || 'Delete Account',
      description: dict.label.warningTitle || 'Permanently delete your account',
    },
  }
}

export default function AccountDeletionPage({ locale }: { locale: string }) {
  return <AccountDeletionContainer locale={locale} />
}


