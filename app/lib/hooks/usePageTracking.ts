'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/app/lib/utils/analytics'

// ページ遷移を自動追跡するカスタムフック
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return

    const search = searchParams?.toString()
    const url = search ? `${pathname}?${search}` : pathname
    
    pageview(url)
  }, [pathname, searchParams])
}

