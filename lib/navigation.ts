import { BarChart3, CreditCard, Home, PiggyBank, Settings, Target } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Transactions', href: '/transactions', icon: CreditCard },
  { label: 'Budgets', href: '/budgets', icon: PiggyBank },
  { label: 'Goals', href: '/goals', icon: Target },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]
