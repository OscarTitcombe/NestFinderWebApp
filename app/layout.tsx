import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/lib/toast'
import { AuthProvider } from '@/lib/auth-context'
import { Analytics } from '@vercel/analytics/react'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: {
    default: 'NestFinder — Browse Buyer Interest & Upload Your Property Brief',
    template: '%s | NestFinder'
  },
  description: 'Browse buyer interest in your area or upload your property brief and let homeowners come to you. Find buyers before listing or find homes before they hit the market. Pre-market property matching in the UK.',
  keywords: [
    'NestFinder',
    'browse buyer interest',
    'property brief',
    'upload property brief',
    'find buyers before listing',
    'find homes before listing',
    'buyer interest in my area',
    'pre-market property',
    'off-market property',
    'homeowners come to you',
    'property marketplace UK'
  ],
  authors: [{ name: 'NestFinder' }],
  creator: 'NestFinder',
  publisher: 'NestFinder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nestfinder.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    siteName: 'NestFinder',
    title: 'NestFinder — Browse Buyer Interest & Upload Your Property Brief',
    description: 'Browse buyer interest in your area or upload your property brief. Find buyers before listing or find homes before they hit the market.',
    images: [
      {
        url: '/logo-v3.png',
        width: 1200,
        height: 630,
        alt: 'NestFinder - Reverse Property Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NestFinder — Browse Buyer Interest & Upload Your Property Brief',
    description: 'Browse buyer interest in your area or upload your property brief. Find buyers before listing or find homes before they hit the market.',
    images: ['/logo-v3.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
