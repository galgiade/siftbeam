import {
  GA_MEASUREMENT_ID,
  pageview,
  event,
  trackButtonClick,
  trackFormSubmit,
  trackFileUpload,
  trackSignUp,
  trackSignIn,
  trackError,
  trackSearch,
  trackTimeOnPage,
} from '../analytics'

describe('analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // window.gtagをモック
    window.gtag = jest.fn()
    window.dataLayer = []
  })

  afterEach(() => {
    delete (window as any).gtag
    delete (window as any).dataLayer
  })

  describe('GA_MEASUREMENT_ID', () => {
    it('環境変数から測定IDを取得する', () => {
      expect(GA_MEASUREMENT_ID).toBeDefined()
      expect(typeof GA_MEASUREMENT_ID).toBe('string')
    })
  })

  describe('pageview', () => {
    it('ページビューイベントを送信する', () => {
      const url = '/test-page'
      pageview(url)

      expect(window.gtag).toHaveBeenCalledWith('config', GA_MEASUREMENT_ID, {
        page_path: url,
      })
    })

    it('サーバーサイドでは何もしない', () => {
      // windowを一時的に削除
      const originalWindow = global.window
      delete (global as any).window

      expect(() => pageview('/test')).not.toThrow()

      // windowを復元
      global.window = originalWindow
    })

    it('gtagが存在しない場合は警告を表示する（開発環境）', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      delete (window as any).gtag

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      pageview('/test')

      expect(consoleWarnSpy).toHaveBeenCalledWith('Google Analytics is not loaded')

      consoleWarnSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })

    it('エラーが発生した場合は開発環境でログを出力する', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      window.gtag = jest.fn().mockImplementation(() => {
        throw new Error('Test error')
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      pageview('/test')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error tracking pageview:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('event', () => {
    it('カスタムイベントを送信する', () => {
      event({
        action: 'test_action',
        category: 'Test Category',
        label: 'Test Label',
        value: 100,
      })

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'Test Category',
        event_label: 'Test Label',
        value: 100,
      })
    })

    it('labelとvalueなしでイベントを送信できる', () => {
      event({
        action: 'test_action',
        category: 'Test Category',
      })

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_action', {
        event_category: 'Test Category',
        event_label: undefined,
        value: undefined,
      })
    })

    it('サーバーサイドでは何もしない', () => {
      const originalWindow = global.window
      delete (global as any).window

      expect(() =>
        event({
          action: 'test',
          category: 'Test',
        })
      ).not.toThrow()

      global.window = originalWindow
    })

    it('gtagが存在しない場合は警告を表示する（開発環境）', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      delete (window as any).gtag

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      event({
        action: 'test',
        category: 'Test',
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith('Google Analytics is not loaded')

      consoleWarnSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('trackButtonClick', () => {
    it('ボタンクリックイベントを送信する', () => {
      trackButtonClick('Submit Button', 'Contact Form')

      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'Button',
        event_label: 'Submit Button - Contact Form',
        value: undefined,
      })
    })

    it('locationなしでボタンクリックを追跡できる', () => {
      trackButtonClick('Submit Button')

      expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'Button',
        event_label: 'Submit Button',
        value: undefined,
      })
    })
  })

  describe('trackFormSubmit', () => {
    it('フォーム送信成功イベントを送信する', () => {
      trackFormSubmit('Contact Form', true)

      expect(window.gtag).toHaveBeenCalledWith('event', 'submit_success', {
        event_category: 'Form',
        event_label: 'Contact Form',
        value: undefined,
      })
    })

    it('フォーム送信失敗イベントを送信する', () => {
      trackFormSubmit('Contact Form', false)

      expect(window.gtag).toHaveBeenCalledWith('event', 'submit_error', {
        event_category: 'Form',
        event_label: 'Contact Form',
        value: undefined,
      })
    })

    it('デフォルトでは成功イベントを送信する', () => {
      trackFormSubmit('Contact Form')

      expect(window.gtag).toHaveBeenCalledWith('event', 'submit_success', {
        event_category: 'Form',
        event_label: 'Contact Form',
        value: undefined,
      })
    })
  })

  describe('trackFileUpload', () => {
    it('ファイルアップロードイベントを送信する', () => {
      const fileSize = 1024 * 500 // 500KB
      trackFileUpload('image/png', fileSize)

      expect(window.gtag).toHaveBeenCalledWith('event', 'upload', {
        event_category: 'File',
        event_label: 'image/png',
        value: 500, // KB単位
      })
    })

    it('ファイルサイズをKB単位に変換する', () => {
      const fileSize = 1024 * 1024 * 2.5 // 2.5MB
      trackFileUpload('application/pdf', fileSize)

      expect(window.gtag).toHaveBeenCalledWith('event', 'upload', {
        event_category: 'File',
        event_label: 'application/pdf',
        value: 2560, // 2.5MB = 2560KB
      })
    })
  })

  describe('trackSignUp', () => {
    it('メールでのサインアップを追跡する', () => {
      trackSignUp('email')

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_up', {
        event_category: 'User',
        event_label: 'email',
        value: undefined,
      })
    })

    it('Googleでのサインアップを追跡する', () => {
      trackSignUp('google')

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_up', {
        event_category: 'User',
        event_label: 'google',
        value: undefined,
      })
    })

    it('GitHubでのサインアップを追跡する', () => {
      trackSignUp('github')

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_up', {
        event_category: 'User',
        event_label: 'github',
        value: undefined,
      })
    })

    it('デフォルトではemailメソッドを使用する', () => {
      trackSignUp()

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_up', {
        event_category: 'User',
        event_label: 'email',
        value: undefined,
      })
    })
  })

  describe('trackSignIn', () => {
    it('メールでのサインインを追跡する', () => {
      trackSignIn('email')

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_in', {
        event_category: 'User',
        event_label: 'email',
        value: undefined,
      })
    })

    it('Googleでのサインインを追跡する', () => {
      trackSignIn('google')

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_in', {
        event_category: 'User',
        event_label: 'google',
        value: undefined,
      })
    })

    it('デフォルトではemailメソッドを使用する', () => {
      trackSignIn()

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_in', {
        event_category: 'User',
        event_label: 'email',
        value: undefined,
      })
    })
  })

  describe('trackError', () => {
    it('エラーイベントを送信する', () => {
      trackError('Network error', 'API Request')

      expect(window.gtag).toHaveBeenCalledWith('event', 'error', {
        event_category: 'Error',
        event_label: 'API Request: Network error',
        value: undefined,
      })
    })

    it('複数のエラーを追跡できる', () => {
      trackError('Validation failed', 'Form Submission')
      trackError('Timeout', 'Database Query')

      expect(window.gtag).toHaveBeenCalledTimes(2)
      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'error', {
        event_category: 'Error',
        event_label: 'Form Submission: Validation failed',
        value: undefined,
      })
      expect(window.gtag).toHaveBeenNthCalledWith(2, 'event', 'error', {
        event_category: 'Error',
        event_label: 'Database Query: Timeout',
        value: undefined,
      })
    })
  })

  describe('trackSearch', () => {
    it('検索イベントを送信する', () => {
      trackSearch('test query')

      expect(window.gtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'Search',
        event_label: 'test query',
        value: undefined,
      })
    })

    it('空の検索クエリを追跡できる', () => {
      trackSearch('')

      expect(window.gtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'Search',
        event_label: '',
        value: undefined,
      })
    })

    it('特殊文字を含む検索クエリを追跡できる', () => {
      trackSearch('test & query "with" special <chars>')

      expect(window.gtag).toHaveBeenCalledWith('event', 'search', {
        event_category: 'Search',
        event_label: 'test & query "with" special <chars>',
        value: undefined,
      })
    })
  })

  describe('trackTimeOnPage', () => {
    it('ページ滞在時間イベントを送信する', () => {
      trackTimeOnPage('Home Page', 120)

      expect(window.gtag).toHaveBeenCalledWith('event', 'time_on_page', {
        event_category: 'Engagement',
        event_label: 'Home Page',
        value: 120,
      })
    })

    it('0秒の滞在時間を追跡できる', () => {
      trackTimeOnPage('Landing Page', 0)

      expect(window.gtag).toHaveBeenCalledWith('event', 'time_on_page', {
        event_category: 'Engagement',
        event_label: 'Landing Page',
        value: 0,
      })
    })

    it('長時間の滞在を追跡できる', () => {
      trackTimeOnPage('Article Page', 3600) // 1時間

      expect(window.gtag).toHaveBeenCalledWith('event', 'time_on_page', {
        event_category: 'Engagement',
        event_label: 'Article Page',
        value: 3600,
      })
    })
  })

  describe('複数のイベントの連続送信', () => {
    it('複数の異なるイベントを連続して送信できる', () => {
      trackButtonClick('Button 1')
      trackFormSubmit('Form 1', true)
      trackSearch('query 1')

      expect(window.gtag).toHaveBeenCalledTimes(3)
    })

    it('同じイベントを複数回送信できる', () => {
      trackButtonClick('Button 1')
      trackButtonClick('Button 2')
      trackButtonClick('Button 3')

      expect(window.gtag).toHaveBeenCalledTimes(3)
      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'click', {
        event_category: 'Button',
        event_label: 'Button 1',
        value: undefined,
      })
      expect(window.gtag).toHaveBeenNthCalledWith(2, 'event', 'click', {
        event_category: 'Button',
        event_label: 'Button 2',
        value: undefined,
      })
      expect(window.gtag).toHaveBeenNthCalledWith(3, 'event', 'click', {
        event_category: 'Button',
        event_label: 'Button 3',
        value: undefined,
      })
    })
  })
})

