'use client'

import { useEffect } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps): React.ReactElement {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <PageContainer className="py-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent-error mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Something Went Wrong
        </h2>
        <p className="text-text-secondary mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </PageContainer>
  )
}
