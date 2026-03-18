
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowLeft, ArrowRight, ShoppingBag, Check, ChevronLeft, ChevronRight, Zap, Shield, Truck, RefreshCcw } from 'lucide-react'
import { subscribeProducts } from '@/lib/productService'
import { products as staticProducts } from '@/lib/data'
import { useCartStore } from '@/lib/store'
import { Product } from '@/types'

export default function ClientProduct({ product }: { product: Product }) {
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
    setTimeout(() => setLoaded(true), 60)
    return () => unsub()
  }, [])

  if (!product) return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:60 }}>
      <div style={{ textAlign:'center' }}>
        <p className="font-display" style={{ fontSize:48, color:'rgba(242,242,237,0.08)', marginBottom:16 }}>NOT FOUND</p>
        <Link href="/shop" style={{ color:'var(--green)', textDecoration:'none', fontSize:13, fontWeight:700 }}>← Back to Shop</Link>
      </div>
    </div>
  )

  const images = product.images
  const discount = product.originalPrice ? Math.round((1 - product.price/product.originalPrice)*100) : 0

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return }
    addItem(product, selectedSize)
    setAdded(true); setTimeout(() => setAdded(false), 2500)
    openCart()
  }

  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:60, fontFamily:'Montserrat,sans-serif' }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(16px,3vw,24px) clamp(20px,4vw,48px) 0' }}>
        <Link href="/shop" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'rgba(242,242,237,0.3)', textDecoration:'none', fontSize:12, fontWeight:600, transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color='var(--white)')}
          onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.3)')}>
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(20px,3vw,32px) clamp(20px,4vw,48px) 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap:'clamp(28px,5vw,56px)', alignItems:'start' }}>

          {/* Gallery */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateX(-20px)', transition:'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}>
            <div style={{ position:'relative', background:'linear-gradient(135deg, var(--bg4), var(--bg3))', aspectRatio:'1/1', overflow:'hidden', marginBottom:12, border:'1px solid var(--border)' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(34,197,94,0.03) 1px, transparent 1px)', backgroundSize:'24px 24px' }} />
              <div className="font-display" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:180, color:'rgba(242,242,237,0.02)', userSelect:'none', pointerEvents:'none', lineHeight:1 }}>{product.brand[0]}</div>

              {images[imgIdx] && (
                <img src={images[imgIdx]} alt={product.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.4s' }} onError={e => (e.currentTarget.style.display='none')} />
              )}

              {discount > 0 && <div style={{ position:'absolute', top:16, left:16, background:'var(--gold)', color:'#050505', fontSize:12, fontWeight:800, padding:'4px 12px', zIndex:5 }}>-{discount}%</div>}
              {product.isNew && <div style={{ position:'absolute', top: discount>0 ? 52 : 16, left:16, background:'var(--green)', color:'#050505', fontSize:10, fontWeight:800, letterSpacing:'0.2em', padding:'3px 10px', zIndex:5 }}>NEW</div>}

              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i-1+images.length)%images.length)} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:36, height:36, background:'rgba(8,8,8,0.7)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--white)', zIndex:5 }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i+1)%images.length)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:36, height:36, background:'rgba(8,8,8,0.7)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--white)', zIndex:5 }}>
                    <ChevronRight size={16} />
                  </button>
                  <div style={{ position:'absolute', bottom:10, right:10, background:'rgba(8,8,8,0.7)', padding:'3px 10px', fontSize:9, color:'rgba(242,242,237,0.5)', fontFamily:'Space Mono', zIndex:5 }}>{imgIdx+1}/{images.length}</div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} style={{ width:64, height:64, flexShrink:0, position:'relative', border:`2px solid ${i===imgIdx ? 'var(--green)' : 'var(--border)'}`, background:'var(--bg4)', cursor:'pointer', overflow:'hidden', padding:0, transition:'border-color 0.2s' }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity: i===imgIdx ? 1 : 0.4 }} onError={e => (e.currentTarget.style.display='none')} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateX(20px)', transition:'all 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s' }}>

            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <span style={{ fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase', color:'var(--green)', fontWeight:800 }}>{product.brand}</span>
              {product.isNew && <span style={{ background:'var(--green)', color:'#050505', fontSize:8, fontWeight:800, letterSpacing:'0.25em', padding:'3px 8px' }}>NEW</span>}
            </div>

            <h1 style={{ fontSize:'clamp(20px,3vw,34px)', fontWeight:900, color:'var(--white)', lineHeight:1.2, marginBottom:14 }}>{product.name}</h1>

            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
              <div style={{ display:'flex', gap:3 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'} color={i < Math.floor(product.rating) ? '#d4af37' : 'rgba(242,242,237,0.15)'} />)}
              </div>
              <span style={{ fontSize:12, color:'rgba(242,242,237,0.35)' }}>{product.rating} · {product.reviewCount} reviews</span>
            </div>

            <div style={{ paddingBottom:24, marginBottom:24, borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:14, flexWrap:'wrap' }}>
                <span className="font-display" style={{ fontSize:'clamp(36px,5vw,52px)', color:'var(--white)', lineHeight:1 }}>₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontSize:16, color:'rgba(242,242,237,0.22)', textDecoration:'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                    <span style={{ fontSize:11, fontWeight:800, color:'var(--green)', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', padding:'2px 8px' }}>SAVE ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <p style={{ fontSize:11, color:'rgba(242,242,237,0.2)', marginTop:6 }}>Free shipping · 7-day returns</p>
            </div>

            <p style={{ fontSize:14, color:'rgba(242,242,237,0.5)', lineHeight:1.85, marginBottom:28, fontWeight:300 }}>{product.longDescription}</p>

            {/* Size */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color: sizeError ? '#f87171' : selectedSize ? 'var(--white)' : 'rgba(242,242,237,0.5)' }}>
                  {sizeError ? '⚠ Please select a size' : selectedSize ? `UK ${selectedSize} Selected` : 'Select UK Size'}
                </p>
                <span style={{ fontSize:10, color:'var(--green)', fontWeight:600, cursor:'pointer', textDecoration:'underline' }}>Size Guide</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {(Array.isArray(product.sizes) ? [...product.sizes].sort((a, b) => parseFloat(a) - parseFloat(b)) : []).map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{ width:52, height:44, fontSize:12, fontWeight:700, background: selectedSize===s ? 'var(--green)' : 'var(--bg3)', color: selectedSize===s ? '#050505' : 'rgba(242,242,237,0.45)', border:`1px solid ${selectedSize===s ? 'var(--green)' : sizeError ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`, cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAdd} style={{ width:'100%', padding:'clamp(14px,2vw,18px)', background: added ? 'rgba(34,197,94,0.12)' : 'var(--green)', color: added ? 'var(--green)' : '#050505', border: added ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize:13, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all 0.3s', fontFamily:'Montserrat', marginBottom:12, boxShadow: added ? 'none' : '0 0 32px rgba(34,197,94,0.3)' }}>
              {added ? <><Check size={16} /> Added to Bag!</> : <><ShoppingBag size={16} /> Add to Bag</>}
            </button>

            <Link href="/checkout" onClick={() => selectedSize && addItem(product, selectedSize)} style={{ textDecoration:'none', display:'block', marginBottom:24 }}>
              <button onClick={() => { if (!selectedSize) { setSizeError(true); setTimeout(()=>setSizeError(false),2000) } }} style={{ width:'100%', padding:'clamp(14px,2vw,18px)', background:'transparent', color:'rgba(242,242,237,0.65)', border:'1px solid rgba(242,242,237,0.15)', fontSize:13, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontFamily:'Montserrat', transition:'all 0.2s' }}>
                <Zap size={14} fill="currentColor" /> Buy Now
              </button>
            </Link>

            {/* Trust */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { icon: Shield,     label:'Mastercopies' },
                { icon: Truck,      label:'Free Shipping' },
                { icon: RefreshCcw, label:'7-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 8px', background:'var(--bg3)', border:'1px solid var(--border)' }}>
                  <Icon size={14} color="var(--green)" strokeWidth={1.5} />
                  <span style={{ fontSize:9, fontWeight:700, color:'rgba(242,242,237,0.4)', textAlign:'center', letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop:80 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <h2 className="font-display" style={{ fontSize:'clamp(28px,4vw,40px)', color:'var(--white)' }}>YOU MAY ALSO LIKE</h2>
              <Link href="/shop" style={{ textDecoration:'none', fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--green)', borderBottom:'1px solid rgba(34,197,94,0.25)', paddingBottom:2 }}>View All</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(200px, calc(50% - 8px)), 1fr))', gap:'clamp(8px,2vw,14px)' }}>
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration:'none' }}>
                  <div className="product-card">
                    <div style={{ height:'clamp(140px,20vw,180px)', background:`linear-gradient(135deg, var(--bg4), var(--bg3))`, position:'relative', overflow:'hidden' }}>
                      <div className="font-display" style={{ position:'absolute', bottom:-5, right:-5, fontSize:90, color:'rgba(242,242,237,0.025)', userSelect:'none', pointerEvents:'none', lineHeight:1 }}>{p.brand?.[0] || 'B'}</div>
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e => (e.currentTarget.style.display='none')} />}
                      <div className="img-dark" />
                      <div style={{ position:'absolute', bottom:10, left:10, zIndex:5 }}>
                        <span style={{ fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(242,242,237,0.5)', fontWeight:700, background:'rgba(8,8,8,0.6)', backdropFilter:'blur(8px)', padding:'3px 8px' }}>{p.brand}</span>
                      </div>
                    </div>
                    <div style={{ padding:'clamp(12px,2vw,16px)' }}>
                      <p style={{ fontSize:13, fontWeight:700, color:'var(--white)', marginBottom:8, lineHeight:1.3 }}>{p.name}</p>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span className="font-display" style={{ fontSize:20, color:'var(--white)' }}>₹{p.price.toLocaleString()}</span>
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
    </div>
  )
}