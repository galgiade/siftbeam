import type { Metadata } from 'next'
import UsageLimitContainer from "@/app/_containers/UsageLimit/create/UsageLimitContainer";
import { limitUsageDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(limitUsageDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.usageNotification || 'Create Usage Notification',
    description: dict.label.selectNotifyOrRestrict || 'Create a usage limit notification',
    openGraph: {
      title: dict.label.usageNotification || 'Create Usage Notification',
      description: dict.label.selectNotifyOrRestrict || 'Create a usage limit notification',
    },
  }
}

export default async function CreateLimitUsagePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  return (
    <UsageLimitContainer locale={locale} />
  )
}
