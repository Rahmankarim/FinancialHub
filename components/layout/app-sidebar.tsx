'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { LogOut, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/context/auth-context'
import { useFinance } from '@/lib/context/finance-context'
import { NAV_ITEMS } from '@/lib/navigation'

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { isSaving } = useFinance()
  const currentYear = new Date().getFullYear()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/auth')
  }

  return (
    <aside className={cn('flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground', className)}>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">FinanceHub</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-50'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border bg-sidebar/95 p-4 backdrop-blur-sm">
        <div className="space-y-3 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/15 p-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-sidebar-foreground/60">Signed in as</p>
            <p className="mt-1 truncate text-sm font-medium">{user?.email || 'Unknown user'}</p>
            {isSaving && <p className="mt-1 text-xs text-sidebar-foreground/60">Saving changes...</p>}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2 border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
          <p className="text-xs text-sidebar-foreground/60">© {currentYear} FinanceHub</p>
        </div>
      </div>
    </aside>
  )
}
