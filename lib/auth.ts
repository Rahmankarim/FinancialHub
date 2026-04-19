import 'server-only'

import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const SESSION_COOKIE_NAME = 'financehub_session'
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: SESSION_DURATION_MS / 1000,
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export function serializeUser(user: { id: string; email: string; name: string | null; createdAt: Date }): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  return { token, expiresAt }
}

export async function getUserFromSessionToken(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session) {
    return null
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { token } }).catch(() => undefined)
    return null
  }

  return serializeUser(session.user)
}

export async function deleteSession(token: string) {
  await prisma.session.deleteMany({ where: { token } })
}