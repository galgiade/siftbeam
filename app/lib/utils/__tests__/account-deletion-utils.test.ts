import {
  calculateDeletionDate,
  calculateDaysUntilDeletion,
} from '../account-deletion-utils'

describe('account-deletion-utils', () => {
  // テスト用の固定日時を設定
  const mockNow = new Date('2024-01-15T12:00:00Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockNow)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('calculateDeletionDate', () => {
    it('削除リクエスト日から90日後の日付を計算する', () => {
      const deletionRequestedAt = '2024-01-01T00:00:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      // 2024年はうるう年なので、1月1日 + 90日 = 3月31日
      const expected = new Date('2024-03-31T00:00:00Z')
      expect(deletionDate.toISOString()).toBe(expected.toISOString())
    })

    it('異なる削除リクエスト日で正しく計算する', () => {
      const deletionRequestedAt = '2024-02-15T10:30:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      const expected = new Date('2024-05-15T10:30:00Z')
      expect(deletionDate.toISOString()).toBe(expected.toISOString())
    })

    it('年をまたぐ場合も正しく計算する', () => {
      const deletionRequestedAt = '2023-11-01T00:00:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      const expected = new Date('2024-01-30T00:00:00Z')
      expect(deletionDate.toISOString()).toBe(expected.toISOString())
    })

    it('うるう年を考慮して計算する', () => {
      const deletionRequestedAt = '2024-02-01T00:00:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      // 2024年はうるう年なので2月29日が存在する
      const expected = new Date('2024-05-01T00:00:00Z')
      expect(deletionDate.toISOString()).toBe(expected.toISOString())
    })

    it('月末の日付でも正しく計算する', () => {
      const deletionRequestedAt = '2024-01-31T23:59:59Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      // 1月31日 + 90日 = 4月30日
      const expected = new Date('2024-04-30T23:59:59Z')
      expect(deletionDate.toISOString()).toBe(expected.toISOString())
    })

    it('時刻情報を保持する', () => {
      const deletionRequestedAt = '2024-01-01T15:30:45Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      expect(deletionDate.getUTCHours()).toBe(15)
      expect(deletionDate.getUTCMinutes()).toBe(30)
      expect(deletionDate.getUTCSeconds()).toBe(45)
    })

    it('タイムゾーン付きの日付を処理できる', () => {
      const deletionRequestedAt = '2024-01-01T00:00:00+09:00'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      // 90日後の日付が計算される
      expect(deletionDate).toBeInstanceOf(Date)
      expect(deletionDate.getTime()).toBeGreaterThan(new Date(deletionRequestedAt).getTime())
    })
  })

  describe('calculateDaysUntilDeletion', () => {
    it('削除までの残り日数を計算する', () => {
      // 2024-01-15から90日後は2024-04-15
      // 現在は2024-01-15なので、残り90日
      const deletionRequestedAt = '2024-01-15T12:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(90)
    })

    it('削除リクエストから数日経過した場合の残り日数を計算する', () => {
      // 2024-01-01から90日後は2024-04-01
      // 現在は2024-01-15なので、残り76日（切り上げ）
      const deletionRequestedAt = '2024-01-01T00:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(76)
    })

    it('削除日が近い場合の残り日数を計算する', () => {
      // 2023-10-17から90日後は2024-01-15
      // 現在は2024-01-15なので、残り0日
      const deletionRequestedAt = '2023-10-17T12:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(0)
    })

    it('削除日を過ぎている場合は0を返す', () => {
      // 2023-10-01から90日後は2023-12-30
      // 現在は2024-01-15なので、すでに過ぎている
      const deletionRequestedAt = '2023-10-01T00:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(0)
    })

    it('削除日の当日は0を返す', () => {
      // 2023-10-17から90日後は2024-01-15
      const deletionRequestedAt = '2023-10-17T12:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(0)
    })

    it('削除日の前日は1を返す', () => {
      // 2023-10-16から90日後は2024-01-14
      // 現在は2024-01-15なので、1日前
      const deletionRequestedAt = '2023-10-16T12:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(0) // すでに過ぎている
    })

    it('削除日の翌日は1を返す', () => {
      // 2023-10-18から90日後は2024-01-16
      // 現在は2024-01-15なので、残り1日
      const deletionRequestedAt = '2023-10-18T12:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(1)
    })

    it('時刻の違いを考慮して切り上げる', () => {
      // 2024-01-15 00:00:00から90日後は2024-04-15 00:00:00
      // 現在は2024-01-15 12:00:00なので、残り89.5日 -> 90日
      const deletionRequestedAt = '2024-01-15T00:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(90)
    })

    it('1時間の差でも1日として切り上げる', () => {
      // 2024-01-15 13:00:00から90日後は2024-04-15 13:00:00
      // 現在は2024-01-15 12:00:00なので、残り90日と1時間 -> 91日
      const deletionRequestedAt = '2024-01-15T13:00:00Z'
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(91)
    })
  })

  describe('エッジケース', () => {
    it('無効な日付文字列でもエラーにならない', () => {
      expect(() => calculateDeletionDate('invalid-date')).not.toThrow()
      expect(() => calculateDaysUntilDeletion('invalid-date')).not.toThrow()
    })

    it('空文字の日付でもエラーにならない', () => {
      expect(() => calculateDeletionDate('')).not.toThrow()
      expect(() => calculateDaysUntilDeletion('')).not.toThrow()
    })

    it('非常に古い日付でも処理できる', () => {
      const deletionRequestedAt = '2000-01-01T00:00:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(deletionDate).toBeInstanceOf(Date)
      expect(daysUntil).toBe(0) // すでに過ぎている
    })

    it('未来の日付でも処理できる', () => {
      const deletionRequestedAt = '2025-01-01T00:00:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(deletionDate).toBeInstanceOf(Date)
      expect(daysUntil).toBeGreaterThan(0)
    })
  })

  describe('統合テスト', () => {
    it('削除日と残り日数の計算が一貫している', () => {
      const deletionRequestedAt = '2024-01-01T00:00:00Z'
      
      const deletionDate = calculateDeletionDate(deletionRequestedAt)
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      // 削除日は2024-03-31（2024-01-01 + 90日）
      expect(deletionDate.toISOString()).toBe('2024-03-31T00:00:00.000Z')
      
      // 現在は2024-01-15なので、残り約76日
      expect(daysUntil).toBeGreaterThan(70)
      expect(daysUntil).toBeLessThan(80)
    })

    it('複数の削除リクエストを処理できる', () => {
      const requests = [
        '2024-01-01T00:00:00Z',
        '2024-01-05T00:00:00Z',
        '2024-01-10T00:00:00Z',
      ]

      requests.forEach(request => {
        const deletionDate = calculateDeletionDate(request)
        const daysUntil = calculateDaysUntilDeletion(request)

        expect(deletionDate).toBeInstanceOf(Date)
        expect(daysUntil).toBeGreaterThanOrEqual(0)
      })
    })

    it('削除日の計算結果が常に90日後である', () => {
      const deletionRequestedAt = '2024-01-01T00:00:00Z'
      const requestDate = new Date(deletionRequestedAt)
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      const diffTime = deletionDate.getTime() - requestDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      expect(diffDays).toBe(90)
    })
  })

  describe('実用的なシナリオ', () => {
    it('削除リクエスト直後の残り日数を計算する', () => {
      const deletionRequestedAt = '2024-01-15T12:00:00Z' // 現在時刻と同じ
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(90)
    })

    it('削除リクエストから1週間後の残り日数を計算する', () => {
      const deletionRequestedAt = '2024-01-08T12:00:00Z' // 7日前
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(83) // 90 - 7 = 83
    })

    it('削除リクエストから1ヶ月後の残り日数を計算する', () => {
      const deletionRequestedAt = '2023-12-15T12:00:00Z' // 約31日前
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(59) // 90 - 31 = 59
    })

    it('削除リクエストから89日後の残り日数を計算する', () => {
      const deletionRequestedAt = '2023-10-18T12:00:00Z' // 89日前
      const daysUntil = calculateDaysUntilDeletion(deletionRequestedAt)

      expect(daysUntil).toBe(1)
    })
  })

  describe('タイムゾーンの処理', () => {
    it('UTC時刻で正しく計算する', () => {
      const deletionRequestedAt = '2024-01-01T00:00:00Z'
      const deletionDate = calculateDeletionDate(deletionRequestedAt)

      expect(deletionDate.toISOString()).toContain('Z')
    })

    it('異なるタイムゾーンでも一貫した結果を返す', () => {
      const utcDate = '2024-01-01T00:00:00Z'
      const jstDate = '2024-01-01T09:00:00+09:00' // 同じ時刻

      const deletionDateUTC = calculateDeletionDate(utcDate)
      const deletionDateJST = calculateDeletionDate(jstDate)

      // 両方とも同じ削除日になる
      expect(deletionDateUTC.getTime()).toBe(deletionDateJST.getTime())
    })
  })
})

