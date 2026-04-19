'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RecentTransactionsSectionProps {
  transactions: Transaction[]
  onAddNew?: () => void
}

export function RecentTransactionsSection({ transactions, onAddNew }: RecentTransactionsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex gap-2">
          {onAddNew && (
            <Button size="sm" variant="outline" onClick={onAddNew}>
              + Add
            </Button>
          )}
          <Link href="/transactions">
            <Button size="sm" variant="outline">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-muted-foreground">
            No transactions yet. Add one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${
                      transaction.type === 'income'
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateShort(new Date(transaction.date))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
