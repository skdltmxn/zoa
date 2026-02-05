'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hash, Code2, KeyRound, Type, Dices, Github, Braces, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/encoder', label: 'Encoder', icon: Code2 },
  { href: '/hash', label: 'Hash', icon: Hash },
  { href: '/id', label: 'ID Gen', icon: KeyRound },
  { href: '/strings', label: 'Strings', icon: Type },
  { href: '/random', label: 'Random', icon: Dices },
  { href: '/json', label: 'JSON', icon: Braces },
  { href: '/time', label: 'Time', icon: Clock },
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
        <a
          href="https://github.com/skdltmxn/zoa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary hover:text-text-primary transition-colors"
          aria-label="GitHub repository"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </header>
  )
}
