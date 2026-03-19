'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Star, Shield, Truck, RefreshCcw, BadgeCheck, Instagram, ChevronRight, Zap } from 'lucide-react'
import { subscribeProducts } from '@/lib/productService'
import { Product } from '@/types'

const brands = ['NIKE', 'ADIDAS', 'PUMA', 'NEW BALANCE', 'MIZUNO']

const trust = [
  { icon: BadgeCheck, title: 'Mastercopies', desc: 'Best quality mastercopies, identical to original elites.', color: '#22c55e' },
  { icon: Truck,      title: 'Free Shipping',  desc: 'Free pan India delivery on every order, every time. No minimums.', color: '#60a5fa' },
  { icon: RefreshCcw, title: '7-Day Returns',  desc: "Wrong size? No problem. Easy returns, no questions asked.", color: '#d4af37' },
  { icon: Shield,     title: 'Secure Pay',     desc: 'Stripe-powered 256-bit SSL. Your card never touches our servers.', color: '#c084fc' },
]

const reviews = [
  { name: 'Arjun S.', city: 'Pune',      rating: 5, text: 'Absolutely insane quality. Arrived in 3 days, 100% identical texture and quality to orignials. Whole team is now ordering from here.', boot: 'Nike Mercurial Vapor 16' },
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

function useTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    const handlers: Array<{ el: HTMLElement, move: (e: Event) => void, leave: (e: Event) => void }> = []
    cards.forEach(card => {
      const el = card as HTMLElement
      const move = (e: Event) => {
        const me = e as MouseEvent
        const r = el.getBoundingClientRect()
        const x = (me.clientX - r.left) / r.width - 0.5
        const y = (me.clientY - r.top) / r.height - 0.5
        el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`
        const glare = el.querySelector('.glare') as HTMLElement
        if (glare) glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
      }
      const leave = (_e: Event) => {
        el.style.transform = ''
        const g = el.querySelector('.glare') as HTMLElement
        if (g) g.style.background = ''
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      handlers.push({ el, move, leave })
    })
    return () => handlers.forEach(({ el, move, leave }) => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    })
  }, [])
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  useReveal(); useCountUp(); useTilt()

  useEffect(() => {
    setTimeout(() => setLoaded(true), 60)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    const unsub = subscribeProducts(data => {
      const valid = data.filter(p => p && p.name && p.price > 0)
      const featured = valid.filter(p => p.featured).slice(0, 6)
      setDisplayProducts(featured.length > 0 ? featured : valid.slice(0, 6))
    })
    return () => { window.removeEventListener('scroll', onScroll); unsub() }
  }, [])

  return (
    <div style={{ background: 'var(--bg)' }}>

     {/* ── HERO ── */}
<section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>

  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    {/* Hero image */}
    <img src="/hero.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain', opacity: 0.55, filter:'brightness(1) saturate(0.7)', transform:`translateY(${scrollY * 0.25}px)`, zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,18,0.85) 0%, rgba(15,26,15,0.6) 40%, rgba(8,8,8,0.3) 100%)' }} />
    <div style={{ position: 'absolute', top: '-20%', left: '55%', width: '60%', height: '160%', background: 'linear-gradient(170deg, rgba(34,197,94,0.06) 0%, transparent 50%)', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(242,242,237,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,237,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, transparent 20%, rgba(8,8,8,0.7) 100%)' }} />
  </div>

  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, var(--bg), transparent)', zIndex: 2 }} />
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 5%, var(--green) 30%, rgba(212,175,55,0.5) 65%, transparent 95%)', zIndex: 10, animation: 'borderPulse 3s ease-in-out infinite' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px) clamp(48px, 8vh, 80px)' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)', marginBottom: 20, opacity: loaded ? 1 : 0, transition: 'opacity 0.7s 0.2s' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
            <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 700 }}>Premium Football Boots · Pan India</span>
          </div>

          {/* Hero title — fixed font size for mobile */}
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(36px, 9vw, 148px)', lineHeight: 0.88, color: 'var(--white)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(60px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.3s', display: 'block' }}>
              DOMINATE
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <h1 className="font-display text-gradient" style={{ fontSize: 'clamp(36px, 9vw, 148px)', lineHeight: 0.88, opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(60px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.45s', display: 'block' }}>
              EVERY
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 24 }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(36px, 9vw, 148px)', lineHeight: 0.88, color: 'var(--white)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(60px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.6s', display: 'block' }}>
              GAME
            </h1>
          </div>

          <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'rgba(242,242,237,0.45)', lineHeight: 1.8, marginBottom: 28, maxWidth: 420, fontWeight: 300, opacity: loaded ? 1 : 0, transition: 'opacity 0.9s 0.65s' }}>
            Premium football boots from Nike, Adidas, Puma and more — authenticated and delivered anywhere in India.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', opacity: loaded ? 1 : 0, transition: 'opacity 0.9s 0.8s' }}>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <div className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,36px)', fontSize: 12, cursor: 'pointer' }}>
                <Zap size={13} fill="currentColor" /> Shop Now
              </div>
            </Link>
            <Link href="/shop?category=boots" style={{ textDecoration: 'none' }}>
              <div className="btn-ghost" style={{ display: 'flex', marginRight: '100px', alignItems: 'center', gap: 8, padding: 'clamp(12px,2vw,16px) clamp(16px,2vw,24px)', fontSize: 12, cursor: 'pointer' }}>
                New Arrivals <ChevronRight size={13} />
              </div>
            </Link>
          </div>

          {/* Mini stats — horizontal scroll on mobile */}
          <div style={{ display: 'flex', gap: 'clamp(16px,4vw,32px)', marginTop: 36, opacity: loaded ? 1 : 0, transition: 'opacity 0.9s 1s', overflowX: 'auto', paddingBottom: 4 }}>
            {[['500+', 'Boots Sold'], ['100%', 'Identical texture and quality to originals'], ['4.9★', 'Rating']].map(([n, l]) => (
              <div key={l} style={{ borderLeft: '2px solid rgba(34,197,94,0.3)', paddingLeft: 14, flexShrink: 0 }}>
                <p className="font-display" style={{ fontSize: 'clamp(22px,4vw,32px)', color: 'var(--white)', lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: 9, color: 'rgba(242,242,237,0.3)', marginTop: 4, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', right: 'clamp(16px,4vw,48px)', bottom: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 10, opacity: loaded ? 0.4 : 0, transition: 'opacity 1s 1.2s' }}>
          <span style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, var(--green), transparent)' }} />
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
          <div className="animate-marquee" style={{ display: 'flex', width: 'max-content', alignItems: 'center' }}>
            {[...brands, ...brands].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <span className="font-display" style={{ fontSize: 14, color: 'rgba(242,242,237,0.1)', letterSpacing: '0.25em', padding: '0 20px' }}>{b}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(34,197,94,0.25)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[
            { n: 500, suffix: '+', label: 'Boots Sold' },
            { n: 100, suffix: '%', label: 'Identical texture and quality' },
            { n: 48,  suffix: 'h', label: 'Dispatch Time' },
            { n: 7,   suffix: ' day', label: 'Easy Returns' },
          ].map(({ n, suffix, label }, i) => (
            <div key={label} className="reveal" style={{ padding: 'clamp(20px,4vw,40px) 16px', borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
              <p className="font-display" style={{ fontSize: 'clamp(36px,6vw,56px)', lineHeight: 1, marginBottom: 6, color: 'var(--white)' }}>
                <span data-count={n} data-suffix={suffix}>0{suffix}</span>
              </p>
              <p style={{ fontSize: 10, color: 'rgba(242,242,237,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,96px) clamp(20px,4vw,48px)' }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="section-tag">The Collection</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px,6vw,72px)', color: 'var(--white)', lineHeight: 0.9 }}>FEATURED<br /><span className="text-gradient">BOOTS</span></h2>
          </div>
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <div className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 11, cursor: 'pointer' }}>
              View All <ArrowRight size={13} />
            </div>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, calc(50% - 8px)), 1fr))', gap: 'clamp(8px,2vw,16px)' }}>
          {displayProducts.map((p, idx) => (
            <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
              <div className="product-card tilt-card reveal" style={{ transitionDelay: `${idx * 0.06}s` }}>
                <div className="glare" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />
                <div style={{ height: 'clamp(160px,25vw,260px)', background: 'linear-gradient(135deg, var(--bg4) 0%, var(--bg3) 100%)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  <div className="font-display" style={{ position: 'absolute', bottom: -10, right: -10, fontSize: 100, color: 'rgba(242,242,237,0.025)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{p.brand?.[0] || 'B'}</div>
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  )}
                  <div className="img-dark" />
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 5, zIndex: 6 }}>
                    {p.isNew && <span style={{ background: 'var(--green)', color: '#050505', fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', padding: '3px 7px' }}>NEW</span>}
                    {p.originalPrice && <span style={{ background: 'rgba(212,175,55,0.9)', color: '#050505', fontSize: 8, fontWeight: 800, padding: '3px 7px' }}>-{Math.round((1 - p.price / p.originalPrice) * 100)}%</span>}
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 6 }}>
                    <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,242,237,0.55)', fontWeight: 700, background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(8px)', padding: '3px 8px', border: '1px solid rgba(242,242,237,0.06)' }}>{p.brand}</span>
                  </div>
                </div>
                <div style={{ padding: 'clamp(12px,2vw,20px)' }}>
                  <p style={{ fontSize: 'clamp(12px,1.8vw,15px)', fontWeight: 700, color: 'var(--white)', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.3)', marginBottom: 10, lineHeight: 1.5 }}>{p.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={9} fill={i < Math.floor(p.rating) ? '#d4af37' : 'none'} color={i < Math.floor(p.rating) ? '#d4af37' : 'rgba(242,242,237,0.1)'} />)}
                    <span style={{ fontSize: 9, color: '#d4af37', fontWeight: 600 }}>{p.rating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="font-display" style={{ fontSize: 'clamp(20px,3vw,26px)', color: 'var(--white)', lineHeight: 1 }}>₹{p.price.toLocaleString()}</span>
                      {p.originalPrice && <span style={{ fontSize: 10, color: 'rgba(242,242,237,0.22)', textDecoration: 'line-through', marginLeft: 6 }}>₹{p.originalPrice.toLocaleString()}</span>}
                    </div>
                    <div style={{ width: 32, height: 32, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={13} color="#050505" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST BANNER ── */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(110deg, #0a1a0a 0%, #080808 50%, #0f0a00 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--green), transparent)', animation: 'borderPulse 3s ease-in-out infinite' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: 40 }}>

          <div className="reveal">
            <span className="section-tag">Why choose us</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px,5vw,64px)', color: 'var(--white)', lineHeight: 0.9, marginBottom: 16 }}>THE VAULT<br /><span className="text-gold">PROMISE</span></h2>
            <p style={{ fontSize: 14, color: 'rgba(242,242,237,0.4)', lineHeight: 1.8, maxWidth: 480, marginBottom: 24, fontWeight: 300 }}>
              Every boot we sell is authenticated, every delivery is tracked, every return is handled fast.
            </p>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <div className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: 12, cursor: 'pointer' }}>
                Shop Now <ArrowRight size={13} />
              </div>
            </Link>
          </div>

          {/* Trust cards — 2x2 on mobile, 2x2 on all */}
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {trust.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ padding: 'clamp(16px,2vw,24px)' }}>
                <div style={{ width: 40, height: 40, background: `${color}10`, border: `1px solid ${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={16} color={color} strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 'clamp(11px,1.5vw,13px)', fontWeight: 800, color: 'var(--white)', marginBottom: 6 }}>{title}</p>
                <p style={{ fontSize: 'clamp(10px,1.3vw,12px)', color: 'rgba(242,242,237,0.35)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,6vw,96px) clamp(20px,4vw,48px)' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="section-tag" style={{ margin: '0 auto 16px', display: 'table' }}>Customer Reviews</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px,5vw,64px)', color: 'var(--white)', lineHeight: 0.9 }}>
            REAL PEOPLE.<br /><span className="text-gradient">REAL BOOTS.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 14 }}>
          {reviews.map(({ name, city, rating, text, boot }, i) => (
            <div key={name} className="card reveal" style={{ padding: 'clamp(20px,3vw,28px)', transitionDelay: `${i * 0.08}s` }}>
              <div className="font-display" style={{ fontSize: 56, lineHeight: 0.7, color: 'rgba(34,197,94,0.07)', marginBottom: 10 }}>"</div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                {[...Array(rating)].map((_, i) => <Star key={i} size={11} fill="#d4af37" color="#d4af37" />)}
              </div>
              <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.55)', lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic', fontWeight: 300 }}>"{text}"</p>
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

      {/* ── INSTAGRAM ── */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: 'clamp(32px,5vw,52px) clamp(20px,4vw,48px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div className="reveal">
            <span className="section-tag">Follow us</span>
            <h3 className="font-display" style={{ fontSize: 'clamp(28px,4vw,40px)', color: 'var(--white)' }}>@BOOTSVAULT</h3>
            <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.3)', marginTop: 6 }}>Latest drops on Instagram</p>
          </div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px', background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <Instagram size={15} /> Follow
            </div>
          </a>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,5vw,80px) clamp(20px,4vw,48px)' }}>
        <div className="reveal" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg2)', border: '1px solid rgba(34,197,94,0.12)', padding: 'clamp(40px,6vw,80px) clamp(24px,4vw,56px)', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: 200, background: 'radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--green), rgba(212,175,55,0.4), transparent)', animation: 'borderPulse 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, width: 32, height: 32, borderTop: '1px solid rgba(34,197,94,0.25)', borderLeft: '1px solid rgba(34,197,94,0.25)' }} />
          <div style={{ position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderBottom: '1px solid rgba(34,197,94,0.25)', borderRight: '1px solid rgba(34,197,94,0.25)' }} />
          <span className="section-tag" style={{ margin: '0 auto 16px', display: 'table' }}>Limited Stock</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px,8vw,96px)', color: 'var(--white)', lineHeight: 0.88, marginBottom: 16, position: 'relative' }}>
            DON'T MISS<br /><span className="text-gradient">YOUR SIZE</span>
          </h2>
          <p style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: 'rgba(242,242,237,0.36)', marginBottom: 28, maxWidth: 320, margin: '0 auto 28px', lineHeight: 1.8, fontWeight: 300, position: 'relative' }}>
            Elite boots sell out fast. Secure your pair today.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              <div className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 'clamp(12px,2vw,16px) clamp(24px,3vw,40px)', fontSize: 12, cursor: 'pointer' }}>
                <Zap size={13} fill="currentColor" /> Shop Now
              </div>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <div className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,28px)', fontSize: 12, cursor: 'pointer' }}>
                Create Account
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}