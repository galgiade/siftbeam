import type { Metadata } from 'next'
import LegalDisclosuresContainer from '@/app/_containers/LegalDisclosures/LegalDisclosuresContainer'
import { legalDisclosuresDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(legalDisclosuresDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.title || 'Legal Disclosures | siftbeam',
    description: dict.intro || 'Legal disclosures and business terms for siftbeam',
    openGraph: {
      title: dict.title || 'Legal Disclosures | siftbeam',
      description: dict.intro || 'Legal disclosures and business terms for siftbeam',
    },
  }
}

export default async function LegalDisclosuresPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <LegalDisclosuresContainer params={params} />
}
