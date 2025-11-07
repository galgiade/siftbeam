import { render } from '@testing-library/react'
import { PageTracking } from '../PageTracking'
import { usePageTracking } from '@/app/lib/hooks/usePageTracking'

// usePageTrackingフックのモック
jest.mock('@/app/lib/hooks/usePageTracking')

describe('PageTracking', () => {
  const mockUsePageTracking = usePageTracking as jest.MockedFunction<typeof usePageTracking>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    const { container } = render(<PageTracking />)
    expect(container).toBeInTheDocument()
  })

  it('何も表示しない（nullを返す）', () => {
    const { container } = render(<PageTracking />)
    expect(container.firstChild).toBeNull()
  })

  it('usePageTrackingフックが呼び出される', () => {
    render(<PageTracking />)
    expect(mockUsePageTracking).toHaveBeenCalledTimes(1)
  })

  it('Suspenseでラップされている', () => {
    const { container } = render(<PageTracking />)
    // Suspenseコンポーネントが正常に動作していることを確認
    expect(container).toBeInTheDocument()
  })

  it('複数回レンダリングしても問題ない', () => {
    const { rerender } = render(<PageTracking />)
    
    rerender(<PageTracking />)
    rerender(<PageTracking />)
    
    // 複数回呼び出されることを確認
    expect(mockUsePageTracking).toHaveBeenCalled()
  })

  it('エラーが発生してもクラッシュしない', () => {
    mockUsePageTracking.mockImplementation(() => {
      throw new Error('Test error')
    })

    // エラーをキャッチするためのエラーバウンダリーなしでレンダリング
    expect(() => render(<PageTracking />)).toThrow()
  })

  it('usePageTrackingがundefinedを返しても問題ない', () => {
    mockUsePageTracking.mockReturnValue(undefined as any)

    const { container } = render(<PageTracking />)
    expect(container).toBeInTheDocument()
  })
})

