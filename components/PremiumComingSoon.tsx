"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function PremiumComingSoon({ children }: { children?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? <Button className="w-full">Start Premium</Button>}
      </DialogTrigger>

      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Premium Is Coming Soon</DialogTitle>
          <p className="text-slate-300 text-center mt-2">We're polishing premium features — stay tuned!</p>
        </DialogHeader>

        <div className="mt-6">
          <ul className="space-y-2 text-slate-300">
            <li>• Advanced reports and exports</li>
            <li>• Invoice & receipt generation</li>
            <li>• E‑commerce integrations</li>
          </ul>
        </div>

        <DialogFooter>
          <Button className="mt-4 w-full bg-white text-black">Notify Me</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
