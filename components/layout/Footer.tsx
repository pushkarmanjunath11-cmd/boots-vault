'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(242,242,237,0.06)', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Main grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,48px) clamp(32px,4vw,48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'clamp(24px,4vw,56px)' }}>

          {/* Brand */}
          <div>
            <span className="font-display" style={{ fontSize: 22, color: 'var(--white)', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
              BOOTS <span style={{ color: 'var(--green)' }}>VAULT</span>
            </span>
            <p style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>
              Premium Boots Since 2025
            </p>
            <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.3)', lineHeight: 1.8, maxWidth: 220, marginBottom: 24 }}>
              Your trusted source for premium football boots, jerseys and gear. Delivered across India.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                { Icon: Instagram, href: 'https://instagram.com/bootsvault.in' },
                { Icon: Facebook,  href: '#' },
                { Icon: Twitter,   href: '#' },
                { Icon: Youtube,   href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'rgba(242,242,237,0.3)', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,242,237,0.3)')}>
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 20, fontWeight: 700 }}>Shop</p>
            {[
              { label: 'New Arrivals',      href: '/shop?filter=new' },
              { label: 'Boots',             href: '/shop?category=boots' },
              { label: 'Jerseys & Jackets', href: '/shop?category=jerseys-jackets' },
              { label: 'Balls',             href: '/shop?category=balls' },
              { label: 'Gloves',            href: '/shop?category=gloves' },
              { label: 'Essentials',        href: '/shop?category=essentials' },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                style={{ display: 'block', fontSize: 13, color: 'rgba(242,242,237,0.4)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,242,237,0.4)')}>
                {label}
              </Link>
            ))}
          </div>

          {/* Help */}
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 20, fontWeight: 700 }}>Help</p>
            {[
              { label: 'Contact Us',    href: '/contact' },
              { label: 'Size Guide',    href: '/size-guide' },
              { label: 'Shipping Info', href: '/shipping' },
              { label: 'Returns',       href: '/returns' },
              { label: 'My Orders',     href: '/account' },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                style={{ display: 'block', fontSize: 13, color: 'rgba(242,242,237,0.4)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,242,237,0.4)')}>
                {label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 20, fontWeight: 700 }}>Legal</p>
            {[
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Privacy Policy',   href: '/privacy-policy' },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                style={{ display: 'block', fontSize: 13, color: 'rgba(242,242,237,0.4)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,242,237,0.4)')}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>
        <div style={{ height: 1, background: 'rgba(242,242,237,0.06)' }} />
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px clamp(20px,4vw,48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.2)' }}>© 2025 Boots Vault. All Rights Reserved.</p>

        {/* Payment badges — Vestero style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: 'rgba(242,242,237,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 4 }}>We Accept</span>
          {['VISA', 'MASTERCARD', 'UPI', 'PAYTM'].map(method => (
            <span key={method} style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
              color: 'rgba(242,242,237,0.4)', border: '1px solid rgba(242,242,237,0.12)',
              padding: '4px 10px',
            }}>{method}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}