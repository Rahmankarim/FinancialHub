'use client'

import { useMemo, useState } from 'react'
import { Upload, FileText, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useFinance } from '@/lib/context/finance-context'

type CsvRow = Record<string, string>

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
}

const REQUIRED_HEADERS = ['date', 'type', 'category', 'description', 'amount', 'recurring']

function normalizeHeader(header: string) {
  return header.trim().toLowerCase()
}

function parseCsv(content: string) {
  const rows: string[][] = []
  let current = ''
  let row: string[] = []
  let inQuotes = false

  for (let index = 0; index < content.length; index++) {
    const char = content[index]
    const nextChar = content[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      index++
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        continue
      }

      row.push(current)
      if (row.some((value) => value.trim().length > 0)) {
        rows.push(row)
      }
      row = []
      current = ''
      continue
    }

    current += char
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current)
    rows.push(row)
  }

  const [headers, ...dataRows] = rows
  const normalizedHeaders = headers?.map(normalizeHeader) ?? []

  return dataRows
    .filter((dataRow) => dataRow.some((value) => value.trim().length > 0))
    .map((dataRow) => {
      const entry: CsvRow = {}

      normalizedHeaders.forEach((header, index) => {
        entry[header] = dataRow[index]?.trim() ?? ''
      })

      return entry
    })
}

export function CsvImportModal({ isOpen, onClose }: CsvImportModalProps) {
  const { addTransaction } = useFinance()
  const [fileName, setFileName] = useState('')
  const [allRows, setAllRows] = useState<CsvRow[]>([])
  const [previewRows, setPreviewRows] = useState<CsvRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const missingHeaders = useMemo(() => {
    return REQUIRED_HEADERS.filter((header) => !headers.includes(header))
  }, [headers])

  const handleFile = async (file: File | null | undefined) => {
    if (!file) {
      return
    }

    setError('')
    setFileName(file.name)

    try {
      const text = await file.text()
      const parsedRows = parseCsv(text)
      const firstRow = parsedRows[0] ?? {}
      setAllRows(parsedRows)
      setHeaders(Object.keys(firstRow))
      setPreviewRows(parsedRows.slice(0, 5))
    } catch {
      setError('Unable to parse the CSV file. Make sure it uses a standard comma-separated format.')
    }
  }

  const handleImport = async () => {
    if (allRows.length === 0) {
      return
    }

    setIsImporting(true)

    try {
      for (const row of allRows) {
        await addTransaction({
          date: row.date,
          type: row.type === 'income' ? 'income' : 'expense',
          category: row.category,
          description: row.description,
          amount: Number(row.amount),
          recurring: row.recurring === 'true' || row.recurring === 'yes' || row.recurring === '1',
        })
      }

      onClose()
      setFileName('')
      setAllRows([])
      setPreviewRows([])
      setHeaders([])
    } catch {
      setError('Import failed. Check the CSV values and try again.')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Transactions from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV with date, type, category, description, amount, and recurring columns.
          </DialogDescription>
        </DialogHeader>

        <div
          className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            void handleFile(event.dataTransfer.files?.[0])
          }}
        >
          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drag and drop your CSV file here</p>
          <p className="mb-4 text-xs text-muted-foreground">or choose a file to preview the first rows before import</p>
          <Input type="file" accept=".csv,text/csv" onChange={(event) => void handleFile(event.target.files?.[0])} />
        </div>

        {fileName && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-2">
              <FileText className="h-3.5 w-3.5" />
              {fileName}
            </Badge>
            {missingHeaders.length === 0 && previewRows.length > 0 && (
              <Badge className="gap-2 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready to import
              </Badge>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {previewRows.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Column preview</p>
            <div className="overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, index) => (
                    <TableRow key={index}>
                      {headers.map((header) => (
                        <TableCell key={header}>{row[header] ?? '—'}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void handleImport()} disabled={allRows.length === 0 || missingHeaders.length > 0 || isImporting}>
            {isImporting ? 'Importing...' : 'Import Transactions'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
