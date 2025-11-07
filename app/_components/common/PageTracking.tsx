'use client'

import { Suspense } from 'react'
import { usePageTracking } from '@/app/lib/hooks/usePageTracking'

function PageTrackingInner() {
  usePageTracking()
  return null
}

export function PageTracking() {
  return (
    <Suspense fallback={null}>
      <PageTrackingInner />
    </Suspense>
  )
}

