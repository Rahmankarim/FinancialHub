'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { IncomeExpensesBarChart } from '@/components/charts/income-expenses-bar-chart'
import { NetWorthLineChart } from '@/components/charts/net-worth-line-chart'
import { MonthPicker } from '@/components/common/month-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFinance } from '@/lib/context/finance-context'
import { useFinanceCalculations } from '@/lib/hooks/use-finance-calculations'
import { formatCurrency } from '@/lib/utils'
import { useEffect } from 'react'

function parseReportMonth(label: string) {
  const [monthLabel, yearLabel] = label.split(' ')
  const monthIndex = new Date(`${monthLabel} 1, 2000`).getMonth()
  return new Date(Number(yearLabel), monthIndex, 1)
}

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const { isLoading } = useFinance()
  const { monthlyData, monthlyIncome, monthlyExpenses, netWorth } = useFinanceCalculations()

  useEffect(() => {
    if (monthlyData.length > 0) {
      setSelectedMonth(parseReportMonth(monthlyData[monthlyData.length - 1].month))
    }
  }, [monthlyData])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-card rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-card rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Get the latest month data for summary
  const selectedEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
  const selectedStart = new Date(selectedEnd)
  selectedStart.setMonth(selectedStart.getMonth() - 5)

  const filteredData = monthlyData.filter((entry) => {
    const entryDate = parseReportMonth(entry.month)
    return entryDate >= selectedStart && entryDate <= selectedEnd
  })

  const latestData = filteredData[filteredData.length - 1] || monthlyData[monthlyData.length - 1]
  const previousData = filteredData[filteredData.length - 2] || monthlyData[monthlyData.length - 2]

  const incomeDiff = latestData ? latestData.income - (previousData?.income || 0) : 0
  const expensesDiff = latestData ? latestData.expenses - (previousData?.expenses || 0) : 0
  const netWorthDiff = latestData ? latestData.net - (previousData?.net || 0) : 0

  const avgExpenses = filteredData.length > 0 
    ? filteredData.reduce((sum, d) => sum + d.expenses, 0) / filteredData.length 
    : 0

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">Analyze your financial trends and insights</p>
        </div>

        {/* Month Picker */}
        <div className="flex justify-center">
          <MonthPicker onMonthChange={setSelectedMonth} currentDate={selectedMonth} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Showing the 6-month window ending in {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Month Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(latestData?.income || 0)}</p>
              <p
                className={`text-xs mt-2 ${
                  incomeDiff >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {incomeDiff >= 0 ? '+' : ''}{formatCurrency(incomeDiff)} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Month Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(latestData?.expenses || 0)}</p>
              <p
                className={`text-xs mt-2 ${
                  expensesDiff <= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {expensesDiff >= 0 ? '+' : ''}{formatCurrency(expensesDiff)} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Worth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(netWorth)}</p>
              <p className={`text-xs mt-2 ${netWorthDiff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {netWorthDiff >= 0 ? '+' : ''}{formatCurrency(netWorthDiff)} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <IncomeExpensesBarChart data={filteredData} />
          <NetWorthLineChart data={filteredData} />
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">Spending Trends</p>
              <p className="text-sm text-muted-foreground">
                Your average monthly expenses are {formatCurrency(avgExpenses)}. In the selected window, you spent{' '}
                {(latestData?.expenses || 0) > avgExpenses
                  ? 'more'
                  : 'less'}{' '}
                than average.
              </p>
            </div>
            {monthlyData.length > 1 && (
              <div className="space-y-2">
                <p className="font-semibold">Growth</p>
                <p className="text-sm text-muted-foreground">
                  Your net worth has grown by {formatCurrency((latestData?.net || 0) - (filteredData[0]?.net || 0))} over the past {filteredData.length} months.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
