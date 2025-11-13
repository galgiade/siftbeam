import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// キャッシュ設定を追加してパフォーマンスを向上
export const revalidate = 86400; // 24時間キャッシュ

// フッターテキストの多言語対応
function getFooterText(locale: string): string {
  const footerTexts: Record<string, string> = {
    ja: 'ブログ記事',
    en: 'Blog Post',
    'en-US': 'Blog Post',
    'zh-CN': '博客文章',
    ko: '블로그 게시물',
    fr: 'Article de blog',
    de: 'Blog-Beitrag',
    es: 'Artículo del blog',
    pt: 'Artigo do blog',
    id: 'Artikel Blog',
  };
  
  return footerTexts[locale] || footerTexts['en'] || 'Blog Post';
}

// デフォルトのdescriptionの多言語対応
function getDefaultDescription(locale: string): string {
  const descriptions: Record<string, string> = {
    ja: 'エンタープライズ向けデータ処理サービス',
    en: 'Enterprise data processing service',
    'en-US': 'Enterprise data processing service',
    'zh-CN': '企业数据处理服务',
    ko: '기업용 데이터 처리 서비스',
    fr: 'Service de traitement de données pour entreprises',
    de: 'Datenverarbeitungsservice für Unternehmen',
    es: 'Servicio de procesamiento de datos empresariales',
    pt: 'Serviço de processamento de dados empresariais',
    id: 'Layanan pemrosesan data perusahaan',
  };
  
  return descriptions[locale] || descriptions['en'] || 'Enterprise data processing service';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const title = searchParams.get('title') || 'siftbeam';
    const description = searchParams.get('description') || getDefaultDescription(locale);
    const category = searchParams.get('category') || '';

    // カテゴリーラベルのマッピング（全9言語対応）
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
      'en-US': {
        technical: 'Technical',
        tutorial: 'Tutorial',
        case_study: 'Case Study',
        trend: 'Trend',
        product_update: 'Product Update',
        comparison: 'Comparison',
        security: 'Security',
        announcement: 'Announcement',
      },
      'zh-CN': {
        technical: '技术',
        tutorial: '教程',
        case_study: '案例研究',
        trend: '趋势',
        product_update: '产品更新',
        comparison: '比较',
        security: '安全',
        announcement: '公告',
      },
      ko: {
        technical: '기술',
        tutorial: '튜토리얼',
        case_study: '사례 연구',
        trend: '트렌드',
        product_update: '제품 업데이트',
        comparison: '비교',
        security: '보안',
        announcement: '공지사항',
      },
      fr: {
        technical: 'Technique',
        tutorial: 'Tutoriel',
        case_study: 'Étude de cas',
        trend: 'Tendance',
        product_update: 'Mise à jour',
        comparison: 'Comparaison',
        security: 'Sécurité',
        announcement: 'Annonce',
      },
      de: {
        technical: 'Technisch',
        tutorial: 'Tutorial',
        case_study: 'Fallstudie',
        trend: 'Trend',
        product_update: 'Produktupdate',
        comparison: 'Vergleich',
        security: 'Sicherheit',
        announcement: 'Ankündigung',
      },
      es: {
        technical: 'Técnico',
        tutorial: 'Tutorial',
        case_study: 'Caso de estudio',
        trend: 'Tendencia',
        product_update: 'Actualización',
        comparison: 'Comparación',
        security: 'Seguridad',
        announcement: 'Anuncio',
      },
      pt: {
        technical: 'Técnico',
        tutorial: 'Tutorial',
        case_study: 'Estudo de caso',
        trend: 'Tendência',
        product_update: 'Atualização',
        comparison: 'Comparação',
        security: 'Segurança',
        announcement: 'Anúncio',
      },
      id: {
        technical: 'Teknis',
        tutorial: 'Tutorial',
        case_study: 'Studi Kasus',
        trend: 'Tren',
        product_update: 'Pembaruan Produk',
        comparison: 'Perbandingan',
        security: 'Keamanan',
        announcement: 'Pengumuman',
      },
    };

    // ロケールの正規化（en-US → en）
    const normalizedLocale = locale.startsWith('en') ? 'en' : locale;
    const categoryLabel = categoryLabels[locale]?.[category] || categoryLabels[normalizedLocale]?.[category] || '';

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
            fontFamily: 'sans-serif',
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
                fontWeight: 700,
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
                  fontWeight: 600,
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
                fontWeight: 700,
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
              {getFooterText(locale)}
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
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (e: unknown) {
    console.error('OG image generation error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

