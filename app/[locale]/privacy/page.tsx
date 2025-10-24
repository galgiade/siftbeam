import type { Metadata } from 'next'
import PrivacyContainer from '@/app/_containers/Privacy/PrivacyContainer'
import { privacyDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(privacyDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.title || 'Privacy Policy | siftbeam',
    description: dict.intro || 'Privacy Policy for siftbeam',
    openGraph: {
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
    },
  }
}

export default async function PrivacyPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <PrivacyContainer params={params} />
}


