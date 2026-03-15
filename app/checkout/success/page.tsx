'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useEffect } from 'react'

export default function SuccessPage() {
  const { clearCart } = useCartStore()
  useEffect(() => { clearCart() }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 0 60px rgba(34,197,94,0.6)', animation: 'glowPulse 2s ease-in-out infinite' }}>
          <Check size={36} color="#050505" strokeWidth={3} />
        </div>
        <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 16, fontWeight: 700 }}>Payment Confirmed</p>
        <h1 className="font-display" style={{ fontSize: 80, color: 'var(--white)', lineHeight: 0.9, marginBottom: 24 }}>ORDER<br />PLACED!</h1>
        <p style={{ color: 'rgba(245,245,240,0.4)', lineHeight: 1.8, marginBottom: 40, fontSize: 14 }}>
          Your boots are locked in. We'll ship within 24–48 hours and send tracking details to your email.
        </p>
        <Link href="/shop" style={{ textDecoration: 'none' }}>
          <div className="btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>
            Keep Shopping
          </div>
        </Link>
      </div>
    </div>
  )
}
