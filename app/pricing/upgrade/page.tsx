"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function UpgradePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const handleUpgrade = async () => {
    if (!user?.email) {
      toast.error('Please sign in before upgrading')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/paystack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await res.json()
      if (data?.success && data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        toast.error(data?.error || 'Failed to start payment')
      }
    } catch (error) {
      console.error(error)
      toast.error('Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-2xl w-full bg-slate-800/50 border border-slate-700/50 p-8 rounded-lg">
        <h2 className="text-2xl text-white font-bold mb-4">Upgrade to ProfitPilot Premium</h2>
        <p className="text-slate-300 mb-4">Monthly recurring: ₦9,999</p>
        <p className="text-slate-400 mb-6">All premium features will be unlocked after successful payment. You can cancel anytime.</p>

        <div className="mb-4">
          <label className="text-slate-300 text-sm">Account Email</label>
          <Input value={user?.email || ''} readOnly className="mt-1" />
        </div>

        <Button onClick={handleUpgrade} className="w-full bg-white text-black" disabled={loading}>
          {loading ? 'Redirecting to payment...' : 'Pay ₦9,999 / month with Paystack'}
        </Button>
      </div>
    </div>
  )
}
