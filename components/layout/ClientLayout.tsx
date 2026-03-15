'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthProvider } from '@/lib/authContext'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return <AuthProvider>{children}</AuthProvider>
  return (
    <AuthProvider>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  )
}
