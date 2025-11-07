import { isValidGAMeasurementId, checkRequiredEnvVars } from '../validateEnv'

describe('validateEnv', () => {
  describe('isValidGAMeasurementId', () => {
    it('有効なGA4測定IDを検証する', () => {
      expect(isValidGAMeasurementId('G-TEST123456')).toBe(true)
      expect(isValidGAMeasurementId('G-ABCDEFGHIJ')).toBe(true)
      expect(isValidGAMeasurementId('G-1234567890')).toBe(true)
      expect(isValidGAMeasurementId('G-ABC123XYZ')).toBe(true)
    })

    it('無効な測定IDを拒否する', () => {
      expect(isValidGAMeasurementId('UA-123456789-1')).toBe(false) // 古いUA形式
      expect(isValidGAMeasurementId('g-test123456')).toBe(false) // 小文字
      expect(isValidGAMeasurementId('G-')).toBe(false) // IDなし
      expect(isValidGAMeasurementId('TEST123456')).toBe(false) // G-なし
      expect(isValidGAMeasurementId('G-test123')).toBe(false) // 小文字を含む
    })

    it('空文字やundefinedを拒否する', () => {
      expect(isValidGAMeasurementId('')).toBe(false)
      expect(isValidGAMeasurementId(undefined)).toBe(false)
    })

    it('特殊文字を含む測定IDを拒否する', () => {
      expect(isValidGAMeasurementId('G-TEST@123')).toBe(false)
      expect(isValidGAMeasurementId('G-TEST-123')).toBe(false)
      expect(isValidGAMeasurementId('G-TEST_123')).toBe(false)
      expect(isValidGAMeasurementId('G-TEST 123')).toBe(false)
    })

    it('非常に長い測定IDも検証する', () => {
      expect(isValidGAMeasurementId('G-VERYLONGMEASUREMENTID123456789')).toBe(true)
    })

    it('非常に短い測定IDを拒否する', () => {
      expect(isValidGAMeasurementId('G-A')).toBe(true) // 1文字でも有効
      expect(isValidGAMeasurementId('G-')).toBe(false) // 0文字は無効
    })
  })

  describe('checkRequiredEnvVars', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('すべての環境変数が設定されている場合は警告なし', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456'
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'
      process.env.NODE_ENV = 'production'

      const warnings = checkRequiredEnvVars()

      expect(warnings).toEqual([])
    })

    it('GA測定IDが未設定の場合は警告を返す', () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'

      const warnings = checkRequiredEnvVars()

      expect(warnings).toContain('NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Analytics will be disabled.')
    })

    it('GA測定IDの形式が無効な場合は警告を返す', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'INVALID-ID'
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'

      const warnings = checkRequiredEnvVars()

      expect(warnings.some(w => w.includes('invalid format'))).toBe(true)
    })

    it('アプリURLが未設定の場合は警告を返す', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456'
      delete process.env.NEXT_PUBLIC_APP_URL

      const warnings = checkRequiredEnvVars()

      expect(warnings).toContain('NEXT_PUBLIC_APP_URL is not set. Using default: https://siftbeam.com')
    })

    it('複数の環境変数が未設定の場合は複数の警告を返す', () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
      delete process.env.NEXT_PUBLIC_APP_URL

      const warnings = checkRequiredEnvVars()

      expect(warnings.length).toBeGreaterThan(1)
    })

    it('開発環境では警告をコンソールに出力する', () => {
      process.env.NODE_ENV = 'development'
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      checkRequiredEnvVars()

      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Environment Variable Warnings')

      consoleWarnSpy.mockRestore()
    })

    it('本番環境では警告をコンソールに出力しない', () => {
      process.env.NODE_ENV = 'production'
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      checkRequiredEnvVars()

      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('警告がない場合はコンソールに何も出力しない', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456'
      process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      checkRequiredEnvVars()

      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })
  })

  describe('統合テスト', () => {
    const originalEnv = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('有効な環境変数の完全なセットを検証する', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-ABCD1234EF'
      process.env.NEXT_PUBLIC_APP_URL = 'https://siftbeam.com'

      const gaIdValid = isValidGAMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
      const warnings = checkRequiredEnvVars()

      expect(gaIdValid).toBe(true)
      expect(warnings).toEqual([])
    })

    it('無効な環境変数のセットを検証する', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'INVALID'
      delete process.env.NEXT_PUBLIC_APP_URL

      const gaIdValid = isValidGAMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
      const warnings = checkRequiredEnvVars()

      expect(gaIdValid).toBe(false)
      expect(warnings.length).toBeGreaterThan(0)
    })

    it('部分的に有効な環境変数のセットを検証する', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-VALID123'
      delete process.env.NEXT_PUBLIC_APP_URL

      const gaIdValid = isValidGAMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
      const warnings = checkRequiredEnvVars()

      expect(gaIdValid).toBe(true)
      expect(warnings.length).toBe(1)
      expect(warnings[0]).toContain('NEXT_PUBLIC_APP_URL')
    })
  })

  describe('エッジケース', () => {
    it('nullを測定IDとして渡した場合', () => {
      expect(isValidGAMeasurementId(null as any)).toBe(false)
    })

    it('数値を測定IDとして渡した場合', () => {
      expect(isValidGAMeasurementId(123 as any)).toBe(false)
    })

    it('オブジェクトを測定IDとして渡した場合', () => {
      expect(isValidGAMeasurementId({} as any)).toBe(false)
    })

    it('配列を測定IDとして渡した場合', () => {
      expect(isValidGAMeasurementId([] as any)).toBe(false)
    })

    it('空白文字のみの測定IDを拒否する', () => {
      expect(isValidGAMeasurementId('   ')).toBe(false)
      expect(isValidGAMeasurementId('\t')).toBe(false)
      expect(isValidGAMeasurementId('\n')).toBe(false)
    })

    it('前後に空白がある測定IDを拒否する', () => {
      expect(isValidGAMeasurementId(' G-TEST123456 ')).toBe(false)
      expect(isValidGAMeasurementId('G-TEST123456 ')).toBe(false)
      expect(isValidGAMeasurementId(' G-TEST123456')).toBe(false)
    })
  })
})

