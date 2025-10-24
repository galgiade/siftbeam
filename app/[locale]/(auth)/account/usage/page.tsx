import type { Metadata } from 'next'
import UsageHistoryContainer from '@/app/_containers/usageHistory/usageHistoryContainer'
import { usageHistoryDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(usageHistoryDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.tableAriaLabel || 'Usage History',
    description: dict.label.tableEmpty || 'View historical usage data and export as needed',
    openGraph: {
      title: dict.label.tableAriaLabel || 'Usage History',
      description: dict.label.tableEmpty || 'View historical usage data and export as needed',
    },
  }
}

export default function UsagePage() {
  return <UsageHistoryContainer />
}
