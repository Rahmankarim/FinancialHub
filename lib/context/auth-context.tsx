'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  createdAt: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (credentials: { email: string; password: string }) => Promise<AuthUser>
  signUp: (credentials: { name?: string; email: string; password: string }) => Promise<AuthUser>
  signOut: () => Promise<void>
  refreshUser: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function readAuthResponse(response: Response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Authentication failed')
  }

  return payload.user as AuthUser
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })

      if (!response.ok) {
        setUser(null)
        return null
      }

      const payload = (await response.json()) as { user: AuthUser }
      setUser(payload.user)
      return payload.user
    } catch (error) {
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const signIn = async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const nextUser = await readAuthResponse(response)
    setUser(nextUser)
    return nextUser
  }

  const signUp = async (credentials: { name?: string; email: string; password: string }) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const nextUser = await readAuthResponse(response)
    setUser(nextUser)
    return nextUser
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    })

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}