import { NextResponse } from 'next/server'
import { createSession, serializeUser, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function getDatabaseConfigError() {
  const databaseUrl = process.env.DATABASE_URL || ''
  if (process.env.NODE_ENV === 'production' && databaseUrl.startsWith('file:')) {
    return 'Production database is misconfigured. Use a hosted Postgres DATABASE_URL on Vercel instead of SQLite file storage.'
  }
  return null
}

export async function POST(request: Request) {
  try {
    const databaseConfigError = getDatabaseConfigError()

    if (databaseConfigError) {
      return NextResponse.json({ error: databaseConfigError }, { status: 500 })
    }

    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash)

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const { token } = await createSession(user.id)
    const response = NextResponse.json({ user: serializeUser(user) })
    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)
    return response
  } catch (error) {
    console.error('Login failed:', error)
    return NextResponse.json({ error: 'Unable to sign in. Check production DATABASE_URL and Prisma setup.' }, { status: 500 })
  }
}