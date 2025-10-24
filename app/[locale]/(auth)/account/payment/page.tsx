import type { Metadata } from 'next'
import PaymentMethodsContainer from '@/app/_containers/Payment/PaymentContainer'
import { paymentMethodsDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import PaymentContainer from '@/app/_containers/Payment/PaymentContainer'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(paymentMethodsDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.pageTitle || 'Payment Methods',
    description: dict.label.pageDescription || 'Manage your payment methods and invoices',
    openGraph: {
      title: dict.label.pageTitle || 'Payment Methods',
      description: dict.label.pageDescription || 'Manage your payment methods and invoices',
    },
  }
}

export default async function StripePage( { params }: { params: Promise<{ locale: string }> } ) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  return (
      <PaymentContainer locale={locale} />
  )
}