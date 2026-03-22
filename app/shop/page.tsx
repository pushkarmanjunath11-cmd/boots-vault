'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Star, X, ChevronDown, SlidersHorizontal, Search, ShoppingBag, Eye, Zap } from 'lucide-react'
import { subscribeProducts } from '@/lib/productService'
import { products as staticProducts } from '@/lib/data'
import { useCartStore } from '@/lib/store'
import { Product } from '@/types'
import QuickViewModal from '@/components/ui/QuickViewModal'

const brands = ['Nike','Adidas','Puma','New Balance','Mizuno']
const sorts = ['Featured','Price: Low to High','Price: High to Low','Newest','Top Rated']
const cats = [
  { id:'all',             label:'All' },
  { id:'boots',           label:'Boots' },
  { id:'jerseys-jackets', label:'Jerseys & Jackets' },
  { id:'balls',           label:'Balls' },
  { id:'gloves',          label:'Gloves' },
  { id:'essentials',      label:'Essentials' },
]
const bootTypes = [
  { id:'all-boots', label:'All Boots' },
  { id:'trainers',  label:'Trainers' },
]

function ProductCard({ p, idx, onQuickView }: { p: Product; idx: number; onQuickView: (p: Product) => void }) {
  const { addItem, openCart } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const hasSecond = !!(p.images?.[1])

  return (
    <Link href={`/products/${p.id}`} style={{ textDecoration:'none' }}>
    <div
      className="product-card"
      style={{ opacity:0, animation:`fadeUp 0.45s ease ${Math.min(idx,8)*0.04}s forwards`, position:'relative' }}
      onMouseEnter={e => { e.preventDefault(); setHovered(true) }}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height:'clamp(200px,36vw,320px)', background:'linear-gradient(135deg,var(--bg4),var(--bg3))', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(34,197,94,0.02) 1px, transparent 1px)', backgroundSize:'22px 22px', zIndex:1 }} />
        <div className="font-display" style={{ position:'absolute', bottom:-12, right:-8, fontSize:'clamp(90px,16vw,150px)', color:'rgba(242,242,237,0.025)', lineHeight:1, userSelect:'none', pointerEvents:'none', zIndex:1 }}>{p.brand?.[0]||'B'}</div>
        {p.images?.[0] && (
          <img src={p.images[0]} alt={p.name}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.45s ease', opacity: hovered && hasSecond ? 0 : 1, zIndex:2 }}
            onError={e=>(e.currentTarget.style.display='none')} />
        )}
        {hasSecond && (
          <img src={p.images[1]} alt={p.name}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.45s ease', opacity: hovered ? 1 : 0, zIndex:2 }}
            onError={e=>(e.currentTarget.style.display='none')} />
        )}
        <div className="img-dark" style={{ zIndex:3 }} />
        <div style={{ position:'absolute', top:10, left:10, display:'flex', gap:4, zIndex:6 }}>
          {p.isNew && <span style={{ background:'var(--green)', color:'#050505', fontSize:8, fontWeight:800, letterSpacing:'0.2em', padding:'3px 8px' }}>NEW</span>}
          {p.originalPrice && <span style={{ background:'rgba(212,175,55,0.9)', color:'#050505', fontSize:8, fontWeight:800, padding:'3px 8px' }}>-{Math.round((1-p.price/p.originalPrice)*100)}%</span>}
        </div>
        <div style={{ position:'absolute', bottom:10, left:10, zIndex:6 }}>
          <span style={{ fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(242,242,237,0.5)', fontWeight:700, background:'rgba(8,8,8,0.6)', backdropFilter:'blur(8px)', padding:'3px 8px', border:'1px solid rgba(242,242,237,0.06)' }}>{p.brand}</span>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', zIndex:10, transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(p) }}
            style={{ padding:'12px 6px', background:'var(--green)', color:'#050505', border:'none', fontSize:9, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', fontFamily:'Montserrat', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'background 0.2s' }}
            onMouseEnter={e=>(e.currentTarget.style.background='#4ade80')}
            onMouseLeave={e=>(e.currentTarget.style.background='var(--green)')}>
            <ShoppingBag size={11} /> Cart
          </button>
          <button onClick={e => { e.stopPropagation(); onQuickView(p) }} style={{ width:'100%', padding:'12px 6px', background:'rgba(10,10,10,0.92)', color:'rgba(242,242,237,0.75)', border:'none', borderLeft:'1px solid rgba(242,242,237,0.08)', fontSize:9, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', fontFamily:'Montserrat', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all 0.2s' }}
            onMouseEnter={e=>{(e.currentTarget.style.background='rgba(34,197,94,0.12)');(e.currentTarget.style.color='var(--green)')}}
            onMouseLeave={e=>{(e.currentTarget.style.background='rgba(10,10,10,0.92)');(e.currentTarget.style.color='rgba(242,242,237,0.75)')}}>
            <Eye size={11} /> View
          </button>
          <Link href="/checkout" onClick={e=>{e.stopPropagation();addItem(p,p.sizes?.[0]||'')}} style={{ textDecoration:'none' }}>
            <button style={{ width:'100%', padding:'12px 6px', background:'rgba(10,10,10,0.92)', color:'rgba(242,242,237,0.75)', border:'none', borderLeft:'1px solid rgba(242,242,237,0.08)', fontSize:9, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', fontFamily:'Montserrat', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all 0.2s' }}
              onMouseEnter={e=>{(e.currentTarget.style.background='rgba(34,197,94,0.12)');(e.currentTarget.style.color='var(--green)')}}
              onMouseLeave={e=>{(e.currentTarget.style.background='rgba(10,10,10,0.92)');(e.currentTarget.style.color='rgba(242,242,237,0.75)')}}>
              <Zap size={11} /> Buy
            </button>
          </Link>
        </div>
      </div>
        <div style={{ padding:'14px 14px 18px' }}>
          <p style={{ fontSize:'clamp(12px,2.5vw,14px)', fontWeight:700, color:'var(--white)', marginBottom:4, lineHeight:1.35 }}>{p.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:10 }}>
            {[...Array(5)].map((_,i)=><Star key={i} size={9} fill={i<Math.floor(p.rating)?'#d4af37':'none'} color={i<Math.floor(p.rating)?'#d4af37':'rgba(242,242,237,0.1)'}/>)}
            <span style={{ fontSize:9, color:'rgba(242,242,237,0.22)' }}>({p.reviewCount})</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span className="font-display" style={{ fontSize:'clamp(18px,4vw,22px)', color:'var(--white)', lineHeight:1 }}>₹{p.price.toLocaleString()}</span>
            {p.originalPrice && <span style={{ fontSize:10, color:'rgba(242,242,237,0.2)', textDecoration:'line-through' }}>₹{p.originalPrice.toLocaleString()}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

function ShopContent() {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>(staticProducts.filter(p=>p&&p.name&&p.price>0))
  const [category, setCategory] = useState(params.get('category')||'all')
  const [bootType, setBootType] = useState('all-boots')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sort, setSort] = useState('Featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [quickView, setQuickView] = useState<Product | null>(null)

  useEffect(()=>{
    const unsub = subscribeProducts(data=>{if(data.length>0)setProducts(data)})
    return ()=>unsub()
  },[])

  useEffect(()=>{if(category!=='boots')setBootType('all-boots')},[category])

  const toggleBrand = (b:string) => setSelectedBrands(p=>p.includes(b)?p.filter(x=>x!==b):[...p,b])
  const clearAll = () => setSelectedBrands([])
  const currentCatLabel = cats.find(c=>c.id===category)?.label||'Products'

  let filtered = products.filter(p=>{
    if(!p||!p.name||!p.price) return false
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.brand?.toLowerCase().includes(search.toLowerCase())) return false
    if(category!=='all'&&p.category!==category) return false
    if(category==='boots'&&bootType==='trainers'&&(p as any).subCategory!=='trainers') return false
    if(selectedBrands.length&&!selectedBrands.includes(p.brand)) return false
    return true
  })

  if(sort==='Price: Low to High') filtered=[...filtered].sort((a,b)=>a.price-b.price)
  if(sort==='Price: High to Low') filtered=[...filtered].sort((a,b)=>b.price-a.price)
  if(sort==='Top Rated')          filtered=[...filtered].sort((a,b)=>b.rating-a.rating)
  if(sort==='Newest')             filtered=[...filtered].sort((a,b)=>(b.createdAt??'').localeCompare(a.createdAt??''))

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:60, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'clamp(24px,4vw,40px) clamp(20px,4vw,48px) 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:8, fontWeight:700 }}>The Collection</p>
          <h1 className="font-display" style={{ fontSize:'clamp(36px,6vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:24 }}>
            {category==='all'?'ALL PRODUCTS':currentCatLabel.toUpperCase()}
          </h1>
          <div style={{ display:'flex', gap:0, overflowX:'auto', WebkitOverflowScrolling:'touch', scrollbarWidth:'none' }}>
            {cats.map(c=>(
              <button key={c.id} onClick={()=>setCategory(c.id)}
                style={{ padding:'12px 18px', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background: category===c.id ? 'rgba(34,197,94,0.08)' : 'transparent', color:category===c.id?'var(--green)':'rgba(242,242,237,0.6)', border:'none', borderBottom:category===c.id?'2px solid var(--green)':'2px solid rgba(242,242,237,0.08)', cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat', whiteSpace:'nowrap' }}>
                {c.label}
              </button>
            ))}
          </div>
          {category==='boots'&&(
            <div style={{ display:'flex', borderTop:'1px solid rgba(242,242,237,0.05)', marginTop:2 }}>
              {bootTypes.map(t=>(
                <button key={t.id} onClick={()=>setBootType(t.id)}
                  style={{ padding:'9px 16px', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'transparent', color:bootType===t.id?'var(--green)':'rgba(242,242,237,0.22)', border:'none', borderBottom:bootType===t.id?'2px solid rgba(34,197,94,0.5)':'2px solid transparent', cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat', whiteSpace:'nowrap' }}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'clamp(16px,3vw,28px) clamp(20px,4vw,48px)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, gap:10, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <button onClick={()=>setFiltersOpen(!filtersOpen)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 14px', background:filtersOpen?'var(--green)':'var(--bg3)', border:`1px solid ${filtersOpen?'var(--green)':'var(--border)'}`, color:filtersOpen?'#050505':'rgba(242,242,237,0.6)', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat' }}>
              <SlidersHorizontal size={13}/> Filters {selectedBrands.length>0&&`(${selectedBrands.length})`}
            </button>
            {selectedBrands.length>0&&(
              <button onClick={clearAll}
                style={{ display:'flex', alignItems:'center', gap:5, padding:'9px 12px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Montserrat' }}>
                <X size={11}/> Clear
              </button>
            )}
            <span style={{ fontSize:12, color:'rgba(242,242,237,0.3)' }}>{filtered.length} {currentCatLabel.toLowerCase()}</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ position:'relative' }}>
              <Search size={13} color="rgba(242,242,237,0.25)" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
                style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:'9px 12px 9px 30px', fontSize:11, color:'var(--white)', outline:'none', width:160, fontFamily:'Montserrat', transition:'border-color 0.2s' }}
                onFocus={e=>(e.target.style.borderColor='rgba(34,197,94,0.3)')}
                onBlur={e=>(e.target.style.borderColor='var(--border)')} />
            </div>
            <div style={{ position:'relative' }}>
              <select value={sort} onChange={e=>setSort(e.target.value)}
                style={{ appearance:'none', background:'var(--bg3)', border:'1px solid var(--border)', color:'rgba(242,242,237,0.6)', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'9px 30px 9px 12px', cursor:'pointer', outline:'none', fontFamily:'Montserrat' }}>
                {sorts.map(s=><option key={s} value={s} style={{ background:'var(--bg3)' }}>{s}</option>)}
              </select>
              <ChevronDown size={11} color="rgba(242,242,237,0.3)" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            </div>
          </div>
        </div>

        {filtersOpen&&(
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'20px', marginBottom:20 }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--green)', marginBottom:12 }}>Brand</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {brands.map(b=>(
                <button key={b} onClick={()=>toggleBrand(b)}
                  style={{ padding:'7px 14px', fontSize:11, fontWeight:700, background:selectedBrands.includes(b)?'var(--green)':'var(--bg3)', color:selectedBrands.includes(b)?'#050505':'rgba(242,242,237,0.5)', border:`1px solid ${selectedBrands.includes(b)?'var(--green)':'var(--border)'}`, cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat' }}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length===0?(
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <p className="font-display" style={{ fontSize:'clamp(24px,5vw,36px)', color:'rgba(242,242,237,0.06)', marginBottom:12 }}>NO {currentCatLabel.toUpperCase()} FOUND</p>
            <p style={{ fontSize:13, color:'rgba(242,242,237,0.3)' }}>Try adjusting your filters</p>
          </div>
        ):(
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(260px, calc(50% - 7px)), 1fr))', gap:'clamp(10px,2vw,18px)' }}>
            {filtered.map((p, idx) => <ProductCard key={p.id} p={p} idx={idx} onQuickView={setQuickView} />)}
          </div>
        )}
      </div>
      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  )
}

export default function ShopPage() {
  return <Suspense fallback={<div style={{ background:'var(--bg)', minHeight:'100vh' }}/>}><ShopContent/></Suspense>
}