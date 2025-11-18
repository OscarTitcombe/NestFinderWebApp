import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Browse Buyer Interest | Find Buyers Before Listing',
  description: 'Browse buyer interest in your area with NestFinder. See what buyers are looking for and connect before going to market. Find buyers before listing your property in the UK.',
  keywords: [
    'browse buyer interest',
    'buyer interest in my area',
    'find buyers before listing',
    'browse property buyers',
    'find buyers before going to market',
    'buyer demand in my area',
    'pre-market property buyers',
    'find property buyers before listing UK'
  ],
  alternates: {
    canonical: '/for-sellers',
  },
  openGraph: {
    title: 'Browse Buyer Interest | NestFinder',
    description: 'Browse buyer interest in your area. See what buyers are looking for and connect before going to market.',
    url: '/for-sellers',
  },
}

export default function ForSellersLayout({
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

