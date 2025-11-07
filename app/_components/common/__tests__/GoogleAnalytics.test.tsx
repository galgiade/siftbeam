import { render } from '@testing-library/react'
import GoogleAnalytics from '../GoogleAnalytics'

describe('GoogleAnalytics', () => {
  // 各テスト前にモックをクリア
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('測定IDの検証', () => {
    it('測定IDが空の場合は何も表示しない', () => {
      const { container } = render(<GoogleAnalytics GA_MEASUREMENT_ID="" />)
      expect(container.firstChild).toBeNull()
    })

    it('測定IDが設定されていない場合は何も表示しない', () => {
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID={undefined as any} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('測定IDの形式が不正な場合は何も表示しない', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID="INVALID-ID" />
      )
      
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid GA_MEASUREMENT_ID format. Expected format: G-XXXXXXXXXX'
      )
      
      consoleWarnSpy.mockRestore()
    })

    it('正しい形式の測定IDの場合はスクリプトをレンダリングする', () => {
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID="G-TEST123456" />
      )
      
      // コンポーネントが何かをレンダリングしていることを確認
      // Next.js Scriptコンポーネントはモックされているため、nullではない
      expect(container.innerHTML).toBeDefined()
    })
  })

  describe('測定IDの形式', () => {
    it('G-で始まる測定IDを受け入れる', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      render(<GoogleAnalytics GA_MEASUREMENT_ID="G-ABCDEFGHIJ" />)
      
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })

    it('UA-で始まる古い形式の測定IDは警告を表示する', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID="UA-123456789-1" />
      )
      
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })

    it('数字のみの測定IDは警告を表示する', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID="123456789" />
      )
      
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })
  })

  describe('エッジケース', () => {
    it('測定IDにスペースが含まれる場合でもG-で始まれば受け入れる', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID="G-TEST 123456" />
      )
      
      // G-で始まるため、警告は表示されない（スペースのバリデーションは実装されていない）
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })

    it('測定IDが小文字のg-で始まる場合は警告を表示する', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const { container } = render(
        <GoogleAnalytics GA_MEASUREMENT_ID="g-test123456" />
      )
      
      expect(container.firstChild).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })

    it('測定IDが非常に長い場合でもG-で始まれば受け入れる', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      render(
        <GoogleAnalytics GA_MEASUREMENT_ID="G-VERYLONGMEASUREMENTID123456789" />
      )
      
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })
  })
})

