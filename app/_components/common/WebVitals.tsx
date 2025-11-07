'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // メトリクスをコンソールに出力(開発環境用)
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric)
    }

    // Google Analyticsにメトリクスを送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // 本番環境では外部モニタリングサービスにも送信可能
    // 例: Vercel Analytics, Sentry, DataDog など
    // 必要に応じて以下のコメントを解除してAPIエンドポイントに送信
    /*
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      })

      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch((error) => {
        // エラーハンドリング（サイレントに失敗）
        console.error('Failed to send web vitals:', error)
      })
    }
    */
  })

  return null
}

// Web Vitalsの説明
// - FCP (First Contentful Paint): 最初のコンテンツが表示されるまでの時間
// - LCP (Largest Contentful Paint): 最大のコンテンツが表示されるまでの時間
// - CLS (Cumulative Layout Shift): レイアウトのずれの累積
// - FID (First Input Delay): 最初の入力への応答時間
// - TTFB (Time to First Byte): 最初のバイトを受信するまでの時間
// - INP (Interaction to Next Paint): 操作から次の描画までの時間

// 良好なスコアの目安:
// - LCP: 2.5秒以下
// - FID: 100ミリ秒以下
// - CLS: 0.1以下
// - FCP: 1.8秒以下
// - TTFB: 800ミリ秒以下

