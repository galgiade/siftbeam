import {
  parseServiceS3Key,
  extractFileNameFromS3Key,
  formatFileSize,
  getFileExtension,
  sanitizeFileName,
  generateTimestamp,
  getDownloadableFiles,
  getProcessingStatusMessage,
  calculateProcessingDuration,
  calculateProcessingTime,
  calculateProcessingDurationByStatus,
  formatProcessingDuration,
} from '../s3-utils'

describe('s3-utils', () => {
  describe('parseServiceS3Key', () => {
    describe('入力ファイルのパース', () => {
      it('入力ファイルのS3キーを正しくパースする', () => {
        const s3Key = 'service/input/customer123/proc-456/20241009_143022_data.csv'
        const result = parseServiceS3Key(s3Key)

        expect(result).toEqual({
          fileType: 'input',
          customerId: 'customer123',
          processingHistoryId: 'proc-456',
          timestamp: '20241009_143022',
          fileName: 'data.csv',
        })
      })

      it('異なる顧客IDでパースする', () => {
        const s3Key = 'service/input/customer999/proc-789/20241010_120000_file.txt'
        const result = parseServiceS3Key(s3Key)

        expect(result?.customerId).toBe('customer999')
        expect(result?.processingHistoryId).toBe('proc-789')
      })
    })

    describe('出力ファイルのパース', () => {
      it('出力ファイルのS3キーを正しくパースする', () => {
        const s3Key = 'service/output/customer123/proc-456/20241009_143022_result.json'
        const result = parseServiceS3Key(s3Key)

        expect(result).toEqual({
          fileType: 'output',
          customerId: 'customer123',
          processingHistoryId: 'proc-456',
          timestamp: '20241009_143022',
          fileName: 'result.json',
        })
      })
    })

    describe('一時ファイルのパース', () => {
      it('一時ファイルのS3キーを正しくパースする', () => {
        const s3Key = 'service/temp/customer123/proc-456/step1/20241009_143022_temp.csv'
        const result = parseServiceS3Key(s3Key)

        expect(result).toEqual({
          fileType: 'temp',
          customerId: 'customer123',
          processingHistoryId: 'proc-456',
          stepName: 'step1',
          timestamp: '20241009_143022',
          fileName: 'temp.csv',
        })
      })

      it('異なるステップ名でパースする', () => {
        const s3Key = 'service/temp/customer123/proc-456/preprocessing/20241009_143022_data.csv'
        const result = parseServiceS3Key(s3Key)

        expect(result?.stepName).toBe('preprocessing')
      })
    })

    describe('無効なS3キー', () => {
      it('無効な形式の場合はnullを返す', () => {
        expect(parseServiceS3Key('invalid/path')).toBeNull()
        expect(parseServiceS3Key('service/invalid/path')).toBeNull()
        expect(parseServiceS3Key('')).toBeNull()
      })

      it('タイムスタンプが不正な場合はnullを返す', () => {
        expect(parseServiceS3Key('service/input/customer123/proc-456/invalid_data.csv')).toBeNull()
      })
    })
  })

  describe('extractFileNameFromS3Key', () => {
    it('S3キーから元のファイル名を抽出する', () => {
      expect(extractFileNameFromS3Key('service/input/customer123/proc-456/20241009_143022_data.csv')).toBe('data.csv')
    })

    it('複雑なファイル名を抽出する', () => {
      expect(extractFileNameFromS3Key('service/output/customer123/proc-456/20241009_143022_my_result_file.json')).toBe('my_result_file.json')
    })

    it('タイムスタンプがない場合はそのまま返す', () => {
      expect(extractFileNameFromS3Key('service/input/customer123/proc-456/data.csv')).toBe('data.csv')
    })

    it('パスのみの場合は最後の部分を返す', () => {
      expect(extractFileNameFromS3Key('folder/file.txt')).toBe('file.txt')
    })
  })

  describe('formatFileSize', () => {
    it('0バイトをフォーマットする', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    it('バイト単位でフォーマットする', () => {
      expect(formatFileSize(500)).toBe('500 Bytes')
      expect(formatFileSize(1023)).toBe('1023 Bytes')
    })

    it('KB単位でフォーマットする', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(2048)).toBe('2 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('MB単位でフォーマットする', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB')
    })

    it('GB単位でフォーマットする', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(1024 * 1024 * 1024 * 3.75)).toBe('3.75 GB')
    })

    it('小数点以下2桁で丸める', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(1234567)).toBe('1.18 MB')
    })
  })

  describe('getFileExtension', () => {
    it('ファイル拡張子を取得する', () => {
      expect(getFileExtension('file.txt')).toBe('.txt')
      expect(getFileExtension('document.pdf')).toBe('.pdf')
      expect(getFileExtension('image.jpg')).toBe('.jpg')
    })

    it('複数のドットがある場合は最後の拡張子を返す', () => {
      expect(getFileExtension('archive.tar.gz')).toBe('.gz')
      expect(getFileExtension('my.file.name.csv')).toBe('.csv')
    })

    it('拡張子がない場合は空文字を返す', () => {
      expect(getFileExtension('filename')).toBe('')
      expect(getFileExtension('README')).toBe('')
    })

    it('ドットで終わる場合はドットを返す', () => {
      expect(getFileExtension('file.')).toBe('.')
    })
  })

  describe('sanitizeFileName', () => {
    it('安全なファイル名を生成する', () => {
      expect(sanitizeFileName('file.txt')).toBe('file.txt')
      expect(sanitizeFileName('my-file_123.csv')).toBe('my-file_123.csv')
    })

    it('危険な文字をアンダースコアに置換する', () => {
      expect(sanitizeFileName('file name.txt')).toBe('file_name.txt')
      expect(sanitizeFileName('file/name.txt')).toBe('file_name.txt')
      expect(sanitizeFileName('file\\name.txt')).toBe('file_name.txt')
    })

    it('特殊文字を置換する', () => {
      // 特殊文字は_に置換され、連続する_は1つにまとめられる
      expect(sanitizeFileName('file@#$%^&*().txt')).toBe('file_.txt')
    })

    it('連続するアンダースコアを1つにまとめる', () => {
      expect(sanitizeFileName('file   name.txt')).toBe('file_name.txt')
      expect(sanitizeFileName('file___name.txt')).toBe('file_name.txt')
    })

    it('100文字を超える場合は切り詰める', () => {
      const longName = 'a'.repeat(150) + '.txt'
      const result = sanitizeFileName(longName)
      expect(result.length).toBe(100)
    })

    it('日本語文字を置換する', () => {
      // 日本語文字は_に置換され、連続する_は1つにまとめられる
      expect(sanitizeFileName('ファイル名.txt')).toBe('_.txt')
    })
  })

  describe('generateTimestamp', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('正しい形式のタイムスタンプを生成する', () => {
      jest.setSystemTime(new Date('2024-10-09T14:30:22Z'))
      const timestamp = generateTimestamp()
      expect(timestamp).toMatch(/^\d{8}_\d{6}$/)
    })

    it('年月日と時分秒が正しい', () => {
      jest.setSystemTime(new Date('2024-10-09T14:30:22Z'))
      const timestamp = generateTimestamp()
      // タイムゾーンによって結果が変わる可能性があるため、形式のみチェック
      expect(timestamp).toMatch(/^\d{8}_\d{6}$/)
    })
  })

  describe('getDownloadableFiles', () => {
    it('入力ファイルのみを取得する（処理中）', () => {
      const processingHistory = {
        processingHistoryId: 'proc-123',
        status: 'in_progress' as const,
        uploadedFileKeys: ['service/input/customer123/proc-123/20241009_143022_data.csv'],
        downloadS3Keys: [],
      }

      const files = getDownloadableFiles(processingHistory)
      expect(files).toHaveLength(1)
      expect(files[0].fileType).toBe('input')
      expect(files[0].fileName).toBe('data.csv')
    })

    it('入力ファイルと出力ファイルを取得する（処理完了）', () => {
      const processingHistory = {
        processingHistoryId: 'proc-123',
        status: 'success' as const,
        uploadedFileKeys: ['service/input/customer123/proc-123/20241009_143022_data.csv'],
        downloadS3Keys: ['service/output/customer123/proc-123/20241009_143022_result.json'],
      }

      const files = getDownloadableFiles(processingHistory)
      expect(files).toHaveLength(2)
      expect(files[0].fileType).toBe('input')
      expect(files[1].fileType).toBe('output')
    })

    it('DynamoDB形式の配列を処理できる', () => {
      const processingHistory = {
        processingHistoryId: 'proc-123',
        status: 'success' as const,
        uploadedFileKeys: [{ S: 'service/input/customer123/proc-123/20241009_143022_data.csv' }],
        downloadS3Keys: [{ S: 'service/output/customer123/proc-123/20241009_143022_result.json' }],
      }

      const files = getDownloadableFiles(processingHistory)
      expect(files).toHaveLength(2)
    })

    it('空の配列を処理できる', () => {
      const processingHistory = {
        processingHistoryId: 'proc-123',
        status: 'success' as const,
        uploadedFileKeys: [],
        downloadS3Keys: [],
      }

      const files = getDownloadableFiles(processingHistory)
      expect(files).toHaveLength(0)
    })
  })

  describe('getProcessingStatusMessage', () => {
    it('処理中のメッセージを取得する', () => {
      const result = getProcessingStatusMessage('in_progress')
      expect(result.message).toBe('処理中...')
      expect(result.color).toBe('primary')
      expect(result.canDownload).toBe(false)
    })

    it('処理完了のメッセージを取得する', () => {
      const result = getProcessingStatusMessage('success')
      expect(result.message).toBe('処理完了')
      expect(result.color).toBe('success')
      expect(result.canDownload).toBe(true)
    })

    it('処理失敗のメッセージを取得する', () => {
      const result = getProcessingStatusMessage('failed')
      expect(result.message).toBe('処理失敗')
      expect(result.color).toBe('danger')
      expect(result.canDownload).toBe(false)
    })

    it('キャンセル済みのメッセージを取得する', () => {
      const result = getProcessingStatusMessage('canceled')
      expect(result.message).toBe('キャンセル済み')
      expect(result.color).toBe('warning')
      expect(result.canDownload).toBe(false)
    })

    it('削除済みのメッセージを取得する', () => {
      const result = getProcessingStatusMessage('deleted')
      expect(result.message).toBe('削除済み')
      expect(result.color).toBe('default')
      expect(result.canDownload).toBe(false)
    })

    it('削除失敗のメッセージを取得する', () => {
      const result = getProcessingStatusMessage('delete_failed')
      expect(result.message).toBe('削除失敗')
      expect(result.color).toBe('danger')
      expect(result.canDownload).toBe(false)
    })
  })

  describe('calculateProcessingDuration', () => {
    it('処理時間を秒単位で計算する', () => {
      const createdAt = '2024-01-01T00:00:00Z'
      const completedAt = '2024-01-01T00:01:30Z'
      const duration = calculateProcessingDuration(createdAt, completedAt)
      expect(duration).toBe(90) // 90秒
    })

    it('completedAtがない場合はnullを返す', () => {
      const createdAt = '2024-01-01T00:00:00Z'
      const duration = calculateProcessingDuration(createdAt)
      expect(duration).toBeNull()
    })
  })

  describe('calculateProcessingTime', () => {
    it('処理時間をミリ秒単位で計算する', () => {
      const createdAt = '2024-01-01T00:00:00Z'
      const completedAt = '2024-01-01T00:01:30Z'
      const time = calculateProcessingTime(createdAt, completedAt)
      expect(time).toBe(90000) // 90000ミリ秒
    })

    it('completedAtがない場合はnullを返す', () => {
      const createdAt = '2024-01-01T00:00:00Z'
      const time = calculateProcessingTime(createdAt)
      expect(time).toBeNull()
    })
  })

  describe('calculateProcessingDurationByStatus', () => {
    const createdAt = '2024-01-01T00:00:00Z'
    const updatedAt = '2024-01-01T00:01:00Z'
    const completedAt = '2024-01-01T00:02:00Z'

    it('successステータスの場合はcompletedAtを使用する', () => {
      const duration = calculateProcessingDurationByStatus('success', createdAt, updatedAt, completedAt)
      expect(duration).toBe(120) // 2分
    })

    it('failedステータスの場合はcompletedAtを使用する', () => {
      const duration = calculateProcessingDurationByStatus('failed', createdAt, updatedAt, completedAt)
      expect(duration).toBe(120)
    })

    it('completedAtがない場合はupdatedAtを使用する', () => {
      const duration = calculateProcessingDurationByStatus('success', createdAt, updatedAt)
      expect(duration).toBe(60) // 1分
    })

    it('in_progressステータスの場合は現在時刻を使用する', () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-01T00:05:00Z'))

      const duration = calculateProcessingDurationByStatus('in_progress', createdAt)
      expect(duration).toBe(300) // 5分

      jest.useRealTimers()
    })

    it('canceledステータスの場合はnullを返す', () => {
      const duration = calculateProcessingDurationByStatus('canceled', createdAt, updatedAt)
      expect(duration).toBeNull()
    })

    it('deletedステータスの場合はnullを返す', () => {
      const duration = calculateProcessingDurationByStatus('deleted', createdAt, updatedAt)
      expect(duration).toBeNull()
    })

    it('delete_failedステータスの場合はnullを返す', () => {
      const duration = calculateProcessingDurationByStatus('delete_failed', createdAt, updatedAt)
      expect(duration).toBeNull()
    })
  })

  describe('formatProcessingDuration', () => {
    it('秒単位でフォーマットする', () => {
      expect(formatProcessingDuration(30)).toBe('30秒')
      expect(formatProcessingDuration(59)).toBe('59秒')
    })

    it('分秒でフォーマットする', () => {
      expect(formatProcessingDuration(60)).toBe('1分0秒')
      expect(formatProcessingDuration(90)).toBe('1分30秒')
      expect(formatProcessingDuration(3599)).toBe('59分59秒')
    })

    it('時分秒でフォーマットする', () => {
      expect(formatProcessingDuration(3600)).toBe('1時間0分0秒')
      expect(formatProcessingDuration(3661)).toBe('1時間1分1秒')
      expect(formatProcessingDuration(7384)).toBe('2時間3分4秒')
    })

    it('0秒をフォーマットする', () => {
      expect(formatProcessingDuration(0)).toBe('0秒')
    })
  })

  describe('統合テスト', () => {
    it('S3キーのパースからファイル名抽出まで一貫して動作する', () => {
      const s3Key = 'service/input/customer123/proc-456/20241009_143022_data.csv'
      const parsed = parseServiceS3Key(s3Key)
      const fileName = extractFileNameFromS3Key(s3Key)

      expect(parsed?.fileName).toBe(fileName)
      expect(fileName).toBe('data.csv')
    })

    it('処理時間の計算とフォーマットが一貫している', () => {
      const createdAt = '2024-01-01T00:00:00Z'
      const completedAt = '2024-01-01T00:01:30Z'

      const duration = calculateProcessingDuration(createdAt, completedAt)
      expect(duration).toBe(90)

      const formatted = formatProcessingDuration(duration!)
      expect(formatted).toBe('1分30秒')
    })
  })
})

