'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowLeft, ArrowRight, ShoppingBag, Check, Zap, Shield, Truck, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { subscribeProducts } from '@/lib/productService'
import { products as staticProducts } from '@/lib/data'
import { useCartStore } from '@/lib/store'
import { Product } from '@/types'

const sleeveLabels: Record<string, string> = {
  'five-sleeve':  'Five Sleeves',
  'normal-fit':   'Normal Fit',
  'full-sleeves': 'Full Sleeves',
}

const jerseyCategoryLabels: Record<string, string> = {
  'national-teams': 'National',
  'club-teams':     'Club',
  'vintage':        'Vintage',
}

export default function ProductPage() {
  const { id } = useParams()
  const { addItem, openCart } = useCartStore()
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [selectedSize, setSelectedSize] = useState('')
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const unsub = subscribeProducts(data => { if (data.length > 0) setProducts(data) })
    setTimeout(() => setLoaded(true), 80)
    return () => unsub()
  }, [])

  const product = products.find(p => p.id === id) as any

  if (!product) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
      <div style={{ textAlign: 'center' }}>
        <p className="font-display" style={{ fontSize: 48, color: 'rgba(242,242,237,0.06)', marginBottom: 16 }}>NOT FOUND</p>
        <Link href="/shop" style={{ color: 'var(--green)', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>← Back to Shop</Link>
      </div>
    </div>
  )

  const isJersey = product.category === 'jerseys-jackets' && product.subCategory === 'jerseys'
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : []
  const sizes = Array.isArray(product.sizes) ? [...product.sizes] : []
  // For jerseys use alphabetical order (XS S M L XL), for boots use numeric
  const sortedSizes = isJersey
    ? (['XS','S','M','L','XL'].filter(s => sizes.includes(s)))
    : [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b))
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return }
    addItem(product, selectedSize)
    setAdded(true); setTimeout(() => setAdded(false), 2500)
    openCart()
  }

  const related = products.filter((p: Product) => p && p.id !== product.id && p.category === product.category).slice(0, 4)

  const sleeveLabel = sleeveLabels[product.sleeveType as string] || product.sleeveType || ''
  const jCatLabel = jerseyCategoryLabels[product.jerseyCategory as string] || product.jerseyCategory || ''

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 60, fontFamily: 'Montserrat, sans-serif' }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px clamp(20px,4vw,48px) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(242,242,237,0.3)', fontWeight: 600 }}>
          <Link href="/shop" style={{ color: 'rgba(242,242,237,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,242,237,0.35)')}>
            <ArrowLeft size={12} /> Shop
          </Link>
          <span style={{ opacity: 0.25 }}>/</span>
          <span style={{ color: 'rgba(242,242,237,0.55)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px clamp(20px,4vw,48px) 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'start',
        }}>

          {/* LEFT: Gallery */}
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
            position: 'sticky',
            top: 84,
          }}>
            <div style={{ display: 'flex', gap: 10 }}>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  {images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      style={{
                        width: 72, height: 72,
                        border: `2px solid ${i === imgIdx ? 'var(--green)' : 'rgba(242,242,237,0.06)'}`,
                        background: 'var(--bg3)', cursor: 'pointer', overflow: 'hidden',
                        padding: 0, flexShrink: 0, transition: 'border-color 0.2s', position: 'relative',
                      }}>
                      {img ? (
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: i === imgIdx ? 1 : 0.45, transition: 'opacity 0.2s' }}
                          onError={e => (e.currentTarget.style.display = 'none')} />
                      ) : (
                        <div className="font-display" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'rgba(242,242,237,0.06)' }}>{product.brand?.[0] || 'B'}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div style={{
                flex: 1, position: 'relative', background: 'var(--bg3)',
                aspectRatio: '1 / 1', overflow: 'hidden', border: '1px solid rgba(242,242,237,0.06)',
              }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.025) 1px, transparent 1px)', backgroundSize: '24px 24px', zIndex: 1 }} />
                <div className="font-display" style={{ position: 'absolute', bottom: -12, right: -8, fontSize: 160, color: 'rgba(242,242,237,0.025)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 1 }}>{product.brand?.[0] || 'B'}</div>

                {images[imgIdx] ? (
                  <img key={imgIdx} src={images[imgIdx]} alt={product.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2, animation: 'fadeIn 0.3s ease' }}
                    onError={e => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <div className="font-display" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, color: 'rgba(242,242,237,0.04)', zIndex: 2 }}>{product.brand?.[0] || 'B'}</div>
                )}

                {/* Badges */}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 5 }}>
                  {discount > 0 && <span style={{ background: 'var(--gold)', color: '#050505', fontSize: 10, fontWeight: 800, padding: '4px 10px' }}>-{discount}%</span>}
                  {product.isNew && <span style={{ background: 'var(--green)', color: '#050505', fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', padding: '3px 9px' }}>NEW</span>}
                </div>

                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                      style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'rgba(8,8,8,0.7)', border: '1px solid rgba(242,242,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--white)', zIndex: 6, transition: 'border-color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--green)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.1)')}>
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, background: 'rgba(8,8,8,0.7)', border: '1px solid rgba(242,242,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--white)', zIndex: 6, transition: 'border-color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--green)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.1)')}>
                      <ChevronRight size={14} />
                    </button>
                    <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(8,8,8,0.65)', padding: '3px 9px', fontSize: 9, color: 'rgba(242,242,237,0.4)', fontFamily: 'Space Mono', zIndex: 6 }}>{imgIdx + 1}/{images.length}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Info */}
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s',
            display: 'flex', flexDirection: 'column', gap: 0,
          }}>

            {/* ── JERSEY-SPECIFIC TOP ROW ── */}
            {isJersey ? (
              <>
                {/* Category tag + Sleeve pill on same row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {jCatLabel && (
                      <span style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(242,242,237,0.4)', fontWeight: 700 }}>
                        {jCatLabel}
                      </span>
                    )}
                    {!product.inStock && (
                      <span style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', padding: '3px 8px', border: '1px solid rgba(248,113,113,0.25)' }}>SOLD OUT</span>
                    )}
                  </div>
                  {sleeveLabel && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: 'rgba(242,242,237,0.6)', border: '1px solid rgba(242,242,237,0.15)',
                      padding: '5px 12px',
                    }}>
                      {sleeveLabel}
                    </span>
                  )}
                </div>

                {/* Jersey name (player/kit name) */}
                <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: 'var(--white)', lineHeight: 1.1, marginBottom: 12, letterSpacing: '-0.01em' }}>{product.name}</h1>

                {/* Club name + year on same line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  {product.brand && (
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>{product.brand}</span>
                  )}
                  {product.year && (
                    <span style={{ fontSize: 14, color: 'rgba(242,242,237,0.35)', fontWeight: 500 }}>{product.year}</span>
                  )}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'} color={i < Math.floor(product.rating) ? '#d4af37' : 'rgba(242,242,237,0.12)'} />)}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(242,242,237,0.3)' }}>{product.rating} · {product.reviewCount} reviews</span>
                </div>

                <div style={{ height: 1, background: 'rgba(242,242,237,0.06)', marginBottom: 20 }} />

                {/* Price + sizes on same row (Vestero style) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                  <div>
                    <span className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 44px)', color: 'var(--white)', lineHeight: 1 }}>₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span style={{ fontSize: 14, color: 'rgba(242,242,237,0.2)', textDecoration: 'line-through', marginLeft: 10 }}>₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Size pills — Vestero style inline */}
                  {sortedSizes.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {sortedSizes.map(s => {
                        const available = sizes.includes(s)
                        const selected = selectedSize === s
                        return (
                          <button key={s} onClick={() => available && setSelectedSize(s)}
                            style={{
                              width: 44, height: 38, fontSize: 11, fontWeight: 700,
                              background: selected ? 'var(--green)' : 'transparent',
                              color: selected ? '#050505' : available ? 'rgba(242,242,237,0.6)' : 'rgba(242,242,237,0.15)',
                              border: `1.5px solid ${selected ? 'var(--green)' : sizeError && !selectedSize ? 'rgba(248,113,113,0.4)' : available ? 'rgba(242,242,237,0.15)' : 'rgba(242,242,237,0.06)'}`,
                              cursor: available ? 'pointer' : 'default',
                              transition: 'all 0.15s', fontFamily: 'Montserrat',
                              position: 'relative', overflow: 'hidden',
                            }}
                            onMouseEnter={e => { if (available && !selected) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--white)' } }}
                            onMouseLeave={e => { if (available && !selected) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,237,0.6)' } }}>
                            {/* Strike-through line for unavailable sizes */}
                            {!available && (
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', width: '130%', height: 1, background: 'rgba(242,242,237,0.1)', transform: 'rotate(-45deg)' }} />
                              </div>
                            )}
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {sizeError && !selectedSize && (
                  <p style={{ fontSize: 11, color: '#f87171', fontWeight: 700, marginBottom: 12 }}>⚠ Please select a size</p>
                )}
                {selectedSize && (
                  <p style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, marginBottom: 12, letterSpacing: '0.1em' }}>Size {selectedSize} selected</p>
                )}

                <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.2)', marginBottom: 24, letterSpacing: '0.05em' }}>Free shipping · 7-day returns</p>

                {/* Description */}
                {product.longDescription && (
                  <>
                    <div style={{ height: 1, background: 'rgba(242,242,237,0.06)', marginBottom: 20 }} />
                    <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.45)', lineHeight: 1.9, marginBottom: 24, fontWeight: 300 }}>{product.longDescription}</p>
                  </>
                )}
              </>
            ) : (
              /* ── STANDARD (boots/balls/etc) INFO ── */
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 800 }}>{product.brand}</span>
                  {!product.inStock && (
                    <span style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', padding: '3px 8px', border: '1px solid rgba(248,113,113,0.25)' }}>SOLD OUT</span>
                  )}
                </div>

                <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--white)', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.01em' }}>{product.name}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'} color={i < Math.floor(product.rating) ? '#d4af37' : 'rgba(242,242,237,0.12)'} />)}
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(242,242,237,0.35)', fontWeight: 500 }}>{product.rating} · {product.reviewCount} reviews</span>
                </div>

                <div style={{ height: 1, background: 'rgba(242,242,237,0.06)', marginBottom: 20 }} />

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <span className="font-display" style={{ fontSize: 'clamp(38px, 5vw, 52px)', color: 'var(--white)', lineHeight: 1 }}>₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16, color: 'rgba(242,242,237,0.2)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '2px 8px', letterSpacing: '0.05em' }}>SAVE ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.2)', marginTop: 6, letterSpacing: '0.05em' }}>Free shipping · 7-day returns</p>
                </div>

                <div style={{ height: 1, background: 'rgba(242,242,237,0.06)', marginBottom: 20 }} />

                {product.longDescription && (
                  <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.45)', lineHeight: 1.9, marginBottom: 24, fontWeight: 300 }}>{product.longDescription}</p>
                )}

                {/* Standard size selector */}
                {sortedSizes.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: sizeError ? '#f87171' : selectedSize ? 'var(--white)' : 'rgba(242,242,237,0.5)', transition: 'color 0.2s' }}>
                        {sizeError ? '⚠ Select a size first' : selectedSize ? `UK ${selectedSize} Selected` : 'Select UK Size'}
                      </p>
                      <Link href="/size-guide" style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(34,197,94,0.3)', paddingBottom: 1 }}>Size Guide</Link>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {sortedSizes.map(s => (
                        <button key={s} onClick={() => setSelectedSize(s)}
                          style={{
                            width: 56, height: 48, fontSize: 12, fontWeight: 700,
                            background: selectedSize === s ? 'var(--green)' : 'transparent',
                            color: selectedSize === s ? '#050505' : 'rgba(242,242,237,0.5)',
                            border: `1.5px solid ${selectedSize === s ? 'var(--green)' : sizeError ? 'rgba(248,113,113,0.4)' : 'rgba(242,242,237,0.1)'}`,
                            cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Montserrat',
                          }}
                          onMouseEnter={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.5)'; (e.currentTarget as HTMLElement).style.color = 'var(--white)' } }}
                          onMouseLeave={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = sizeError ? 'rgba(248,113,113,0.4)' : 'rgba(242,242,237,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,237,0.5)' } }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* CTA Buttons — same for both */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <button onClick={handleAdd}
                style={{
                  width: '100%', padding: '17px',
                  background: added ? 'rgba(34,197,94,0.12)' : 'var(--green)',
                  color: added ? 'var(--green)' : '#050505',
                  border: added ? '1px solid rgba(34,197,94,0.3)' : 'none',
                  fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'all 0.3s', fontFamily: 'Montserrat',
                  boxShadow: added ? 'none' : '0 0 28px rgba(34,197,94,0.25)',
                }}>
                {added ? <><Check size={15} /> Added to Bag!</> : <><ShoppingBag size={15} /> Add to Bag</>}
              </button>

              <Link href="/checkout" onClick={() => { if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000) } else { addItem(product, selectedSize) } }} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '17px', background: 'transparent',
                  color: 'rgba(242,242,237,0.65)', border: '1px solid rgba(242,242,237,0.15)',
                  fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  fontFamily: 'Montserrat', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.35)'); (e.currentTarget.style.color = 'var(--white)') }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.15)'); (e.currentTarget.style.color = 'rgba(242,242,237,0.65)') }}>
                  <Zap size={14} fill="currentColor" /> Buy Now
                </button>
              </Link>
            </div>

            {/* Trust strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { icon: Shield,     label: '100% Authentic' },
                { icon: Truck,      label: 'Free Shipping' },
                { icon: RefreshCcw, label: '7-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                  padding: '14px 8px', background: 'rgba(242,242,237,0.02)',
                  border: '1px solid rgba(242,242,237,0.06)', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.06)')}>
                  <Icon size={15} color="var(--green)" strokeWidth={1.5} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(242,242,237,0.35)', textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.4 }}>{label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 700, marginBottom: 6 }}>More Like This</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--white)' }}>YOU MAY ALSO LIKE</h2>
              </div>
              <Link href="/shop" style={{ textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--green)', borderBottom: '1px solid rgba(34,197,94,0.25)', paddingBottom: 2 }}>View All</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 14 }}>
              {related.map((p: any) => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-card"
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                    <div style={{ height: 200, background: 'linear-gradient(135deg, var(--bg4), var(--bg3))', position: 'relative', overflow: 'hidden' }}>
                      <div className="font-display" style={{ position: 'absolute', bottom: -6, right: -6, fontSize: 90, color: 'rgba(242,242,237,0.025)', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>{p?.brand?.[0] || 'B'}</div>
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />}
                      <div className="img-dark" />
                      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 5 }}>
                        <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(242,242,237,0.5)', fontWeight: 700, background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(8px)', padding: '3px 8px' }}>{p.brand}</span>
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px 16px' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 8, lineHeight: 1.3 }}>{p.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="font-display" style={{ fontSize: 22, color: 'var(--white)' }}>₹{p.price.toLocaleString()}</span>
                        <ArrowRight size={13} color="var(--green)" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}