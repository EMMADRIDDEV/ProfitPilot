'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GetAccessCodePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to register page since access codes are no longer used
    router.push('/register')
  }, [router])

  return null
}
