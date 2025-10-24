import type { Metadata } from 'next'
import NewOrderDetailContainer from "@/app/_containers/NewOrder/detail/NewOrderDetailContainer";
import { newOrderDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(newOrderDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.orderDetail || 'Order Detail',
    openGraph: {
      title: dict.label.orderDetail || 'Order Detail',
      description: dict.label.details || 'Order detail information',
    },
    description: dict.label.details || 'Order detail information',
  }
}

export default async function NewOrderDetailPage(props: {params: Promise<{locale: string; id: string}>}) {
    const params = await props.params;
    const { locale, id: newOrderRequestId } = params;

    // パラメータの検証
    if (!newOrderRequestId) {
        return notFound();
    }

    try {
        return (
            <NewOrderDetailContainer locale={locale} newOrderRequestId={newOrderRequestId}/>
        )
    } catch (error) {
        return notFound();
    }
}