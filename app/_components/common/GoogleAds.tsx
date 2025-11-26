'use client'

import Script from 'next/script'

interface GoogleAdsProps {
  CONVERSION_ID?: string
  CONVERSION_LABEL?: string
}

/**
 * Google広告タグコンポーネント
 * Google Ads Conversion Trackingを実装します
 * 
 * 環境変数:
 * - NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID: Google広告のコンバージョンID（例: AW-123456789）
 * - NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL: コンバージョンラベル（オプション）
 */
export default function GoogleAds({ 
  CONVERSION_ID, 
  CONVERSION_LABEL 
}: GoogleAdsProps) {
  // コンバージョンIDが設定されていない場合は何も表示しない
  if (!CONVERSION_ID || CONVERSION_ID === '') {
    return null
  }

  // コンバージョンIDの形式を検証（AW-で始まる）
  if (!CONVERSION_ID.startsWith('AW-')) {
    console.warn('Invalid Google Ads Conversion ID format. Expected format: AW-XXXXXXXXXX')
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${CONVERSION_ID}`}
      />
      <Script
        id="google-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${CONVERSION_ID}'${CONVERSION_LABEL ? `, { 'send_page_view': false }` : ''});
          `,
        }}
      />
    </>
  )
}

