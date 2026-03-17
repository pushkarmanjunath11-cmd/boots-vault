'use client'

import { useEffect, useState } from 'react'
import { subscribeProducts, deleteProduct, updateProduct } from '@/lib/productService'
import { Product } from '@/types'
import Link from 'next/link'
import { Trash2, Edit3, ChevronLeft, ChevronRight, Plus, Check, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const catLabel: Record<string, string> = {
  'football-boots': 'FG/AG',
  'turf': 'Turf',
  'futsal': 'Futsal',
}

const catColor: Record<string, string> = {
  'football-boots': '#22c55e',
  'turf': '#60a5fa',
  'futsal': '#f97316',
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState<Record<string, number>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsub = subscribeProducts(data => { setProducts(data); setLoading(false) })
    return () => unsub()
  }, [])

  const prevImg = (id: string, total: number) => setImgIndex(p => ({ ...p, [id]: ((p[id] ?? 0) - 1 + total) % total }))
  const nextImg = (id: string, total: number) => setImgIndex(p => ({ ...p, [id]: ((p[id] ?? 0) + 1) % total }))

  const startEdit = (p: Product) => {
    router.push(`/admin/edit-product/${p.id}`)
  }
  const cancelEdit = () => { setEditingId(null); setEditForm({}) }

  const saveEdit = async (id: string) => {
    setSaving(true)
    await updateProduct(id, editForm)
    setSaving(false)
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await deleteProduct(id)
  }

  const inp = { background: '#0a0a0a', border: '1px solid rgba(245,245,240,0.1)', padding: '8px 10px', fontSize: 13, color: '#f5f5f0', outline: 'none', fontFamily: 'Montserrat, sans-serif', width: '100%', boxSizing: 'border-box' as const }

  return (
    <div style={{ color: '#f5f5f0', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, color: '#f5f5f0', letterSpacing: '0.05em' }}>PRODUCTS</h1>
          <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.3)', marginTop: 4 }}>{products.length} boots in the vault</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {loading && <Loader2 size={16} color="#22c55e" style={{ animation: 'spin 1s linear infinite' }} />}
          <Link href="/admin/add-product" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#22c55e', color: '#050505', fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 20px rgba(34,197,94,0.3)', fontFamily: 'Montserrat' }}>
              <Plus size={14} /> Add Product
            </div>
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(245,245,240,0.3)' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <p className="font-display" style={{ fontSize: 32, color: 'rgba(245,245,240,0.06)', marginBottom: 12 }}>NO PRODUCTS YET</p>
          <Link href="/admin/add-product" style={{ textDecoration: 'none' }}>
            <div className="btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <Plus size={14} /> Add Your First Boot
            </div>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => {
            const curImg = imgIndex[p.id] ?? 0
            const isEditing = editingId === p.id
            const col = catColor[p.category] ?? '#22c55e'

            return (
              <div key={p.id} style={{ background: '#0d0d0d', border: `1px solid rgba(245,245,240,0.05)`, borderLeft: `3px solid ${col}`, position: 'relative', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 0 }}>

                  {/* Image gallery preview */}
                  <div style={{ position: 'relative', height: 140, background: '#0a0a0a', overflow: 'hidden' }}>
                    {p.images?.length > 0 ? (
                      <>
                        <img src={p.images[curImg]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                        {p.images.length > 1 && (
                          <>
                            <button onClick={() => prevImg(p.id, p.images.length)}
                              style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: 'rgba(5,5,5,0.8)', border: 'none', cursor: 'pointer', color: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ChevronLeft size={12} />
                            </button>
                            <button onClick={() => nextImg(p.id, p.images.length)}
                              style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24, background: 'rgba(5,5,5,0.8)', border: 'none', cursor: 'pointer', color: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ChevronRight size={12} />
                            </button>
                            <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                              {p.images.map((_, i) => (
                                <div key={i} style={{ width: i === curImg ? 12 : 5, height: 5, borderRadius: 2.5, background: i === curImg ? '#22c55e' : 'rgba(255,255,255,0.3)', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => setImgIndex(prev => ({ ...prev, [p.id]: i }))} />
                              ))}
                            </div>
                            <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', padding: '2px 6px', fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'Space Mono' }}>
                              {curImg + 1}/{p.images.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,245,240,0.1)', fontSize: 11 }}>No Image</div>
                    )}
                  </div>

                  {/* Info / Edit Form */}
                  <div style={{ padding: '16px 20px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          <div>
                            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.25)', marginBottom: 4, fontWeight: 700 }}>Name</p>
                            <input value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} style={inp} />
                          </div>
                          <div>
                            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.25)', marginBottom: 4, fontWeight: 700 }}>Sale Price ₹</p>
                            <input type="number" value={editForm.price ?? ''} onChange={e => setEditForm(p => ({ ...p, price: Number(e.target.value) }))} style={inp} />
                          </div>
                          <div>
                            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.25)', marginBottom: 4, fontWeight: 700 }}>MRP ₹</p>
                            <input type="number" value={editForm.originalPrice ?? ''} onChange={e => setEditForm(p => ({ ...p, originalPrice: Number(e.target.value) || undefined }))} style={inp} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          {[['inStock', 'In Stock'], ['featured', 'Featured'], ['isNew', 'New']].map(([k, lbl]) => (
                            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, color: 'rgba(245,245,240,0.5)' }}>
                              <div style={{ width: 14, height: 14, border: `1px solid ${editForm[k as keyof typeof editForm] ? '#22c55e' : 'rgba(245,245,240,0.15)'}`, background: editForm[k as keyof typeof editForm] ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                onClick={() => setEditForm(p => ({ ...p, [k]: !p[k as keyof typeof p] }))}>
                                {editForm[k as keyof typeof editForm] && <Check size={8} color="#050505" />}
                              </div>
                              {lbl}
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ background: `${col}15`, color: col, fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', padding: '2px 8px', border: `1px solid ${col}25` }}>{catLabel[p.category] ?? p.category}</span>
                          {p.isNew && <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', padding: '2px 8px', border: '1px solid rgba(34,197,94,0.2)' }}>NEW</span>}
                          {p.featured && <span style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', padding: '2px 8px', border: '1px solid rgba(212,175,55,0.2)' }}>FEATURED</span>}
                          {!p.inStock && <span style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', padding: '2px 8px', border: '1px solid rgba(248,113,113,0.2)' }}>OUT OF STOCK</span>}
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.35)', marginBottom: 3, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{p.brand}</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f0', marginBottom: 8 }}>{p.name}</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span className="font-display" style={{ fontSize: 26, color: '#f5f5f0' }}>₹{p.price.toLocaleString()}</span>
                          {p.originalPrice && <span style={{ fontSize: 13, color: 'rgba(245,245,240,0.25)', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString()}</span>}
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.2)', marginTop: 6 }}>
                          Sizes: {Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || '—'} · {p.images?.length ?? 0} image{p.images?.length !== 1 ? 's' : ''}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', borderLeft: '1px solid rgba(245,245,240,0.04)' }}>
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(p.id)} disabled={saving}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#22c55e', color: '#050505', border: 'none', fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap' }}>
                          <Check size={11} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={cancelEdit}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'transparent', color: 'rgba(245,245,240,0.3)', border: '1px solid rgba(245,245,240,0.08)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap' }}>
                          <X size={11} /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(p)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(245,245,240,0.04)', color: 'rgba(245,245,240,0.5)', border: '1px solid rgba(245,245,240,0.07)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f5f5f0'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,240,0.15)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(245,245,240,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,240,0.07)' }}>
                          <Edit3 size={11} /> Edit
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(248,113,113,0.06)', color: 'rgba(248,113,113,0.4)', border: '1px solid rgba(248,113,113,0.1)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.1)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.06)' }}>
                          <Trash2 size={11} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
