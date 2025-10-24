import type { Metadata } from 'next'
import SupportManagementContainer from '@/app/_containers/Support/SupportManagementContainer'
import { supportCenterDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(supportCenterDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.pageTitle || 'Support Center',
    description: dict.label.supportRequestList || 'View and manage support requests',
    openGraph: {
      title: dict.label.pageTitle || 'Support Center',
      description: dict.label.supportRequestList || 'View and manage support requests',
    },
  }
}

export default async function SupportCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  return (
      <SupportManagementContainer locale={locale} />
  )
} 