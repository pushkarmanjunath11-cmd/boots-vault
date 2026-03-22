'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, Zap, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Product } from '@/types'

export default function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem, openCart } = useCartStore()
  const [selectedSize, setSelectedSize] = useState('')
  const [imgIdx, setImgIdx] = useState(0)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : []
  const sizes = Array.isArray(product.sizes) ? [...product.sizes].sort((a, b) => parseFloat(a) - parseFloat(b)) : []
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return }
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose(); openCart() }, 1200)
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease' }}>

      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#0d0d0d', border: '1px solid rgba(242,242,237,0.08)', width: '100%', maxWidth: 780, maxHeight: '90vh', overflowY: 'auto', position: 'relative', animation: 'fadeUp 0.25s ease' }}>

        {/* Top green line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#22c55e,rgba(212,175,55,0.4),transparent)' }} />

        {/* Close */}
        <button onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, background: 'rgba(242,242,237,0.06)', border: '1px solid rgba(242,242,237,0.1)', cursor: 'pointer', color: 'rgba(242,242,237,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(248,113,113,0.1)'); (e.currentTarget.style.color = '#f87171') }}
          onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(242,242,237,0.06)'); (e.currentTarget.style.color = 'rgba(242,242,237,0.6)') }}>
          <X size={15} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 0 }}>

          {/* Image */}
          <div style={{ position: 'relative', background: 'linear-gradient(135deg,var(--bg4),var(--bg3))', aspectRatio: '1/1', overflow: 'hidden', minHeight: 280 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.025) 1px,transparent 1px)', backgroundSize: '22px 22px', zIndex: 1 }} />
            <div className="font-display" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 140, color: 'rgba(242,242,237,0.025)', userSelect: 'none', pointerEvents: 'none', zIndex: 1 }}>{product.brand?.[0] || 'B'}</div>
            {images[imgIdx] && (
              <img src={images[imgIdx]} alt={product.name} key={imgIdx}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2, animation: 'fadeIn 0.25s ease' }}
                onError={e => (e.currentTarget.style.display = 'none')} />
            )}
            {discount > 0 && <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(212,175,55,0.9)', color: '#050505', fontSize: 10, fontWeight: 800, padding: '3px 9px', zIndex: 5 }}>-{discount}%</div>}
            {product.isNew && <div style={{ position: 'absolute', top: discount > 0 ? 40 : 12, left: 12, background: 'var(--green)', color: '#050505', fontSize: 8, fontWeight: 800, letterSpacing: '0.2em', padding: '3px 8px', zIndex: 5 }}>NEW</div>}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: 'rgba(8,8,8,0.75)', border: '1px solid rgba(242,242,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--white)', zIndex: 5 }}>
                  <ChevronLeft size={13} />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: 'rgba(8,8,8,0.75)', border: '1px solid rgba(242,242,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--white)', zIndex: 5 }}>
                  <ChevronRight size={13} />
                </button>
                {/* Thumbnail dots */}
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 5 }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      style={{ width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? 'var(--green)' : 'rgba(242,242,237,0.3)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'Montserrat,sans-serif' }}>

            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 800 }}>{product.brand}</span>
              {!product.inStock && <span style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 8, fontWeight: 800, padding: '2px 7px', border: '1px solid rgba(248,113,113,0.25)' }}>SOLD OUT</span>}
            </div>

            {/* Name */}
            <h2 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 900, color: 'var(--white)', lineHeight: 1.2, margin: 0 }}>{product.name}</h2>

            {/* Price */}
            <div style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span className="font-display" style={{ fontSize: 'clamp(28px,4vw,38px)', color: 'var(--white)', lineHeight: 1 }}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontSize: 14, color: 'rgba(242,242,237,0.22)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--green)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '2px 7px' }}>SAVE ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                  </>
                )}
              </div>
              <p style={{ fontSize: 10, color: 'rgba(242,242,237,0.2)', marginTop: 4 }}>Free shipping · 7-day returns</p>
            </div>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: sizeError ? '#f87171' : selectedSize ? 'var(--white)' : 'rgba(242,242,237,0.45)', marginBottom: 10 }}>
                  {sizeError ? '⚠ Select a size first' : selectedSize ? `UK ${selectedSize} Selected` : 'Select UK Size'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      style={{ width: 50, height: 42, fontSize: 12, fontWeight: 700, background: selectedSize === s ? 'var(--green)' : 'transparent', color: selectedSize === s ? '#050505' : 'rgba(242,242,237,0.45)', border: `1.5px solid ${selectedSize === s ? 'var(--green)' : sizeError ? 'rgba(248,113,113,0.4)' : 'rgba(242,242,237,0.12)'}`, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Montserrat' }}
                      onMouseEnter={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.color = 'var(--white)' } }}
                      onMouseLeave={e => { if (selectedSize !== s) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.12)'; (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,237,0.45)' } }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
              <button onClick={handleAdd}
                style={{ width: '100%', padding: '15px', background: added ? 'rgba(34,197,94,0.12)' : 'var(--green)', color: added ? 'var(--green)' : '#050505', border: added ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Montserrat', transition: 'all 0.3s', boxShadow: added ? 'none' : '0 0 20px rgba(34,197,94,0.2)' }}>
                {added ? <><Check size={14} /> Added!</> : <><ShoppingBag size={14} /> Add to Bag</>}
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/checkout`} onClick={() => { if (selectedSize) { addItem(product, selectedSize); onClose() } else { setSizeError(true); setTimeout(() => setSizeError(false), 2000) } }} style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{ width: '100%', padding: '13px', background: 'transparent', color: 'rgba(242,242,237,0.65)', border: '1px solid rgba(242,242,237,0.15)', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.35)'); (e.currentTarget.style.color = 'var(--white)') }}
                    onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.15)'); (e.currentTarget.style.color = 'rgba(242,242,237,0.65)') }}>
                    <Zap size={12} fill="currentColor" /> Buy Now
                  </button>
                </Link>
                <Link href={`/products/${product.id}`} onClick={onClose} style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{ width: '100%', padding: '13px', background: 'transparent', color: 'rgba(242,242,237,0.65)', border: '1px solid rgba(242,242,237,0.15)', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)'); (e.currentTarget.style.color = 'var(--green)') }}
                    onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(242,242,237,0.15)'); (e.currentTarget.style.color = 'rgba(242,242,237,0.65)') }}>
                    Full Details →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}