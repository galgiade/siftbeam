import type { Metadata } from 'next'
import CancelDeleteAccountContainer from "@/app/_containers/CancelDeleteAccount/CancelDeleteAccountContainer";
import { cancelDeleteAccountDictionaries, pickDictionary } from '@/app/dictionaries/mappings'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const resolvedParams = await params
  const dict = pickDictionary(cancelDeleteAccountDictionaries, resolvedParams.locale, 'en-US')
  return {
    title: dict.label.cancelDeleteTitle || 'Cancel Account Deletion',
    description: dict.label.confirmationMessage || 'Cancel your pending account deletion request',
    openGraph: {
      title: dict.label.cancelDeleteTitle || 'Cancel Account Deletion',
      description: dict.label.confirmationMessage || 'Cancel your pending account deletion request',
    },
  }
}

export default function CancelDeleteAccountPage() {
    return (
        <div>
            <CancelDeleteAccountContainer />
        </div>
    )
}