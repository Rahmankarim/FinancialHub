'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

interface IncomeExpensesBarChartProps {
  data: MonthlyData[]
}

export function IncomeExpensesBarChart({ data }: IncomeExpensesBarChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].payload.month}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-1)]" /> Income
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-3)]" /> Expenses
          </span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.slice(-6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
