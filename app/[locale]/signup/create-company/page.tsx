import type { Metadata } from 'next'
import CreateCompanyInfoContainer from "@/app/_containers/SignUp/CreateCompany/CreateCompanyInfoContainer";
import { createCompanyInfoDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

// 静的生成のためのgenerateStaticParams（2文字コードに統一）
export async function generateStaticParams() {
  return [
    { locale: 'ja' },
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'ko' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'id' },
  ];
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(createCompanyInfoDictionaries, resolvedParams.locale, 'en')
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