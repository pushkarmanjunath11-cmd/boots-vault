'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { ArrowRight, Star, Shield, Truck, RefreshCcw, BadgeCheck, Instagram, ChevronRight, Zap, Play } from 'lucide-react'
import { products } from '@/lib/data'

const allProducts = products.slice(0, 6)
const brands = ['NIKE', 'ADIDAS', 'PUMA', 'MIZUNO']

const trust = [
  { icon: BadgeCheck, title: '100% Authentic', desc: 'Sourced directly from authorised distributors. Zero fakes, zero exceptions.', color: '#22c55e' },
  { icon: Truck,      title: 'Free Shipping',  desc: 'Free pan India delivery on every order, every time. No minimums.', color: '#60a5fa' },
  { icon: RefreshCcw, title: '7-Day Returns',  desc: "Wrong size? No problem. Easy returns, no questions asked.", color: '#d4af37' },
  { icon: Shield,     title: 'Secure Pay',     desc: 'Stripe-powered 256-bit SSL. Your card never touches our servers.', color: '#c084fc' },
]

const reviews = [
  { name: 'Arjun S.', city: 'Pune',      rating: 5, text: 'Absolutely insane quality. Arrived in 3 days, 100% authentic. Whole team is now ordering from here.', boot: 'Nike Mercurial Vapor 16' },
  { name: 'Rahul M.', city: 'Mumbai',    rating: 5, text: 'Size guide was spot on. The Predator Elite fits perfectly. Premium packaging too. Will 100% order again.', boot: 'Adidas Predator Elite' },
  { name: 'Karan T.', city: 'Bangalore', rating: 5, text: "Best football boot store in India. Fair prices, fast shipping, swapped my size same day. Unbeatable.", boot: 'Puma Future 7' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!cursor || !ring) return
    let rx = 0, ry = 0
    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
      rx += (e.clientX - rx) * 0.12
      ry += (e.clientY - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
    }
    let raf: number
    const animate = () => { raf = requestAnimationFrame(animate) }
    animate()
    window.addEventListener('mousemove', move)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
}

function useCountUp() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-count]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = parseInt(el.dataset.count || '0')
        const suffix = el.dataset.suffix || ''
        let start = 0
        const step = target / 60
        const t = setInterval(() => {
          start = Math.min(start + step, target)
          el.textContent = Math.floor(start) + suffix
          if (start >= target) clearInterval(t)
        }, 16)
        obs.unobserve(el)
      })
    }, { threshold: 0.5 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// 3D tilt on product cards
function useTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    const handlers: Array<{ el: HTMLElement, move: (e: Event) => void, leave: (e: Event) => void }> = []
    
    cards.forEach(card => {
      const el = card as HTMLElement
      
      const move = (e: Event) => {
        const mouseEvent = e as MouseEvent
        const r = el.getBoundingClientRect()
        const x = (mouseEvent.clientX - r.left) / r.width - 0.5
        const y = (mouseEvent.clientY - r.top) / r.height - 0.5
        el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`
        const glare = el.querySelector('.glare') as HTMLElement
        if (glare) glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
      }

      const leave = (e: Event) => {
        el.style.transform = ''
        const g = el.querySelector('.glare') as HTMLElement
        if (g) g.style.background = ''
      }

      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      handlers.push({ el, move, leave })
    })

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  useReveal(); useCursor(); useCountUp(); useTilt()

  useEffect(() => {
    setTimeout(() => setLoaded(true), 60)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>

      <div style={{ background: 'var(--bg)' }}>

        {/* ══════════════ HERO ══════════════ */}
        <section ref={heroRef} style={{ position: 'relative', height: '100vh', minHeight: 700, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>

          {/* Hero image placeholder — replace /hero.jpg with your actual image */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* Placeholder gradient bg — looks great without image too */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0a12 0%, #0f1a0f 40%, #080808 100%)', animation: 'heroScale 8s ease-out forwards' }} />
            {/* If you have an image, add it here: */}
            {/* <img src="/hero.jpg" style={{ width:'100%', height:'100%', objectFit:'cover', transform:`translateY(${scrollY*0.3}px)` }} /> */}

            {/* Dramatic light rays */}
            <div style={{ position: 'absolute', top: '-20%', left: '55%', width: 600, height: '160%', background: 'linear-gradient(170deg, rgba(34,197,94,0.06) 0%, transparent 50%)', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '-20%', left: '65%', width: 300, height: '160%', background: 'linear-gradient(170deg, rgba(34,197,94,0.04) 0%, transparent 40%)', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '-20%', right: '5%', width: 200, height: '160%', background: 'linear-gradient(170deg, rgba(212,175,55,0.03) 0%, transparent 40%)', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />

            {/* Grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(242,242,237,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,237,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            {/* Vignette */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, transparent 20%, rgba(8,8,8,0.7) 100%)' }} />
          </div>

          {/* Bottom gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)', zIndex: 2 }} />

          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 5%, var(--green) 30%, rgba(212,175,55,0.5) 65%, transparent 95%)', zIndex: 10, animation: 'borderPulse 3s ease-in-out infinite' }} />

          {/* Big ghost text */}
          <div className="font-display" style={{ position: 'absolute', right: '-3%', top: '50%', transform: `translateY(-54%) translateY(${scrollY * 0.12}px)`, fontSize: 'clamp(200px,30vw,480px)', lineHeight: 0.85, color: 'transparent', WebkitTextStroke: '1px rgba(34,197,94,0.04)', pointerEvents: 'none', zIndex: 1, userSelect: 'none', letterSpacing: '-0.03em' }}>BV</div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 48px 80px' }}>

            {/* Category tag */}
            <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s 0.2s', marginBottom: 20 }}>
              <span className="section-tag">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', animation: 'glowPulse 2s infinite' }} />
                Premium Football Boots · Pan India Delivery
              </span>
            </div>

            {/* Main title — letter by letter */}
            <div style={{ overflow: 'hidden', marginBottom: 4 }}>
              <h1 className="font-display" style={{ fontSize: 'clamp(64px,11vw,160px)', lineHeight: 0.85, color: 'var(--white)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(80px)', transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s' }}>
                DOMINATE
              </h1>
            </div>
            <div style={{ overflow: 'hidden', marginBottom: 4 }}>
              <h1 className="font-display text-gradient" style={{ fontSize: 'clamp(64px,11vw,160px)', lineHeight: 0.85, opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(80px)', transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.45s' }}>
                EVERY
              </h1>
            </div>
            <div style={{ overflow: 'hidden', marginBottom: 32 }}>
              <h1 className="font-display" style={{ fontSize: 'clamp(64px,11vw,160px)', lineHeight: 0.85, color: 'var(--white)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(80px)', transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.6s' }}>
                GAME
              </h1>
            </div>

            {/* Sub + CTA row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 48, flexWrap: 'wrap', opacity: loaded ? 1 : 0, transition: 'opacity 0.9s 0.85s' }}>
              <div style={{ maxWidth: 380 }}>
                <p style={{ fontSize: 15, color: 'rgba(242,242,237,0.45)', lineHeight: 1.8, marginBottom: 28, fontWeight: 300 }}>
                  Premium football boots from Nike, Adidas, Puma and more — authenticated and delivered anywhere in India.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/shop" style={{ textDecoration: 'none' }}>
                    <div className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', fontSize: 12, cursor: 'pointer' }}>
                      <Zap size={13} fill="currentColor" /> Shop Now
                    </div>
                  </Link>
                  <Link href="/shop?category=football-boots" style={{ textDecoration: 'none' }}>
                    <div className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 24px', fontSize: 12, cursor: 'pointer' }}>
                      New Arrivals <ChevronRight size={14} />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: 32 }}>
                {[['500+', 'Boots Sold'], ['100%', 'Authentic'], ['4.9★', 'Rating']].map(([n, l]) => (
                  <div key={l} style={{ borderLeft: '2px solid rgba(34,197,94,0.3)', paddingLeft: 16 }}>
                    <p className="font-display" style={{ fontSize: 32, color: 'var(--white)', lineHeight: 1 }}>{n}</p>
                    <p style={{ fontSize: 10, color: 'rgba(242,242,237,0.3)', marginTop: 4, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', right: 48, bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10, opacity: loaded ? 0.4 : 0, transition: 'opacity 1s 1.2s' }}>
            <span style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
            <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, var(--green), transparent)' }} />
          </div>
        </section>

        {/* ══════════════ BRAND MARQUEE ══════════════ */}
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center' }}>
            <div className="animate-marquee" style={{ display: 'flex', width: 'max-content', alignItems: 'center' }}>
              {[...brands, ...brands].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="font-display" style={{ fontSize: 16, color: 'rgba(242,242,237,0.1)', letterSpacing: '0.3em', padding: '0 28px' }}>{b}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(34,197,94,0.25)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ STATS ══════════════ */}
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { n: 500, suffix: '+', label: 'Boots Sold' },
              { n: 100, suffix: '%', label: 'Authentic' },
              { n: 48,  suffix: 'h', label: 'Dispatch Time' },
              { n: 7,   suffix: ' day', label: 'Easy Returns' },
            ].map(({ n, suffix, label }, i) => (
              <div key={label} className="reveal" style={{ padding: '40px 16px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
                <p className="font-display" style={{ fontSize: 56, lineHeight: 1, marginBottom: 8, color: 'var(--white)' }}>
                  <span data-count={n} data-suffix={suffix}>0{suffix}</span>
                </p>
                <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 48px' }}>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="section-tag">The Collection</span>
              <h2 className="font-display" style={{ fontSize: 'clamp(48px,6vw,80px)', color: 'var(--white)', lineHeight: 0.9 }}>
                FEATURED<br /><span className="text-gradient">BOOTS</span>
              </h2>
            </div>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <div className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: 11, cursor: 'pointer' }}>
                View All <ArrowRight size={13} />
              </div>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
            {allProducts.map((p, idx) => (
              <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="product-card tilt-card reveal" style={{ transitionDelay: `${idx * 0.06}s` }}>

                  {/* Glare effect */}
                  <div className="glare" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, transition: 'background 0.1s' }} />

                  {/* Image */}
                  <div style={{ height: 260, background: `linear-gradient(135deg, var(--bg4) 0%, var(--bg3) 100%)`, position: 'relative', overflow: 'hidden' }}>
                    {/* Rich placeholder */}
                    <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, #161616 0%, #1e1e1e 50%, #141414 100%)` }} />
                    <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
                    <div className="font-display" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:96, color:'rgba(242,242,237,0.04)', userSelect:'none', pointerEvents:'none', lineHeight:1, letterSpacing:'0.02em' }}>{p.brand.toUpperCase()}</div>
                    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:64, height:64, border:'1px solid rgba(34,197,94,0.08)', borderRadius:'50%' }} />
                    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:40, height:40, border:'1px solid rgba(34,197,94,0.05)', borderRadius:'50%' }} />
                    <div className="img-dark" />

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6, zIndex: 6 }}>
                      {p.isNew && <span style={{ background: 'var(--green)', color: '#050505', fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', padding: '3px 8px' }}>NEW</span>}
                      {p.originalPrice && <span style={{ background: 'rgba(212,175,55,0.9)', color: '#050505', fontSize: 8, fontWeight: 800, padding: '3px 8px' }}>-{Math.round((1-p.price/p.originalPrice)*100)}%</span>}
                    </div>

                    {/* Brand + category */}
                    <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 6 }}>
                      <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(242,242,237,0.55)', fontWeight: 700, background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(8px)', padding: '3px 8px', border: '1px solid rgba(242,242,237,0.06)' }}>{p.brand}</span>
                      <span style={{ fontSize: 8, color: 'rgba(34,197,94,0.6)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{p.category === 'football-boots' ? 'FG/AG' : p.category.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '20px 22px 24px' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(242,242,237,0.3)', marginBottom: 12, lineHeight: 1.6 }}>{p.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < Math.floor(p.rating) ? '#d4af37' : 'none'} color={i < Math.floor(p.rating) ? '#d4af37' : 'rgba(242,242,237,0.1)'} />)}
                      <span style={{ fontSize: 10, color: '#d4af37', fontWeight: 600 }}>{p.rating}</span>
                      <span style={{ fontSize: 10, color: 'rgba(242,242,237,0.2)' }}>({p.reviewCount})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span className="font-display" style={{ fontSize: 28, color: 'var(--white)', lineHeight: 1 }}>₹{p.price.toLocaleString()}</span>
                        {p.originalPrice && <span style={{ fontSize: 11, color: 'rgba(242,242,237,0.22)', textDecoration: 'line-through', marginLeft: 7 }}>₹{p.originalPrice.toLocaleString()}</span>}
                      </div>
                      <div style={{ width: 38, height: 38, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(34,197,94,0.35)', transition: 'box-shadow 0.3s' }}>
                        <ArrowRight size={15} color="#050505" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════ FULL WIDTH BANNER ══════════════ */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 400, display: 'flex', alignItems: 'center', background: 'linear-gradient(110deg, #0a1a0a 0%, #080808 50%, #0f0a00 100%)' }}>
          {/* Animated light sweep */}
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '120%', height: '200%', background: 'linear-gradient(105deg, transparent 40%, rgba(34,197,94,0.04) 50%, transparent 60%)', animation: 'shimmer 4s linear infinite', backgroundSize: '200% 100%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,197,94,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--green), transparent)', animation: 'borderPulse 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', width: '100%' }}>
            <div className="reveal left">
              <span className="section-tag" style={{ marginBottom: 20 }}>Why Boots Vault</span>
              <h2 className="font-display" style={{ fontSize: 'clamp(40px,5vw,72px)', color: 'var(--white)', lineHeight: 0.9, marginBottom: 24 }}>
                THE VAULT<br /><span className="text-gold">PROMISE</span>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(242,242,237,0.4)', lineHeight: 1.8, marginBottom: 32, fontWeight: 300 }}>
                We exist for players who take their game seriously. Every boot we sell is authenticated, every delivery is tracked, every return is handled fast.
              </p>
              <Link href="/shop" style={{ textDecoration: 'none' }}>
                <div className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontSize: 12, cursor: 'pointer' }}>
                  Shop Now <ArrowRight size={13} />
                </div>
              </Link>
            </div>
            <div className="reveal right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {trust.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="card" style={{ padding: '24px 20px' }}>
                  <div style={{ width: 44, height: 44, background: `${color}10`, border: `1px solid ${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={18} color={color} strokeWidth={1.5} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--white)', marginBottom: 6 }}>{title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.35)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ REVIEWS ══════════════ */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 48px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-tag" style={{ margin: '0 auto 16px', display: 'table' }}>Customer Reviews</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(40px,5vw,72px)', color: 'var(--white)', lineHeight: 0.9 }}>
              REAL PEOPLE.<br /><span className="text-gradient">REAL BOOTS.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 14 }}>
            {reviews.map(({ name, city, rating, text, boot }, i) => (
              <div key={name} className="card reveal" style={{ padding: '28px 24px', transitionDelay: `${i*0.08}s` }}>
                <div className="font-display" style={{ fontSize: 64, lineHeight: 0.7, color: 'rgba(34,197,94,0.07)', marginBottom: 12 }}>"</div>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[...Array(rating)].map((_, i) => <Star key={i} size={12} fill="#d4af37" color="#d4af37" />)}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(242,242,237,0.55)', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic', fontWeight: 300 }}>"{text}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>{name}</p>
                    <p style={{ fontSize: 10, color: 'rgba(242,242,237,0.25)', marginTop: 2 }}>{city}</p>
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right', maxWidth: 110 }}>{boot}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ INSTAGRAM ══════════════ */}
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '52px 48px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div className="reveal">
              <span className="section-tag">Follow Us</span>
              <h3 className="font-display" style={{ fontSize: 40, color: 'var(--white)' }}>@BOOTSVAULT</h3>
              <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.3)', marginTop: 6 }}>Latest drops and customer photos</p>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 30px', background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: '0 8px 32px rgba(253,29,29,0.2)', transition: 'all 0.3s' }}>
                <Instagram size={15} /> Follow on Instagram
              </div>
            </a>
          </div>
        </div>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>
          <div className="reveal" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg2)', border: '1px solid rgba(34,197,94,0.14)', padding: '88px 56px', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--green), rgba(212,175,55,0.4), transparent)', animation: 'borderPulse 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: '1px solid rgba(34,197,94,0.25)', borderLeft: '1px solid rgba(34,197,94,0.25)' }} />
            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: '1px solid rgba(34,197,94,0.25)', borderRight: '1px solid rgba(34,197,94,0.25)' }} />
            <span className="section-tag" style={{ margin: '0 auto 20px', display: 'table' }}>Limited Stock</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(52px,8vw,104px)', color: 'var(--white)', lineHeight: 0.88, marginBottom: 20, position: 'relative' }}>
              DON'T MISS<br /><span className="text-gradient">YOUR SIZE</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(242,242,237,0.36)', maxWidth: 360, margin: '0 auto 36px', lineHeight: 1.8, fontWeight: 300 }}>
              Elite boots sell out fast. Secure your pair before it's gone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" style={{ textDecoration: 'none' }}>
                <div className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 44px', fontSize: 13, cursor: 'pointer' }}>
                  <Zap size={14} fill="currentColor" /> Shop Now
                </div>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <div className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 28px', fontSize: 13, cursor: 'pointer' }}>
                  Create Account
                </div>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
