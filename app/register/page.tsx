"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { TrendingUp, Mail, User, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { registerUser } from '@/app/actions/auth'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name')
      return false
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await registerUser({
        email: email.toLowerCase(),
        password: password,
        fullName: fullName,
      })

      if (!response.success) {
        toast.error(response.error || 'Registration failed')
        setLoading(false)
        return
      }

      toast.success('Registration successful! Please check your email to verify your account.')
      
      // We don't redirect immediately because they need to verify email
      // But we can redirect to a verification pending page or login
      setTimeout(() => {
        router.push('/login?message=Check your email to verify your account')
      }, 3000)
    } catch (error: any) {
      console.error('[Register] Error:', error)
      toast.error('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    toast.info('Google signup coming soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 py-8">
      <LoadingOverlay isVisible={loading} message="Creating your account..." />
      
      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-300 hover:text-white transition">
        <TrendingUp className="w-5 h-5" />
        <span>ProfitPilot</span>
      </Link>

      <div className="w-full max-w-md">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white text-center">Create Account</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign up for ProfitPilot to start managing your business today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">At least 8 characters</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!fullName || !email || !password || !confirmPassword || loading}
                onClick={() => console.debug('[Register] submit clicked', { fullName, email, loading })}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full border-slate-600 hover:bg-slate-700 text-white bg-transparent"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-8">
          © 2024 ProfitPilot. Premium Business Management Software.
        </p>
      </div>
    </div>
  )
}
