import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, calculatePercentage } from '@/lib/utils'
import { Wallet, ArrowDownRight, ArrowUpRight, Percent } from 'lucide-react'

interface MetricSummaryCardsProps {
  balance: number
  income: number
  expenses: number
  savingsRate: number
}

export function MetricSummaryCards({
  balance,
  income,
  expenses,
  savingsRate,
}: MetricSummaryCardsProps) {
  const metrics = [
    {
      label: 'Balance',
      value: balance,
      icon: Wallet,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Income',
      value: income,
      icon: ArrowUpRight,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      label: 'Expenses',
      value: expenses,
      icon: ArrowDownRight,
      color: 'bg-red-500/10 text-red-600',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: Percent,
      color: 'bg-purple-500/10 text-purple-600',
      isPercent: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {metric.isPercent ? metric.value : formatCurrency(metric.value as number)}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
