'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CurrencySelector } from '@/components/common/currency-selector'
import { Switch } from '@/components/ui/switch'
import { Download, RotateCcw, Save, Upload } from 'lucide-react'
import { useAuth } from '@/lib/context/auth-context'
import { useFinance } from '@/lib/context/finance-context'
import { formatDate } from '@/lib/utils'
import { CsvImportModal } from '@/components/modals/csv-import-modal'

export default function SettingsPage() {
  const { user } = useAuth()
  const { settings, transactions, updateSettings, resetData, isSaving } = useFinance()
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [currency, setCurrency] = useState(settings.currency)
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled)
  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts)

  useEffect(() => {
    setCurrency(settings.currency)
    setNotificationsEnabled(settings.notificationsEnabled)
    setEmailAlerts(settings.emailAlerts)
  }, [settings])

  const handleSave = async () => {
    await updateSettings({
      currency,
      notificationsEnabled,
      emailAlerts,
    })
  }

  const handleExport = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Recurring']
    const escapeCsv = (value: string | number | boolean) => {
      const text = String(value)
      if (text.includes('"') || text.includes(',') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`
      }
      return text
    }

    const rows = transactions.map((transaction) => [
      transaction.date,
      transaction.type,
      transaction.category,
      transaction.description,
      transaction.amount.toFixed(2),
      transaction.recurring ? 'Yes' : 'No',
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeDate = new Date().toISOString().slice(0, 10)

    link.href = url
    link.download = `financehub-transactions-${safeDate}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your preferences and account settings</p>
        </div>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Customize how your financial data is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Currency</p>
                <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
              </div>
              <CurrencySelector onCurrencyChange={setCurrency} currentCurrency={currency} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for budget overages and goals</p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-muted-foreground">Receive weekly financial summaries</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Account Email</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'Unknown'}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Account Created</p>
              <p className="text-sm text-muted-foreground">
                {user ? formatDate(user.createdAt) : 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or manage your financial data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setIsImportOpen(true)} variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import Transactions from CSV
            </Button>
            <Button onClick={handleExport} variant="outline" className="w-full" disabled={transactions.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export Transactions as CSV
            </Button>
            <p className="text-xs text-muted-foreground">
              Download all your transaction data as a CSV file for backup or analysis
            </p>
            <Button onClick={resetData} variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset My Data
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 sticky bottom-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <CsvImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      </div>
    </AppLayout>
  )
}
