'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ExpenseData {
  category: string
  amount: number
}

interface SpendingDonutChartProps {
  data: ExpenseData[]
}

export function SpendingDonutChart({ data }: SpendingDonutChartProps) {
  const categoryData = data.map((item) => ({
    name: item.category,
    value: item.amount,
  }))

  // Sort by value and take top 6
  const topCategories = categoryData.sort((a, b) => b.value - a.value).slice(0, 6)

  // Generate colors
  const colors = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCategories.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {topCategories.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index] }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(entry.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
