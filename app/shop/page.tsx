'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Star, X, ChevronDown, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { subscribeProducts } from '@/lib/productService'
import { products as staticProducts } from '@/lib/data'
import { Product } from '@/types'

const sizes = ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11']
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

function ShopContent() {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [bootType, setBootType] = useState('all-boots')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sort, setSort] = useState('Featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const unsub = subscribeProducts(data => { if (data.length > 0) setProducts(data) })
    return () => unsub()
  }, [])

  // Reset boot type when switching away from boots
  useEffect(() => {
    if (category !== 'boots') setBootType('all-boots')
  }, [category])

  const toggleBrand = (b: string) => setSelectedBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b])
  const toggleSize  = (s: string) => setSelectedSizes(p =>  p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  const clearAll = () => { setSelectedBrands([]); setSelectedSizes([]) }

  const currentCatLabel = cats.find(c => c.id === category)?.label || 'Products'

  let filtered = products.filter(p => {
    if (category !== 'all' && p.category !== category) return false
    if (category === 'boots' && bootType === 'trainers' && (p as any).subCategory !== 'trainers') return false
    if (category === 'boots' && bootType === 'all-boots' && (p as any).subCategory === 'trainers') {
      // still show trainers in all-boots — remove this block if you don't want that
    }
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false
    if (selectedSizes.length && !selectedSizes.some(s => p.sizes.includes(s))) return false
    return true
  })

  if (sort === 'Price: Low to High')  filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sort === 'Price: High to Low')  filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sort === 'Top Rated')           filtered = [...filtered].sort((a,b) => b.rating - a.rating)
  if (sort === 'Newest')              filtered = [...filtered].sort((a,b) => (b.createdAt??'').localeCompare(a.createdAt??''))

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>

      {/* Header */}
      <div style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'40px 48px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:10, fontWeight:700 }}>The Collection</p>
          <h1 className="font-display" style={{ fontSize:'clamp(48px,7vw,88px)', color:'var(--white)', lineHeight:0.9, marginBottom:28 }}>
            {category === 'all' ? 'ALL PRODUCTS' : currentCatLabel.toUpperCase()}
          </h1>

          {/* Main category tabs */}
          <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding:'14px 24px', fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', background:'transparent', color: category===c.id ? 'var(--white)' : 'rgba(242,242,237,0.3)', border:'none', borderBottom: category===c.id ? '2px solid var(--green)' : '2px solid transparent', cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat', whiteSpace:'nowrap' }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Boot sub-filter — only shows under Boots tab */}
          {category === 'boots' && (
            <div style={{ display:'flex', gap:0, borderTop:'1px solid rgba(242,242,237,0.05)', marginTop:2 }}>
              {bootTypes.map(t => (
                <button key={t.id} onClick={() => setBootType(t.id)} style={{ padding:'10px 20px', fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', background:'transparent', color: bootType===t.id ? 'var(--green)' : 'rgba(242,242,237,0.22)', border:'none', borderBottom: bootType===t.id ? '2px solid rgba(34,197,94,0.5)' : '2px solid transparent', cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat', whiteSpace:'nowrap' }}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 48px' }}>

        {/* Toolbar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={() => setFiltersOpen(!filtersOpen)} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', background: filtersOpen ? 'var(--green)' : 'var(--bg3)', border:`1px solid ${filtersOpen ? 'var(--green)' : 'var(--border)'}`, color: filtersOpen ? '#050505' : 'rgba(242,242,237,0.6)', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat' }}>
              <SlidersHorizontal size={13} /> Filters {(selectedBrands.length + selectedSizes.length) > 0 && `(${selectedBrands.length + selectedSizes.length})`}
            </button>
            {(selectedBrands.length > 0 || selectedSizes.length > 0) && (
              <button onClick={clearAll} style={{ display:'flex', alignItems:'center', gap:5, padding:'9px 14px', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', color:'#f87171', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Montserrat' }}>
                <X size={11} /> Clear
              </button>
            )}
            <span style={{ fontSize:12, color:'rgba(242,242,237,0.3)' }}>{filtered.length} {category === 'all' ? 'products' : currentCatLabel.toLowerCase()}</span>
          </div>

          <div style={{ position:'relative' }}>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ appearance:'none', background:'var(--bg3)', border:'1px solid var(--border)', color:'rgba(242,242,237,0.6)', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'9px 36px 9px 14px', cursor:'pointer', outline:'none', fontFamily:'Montserrat' }}>
              {sorts.map(s => <option key={s} value={s} style={{ background:'var(--bg3)' }}>{s}</option>)}
            </select>
            <ChevronDown size={12} color="rgba(242,242,237,0.3)" style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:'28px 32px', marginBottom:24, display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--green)', marginBottom:16 }}>Brand</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {brands.map(b => (
                  <button key={b} onClick={() => toggleBrand(b)} style={{ padding:'6px 14px', fontSize:11, fontWeight:700, background: selectedBrands.includes(b) ? 'var(--green)' : 'var(--bg3)', color: selectedBrands.includes(b) ? '#050505' : 'rgba(242,242,237,0.5)', border:`1px solid ${selectedBrands.includes(b) ? 'var(--green)' : 'var(--border)'}`, cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat' }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--green)', marginBottom:16 }}>Size (UK)</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {sizes.map(s => (
                  <button key={s} onClick={() => toggleSize(s)} style={{ width:46, height:40, fontSize:11, fontWeight:700, background: selectedSizes.includes(s) ? 'var(--green)' : 'var(--bg3)', color: selectedSizes.includes(s) ? '#050505' : 'rgba(242,242,237,0.4)', border:`1px solid ${selectedSizes.includes(s) ? 'var(--green)' : 'var(--border)'}`, cursor:'pointer', transition:'all 0.2s', fontFamily:'Montserrat' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <p className="font-display" style={{ fontSize:36, color:'rgba(242,242,237,0.08)', marginBottom:12 }}>
              NO {bootType === 'trainers' ? 'TRAINERS' : currentCatLabel.toUpperCase()} FOUND
            </p>
            <p style={{ fontSize:13, color:'rgba(242,242,237,0.3)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:14 }}>
            {filtered.map((p, idx) => (
              <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration:'none' }}>
                <div className="product-card" style={{ opacity:0, animation:`fadeUp 0.5s ease ${idx*0.04}s forwards` }}>
                  <div style={{ height:240, background:'linear-gradient(135deg, var(--bg4), var(--bg3))', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(34,197,94,0.025) 1px, transparent 1px)', backgroundSize:'20px 20px' }} />
                    <div className="font-display" style={{ position:'absolute', bottom:-8, right:-8, fontSize:110, color:'rgba(242,242,237,0.025)', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>{p.brand[0]}</div>
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e => (e.currentTarget.style.display='none')} />
                    )}
                    <div className="img-dark" />
                    <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:5, zIndex:5 }}>
                      {p.isNew && <span style={{ background:'var(--green)', color:'#050505', fontSize:8, fontWeight:800, letterSpacing:'0.2em', padding:'3px 8px' }}>NEW</span>}
                      {p.originalPrice && <span style={{ background:'rgba(212,175,55,0.9)', color:'#050505', fontSize:8, fontWeight:800, padding:'3px 8px' }}>-{Math.round((1-p.price/p.originalPrice)*100)}%</span>}
                    </div>
                    <div style={{ position:'absolute', bottom:12, left:12, zIndex:5 }}>
                      <span style={{ fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(242,242,237,0.5)', fontWeight:700, background:'rgba(8,8,8,0.6)', backdropFilter:'blur(8px)', padding:'3px 8px', border:'1px solid rgba(242,242,237,0.06)' }}>{p.brand}</span>
                    </div>
                  </div>
                  <div style={{ padding:'18px 18px 20px' }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'var(--white)', marginBottom:4, lineHeight:1.3 }}>{p.name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:12 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={9} fill={i < Math.floor(p.rating) ? '#d4af37' : 'none'} color={i < Math.floor(p.rating) ? '#d4af37' : 'rgba(242,242,237,0.1)'} />)}
                      <span style={{ fontSize:9, color:'rgba(242,242,237,0.25)' }}>({p.reviewCount})</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <span className="font-display" style={{ fontSize:24, color:'var(--white)', lineHeight:1 }}>₹{p.price.toLocaleString()}</span>
                        {p.originalPrice && <span style={{ fontSize:10, color:'rgba(242,242,237,0.2)', textDecoration:'line-through', marginLeft:6 }}>₹{p.originalPrice.toLocaleString()}</span>}
                      </div>
                      <ArrowRight size={14} color="var(--green)" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return <Suspense fallback={<div style={{ background:'var(--bg)', minHeight:'100vh' }} />}><ShopContent /></Suspense>
}