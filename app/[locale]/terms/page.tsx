import type { Metadata } from 'next'
import TermsContainer from '@/app/_containers/Terms/TermsContainer'
import { termsDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(termsDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.title || 'Terms of Service | siftbeam',
    description: dict.intro || 'Terms of Service for siftbeam',
    openGraph: {
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
    },
  }
}

export default async function TermsPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <TermsContainer params={params} />
}


