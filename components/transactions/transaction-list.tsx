'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { TransactionItem } from './transaction-item'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

const ALL_CATEGORIES = 'all'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES)
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((transaction) => transaction.category))).sort()
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const term = search.trim().toLowerCase()
      const matchesSearch =
        term.length === 0 ||
        transaction.description.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term)
      const matchesCategory = categoryFilter === ALL_CATEGORIES || transaction.category === categoryFilter
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      const matchesFromDate = !fromDate || transaction.date >= fromDate
      const matchesToDate = !toDate || transaction.date <= toDate

      return matchesSearch && matchesCategory && matchesType && matchesFromDate && matchesToDate
    })
  }, [transactions, search, categoryFilter, typeFilter, fromDate, toDate])

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return order === 'asc' ? dateA - dateB : dateB - dateA
    } else {
      return order === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
  })

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Search, filter, and manage every transaction in one place.</p>
          </div>
          <Badge variant="outline" className="w-fit">{sorted.length} visible</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search merchant or category" className="pl-9" />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearch('')
              setCategoryFilter(ALL_CATEGORIES)
              setTypeFilter('all')
              setFromDate('')
              setToDate('')
            }}
          >
            Reset filters
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          <div className="hidden lg:block" />
          <div className="hidden lg:block" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-semibold">Icon</th>
                <th className="px-4 py-3 text-left font-semibold">Details</th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-primary"
                  onClick={() => {
                    if (sortBy === 'date') {
                      setOrder(order === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortBy('date')
                    }
                  }}
                >
                  Date {sortBy === 'date' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th
                  className="px-4 py-3 text-right font-semibold cursor-pointer hover:text-primary"
                  onClick={() => {
                    if (sortBy === 'amount') {
                      setOrder(order === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortBy('amount')
                    }
                  }}
                >
                  Amount {sortBy === 'amount' && (order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
