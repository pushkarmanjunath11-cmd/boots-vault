'use client'

import Link from 'next/link'
import { ShoppingBag, User, LogOut, ChevronDown, Search } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useAuth } from '@/lib/authContext'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const { itemCount, toggleCart } = useCartStore()
  const { user, loading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const count = itemCount()
  const prevCount = useRef(count)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (count > prevCount.current) { setCartBounce(true); setTimeout(() => setCartBounce(false), 600) }
    prevCount.current = count
  }, [count])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      height:60,
      background: scrolled ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.3)',
      backdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(242,242,237,0.08)' : 'transparent'}`,
      transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 20px',
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration:'none', flexShrink:0 }}>
        <span className="font-display" style={{ fontSize:22, color:'var(--white)', letterSpacing:'0.08em', transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color='var(--green)')}
          onMouseLeave={e => (e.currentTarget.style.color='var(--white)')}>
          BOOTS <span style={{ color:'var(--green)' }}>VAULT</span>
        </span>
      </Link>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>

        {/* Cart */}
        <button onClick={toggleCart} style={{ width:44, height:44, background:'transparent', border:'none', cursor:'pointer', position:'relative', color:'rgba(242,242,237,0.6)', display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.2s', transform: cartBounce ? 'scale(1.3)' : 'scale(1)', transitionProperty:'color,transform' }}
          onMouseEnter={e => (e.currentTarget.style.color='var(--white)')}
          onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.6)')}>
          <ShoppingBag size={20} />
          {count > 0 && (
            <span style={{ position:'absolute', top:6, right:6, width:16, height:16, background:'var(--green)', borderRadius:'50%', fontSize:9, fontWeight:800, color:'#050505', display:'flex', alignItems:'center', justifyContent:'center', animation: cartBounce ? 'glowPulse 0.6s ease' : 'none' }}>{count}</span>
          )}
        </button>

        {/* Auth */}
        {!loading && (
          <>
            {!user ? (
              <Link href="/login" style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 18px', border:'1px solid rgba(242,242,237,0.14)', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(242,242,237,0.6)', cursor:'pointer', transition:'all 0.25s', fontFamily:'Montserrat' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(34,197,94,0.5)'; (e.currentTarget as HTMLElement).style.color='var(--white)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(242,242,237,0.14)'; (e.currentTarget as HTMLElement).style.color='rgba(242,242,237,0.6)' }}>
                  <User size={13} /> Login
                </div>
              </Link>
            ) : (
              <div ref={dropRef} style={{ position:'relative' }}>
                <button onClick={() => setDropdown(d => !d)} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', background: dropdown ? 'rgba(34,197,94,0.1)' : 'rgba(242,242,237,0.04)', border:`1px solid ${dropdown ? 'rgba(34,197,94,0.3)' : 'rgba(242,242,237,0.08)'}`, cursor:'pointer', color:'var(--white)', transition:'all 0.2s', fontFamily:'Montserrat' }}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" style={{ width:24, height:24, borderRadius:'50%', objectFit:'cover' }} />
                  ) : (
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#050505' }}>
                      {firstName[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize:12, fontWeight:700, color:'rgba(242,242,237,0.8)' }}>{firstName}</span>
                  <ChevronDown size={12} color="rgba(242,242,237,0.4)" style={{ transform: dropdown ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
                </button>

                {dropdown && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:204, background:'#0f0f0f', border:'1px solid rgba(242,242,237,0.08)', boxShadow:'0 20px 60px rgba(0,0,0,0.6)', zIndex:200, animation:'fadeUp 0.2s ease' }}>
                    <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(242,242,237,0.06)' }}>
                      <p style={{ fontSize:13, fontWeight:700, color:'var(--white)', marginBottom:2 }}>{user.displayName || firstName}</p>
                      <p style={{ fontSize:10, color:'rgba(242,242,237,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>
                    </div>
                    <Link href="/account" onClick={() => setDropdown(false)} style={{ textDecoration:'none', display:'block' }}>
                      <div style={{ padding:'12px 16px', fontSize:12, fontWeight:600, color:'rgba(242,242,237,0.6)', display:'flex', alignItems:'center', gap:8, cursor:'pointer', transition:'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(34,197,94,0.06)'; (e.currentTarget as HTMLElement).style.color='var(--white)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='rgba(242,242,237,0.6)' }}>
                        <User size={13} /> My Orders
                      </div>
                    </Link>
                    <button onClick={() => { signOut(auth); setDropdown(false) }} style={{ width:'100%', padding:'12px 16px', fontSize:12, fontWeight:600, color:'rgba(248,113,113,0.6)', background:'none', border:'none', display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:'Montserrat', borderTop:'1px solid rgba(242,242,237,0.05)', transition:'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(248,113,113,0.06)'; (e.currentTarget as HTMLElement).style.color='#f87171' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='rgba(248,113,113,0.6)' }}>
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
