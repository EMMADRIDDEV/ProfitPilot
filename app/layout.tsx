import React from "react"
import type { Metadata } from 'next'
import './globals.css'
import ClientMotionWrapper from '@/components/ClientMotionWrapper'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'ProfitPilot - Business Management Software',
  description: 'Premium business management software for sales tracking, inventory management, and profit analysis',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ClientMotionWrapper>{children}</ClientMotionWrapper>
        <Analytics />
      </body>
    </html>
  )
}
