 'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { AppSidebar } from './app-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background lg:flex">
      <AppSidebar className="hidden lg:flex lg:sticky lg:top-0" />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[88vw] p-0 sm:max-w-sm">
          <AppSidebar className="h-full w-full border-0" />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto bg-background">
        <div className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold tracking-tight">FinanceHub</p>
              <p className="text-xs text-muted-foreground">Personal finance dashboard</p>
            </div>
            <Button type="button" variant="outline" size="icon" onClick={() => setMobileOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
