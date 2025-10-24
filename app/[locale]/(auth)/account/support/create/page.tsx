import type { Metadata } from 'next'
import CreateSupportCenterContainer from '@/app/_containers/Support/create/CreateSupportRequestContainer'
import { supportCenterDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(supportCenterDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.pageTitle || 'Support Center',
    description: dict.label.newRequest || 'Create a new support request',
    openGraph: {
      title: dict.label.pageTitle || 'Support Center',
      description: dict.label.newRequest || 'Create a new support request',
    },
  }
}

export default async function CreateSupportCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  return (
    <div className="container mx-auto py-8">
      <CreateSupportCenterContainer locale={locale} />
    </div>
  )
}