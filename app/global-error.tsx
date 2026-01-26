'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps): React.ReactElement {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#1a1b26] text-[#c0caf5] font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-[#f7768e] mb-4">500</h1>
            <h2 className="text-2xl font-semibold mb-2">
              Something Went Wrong
            </h2>
            <p className="text-[#9aa5ce] mb-8">
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-[#7aa2f7]/20 text-[#7aa2f7] border border-[#7aa2f7]/30 rounded-lg hover:bg-[#7aa2f7]/30 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
