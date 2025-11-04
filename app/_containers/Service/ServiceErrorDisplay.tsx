'use client'

import { Card, CardBody } from '@heroui/react';
import type { ServiceLocale } from '@/app/dictionaries/service/ServiceLocale.d.ts';

interface ServiceErrorDisplayProps {
  error: string;
  dictionary: ServiceLocale;
}

/**
 * サービスページのエラー表示コンポーネント
 */
export default function ServiceErrorDisplay({ error, dictionary }: ServiceErrorDisplayProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-danger-200 bg-danger-50">
          <CardBody className="text-center p-8">
            <div className="text-danger-600 text-6xl mb-4">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-danger-800 mb-4">
              {dictionary.error.title}
            </h2>
            <p className="text-danger-700 mb-6">
              {error}
            </p>
            <div className="space-y-2 text-sm text-danger-600">
              <p>{dictionary.error.suggestion1}</p>
              <p>{dictionary.error.suggestion2}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
