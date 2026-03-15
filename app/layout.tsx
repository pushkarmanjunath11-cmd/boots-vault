import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: 'Boots Vault — Premium Football Boots',
  description: 'The finest football boots. Nike, Adidas, Puma and more. Delivered across India.',
  metadataBase: new URL('https://bootsvault.vercel.app'),
  openGraph: {
    title: 'Boots Vault — Premium Football Boots',
    description: 'The finest football boots. Nike, Adidas, Puma and more.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  icons: { icon: 'public/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
