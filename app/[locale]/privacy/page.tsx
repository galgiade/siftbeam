import type { Metadata } from 'next'
import PrivacyContainer from '@/app/_containers/Privacy/PrivacyContainer'
import { privacyDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(privacyDictionaries, resolvedParams.locale, 'en-US')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com'
  
  return {
    title: dict.title || 'Privacy Policy | siftbeam',
    description: dict.intro || 'Privacy Policy for siftbeam',
    keywords: ['プライバシーポリシー', '個人情報保護', 'privacy', 'privacy policy', 'data protection'],
    alternates: {
      canonical: `${baseUrl}/${resolvedParams.locale}/privacy`,
    },
    openGraph: {
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
      url: `${baseUrl}/${resolvedParams.locale}/privacy`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: dict.title || 'Privacy Policy | siftbeam',
      description: dict.intro || 'Privacy Policy for siftbeam',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PrivacyPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <PrivacyContainer params={params} />
}


