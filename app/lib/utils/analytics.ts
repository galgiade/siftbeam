// Google Analytics イベント送信用のユーティリティ

// GA4のgtagが利用可能かチェック
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// gtagの型定義
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

// ページビューイベント
export const pageview = (url: string) => {
  if (typeof window === 'undefined') return
  
  if (!window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics is not loaded')
    }
    return
  }

  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking pageview:', error)
    }
  }
}

// カスタムイベント送信
interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: GtagEvent) => {
  if (typeof window === 'undefined') return
  
  if (!window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics is not loaded')
    }
    return
  }

  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking event:', error)
    }
  }
}

// よく使うイベントのヘルパー関数

// ボタンクリック
export const trackButtonClick = (buttonName: string, location?: string) => {
  event({
    action: 'click',
    category: 'Button',
    label: location ? `${buttonName} - ${location}` : buttonName,
  })
}

// フォーム送信
export const trackFormSubmit = (formName: string, success: boolean = true) => {
  event({
    action: success ? 'submit_success' : 'submit_error',
    category: 'Form',
    label: formName,
  })
}

// ファイルアップロード
export const trackFileUpload = (fileType: string, fileSize: number) => {
  event({
    action: 'upload',
    category: 'File',
    label: fileType,
    value: Math.round(fileSize / 1024), // KB単位
  })
}

// サインアップ
export const trackSignUp = (method: 'email' | 'google' | 'github' | 'other' = 'email') => {
  event({
    action: 'sign_up',
    category: 'User',
    label: method,
  })
}

// サインイン
export const trackSignIn = (method: 'email' | 'google' | 'github' | 'other' = 'email') => {
  event({
    action: 'sign_in',
    category: 'User',
    label: method,
  })
}

// エラー追跡
export const trackError = (errorMessage: string, errorLocation: string) => {
  event({
    action: 'error',
    category: 'Error',
    label: `${errorLocation}: ${errorMessage}`,
  })
}

// 検索
export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
  })
}

// ページ滞在時間
export const trackTimeOnPage = (pageName: string, seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: pageName,
    value: seconds,
  })
}

// ============================================
// Google広告コンバージョンイベント
// ============================================

// Google Ads Conversion ID（環境変数から取得）
export const GOOGLE_ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || ''
export const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || ''

/**
 * Google広告のコンバージョンイベントを送信
 * @param conversionLabel - コンバージョンラベル（オプション）
 * @param value - コンバージョン価値（オプション）
 * @param currency - 通貨コード（デフォルト: 'JPY'）
 */
export const trackGoogleAdsConversion = (
  conversionLabel?: string,
  value?: number,
  currency: string = 'JPY'
) => {
  if (typeof window === 'undefined') return
  
  if (!window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Ads is not loaded')
    }
    return
  }

  if (!GOOGLE_ADS_CONVERSION_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Ads Conversion ID is not configured')
    }
    return
  }

  try {
    const conversionParams: Record<string, any> = {
      send_to: conversionLabel 
        ? `${GOOGLE_ADS_CONVERSION_ID}/${conversionLabel}`
        : GOOGLE_ADS_CONVERSION_ID,
    }

    if (value !== undefined) {
      conversionParams.value = value
      conversionParams.currency = currency
    }

    window.gtag('event', 'conversion', conversionParams)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking Google Ads conversion:', error)
    }
  }
}

// ============================================
// GA4コンバージョンイベント（Google Analytics）
// ============================================

/**
 * 購入コンバージョンイベント（purchase）
 * 支払い完了時に送信します
 * 
 * @param transactionId - 取引ID（必須）
 * @param value - 取引金額
 * @param currency - 通貨コード（デフォルト: 'JPY'）
 * @param items - 購入アイテムの配列（オプション）
 */
export const trackPurchase = (
  transactionId: string,
  value?: number,
  currency: string = 'JPY',
  items?: Array<{
    item_id?: string
    item_name?: string
    category?: string
    quantity?: number
    price?: number
  }>
) => {
  if (typeof window === 'undefined') return
  
  if (!window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics is not loaded')
    }
    return
  }

  try {
    const purchaseParams: Record<string, any> = {
      transaction_id: transactionId,
      currency: currency,
    }

    if (value !== undefined) {
      purchaseParams.value = value
    }

    if (items && items.length > 0) {
      purchaseParams.items = items
    }

    // GA4のpurchaseイベントを送信
    window.gtag('event', 'purchase', purchaseParams)
    
    // Google広告のコンバージョンも送信（設定されている場合）
    if (GOOGLE_ADS_CONVERSION_ID) {
      trackGoogleAdsConversion(GOOGLE_ADS_CONVERSION_LABEL, value, currency)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking purchase:', error)
    }
  }
}

/**
 * リード獲得コンバージョンイベント（qualify_lead）
 * 見込み客が条件を満たした時に送信します
 * 
 * @param leadId - リードID（オプション）
 * @param value - リードの価値（オプション）
 */
export const trackQualifyLead = (leadId?: string, value?: number) => {
  if (typeof window === 'undefined') return
  
  if (!window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics is not loaded')
    }
    return
  }

  try {
    const params: Record<string, any> = {}
    
    if (leadId) {
      params.lead_id = leadId
    }
    
    if (value !== undefined) {
      params.value = value
    }

    // GA4のqualify_leadイベントを送信
    window.gtag('event', 'qualify_lead', params)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking qualify_lead:', error)
    }
  }
}

/**
 * リード転換コンバージョンイベント（close_convert_lead）
 * リードが実際に転換した時に送信します
 * 
 * @param leadId - リードID（オプション）
 * @param value - 転換の価値（オプション）
 */
export const trackCloseConvertLead = (leadId?: string, value?: number) => {
  if (typeof window === 'undefined') return
  
  if (!window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics is not loaded')
    }
    return
  }

  try {
    const params: Record<string, any> = {}
    
    if (leadId) {
      params.lead_id = leadId
    }
    
    if (value !== undefined) {
      params.value = value
    }

    // GA4のclose_convert_leadイベントを送信
    window.gtag('event', 'close_convert_lead', params)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracking close_convert_lead:', error)
    }
  }
}

