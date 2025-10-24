// app/[locale]/pricing/page.tsx
import type { Metadata } from 'next'
import PricingContainer from '@/app/_containers/Pricing/PricingContainer'
import { pricingDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(pricingDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
    description: dict.pricing.hero.subtitle || 'siftbeam pricing information',
    openGraph: {
      title: `${dict.pricing.hero.titleSub} | siftbeam` || 'Pricing | siftbeam',
      description: dict.pricing.hero.subtitle || 'siftbeam pricing information',
    },
  }
}

export default async function PricingPage(
  props: { params: Promise<{ locale: string }> }
) {
  const params = await props.params
  return <PricingContainer params={params} />
}


