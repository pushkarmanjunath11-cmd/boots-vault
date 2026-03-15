'use client'

import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, ArrowRight, Truck } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const cartTotal = total()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={72} strokeWidth={1} color="rgba(245,245,240,0.06)" style={{ margin: '0 auto 24px' }} />
          <h1 className="font-display" style={{ fontSize: 56, color: 'var(--white)', marginBottom: 16 }}>BAG IS EMPTY</h1>
          <p style={{ fontSize: 14, color: 'rgba(245,245,240,0.3)', marginBottom: 32 }}>Add some boots to get started.</p>
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <div className="btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}>
              Shop Boots <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
          <h1 className="font-display" style={{ fontSize: 60, color: 'var(--white)', lineHeight: 0.9 }}>YOUR BAG<br /><span style={{ fontSize: 20, color: 'rgba(245,245,240,0.25)', fontFamily: 'Montserrat', letterSpacing: '0.1em' }}>{itemCount} ITEM{itemCount !== 1 ? 'S' : ''}</span></h1>
          <button onClick={clearCart} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(248,113,113,0.5)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Montserrat', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,113,113,0.5)')}>
            Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={`${item.product.id}-${item.selectedSize}`} style={{ display: 'flex', gap: 20, padding: 20, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div style={{ width: 100, height: 100, background: 'var(--bg4)', position: 'relative', flexShrink: 0, border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--green)', fontWeight: 700, marginBottom: 4 }}>{item.product.brand}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{item.product.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.3)', marginBottom: 16 }}>UK {item.selectedSize}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,240,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ width: 36, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,240,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-display" style={{ fontSize: 28, color: 'var(--white)' }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id, item.selectedSize)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,240,0.15)', alignSelf: 'flex-start', padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,240,0.15)')}>
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 28, position: 'sticky', top: 88 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--green), transparent)' }} />
            <h2 className="font-display" style={{ fontSize: 24, color: 'var(--white)', marginBottom: 24, letterSpacing: '0.05em' }}>ORDER SUMMARY</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,240,0.4)' }}>Subtotal ({itemCount} items)</span>
                <span style={{ color: 'var(--white)', fontWeight: 600 }}>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,240,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}><Truck size={12} /> Shipping</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-display" style={{ fontSize: 20, color: 'var(--white)' }}>TOTAL</span>
                <span className="font-display" style={{ fontSize: 36, color: 'var(--white)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="btn-green" style={{ width: '100%', padding: '16px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'Montserrat', boxSizing: 'border-box' }}>
                Proceed to Checkout <ArrowRight size={15} />
              </div>
            </Link>
            <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(245,245,240,0.2)', marginTop: 12, letterSpacing: '0.1em' }}>Secure checkout via Stripe</p>
          </div>
        </div>
      </div>
    </div>
  )
}
