import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NestFinder — Browse Buyer Interest & Upload Your Property Brief',
  description: 'Browse buyer interest in your area or upload your property brief and let homeowners come to you. Find buyers before listing or find homes before they hit the market. Pre-market property matching in the UK.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NestFinder — Browse Buyer Interest & Upload Your Property Brief',
    description: 'Browse buyer interest in your area or upload your property brief. Find buyers before listing or find homes before they hit the market.',
    url: '/',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

