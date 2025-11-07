import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'siftbeam - 企業データ処理・管理プラットフォーム'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
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
            siftbeam
          </div>
          <div
            style={{
              fontSize: 40,
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            企業データ処理・管理プラットフォーム
          </div>
          <div
            style={{
              fontSize: 28,
              marginTop: 30,
              opacity: 0.9,
              textAlign: 'center',
            }}
          >
            ポリシーベースの柔軟な管理 | 従量課金 | セキュア
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

