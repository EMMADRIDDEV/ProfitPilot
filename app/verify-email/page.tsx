'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmail, resendVerificationCode } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { TrendingUp, Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [resending, setResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if there's a code in URL
    const urlCode = searchParams.get('code')
    if (urlCode) {
      setCode(urlCode)
      handleVerify(urlCode)
    }
  }, [searchParams])

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code
    
    if (!codeToVerify) {
      toast.error('Please enter a verification code')
      return
    }

    setLoading(true)
    try {
      const result = await verifyEmail(codeToVerify)
      
      if (result.success) {
        setVerified(true)
        toast.success('Email verified successfully!')
        
        // Redirect to dashboard setup after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/setup')
        }, 2000)
      } else {
        toast.error(result.error || 'Verification failed')
      }
    } catch (error) {
      console.error('[VerifyEmail] Error:', error)
      toast.error('An error occurred during verification')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setResending(true)
    try {
      const result = await resendVerificationCode(email)
      
      if (result.success) {
        toast.success('Verification code sent to your email!')
      } else {
        toast.error(result.error || 'Failed to resend code')
      }
    } catch (error) {
      console.error('[ResendCode] Error:', error)
      toast.error('An error occurred')
    } finally {
      setResending(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                  <p className="text-slate-400">
                    Your email has been verified successfully. Redirecting to setup...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
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
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Enter the verification code sent to your email address
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-slate-300">
                  Verification Code
                </label>
                <Input
                  id="code"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">Check your email for the code</p>
              </div>

              <Button
                onClick={() => handleVerify()}
                disabled={!code || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Resend Code to Email
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={resending}
                  />
                  <Button
                    onClick={handleResendCode}
                    disabled={!email || resending}
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700 text-white bg-transparent"
                  >
                    {resending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 text-center">
                Already verified?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  Go to login
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
