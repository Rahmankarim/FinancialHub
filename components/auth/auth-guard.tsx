'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TrendingUp } from 'lucide-react'
import { useAuth } from '@/lib/context/auth-context'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!user && pathname !== '/auth') {
      router.replace('/auth')
    }

    if (user && pathname === '/auth') {
      router.replace('/')
    }
  }, [isLoading, user, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eefaf5_100%)]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Checking your session...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/auth') {
    return null
  }

  if (user && pathname === '/auth') {
    return null
  }

  return <>{children}</>
}