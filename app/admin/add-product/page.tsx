'use client'

import { useState } from 'react'
import { addProduct } from '@/lib/productService'
import { Plus, Trash2, Check, Image as ImageIcon } from 'lucide-react'

const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11']
const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Mizuno', 'Under Armour']
const categories = [
  { id: 'football-boots', label: 'Football Boots (FG/AG)' },
  { id: 'turf', label: 'Turf Boots (TF)' },
  { id: 'futsal', label: 'Futsal (IC)' },
]

const inp = { width: '100%', background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.07)', padding: '13px 16px', fontSize: 13, color: '#f5f5f0', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Montserrat, sans-serif', transition: 'border-color 0.2s' }
const lbl = { display: 'block', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(245,245,240,0.25)', marginBottom: 8, fontWeight: 700 }

const section = (color: string) => ({
  background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)', padding: 24, position: 'relative' as const,
  borderTop: `3px solid ${color}`,
})

export default function AddProductPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [images, setImages] = useState(['', '', ''])  // multiple image URLs
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', brand: brands[0], category: 'football-boots',
    price: '', originalPrice: '', description: '', longDescription: '',
    inStock: true, featured: false, isNew: false,
    rating: '4.5', reviewCount: '0',
  })

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const el = e.target as HTMLInputElement
    setForm(p => ({ ...p, [el.name]: el.type === 'checkbox' ? el.checked : el.value }))
  }

  const addImageSlot = () => setImages(p => [...p, ''])
  const removeImageSlot = (i: number) => setImages(p => p.filter((_, idx) => idx !== i))
  const updateImage = (i: number, val: string) => setImages(p => p.map((img, idx) => idx === i ? val : img))
  const toggleSize = (s: string) => setSelectedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const save = async () => {
    if (!form.name || !form.price || selectedSizes.length === 0) {
      alert('Please fill in name, price, and select at least one size.')
      return
    }
    setSaving(true)
    try {
      await addProduct({
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        images: images.filter(Boolean),
        sizes: selectedSizes,
        colors: [],
        description: form.description,
        longDescription: form.longDescription,
        inStock: form.inStock,
        featured: form.featured,
        isNew: form.isNew,
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
        tags: [form.brand.toLowerCase(), form.category],
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      // Reset
      setForm({ name: '', brand: brands[0], category: 'football-boots', price: '', originalPrice: '', description: '', longDescription: '', inStock: true, featured: false, isNew: false, rating: '4.5', reviewCount: '0' })
      setImages(['', '', ''])
      setSelectedSizes([])
    } catch (e) {
      console.error(e)
      alert('Failed to save product.')
    }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 960, color: '#f5f5f0', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, color: '#f5f5f0', letterSpacing: '0.05em' }}>ADD PRODUCT</h1>
          <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.3)', marginTop: 4 }}>Add a new boot to the Boots Vault store</p>
        </div>
        <button onClick={save} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: saved ? 'rgba(34,197,94,0.15)' : saving ? '#222' : '#22c55e', color: saved ? '#22c55e' : saving ? 'rgba(245,245,240,0.3)' : '#050505', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', boxShadow: saved || saving ? 'none' : '0 0 20px rgba(34,197,94,0.3)', transition: 'all 0.3s' }}>
          {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Basic Info */}
          <div style={section('#22c55e')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 20 }}>Basic Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Product Name *</label><input name="name" value={form.name} onChange={handle} placeholder="e.g. Mercurial Vapor 16 Elite FG" style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Brand *</label>
                  <select name="brand" value={form.brand} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
                    {brands.map(b => <option key={b} value={b} style={{ background: '#0d0d0d' }}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Category *</label>
                  <select name="category" value={form.category} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
                    {categories.map(c => <option key={c.id} value={c.id} style={{ background: '#0d0d0d' }}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={lbl}>Sale Price (₹) *</label><input name="price" type="number" value={form.price} onChange={handle} placeholder="22499" style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} /></div>
                <div><label style={lbl}>Original MRP (₹)</label><input name="originalPrice" type="number" value={form.originalPrice} onChange={handle} placeholder="25999" style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} /></div>
              </div>
              <div><label style={lbl}>Short Description</label><input name="description" value={form.description} onChange={handle} placeholder="One-line hook for product cards" style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} /></div>
              <div>
                <label style={lbl}>Full Description</label>
                <textarea name="longDescription" value={form.longDescription} onChange={handle} rows={4} placeholder="Detailed product description for the PDP..." style={{ ...inp, resize: 'none' }} onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
              </div>
            </div>
          </div>

          {/* Images — multiple URLs */}
          <div style={section('#d4af37')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0' }}>Product Images</h2>
              <button onClick={addImageSlot} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#d4af37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                <Plus size={12} /> Add Image
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(245,245,240,0.25)', marginBottom: 16 }}>Add image URLs — these will cycle in the PDP gallery. First image is the main thumbnail.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {images.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Preview */}
                  <div style={{ width: 48, height: 48, background: '#0a0a0a', border: '1px solid rgba(245,245,240,0.07)', flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {img ? (
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <ImageIcon size={16} color="rgba(245,245,240,0.15)" />
                    )}
                  </div>
                  <input value={img} onChange={e => updateImage(i, e.target.value)} placeholder={`Image ${i + 1} URL — paste link from Instagram or Google`}
                    style={{ ...inp, flex: 1 }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
                  {images.length > 1 && (
                    <button onClick={() => removeImageSlot(i)} style={{ padding: 8, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', cursor: 'pointer', color: '#f87171', flexShrink: 0 }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div style={section('#60a5fa')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 16 }}>Available Sizes (UK) *</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sizes.map(s => (
                <button key={s} onClick={() => toggleSize(s)}
                  style={{ width: 52, height: 44, fontSize: 12, fontWeight: 700, background: selectedSizes.includes(s) ? '#22c55e' : 'transparent', color: selectedSizes.includes(s) ? '#050505' : 'rgba(245,245,240,0.4)', border: `1px solid ${selectedSizes.includes(s) ? '#22c55e' : 'rgba(245,245,240,0.08)'}`, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Montserrat' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Flags */}
          <div style={section('#22c55e')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 20 }}>Flags</h2>
            {[
              { key: 'inStock', label: 'In Stock', sub: 'Show as available' },
              { key: 'featured', label: 'Featured', sub: 'Homepage spotlight' },
              { key: 'isNew', label: 'New Arrival', sub: 'Show NEW badge' },
            ].map(({ key, label, sub }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.7)', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.25)', marginTop: 2 }}>{sub}</p>
                </div>
                <div style={{ width: 42, height: 22, borderRadius: 11, background: form[key as keyof typeof form] ? '#22c55e' : 'rgba(245,245,240,0.08)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, boxShadow: form[key as keyof typeof form] ? '0 0 12px rgba(34,197,94,0.4)' : 'none' }}>
                  <input type="checkbox" name={key} checked={!!form[key as keyof typeof form]} onChange={handle} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', margin: 0 }} />
                  <span style={{ position: 'absolute', top: 3, left: form[key as keyof typeof form] ? 23 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </label>
            ))}
          </div>

          {/* Rating */}
          <div style={section('#d4af37')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 16 }}>Display Rating</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={lbl}>Rating (1–5)</label><input name="rating" type="number" min="1" max="5" step="0.1" value={form.rating} onChange={handle} style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} /></div>
              <div><label style={lbl}>Review Count</label><input name="reviewCount" type="number" value={form.reviewCount} onChange={handle} style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} /></div>
            </div>
          </div>

          <button onClick={save} disabled={saving}
            style={{ width: '100%', padding: 14, background: saved ? 'rgba(34,197,94,0.15)' : saving ? '#222' : '#22c55e', color: saved ? '#22c55e' : saving ? 'rgba(245,245,240,0.3)' : '#050505', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', boxShadow: saved || saving ? 'none' : '0 0 20px rgba(34,197,94,0.25)', transition: 'all 0.3s' }}>
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}
