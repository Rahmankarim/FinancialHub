 'use client'

import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface NetWorthCardProps {
  totalNetWorth: number
  monthlyChange: number
  changePercent: number
  trend?: number[]
}

export function NetWorthCard({ totalNetWorth, monthlyChange, changePercent, trend = [] }: NetWorthCardProps) {
  const isPositive = monthlyChange >= 0
  const sparklineData = trend.length > 0
    ? trend.map((value, index) => ({ index, value }))
    : [
        { index: 0, value: totalNetWorth * 0.78 },
        { index: 1, value: totalNetWorth * 0.82 },
        { index: 2, value: totalNetWorth * 0.8 },
        { index: 3, value: totalNetWorth * 0.88 },
        { index: 4, value: totalNetWorth },
      ]

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-[0_16px_40px_-28px_rgba(16,185,129,0.45)]">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Net Worth</CardTitle>
          <Badge variant="outline" className={isPositive ? 'border-emerald-200 text-emerald-700' : 'border-red-200 text-red-700'}>
            {isPositive ? 'Growing' : 'Declining'} trend
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{formatCurrency(totalNetWorth)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${isPositive ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isPositive ? '+' : ''}{formatCurrency(monthlyChange)} this month
            </div>
            <span className="text-sm text-muted-foreground">{changePercent}% change</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-white/70 p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">12-month sparkline</p>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="net-worth-sparkline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} fill="url(#net-worth-sparkline)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
