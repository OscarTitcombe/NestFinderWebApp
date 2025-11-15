import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center">
        {children}
      </main>
      <Footer />
    </div>
  )
}

