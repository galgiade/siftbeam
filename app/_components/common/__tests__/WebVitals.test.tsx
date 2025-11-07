import { render } from '@testing-library/react'
import { WebVitals } from '../WebVitals'
import { useReportWebVitals } from 'next/web-vitals'

// next/web-vitalsのモック
jest.mock('next/web-vitals')

describe('WebVitals', () => {
  const mockUseReportWebVitals = useReportWebVitals as jest.MockedFunction<
    typeof useReportWebVitals
  >

  beforeEach(() => {
    jest.clearAllMocks()
    // window.gtagをモック
    window.gtag = jest.fn()
  })

  afterEach(() => {
    delete (window as any).gtag
  })

  it('コンポーネントがnullをレンダリングする', () => {
    const { container } = render(<WebVitals />)
    expect(container.firstChild).toBeNull()
  })

  it('useReportWebVitalsが呼び出される', () => {
    render(<WebVitals />)
    expect(mockUseReportWebVitals).toHaveBeenCalledTimes(1)
    expect(mockUseReportWebVitals).toHaveBeenCalledWith(expect.any(Function))
  })

  describe('メトリクスの処理', () => {
    let metricCallback: (metric: any) => void

    beforeEach(() => {
      mockUseReportWebVitals.mockImplementation((callback) => {
        metricCallback = callback
      })
      render(<WebVitals />)
    })

    it('開発環境でメトリクスをコンソールに出力する', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

      const metric = {
        name: 'LCP',
        value: 2500,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 2500,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(consoleLogSpy).toHaveBeenCalledWith('Web Vitals:', metric)

      consoleLogSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })

    it('本番環境ではコンソールに出力しない', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

      const metric = {
        name: 'LCP',
        value: 2500,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 2500,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(consoleLogSpy).not.toHaveBeenCalled()

      consoleLogSpy.mockRestore()
      process.env.NODE_ENV = originalEnv
    })

    it('Google Analyticsにメトリクスを送信する', () => {
      const metric = {
        name: 'LCP',
        value: 2500,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 2500,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(window.gtag).toHaveBeenCalledWith('event', 'LCP', {
        value: 2500,
        event_category: 'Web Vitals',
        event_label: 'v1-1234567890',
        non_interaction: true,
      })
    })

    it('CLSメトリクスの値を1000倍にして送信する', () => {
      const metric = {
        name: 'CLS',
        value: 0.15,
        id: 'v1-1234567890',
        rating: 'needs-improvement',
        delta: 0.15,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(window.gtag).toHaveBeenCalledWith('event', 'CLS', {
        value: 150, // 0.15 * 1000 = 150
        event_category: 'Web Vitals',
        event_label: 'v1-1234567890',
        non_interaction: true,
      })
    })

    it('FIDメトリクスを正しく処理する', () => {
      const metric = {
        name: 'FID',
        value: 50,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 50,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(window.gtag).toHaveBeenCalledWith('event', 'FID', {
        value: 50,
        event_category: 'Web Vitals',
        event_label: 'v1-1234567890',
        non_interaction: true,
      })
    })

    it('FCPメトリクスを正しく処理する', () => {
      const metric = {
        name: 'FCP',
        value: 1500,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 1500,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(window.gtag).toHaveBeenCalledWith('event', 'FCP', {
        value: 1500,
        event_category: 'Web Vitals',
        event_label: 'v1-1234567890',
        non_interaction: true,
      })
    })

    it('TTFBメトリクスを正しく処理する', () => {
      const metric = {
        name: 'TTFB',
        value: 600,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 600,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(window.gtag).toHaveBeenCalledWith('event', 'TTFB', {
        value: 600,
        event_category: 'Web Vitals',
        event_label: 'v1-1234567890',
        non_interaction: true,
      })
    })

    it('INPメトリクスを正しく処理する', () => {
      const metric = {
        name: 'INP',
        value: 150,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 150,
        navigationType: 'navigate',
      }

      metricCallback(metric)

      expect(window.gtag).toHaveBeenCalledWith('event', 'INP', {
        value: 150,
        event_category: 'Web Vitals',
        event_label: 'v1-1234567890',
        non_interaction: true,
      })
    })

    it('window.gtagが存在しない場合はエラーにならない', () => {
      delete (window as any).gtag

      const metric = {
        name: 'LCP',
        value: 2500,
        id: 'v1-1234567890',
        rating: 'good',
        delta: 2500,
        navigationType: 'navigate',
      }

      expect(() => metricCallback(metric)).not.toThrow()
    })
  })

  describe('複数のメトリクスの処理', () => {
    let metricCallback: (metric: any) => void

    beforeEach(() => {
      mockUseReportWebVitals.mockImplementation((callback) => {
        metricCallback = callback
      })
      render(<WebVitals />)
    })

    it('複数のメトリクスを連続して処理できる', () => {
      const metrics = [
        { name: 'FCP', value: 1500, id: 'v1-1', rating: 'good', delta: 1500, navigationType: 'navigate' },
        { name: 'LCP', value: 2500, id: 'v1-2', rating: 'good', delta: 2500, navigationType: 'navigate' },
        { name: 'CLS', value: 0.1, id: 'v1-3', rating: 'good', delta: 0.1, navigationType: 'navigate' },
      ]

      metrics.forEach(metric => metricCallback(metric))

      expect(window.gtag).toHaveBeenCalledTimes(3)
      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'FCP', expect.any(Object))
      expect(window.gtag).toHaveBeenNthCalledWith(2, 'event', 'LCP', expect.any(Object))
      expect(window.gtag).toHaveBeenNthCalledWith(3, 'event', 'CLS', expect.any(Object))
    })
  })
})

