import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'

export default function NotFound(): React.ReactElement {
  return (
    <PageContainer className="py-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-8">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
