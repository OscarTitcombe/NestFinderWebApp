import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Upload Your Property Brief | Find Homes Before They\'re Listed',
  description: 'Upload your property brief with NestFinder and let homeowners come to you. Post your requirements and find homes before they hit the market. Pre-market property matching in the UK.',
  keywords: [
    'property brief',
    'upload property brief',
    'find homes before listing',
    'homeowners come to you',
    'find homes before they hit the market',
    'pre-market property search',
    'off-market property search',
    'property brief UK'
  ],
  alternates: {
    canonical: '/for-buyers',
  },
  openGraph: {
    title: 'Upload Your Property Brief | NestFinder',
    description: 'Upload your property brief and let homeowners come to you. Find homes before they hit the market.',
    url: '/for-buyers',
  },
}

export default function ForBuyersLayout({
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

