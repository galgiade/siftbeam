import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'siftbeam';
    const description = searchParams.get('description') || 'エンタープライズ向けデータ処理サービス';
    const category = searchParams.get('category') || '';
    const locale = searchParams.get('locale') || 'ja';

    // カテゴリーラベルのマッピング
    const categoryLabels: Record<string, Record<string, string>> = {
      ja: {
        technical: '技術',
        tutorial: 'チュートリアル',
        case_study: '事例',
        trend: 'トレンド',
        product_update: '製品更新',
        comparison: '比較',
        security: 'セキュリティ',
        announcement: 'お知らせ',
      },
      en: {
        technical: 'Technical',
        tutorial: 'Tutorial',
        case_study: 'Case Study',
        trend: 'Trend',
        product_update: 'Product Update',
        comparison: 'Comparison',
        security: 'Security',
        announcement: 'Announcement',
      },
    };

    const categoryLabel = categoryLabels[locale]?.[category] || '';

    // カテゴリーカラーのマッピング
    const categoryColors: Record<string, string> = {
      technical: '#3B82F6',
      tutorial: '#8B5CF6',
      case_study: '#10B981',
      trend: '#F59E0B',
      product_update: '#EF4444',
      comparison: '#3B82F6',
      security: '#8B5CF6',
      announcement: '#EF4444',
    };

    const categoryColor = categoryColors[category] || '#3B82F6';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0F172A',
            padding: '60px 80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* ヘッダー */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#FFFFFF',
                display: 'flex',
              }}
            >
              siftbeam
            </div>
            {categoryLabel && (
              <div
                style={{
                  backgroundColor: categoryColor,
                  color: '#FFFFFF',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontSize: 24,
                  fontWeight: '600',
                  display: 'flex',
                }}
              >
                {categoryLabel}
              </div>
            )}
          </div>

          {/* タイトル */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#FFFFFF',
                lineHeight: 1.2,
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: '100%',
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: 28,
                  color: '#94A3B8',
                  lineHeight: 1.4,
                  display: 'flex',
                  maxWidth: '100%',
                }}
              >
                {description.length > 120
                  ? description.substring(0, 120) + '...'
                  : description}
              </div>
            )}
          </div>

          {/* フッター */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTop: '2px solid #334155',
              paddingTop: '30px',
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: '#64748B',
                display: 'flex',
              }}
            >
              {locale === 'ja' ? 'ブログ記事' : 'Blog Post'}
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#64748B',
                display: 'flex',
              }}
            >
              siftbeam.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error('OG image generation error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

