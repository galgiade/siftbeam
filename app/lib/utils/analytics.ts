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

