import type { Metadata } from 'next'
import NewOrderContainer from "@/app/_containers/NewOrder/NewOrderManagementContainer";
import { newOrderDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(newOrderDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.newOrderTitle || 'New Orders',
    description: dict.label.newOrderHistory || 'View your order history',
    openGraph: {
      title: dict.label.newOrderTitle || 'New Orders',
      description: dict.label.newOrderHistory || 'View your order history',
    },
  }
}

export default async function NewOrderPage(props: {params: Promise<{locale: "en-US" | "ja" | "fr"}>}) {
    const resolvedParams = await props.params
    const locale = resolvedParams.locale
    return (
        <NewOrderContainer locale={locale} />
    )
}

