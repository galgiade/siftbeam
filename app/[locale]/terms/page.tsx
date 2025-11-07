import type { Metadata } from 'next'
import TermsContainer from '@/app/_containers/Terms/TermsContainer'
import { termsDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(termsDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Terms of Service | siftbeam',
    description: dict.intro || 'Terms of Service for siftbeam',
    keywords: ['利用規約', '規約', 'terms', 'terms of service', 'legal'],
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/terms`,
    },
    openGraph: {
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/terms`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Terms of Service | siftbeam',
      description: dict.intro || 'Terms of Service for siftbeam',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function TermsPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <TermsContainer params={params} />
}


