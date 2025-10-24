import type { Metadata } from 'next'
import UsageLimitContainer from "@/app/_containers/UsageLimit/UsageLimitContainer";
import { limitUsageDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(limitUsageDictionaries, resolvedParams.locale, 'en-US')
  
  return {
    title: dict.label.limitUsageTitle || 'Usage Limits',
    description: dict.label.selectNotifyOrRestrict || 'Manage and configure usage limits for your account',
    openGraph: {
      title: dict.label.limitUsageTitle || 'Usage Limits',
      description: dict.label.selectNotifyOrRestrict || 'Manage and configure usage limits for your account',
    },
  }
}

export default async function LimitUsagePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
    return (
        <UsageLimitContainer locale={locale} />
    )
}
