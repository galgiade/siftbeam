'use client'

import { Card, Button } from "@heroui/react"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { FaExclamationTriangle } from 'react-icons/fa'
import type { PaymentLocale } from '@/app/dictionaries/payment/payment.d.ts';
import AccessDeniedError from '@/app/_components/common/error/AccessDeniedError';

interface PaymentErrorDisplayProps {
  error: string;
  dictionary: PaymentLocale;
}

export default function PaymentErrorDisplay({ error, dictionary }: PaymentErrorDisplayProps) {
  const params = useParams();
  const locale = params.locale as string || 'en';

  const isAccessDenied = error === dictionary.alert.accessDenied;

  if (isAccessDenied) {
    return <AccessDeniedError />;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-6">
              <FaExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {dictionary.label.pageTitle}
              </h1>
              <p className="text-gray-600">
                {dictionary.alert.errorOccurred}
              </p>
            </div>

            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">{dictionary.label.errorDetails}</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                {error}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                color="primary"
                onPress={handleReload}
                className="font-medium"
              >
                {dictionary.label.reloadPage}
              </Button>

              <Button
                variant="bordered"
                as={Link}
                href={`/${locale}/account`}
                className="font-medium"
              >
                {dictionary.label.backToAccount}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

