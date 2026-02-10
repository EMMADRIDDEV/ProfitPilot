'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('profitpilot_access_token')
        const businessId = localStorage.getItem('profitpilot_business_id')

        if (!accessToken || !businessId) {
          router.push('/login')
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('[v0] Auth check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />
      <div className="pt-16 pb-8">
        {children}
      </div>
    </div>
  )
}
