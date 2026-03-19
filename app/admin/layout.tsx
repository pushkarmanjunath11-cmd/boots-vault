'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PlusSquare, ShoppingCart, Package, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/authContext'

const ADMIN_EMAIL = 'pushkarmanjunath11@gmail.com'

const navItems = [
  { href: '/admin',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/add-product', label: 'Add Product', icon: PlusSquare },
  { href: '/admin/orders',      label: 'Orders',      icon: ShoppingCart },
  { href: '/admin/products',    label: 'Products',    icon: Package },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [authed, setAuthed] = useState<boolean | null>(null)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) { setAuthed(true); return }
    if (authLoading) return

    // Must be logged in AND be the admin email AND have bv_admin in localStorage
    const hasToken = localStorage.getItem('bv_admin')
    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

    if (hasToken && isAdmin) {
      setAuthed(true)
    } else {
      localStorage.removeItem('bv_admin')
      router.replace('/admin/login')
    }
  }, [isLoginPage, authLoading, user])

  if (isLoginPage) return <>{children}</>
  if (authed === null) return <div style={{ background: '#050505', minHeight: '100vh' }} />

  const logout = () => {
    localStorage.removeItem('bv_admin')
    router.replace('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080808', fontFamily: 'Montserrat, sans-serif' }}>
      <aside style={{ width: 230, background: '#0a0a0a', borderRight: '1px solid rgba(34,197,94,0.08)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(34,197,94,0.08)', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <p className="font-display" style={{ fontSize: 20, color: '#f5f5f0', letterSpacing: '0.08em' }}>BOOTS <span style={{ color: '#22c55e' }}>VAULT</span></p>
            <p style={{ fontSize: 9, color: 'rgba(34,197,94,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>← View Store</p>
          </div>
        </Link>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: active ? 'rgba(34,197,94,0.12)' : 'transparent', color: active ? '#22c55e' : 'rgba(245,245,240,0.35)', borderRadius: 6, fontSize: 13, fontWeight: 700, transition: 'all 0.2s', border: `1px solid ${active ? 'rgba(34,197,94,0.2)' : 'transparent'}` }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#f5f5f0'; (e.currentTarget as HTMLElement).style.background = 'rgba(245,245,240,0.04)' } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'rgba(245,245,240,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}>
                  <Icon size={16} strokeWidth={2} />{label}
                </div>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(34,197,94,0.08)' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: 'rgba(245,245,240,0.25)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: 6, fontFamily: 'Montserrat', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,240,0.25)')}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: 230, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(34,197,94,0.08)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(245,245,240,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            {navItems.find(n => n.href === pathname)?.label ?? 'Admin'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: 'rgba(245,245,240,0.2)', letterSpacing: '0.15em' }}>LIVE</span>
          </div>
        </header>
        <main style={{ flex: 1, padding: 32 }}>{children}</main>
      </div>
    </div>
  )
}