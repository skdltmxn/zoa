'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hash, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/encoder', label: 'Encoder', icon: Code2 },
  { href: '/hash', label: 'Hash', icon: Hash },
]

export function Header(): React.ReactElement {
  const pathname = usePathname()

  return (
    <header className="border-b border-border-default bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-accent-primary hover:text-accent-primary/80 transition-colors"
        >
          zoa
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  isActive
                    ? 'text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
