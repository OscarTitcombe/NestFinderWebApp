import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NestFinder — Anonymous, pre-market house-hunting',
  description: 'Find real buyers before you list — or sellers before they go live. Anonymous matches, private intros, off-market first.',
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
