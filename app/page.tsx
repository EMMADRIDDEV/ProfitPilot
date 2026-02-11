import { Button } from '@/components/ui/button'
import Link from 'next/link'
import PremiumComingSoon from '@/components/PremiumComingSoon'
import { BarChart3, TrendingUp, Package, PieChart, Zap, Lock } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ProfitPilot</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-slate-600 hover:bg-slate-800 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Premium Business Management Software</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Manage Your Business with{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Confidence
            </span>
          </h2>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            ProfitPilot is a comprehensive business management solution designed for ambitious entrepreneurs. Track sales, manage inventory, and optimize profits - all in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/get-access-code">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Manage Business
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800 text-white bg-transparent">
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Daily Sales Tracking</h3>
              <p className="text-slate-400">Monitor your sales performance in real-time with detailed daily records and analytics.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
              <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Inventory Management</h3>
              <p className="text-slate-400">Keep track of your stock levels, reorder points, and supplier information effortlessly.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
              <PieChart className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Profit & Loss Analysis</h3>
              <p className="text-slate-400">Get comprehensive insights into your expenses and profitability with advanced analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8">
              <h4 className="text-2xl font-semibold text-white">Free</h4>
              <p className="text-slate-400 mt-2">Perfect for startups and small businesses</p>
              <div className="mt-6 text-white text-4xl font-bold">₦0 <span className="text-slate-400 text-sm">/month</span></div>
              <ul className="mt-6 space-y-3 text-slate-300 text-left">
                <li>Daily sales tracking</li>
                <li>Inventory management</li>
                <li>Profit & loss reports</li>
                <li>Business analytics dashboard</li>
              </ul>
              <div className="mt-6">
                <Link href="/get-access-code">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600">Start Free</Button>
                </Link>
              </div>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-blue-800/60 to-blue-700/40 border border-blue-600/30 rounded-lg p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-semibold text-white">Premium</h4>
                  <p className="text-slate-200 mt-1">All Free features + advanced premium tools</p>
                </div>
                <div className="text-white text-4xl font-bold">₦9,999 <span className="text-slate-300 text-sm">/month</span></div>
              </div>

              <ul className="mt-6 space-y-3 text-slate-100 text-left">
                <li>Customizable Reports & Dashboards (export to PDF/Excel) <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs rounded text-black">Premium</span></li>
                <li>Invoice & Receipt Generation System <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs rounded text-black">Premium</span></li>
                <li>E-commerce Platform Integration <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs rounded text-black">Premium</span></li>
                <li>Customer Relationship Management (CRM) <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs rounded text-black">Premium</span></li>
                <li>Automated Tax Calculations <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs rounded text-black">Premium</span></li>
                <li>Advanced Remote & Service Business Features <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-xs rounded text-black">Premium</span></li>
              </ul>

              <div className="mt-6">
                <PremiumComingSoon>
                  <Button id="upgrade-paystack-btn" className="w-full bg-white text-black">Start Premium</Button>
                </PremiumComingSoon>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© 2026 ProfitPilot. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
