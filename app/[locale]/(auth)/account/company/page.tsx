import type { Metadata } from 'next'
import UpdateCompanyInfoContainer from '@/app/_containers/UpdateCompanyInfo/UpdateCompanyInfoContainer'
import { companyDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(companyDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.title || 'Company Profile',
    description: dict.label.title || 'Update your company profile information',
    openGraph: {
      title: dict.label.title || 'Company Profile',
      description: dict.label.title || 'Update your company profile information',
    },
  }
}

export default function ProfilePage() {
  return <UpdateCompanyInfoContainer  />
}

