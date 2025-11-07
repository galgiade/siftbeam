// Testing Libraryのカスタムマッチャーをインポート
import '@testing-library/jest-dom'

// グローバルモックの設定

// uuidモジュールのモック
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}))

// Next.js Scriptコンポーネントのモック
jest.mock('next/script', () => {
  return function MockScript(props) {
    return null
  }
})

// Next.js Imageコンポーネントのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Next.js Linkコンポーネントのモック
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>
  }
})

// Next.js Navigationのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}))

// Web Vitalsのモック
jest.mock('next/web-vitals', () => ({
  useReportWebVitals: jest.fn(),
}))

// Window.matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// IntersectionObserverのモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// ResizeObserverのモック
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// console.errorとconsole.warnのモック（不要なログを抑制）
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // React 19の警告を抑制
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: useLayoutEffect') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    // 不要な警告を抑制
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// 環境変数のモック
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456'
process.env.NODE_ENV = 'test'

// framer-motionのモック（heroui用）
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: () => ({
    set: jest.fn(),
    get: jest.fn(() => 0),
  }),
  useTransform: () => ({
    set: jest.fn(),
    get: jest.fn(() => 0),
  }),
  useSpring: () => ({
    set: jest.fn(),
    get: jest.fn(() => 0),
  }),
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
  domAnimation: jest.fn(),
  LazyMotion: ({ children }) => children,
}))

// HeroUI Rippleコンポーネントのモック
jest.mock('@heroui/ripple', () => ({
  Ripple: () => null,
  useRipple: () => ({
    ripples: [],
    onClick: jest.fn(),
    onClear: jest.fn(),
  }),
}))

// HeroUI Buttonコンポーネントのモック（useRippleを使用しないバージョン）
jest.mock('@heroui/button', () => {
  const React = require('react')
  return {
    Button: React.forwardRef(({ children, onPress, as: Component = 'button', ...props }, ref) => {
      // asプロパティが指定されている場合はそのコンポーネントを使用
      if (Component !== 'button') {
        return React.createElement(Component, { ref, ...props }, children)
      }
      return (
        <button ref={ref} onClick={onPress} {...props}>
          {children}
        </button>
      )
    }),
  }
})

// HeroUI Popoverコンポーネントのモック
jest.mock('@heroui/popover', () => {
  const React = require('react')
  return {
    Popover: ({ children }) => <div>{children}</div>,
    PopoverTrigger: ({ children }) => <div>{children}</div>,
    PopoverContent: ({ children }) => <div>{children}</div>,
  }
})
