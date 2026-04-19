'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/context/auth-context'
import { TrendingUp, ShieldCheck, Wallet, LineChart } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const { user, isLoading, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [name, setName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn({ email: signInEmail, password: signInPassword })
      router.replace('/')
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await signUp({ name, email: signUpEmail, password: signUpPassword })
      router.replace('/')
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eefaf5_100%)]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.2fr_0.8fr] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_100%)]">
      <section className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-slate-900">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <TrendingUp className="h-4 w-4 text-primary" />
            FinanceHub
          </div>
          <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight xl:text-6xl">
            Personal finance that adapts to each account.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-600">
            Sign in or create an account, then keep every transaction, budget, goal, and setting tied to your own database-backed profile.
          </p>
        </div>

        <div className="grid max-w-xl gap-4 sm:grid-cols-3">
          {[
            { icon: Wallet, title: 'Transactions', body: 'Track every income and expense in one place.' },
            { icon: LineChart, title: 'Analytics', body: 'See trends update from your own data.' },
            { icon: ShieldCheck, title: 'Private', body: 'Each account gets isolated stored data.' },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-lg border-white/70 bg-white/85 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription>Sign in or create a new account to sync your financial data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" value={signInEmail} onChange={(event) => setSignInEmail(event.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" value={signInPassword} onChange={(event) => setSignInPassword(event.target.value)} placeholder="Enter your password" required />
                  </div>
                  {error && mode === 'signin' && <p className="text-sm text-red-600">{error}</p>}
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" value={signUpEmail} onChange={(event) => setSignUpEmail(event.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" value={signUpPassword} onChange={(event) => setSignUpPassword(event.target.value)} placeholder="At least 8 characters" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" required />
                  </div>
                  {error && mode === 'signup' && <p className="text-sm text-red-600">{error}</p>}
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}