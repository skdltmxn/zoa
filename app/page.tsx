import Link from 'next/link'
import { Code2, Hash, KeyRound, Type, Dices, Braces, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'

const features = [
  {
    title: 'Encoder / Decoder',
    description: 'Convert text between Base64, URL, and Hex encoding formats',
    href: '/encoder',
    icon: Code2,
  },
  {
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes',
    href: '/hash',
    icon: Hash,
  },
  {
    title: 'ID Generator',
    description: 'Generate UUID v4, UUID v7, ULID, NanoID, and CUID',
    href: '/id',
    icon: KeyRound,
  },
  {
    title: 'String Transformer',
    description: 'Transform strings with case conversion, sorting, and more',
    href: '/strings',
    icon: Type,
  },
  {
    title: 'Random Generator',
    description: 'Generate random bytes, strings, numbers, or shuffle lists',
    href: '/random',
    icon: Dices,
  },
  {
    title: 'JSON / YAML',
    description: 'Format, minify, or convert between JSON and YAML',
    href: '/json',
    icon: Braces,
  },
]

export default function Home(): React.ReactElement {
  return (
    <PageContainer className="py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-accent-primary mb-4">
          zoa
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mx-auto">
          Fast, private web utilities for developers.
          Encoding, decoding, hashing, and more.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:border-border-focus transition-colors group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent-primary/20">
                      <Icon className="h-5 w-5 text-accent-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-accent-primary group-hover:gap-3 transition-all">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </PageContainer>
  )
}
