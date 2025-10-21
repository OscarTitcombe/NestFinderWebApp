import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NestFinder - See who\'s buying in your area',
  description: 'Buyers post what they want. Sellers browse demand and connect directly — fewer middlemen.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
