import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from '@/components/layout/ClientLayout'

export const metadata = {
  metadataBase: new URL("https://boots-vault.vercel.app"),

  title: {
    default: "Boots Vault - Buy Premium Football Boots in India",
    template: "%s | Boots Vault",
  },

  description:
    "Shop premium football boots from Nike, Adidas, Puma in India. Best prices, fast delivery, 100% authentic.",

  keywords: [
    "football boots India",
    "buy football shoes India",
    "Nike football boots",
    "Adidas football shoes",
    "Puma football boots",
    "cheap football boots India",
  ],

  verification: {
    google: "YOUR_CODE_HERE",
  },

  openGraph: {
    title: "Boots Vault",
    description: "Premium football boots in India",
    url: "https://boots-vault.vercel.app",
    siteName: "Boots Vault",
    type: "website",
  },
  
  icons: { icon: '/favicon.ico' },
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
