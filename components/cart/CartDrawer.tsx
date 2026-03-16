'use client'

import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCartStore()
  const count = itemCount()
  const cartTotal = total()

  return (
    <>
      {isOpen && <div onClick={closeCart} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000, backdropFilter:'blur(4px)' }} />}

      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(420px, 100vw)', zIndex:1001, background:'#0f0f0f', borderLeft:'1px solid rgba(242,242,237,0.08)', transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.45s cubic-bezier(0.22,1,0.36,1)', display:'flex', flexDirection:'column' }}>

        <div style={{ height:2, background:'linear-gradient(90deg, var(--green), rgba(212,175,55,0.4), transparent)' }} />

        <div style={{ padding:'20px clamp(16px,4vw,24px)', borderBottom:'1px solid rgba(242,242,237,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize:26, color:'var(--white)', letterSpacing:'0.05em' }}>YOUR BAG</h2>
            <p style={{ fontSize:11, color:'rgba(242,242,237,0.28)', marginTop:2 }}>{count} {count===1?'item':'items'}</p>
          </div>
          <button onClick={closeCart} style={{ width:38, height:38, background:'rgba(242,242,237,0.04)', border:'1px solid rgba(242,242,237,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(242,242,237,0.5)', transition:'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--green)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='rgba(242,242,237,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px clamp(16px,4vw,24px)' }}>
          {items.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16, paddingBottom:60 }}>
              <ShoppingBag size={52} strokeWidth={1} color="rgba(242,242,237,0.08)" />
              <p className="font-display" style={{ fontSize:22, color:'rgba(242,242,237,0.15)', letterSpacing:'0.1em' }}>BAG IS EMPTY</p>
              <Link href="/shop" onClick={closeCart} style={{ textDecoration:'none' }}>
                <div className="btn-primary" style={{ padding:'10px 24px', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  Shop Now <ArrowRight size={12} />
                </div>
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}`} style={{ display:'flex', gap:12, padding:14, background:'rgba(242,242,237,0.02)', border:'1px solid rgba(242,242,237,0.06)' }}>
                  <div style={{ width:68, height:68, background:'var(--bg4)', flexShrink:0, overflow:'hidden', position:'relative' }}>
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => (e.currentTarget.style.display='none')} />
                    ) : (
                      <div className="font-display" style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:'rgba(242,242,237,0.05)' }}>{item.product.brand[0]}</div>
                    )}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--green)', marginBottom:2, fontWeight:700 }}>{item.product.brand}</p>
                    <p style={{ fontSize:13, fontWeight:700, color:'var(--white)', lineHeight:1.3, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.product.name}</p>
                    <p style={{ fontSize:11, color:'rgba(242,242,237,0.28)', marginBottom:10 }}>UK {item.selectedSize}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', border:'1px solid rgba(242,242,237,0.08)' }}>
                        <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity-1)} style={{ width:28, height:28, background:'none', border:'none', cursor:'pointer', color:'rgba(242,242,237,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}><Minus size={10} /></button>
                        <span style={{ width:24, textAlign:'center', fontSize:12, fontWeight:700, color:'var(--white)' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity+1)} style={{ width:28, height:28, background:'none', border:'none', cursor:'pointer', color:'rgba(242,242,237,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={10} /></button>
                      </div>
                      <span className="font-display" style={{ fontSize:18, color:'var(--white)' }}>₹{(item.product.price*item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product.id, item.selectedSize)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(242,242,237,0.15)', alignSelf:'flex-start', padding:4, transition:'color 0.2s', flexShrink:0 }}
                    onMouseEnter={e => (e.currentTarget.style.color='#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.15)')}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding:'20px clamp(16px,4vw,24px)', borderTop:'1px solid rgba(242,242,237,0.07)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontSize:13, color:'rgba(242,242,237,0.4)', fontWeight:600 }}>Total</span>
              <span className="font-display" style={{ fontSize:32, color:'var(--white)' }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} style={{ textDecoration:'none', display:'block' }}>
              <div className="btn-primary" style={{ width:'100%', padding:16, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxSizing:'border-box' }}>
                Checkout <ArrowRight size={15} />
              </div>
            </Link>
            <p style={{ textAlign:'center', fontSize:10, color:'rgba(242,242,237,0.18)', marginTop:10, letterSpacing:'0.1em' }}>Secured by Stripe</p>
          </div>
        )}
      </div>
    </>
  )
}