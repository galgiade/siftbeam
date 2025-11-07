'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  // 測定IDが設定されていない場合は何も表示しない
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === '') {
    return null
  }

  // 測定IDの形式を検証（G-で始まる）
  if (!GA_MEASUREMENT_ID.startsWith('G-')) {
    console.warn('Invalid GA_MEASUREMENT_ID format. Expected format: G-XXXXXXXXXX')
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

