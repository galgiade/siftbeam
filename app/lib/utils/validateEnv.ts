// 環境変数の検証ユーティリティ

/**
 * Google Analytics測定IDの形式を検証
 * @param id - 測定ID
 * @returns 有効な場合はtrue
 */
export function isValidGAMeasurementId(id: string | undefined): boolean {
  if (!id) return false
  
  // GA4の測定IDは "G-" で始まる
  const ga4Pattern = /^G-[A-Z0-9]+$/
  
  return ga4Pattern.test(id)
}

/**
 * 環境変数が設定されているか確認
 */
export function checkRequiredEnvVars() {
  const warnings: string[] = []

  // Google Analytics
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!gaId) {
    warnings.push('NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Analytics will be disabled.')
  } else if (!isValidGAMeasurementId(gaId)) {
    warnings.push(`NEXT_PUBLIC_GA_MEASUREMENT_ID has invalid format: ${gaId}. Expected format: G-XXXXXXXXXX`)
  }

  // アプリケーションURL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    warnings.push('NEXT_PUBLIC_APP_URL is not set. Using default: https://siftbeam.com')
  }

  // 開発環境でのみ警告を表示
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.warn('⚠️  Environment Variable Warnings:')
    warnings.forEach(warning => console.warn(`  - ${warning}`))
  }

  return warnings
}

