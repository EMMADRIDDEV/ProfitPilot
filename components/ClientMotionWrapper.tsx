"use client"

import React from 'react'
import MotionLayout from '@/components/MotionLayout'

export default function ClientMotionWrapper({ children }: { children: React.ReactNode }) {
  return <MotionLayout>{children}</MotionLayout>
}
