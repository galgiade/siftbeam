import type { Metadata } from 'next'
import CreatePaymentContainer from "@/app/_containers/SignUp/CreatePayment/CreatePaymentContainer";
import { createPaymentDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

// 認証が必要なページのため、動的レンダリングを強制
export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(createPaymentDictionaries, resolvedParams.locale, 'en')
  return {
    title: dict.label.paymentSetupTitle || 'Payment Setup',
    description: dict.label.saveInfoDescription || 'Set up your payment method',
    openGraph: {
      title: dict.label.paymentSetupTitle || 'Payment Setup',
      description: dict.label.saveInfoDescription || 'Set up your payment method',
    },
  }
}

export default async function PaymentPage({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = await params;
    return <CreatePaymentContainer params={resolvedParams} />
}