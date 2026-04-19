import { NextResponse } from 'next/server'
import { createSession, hashPassword, serializeUser, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createDefaultFinanceSnapshot } from '@/lib/finance-data'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      password?: string
    }

    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()
    const name = body.name?.trim() || null

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        financeData: {
          create: {
            transactionsJson: JSON.stringify(createDefaultFinanceSnapshot().transactions),
            budgetsJson: JSON.stringify(createDefaultFinanceSnapshot().budgets),
            goalsJson: JSON.stringify(createDefaultFinanceSnapshot().goals),
            settingsJson: JSON.stringify(createDefaultFinanceSnapshot().settings),
            version: 1,
          },
        },
      },
    })

    const { token } = await createSession(user.id)

    const response = NextResponse.json({ user: serializeUser(user) }, { status: 201 })
    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)
    return response
  } catch (error) {
    console.error('Signup failed:', error)
    return NextResponse.json({ error: 'Unable to create account' }, { status: 500 })
  }
}