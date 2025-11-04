'use client'

import { Card } from "@heroui/react"
import type { SupportCenterLocale } from '@/app/dictionaries/supportCenter/supportCenter.d.ts';
import { FaTriangleExclamation } from "react-icons/fa6"

interface SupportErrorDisplayProps {
  error: string;
  dictionary: SupportCenterLocale;
}

/**
 * サポート関連のエラー表示コンポーネント
 */
export default function SupportErrorDisplay({ error, dictionary }: SupportErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FaTriangleExclamation className="text-red-500" size={32} />
            <h1 className="text-3xl font-bold text-red-600">{dictionary.label.errorOccurred}</h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-3">{dictionary.label.errorDetails}</h2>
            <pre className="text-red-700 text-sm whitespace-pre-wrap font-mono bg-red-100 p-4 rounded border overflow-auto">
              {error}
            </pre>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-800 font-medium mb-2">{dictionary.label.troubleshooting}</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• {dictionary.label.reloadPage}</li>
              <li>• {dictionary.label.contactAdmin}</li>
              <li>• {dictionary.label.clearCache}</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
