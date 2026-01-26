import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({
  children,
  className,
}: PageContainerProps): React.ReactElement {
  return (
    <main className={cn('max-w-[1200px] mx-auto px-6 py-8', className)}>
      {children}
    </main>
  )
}
