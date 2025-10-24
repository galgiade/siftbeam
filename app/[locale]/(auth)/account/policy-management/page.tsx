import type { Metadata } from 'next'
import PolicyManagementContainer from "@/app/_containers/PolicyManagement/PolicyManagementContainer"    
import { policyManagementDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(policyManagementDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.policyList || 'Policy Management',
    description: dict.label.policyList || 'Manage access policies',
    openGraph: {
      title: dict.label.policyList || 'Policy Management',
      description: dict.label.policyList || 'Manage access policies',
    },
  }
}

export default async function PolicyManagementPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  return <PolicyManagementContainer locale={locale} />
}
