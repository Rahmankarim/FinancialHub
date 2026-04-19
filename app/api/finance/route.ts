import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME, getUserFromSessionToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createDefaultFinanceSnapshot, normalizeFinanceSnapshot } from '@/lib/finance-data'

async function getAuthedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return getUserFromSessionToken(token)
}

export async function GET() {
  const user = await getAuthedUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const financeData = await prisma.financeData.findUnique({ where: { userId: user.id } })

  if (!financeData) {
    const defaults = createDefaultFinanceSnapshot()

    const created = await prisma.financeData.create({
      data: {
        userId: user.id,
        transactionsJson: JSON.stringify(defaults.transactions),
        budgetsJson: JSON.stringify(defaults.budgets),
        goalsJson: JSON.stringify(defaults.goals),
        settingsJson: JSON.stringify(defaults.settings),
        version: defaults.version,
      },
    })

    return NextResponse.json({
      transactions: defaults.transactions,
      budgets: defaults.budgets,
      goals: defaults.goals,
      settings: defaults.settings,
      version: created.version,
    })
  }

  return NextResponse.json({
    transactions: JSON.parse(financeData.transactionsJson),
    budgets: JSON.parse(financeData.budgetsJson),
    goals: JSON.parse(financeData.goalsJson),
    settings: JSON.parse(financeData.settingsJson),
    version: financeData.version,
  })
}

export async function PUT(request: Request) {
  const user = await getAuthedUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const nextSnapshot = normalizeFinanceSnapshot(body)

  await prisma.financeData.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      transactionsJson: JSON.stringify(nextSnapshot.transactions),
      budgetsJson: JSON.stringify(nextSnapshot.budgets),
      goalsJson: JSON.stringify(nextSnapshot.goals),
      settingsJson: JSON.stringify(nextSnapshot.settings),
      version: nextSnapshot.version,
    },
    update: {
      transactionsJson: JSON.stringify(nextSnapshot.transactions),
      budgetsJson: JSON.stringify(nextSnapshot.budgets),
      goalsJson: JSON.stringify(nextSnapshot.goals),
      settingsJson: JSON.stringify(nextSnapshot.settings),
      version: nextSnapshot.version,
    },
  })

  return NextResponse.json(nextSnapshot)
}