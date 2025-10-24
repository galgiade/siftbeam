import type { Metadata } from 'next'
import CreateCompanyInfoContainer from "@/app/_containers/SignUp/CreateCompany/CreateCompanyInfoContainer";
import { createCompanyInfoDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(createCompanyInfoDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.companyInfoTitle || 'Company Information',
    description: 'Enter your company information',
    openGraph: {
      title: dict.label.companyInfoTitle || 'Company Information',
      description: 'Enter your company information',
    },
  }
}

export default async function SignUpAccountPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    return (
        <CreateCompanyInfoContainer params={params} />
    )
}