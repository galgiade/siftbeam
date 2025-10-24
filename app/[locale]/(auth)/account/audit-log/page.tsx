import type { Metadata } from 'next'
import AuditLogContainer from "@/app/_containers/AuditLog/AuditLogContainer";
import { auditLogDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(auditLogDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.pageTitle || 'Audit Logs',
    description: dict.label.pageDescription || 'Inspect actions and changes across the system',
    openGraph: {
      title: dict.label.pageTitle || 'Audit Logs',
      description: dict.label.pageDescription || 'Inspect actions and changes across the system',
    },
  }
}

export default async function AuditLogPage({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = await params
    const locale = resolvedParams.locale
    return (
        <AuditLogContainer locale={locale} />
    )
}