import SupportDetailContainer from '@/app/_containers/Support/detail/SupportDetailContainer';
import type { Metadata } from 'next';
import { supportCenterDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

type SupportRequestPageProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(supportCenterDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: `${dict.label.pageTitle} | siftbeam` || 'Support Request Detail | siftbeam',
    description: dict.label.inquiryContent || 'View support request details and replies',
    openGraph: {
      title: `${dict.label.pageTitle} | siftbeam` || 'Support Request Detail | siftbeam',
      description: dict.label.inquiryContent || 'View support request details and replies',
    },
  }
}

export default async function SupportRequestPage(props: SupportRequestPageProps) {
  const params = await props.params;
  return <SupportDetailContainer supportRequestId={params.id} locale={params.locale} />;
} 