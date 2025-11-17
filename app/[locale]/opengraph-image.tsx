import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'siftbeam - Data Processing Platform'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// 言語ごとのテキスト（2文字コードに統一）
const translations: Record<string, { title: string; subtitle: string; features: string }> = {
  ja: {
    title: 'siftbeam',
    subtitle: '企業データ処理・管理プラットフォーム',
    features: 'ポリシーベースの柔軟な管理 | 従量課金 | セキュア',
  },
  en: {
    title: 'siftbeam',
    subtitle: 'Enterprise Data Processing Platform',
    features: 'Policy-based Management | Pay-as-you-go | Secure',
  },
  zh: {
    title: 'siftbeam',
    subtitle: '企业数据处理管理平台',
    features: '基于策略的管理 | 按量付费 | 安全',
  },
  ko: {
    title: 'siftbeam',
    subtitle: '기업 데이터 처리 관리 플랫폼',
    features: '정책 기반 관리 | 종량제 | 보안',
  },
  fr: {
    title: 'siftbeam',
    subtitle: 'Plateforme de traitement de données',
    features: 'Gestion par politiques | Paiement à l\'usage | Sécurisé',
  },
  de: {
    title: 'siftbeam',
    subtitle: 'Datenverarbeitungsplattform',
    features: 'Richtlinienbasiert | Nutzungsbasiert | Sicher',
  },
  es: {
    title: 'siftbeam',
    subtitle: 'Plataforma de procesamiento de datos',
    features: 'Gestión por políticas | Pago por uso | Seguro',
  },
  pt: {
    title: 'siftbeam',
    subtitle: 'Plataforma de processamento de dados',
    features: 'Gerenciamento por políticas | Pagamento por uso | Seguro',
  },
  id: {
    title: 'siftbeam',
    subtitle: 'Platform Pemrosesan Data Perusahaan',
    features: 'Manajemen Berbasis Kebijakan | Bayar Sesuai Penggunaan | Aman',
  },
}

// Image generation
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const text = translations[locale] || translations['en']

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #1e40af, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            {text.title}
          </div>
          <div
            style={{
              fontSize: 40,
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            {text.subtitle}
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 30,
              opacity: 0.9,
              textAlign: 'center',
            }}
          >
            {text.features}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

