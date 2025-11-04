'use client'

import { Card } from "@heroui/react"
import { FaTriangleExclamation } from "react-icons/fa6"
import type { NewOrderLocale } from '@/app/dictionaries/newOrder/newOrder.d.ts';

interface NewOrderErrorDisplayProps {
  error: string;
  dictionary: NewOrderLocale;
}

export default function NewOrderErrorDisplay({ error, dictionary }: NewOrderErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <FaTriangleExclamation className="text-red-600" size={32} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {dictionary.label.newOrderError}
              </h1>
              <p className="text-gray-600">
                {dictionary.label.errorOccurred}
              </p>
            </div>
            
            <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-lg">
              <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                {error}
              </pre>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>{dictionary.label.contactSupport}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
