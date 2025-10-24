import type { Metadata } from 'next'
import CreateNewOrderContainer from "@/app/_containers/NewOrder/create/CreateNewOrderRequestContainer";
import { newOrderDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(newOrderDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.newOrderTitle || 'New Order',
    description: dict.label.newOrderButton || 'Create a new order',
    openGraph: {
      title: dict.label.newOrderTitle || 'New Order',
      description: dict.label.newOrderButton || 'Create a new order',
    },
  }
}

export default async function NewOrderCreatePage(props: {params: Promise<{locale: "en-US" | "ja" | "fr"}>}) {
    const resolvedParams = await props.params
    const locale = resolvedParams.locale
    return (
        <div>
            <CreateNewOrderContainer locale={locale} />
        </div>
    );
}
