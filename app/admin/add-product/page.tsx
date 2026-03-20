'use client'

import { useState, useEffect } from 'react'
import { addProduct } from '@/lib/productService'
import { Plus, Trash2, Check, Upload } from 'lucide-react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const bootSizes = ['3','3.5','4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11']
const ballSizes = ['5']
const gloveSizes = ['7','8','9','10']
const apparelSizes = ['XS','S','M','L','XL']
const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Mizuno']
const categories = [
  { id: 'boots',           label: 'Boots' },
  { id: 'jerseys-jackets', label: 'Jerseys & Jackets' },
  { id: 'balls',           label: 'Balls' },
  { id: 'essentials',      label: 'Essentials' },
  { id: 'gloves',          label: 'Gloves' },
]
const bootSubCategories = [
  { id: 'trainers',  label: 'Trainers' },
  { id: 'FG', label: 'Firm Ground (FG)' },
  { id: 'SG', label: 'Soft Ground (SG)' },
  { id: 'AG', label: 'Artificial Ground(AG)'},
  { id: 'TF', label: 'Turf(TF)'},
]

const apparelSubCategories = [
  { id: 'all-jersey-jackets', label: 'All Jerseys & Jackets' },
  { id: 'jerseys', label: 'Jerseys' },
  { id: 'jackets', label: 'Jackets' },
]

const inp = {
  width: '100%', background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.07)',
  padding: '13px 16px', fontSize: 13, color: '#f5f5f0', outline: 'none',
  boxSizing: 'border-box' as const, fontFamily: 'Montserrat, sans-serif', transition: 'border-color 0.2s',
}

const lbl = {
  display: 'block' as const, fontSize: 9, letterSpacing: '0.3em',
  textTransform: 'uppercase' as const, color: 'rgba(245,245,240,0.25)', marginBottom: 8, fontWeight: 700,
}

const section = (color: string) => ({
  background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)',
  padding: 24, position: 'relative' as const, borderTop: `3px solid ${color}`,
})

export default function AddProductPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [images, setImages] = useState<string[]>(['', '', ''])
  const [uploadingIdxs, setUploadingIdxs] = useState<number[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', brand: brands[0], category: 'boots', subCategory: 'trainers',
    price: '', originalPrice: '', description: '', longDescription: '',
    inStock: true, featured: false, isNew: false,
  })

  useEffect(() => {
    if (form.category === 'balls') {
      setSelectedSizes(['5'])
    } else {
      setSelectedSizes([])
    }
  }, [form.category])

  const handle = (e: any) => {
    const { name, value, type, checked } = e.target

    if (name === 'category') {
      if (value === 'boots') {
        setSelectedSizes([]) // ✅ reset sizes
        setForm(f => ({
          ...f,
          category: value,
          subCategory: 'trainers'
        }))
        return
      }

      if (value === 'jerseys-jackets') {
        setSelectedSizes([]) // ✅ reset sizes
        setForm(f => ({
          ...f,
          category: value,
          subCategory: 'jerseys'
        }))
        return
      }
    }

    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addImageSlot = () => setImages(p => [...p, ''])
  const removeImageSlot = (i: number) => setImages(p => p.filter((_, idx) => idx !== i))
  const updateImage = (i: number, val: string) => setImages(p => p.map((img, idx) => idx === i ? val : img))
  const toggleSize = (s: string) => setSelectedSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const handleFileUpload = async (i: number, file: File) => {
    setUploadingIdxs(p => [...p, i])
    try {
      const storage = getStorage()
      const storageRef = ref(storage, `product-images/${Date.now()}_${i}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      updateImage(i, url)
    } catch (e) {
      console.error('Upload failed:', e)
      alert('Upload failed. Make sure Firebase Storage is enabled in Firebase Console → Storage.')
    }
    setUploadingIdxs(p => p.filter(x => x !== i))
  }

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
        subCategory: form.subCategory,
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
        rating: 4.5,
        reviewCount: 0,
        tags: [form.brand.toLowerCase(), form.category],
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      // reset form
      setForm({
        name: '',
        brand: brands[0],
        category: 'boots',
        subCategory: 'trainers',
        price: '',
        originalPrice: '',
        description: '',
        longDescription: '',
        inStock: true,
        featured: false,
        isNew: false,
      })

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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, color: '#f5f5f0', letterSpacing: '0.05em' }}>ADD PRODUCT</h1>
          <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.3)', marginTop: 4 }}>Add a new product to Boots Vault</p>
        </div>
        <button onClick={save} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: saved ? 'rgba(34,197,94,0.15)' : saving ? '#222' : '#22c55e', color: saved ? '#22c55e' : saving ? 'rgba(245,245,240,0.3)' : '#050505', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', transition: 'all 0.3s' }}>
          {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Basic Info */}
          <div style={section('#22c55e')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 20 }}>Basic Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div>
                <label style={lbl}>Product Name *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="e.g. Predator Elite FG" style={inp}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
              </div>

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

              {form.category === 'boots' && (
                <div>
                  <label style={lbl}>Boot Type</label>
                  <select name="subCategory" value={form.subCategory} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
                    {bootSubCategories.map(c => <option key={c.id} value={c.id} style={{ background: '#0d0d0d' }}>{c.label}</option>)}
                  </select>
                </div>
              )}

              {form.category === 'jerseys-jackets' && (
                <div>
                  <label style={lbl}>Apparel Type</label>
                  <select
                    name="subCategory"
                    value={form.subCategory}
                    onChange={handle}
                    style={inp}
                  >
                    <option value="jerseys">Jerseys</option>
                    <option value="jackets">Jackets</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Sale Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handle} placeholder="22499" style={inp}
                    onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
                </div>
                <div>
                  <label style={lbl}>Original MRP (₹)</label>
                  <input name="originalPrice" type="number" value={form.originalPrice} onChange={handle} placeholder="25999" style={inp}
                    onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
                </div>
              </div>

              <div>
                <label style={lbl}>Short Description</label>
                <input name="description" value={form.description} onChange={handle} placeholder="One-line hook for product cards" style={inp}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
              </div>

              <div>
                <label style={lbl}>Full Description</label>
                <textarea name="longDescription" value={form.longDescription} onChange={handle} rows={4} placeholder="Detailed product description..." style={{ ...inp, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div style={section('#d4af37')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0' }}>Product Images</h2>
              <button onClick={addImageSlot} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#d4af37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                <Plus size={12} /> Add Image
              </button>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(245,245,240,0.25)', marginBottom: 16 }}>Upload from your computer or paste a URL. First image is the main thumbnail.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {images.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

                  {/* Preview */}
                  <div style={{ width: 64, height: 64, background: '#0a0a0a', border: '1px solid rgba(245,245,240,0.07)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {uploadingIdxs.includes(i) ? (
                      <div style={{ width: 22, height: 22, border: '2px solid rgba(245,245,240,0.1)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : img ? (
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <Upload size={18} color="rgba(245,245,240,0.12)" />
                    )}
                  </div>

                  {/* Inputs */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>

                    {/* Upload button */}
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', background: uploadingIdxs.includes(i) ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', cursor: uploadingIdxs.includes(i) ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, color: uploadingIdxs.includes(i) ? 'rgba(34,197,94,0.4)' : '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Montserrat', transition: 'all 0.2s' }}>
                      <Upload size={13} />
                      {uploadingIdxs.includes(i) ? 'Uploading...' : 'Upload from Computer'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={uploadingIdxs.includes(i)}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(i, file)
                          e.target.value = ''
                        }}
                      />
                    </label>

                    {/* URL input */}
                    <input
                      value={img}
                      onChange={e => updateImage(i, e.target.value)}
                      placeholder="Or paste image URL here"
                      style={{ ...inp, fontSize: 12 }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')}
                    />
                  </div>

                  {/* Remove */}
                  {images.length > 1 && (
                    <button onClick={() => removeImageSlot(i)} style={{ padding: 8, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', cursor: 'pointer', color: '#f87171', flexShrink: 0, marginTop: 2 }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div style={section('#60a5fa')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 16 }}>
              {form.category === 'essentials' ? 'Sizes / Variants' : form.category === 'boots' || form.category === 'gloves' ? 'Available Sizes (UK)' : 'Available Sizes'}
              </h2>

            {form.category === 'essentials' ? (
              <div>
                <p style={{ fontSize: 11, color: 'rgba(245,245,240,0.25)', marginBottom: 12 }}>Type a size or colour and press Enter to add it.</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    id="essentials-input"
                    placeholder="e.g. Red, XL, One Size, 500ml..."
                    style={{ ...inp, flex: 1 }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(96,165,250,0.4)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.07)')}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim()
                        if (val && !selectedSizes.includes(val)) {
                          setSelectedSizes(p => [...p, val])
                        }
                          ;(e.target as HTMLInputElement).value = ''
                      }
                      }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('essentials-input') as HTMLInputElement
                      const val = input?.value.trim()
                      if (val && !selectedSizes.includes(val)) {
                        setSelectedSizes(p => [...p, val])
                        input.value = ''
                      }
                    }}
                    style={{ padding: '0 16px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap' }}>
                    + Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedSizes.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontSize: 12, fontWeight: 700 }}>
                      {s}
                      <button onClick={() => setSelectedSizes(p => p.filter(x => x !== s))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
                    </div>
                  ))}
                </div>
                </div>
            ) : form.category === 'balls' ? (
              <div>
                <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.35)' }}>Balls are always Size 5 — auto selected.</p>
                <div style={{ marginTop: 10, display: 'inline-block', padding: '8px 20px', background: '#22c55e', color: '#050505', fontSize: 13, fontWeight: 700 }}>Size 5</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(form.category === 'boots' || form.category === 'gloves' ? gloveSizes : apparelSizes).map(s => (
                  <button key={s} onClick={() => toggleSize(s)}
                    style={{ width: 52, height: 44, fontSize: 12, fontWeight: 700, background: selectedSizes.includes(s) ? '#22c55e' : 'transparent', color: selectedSizes.includes(s) ? '#050505' : 'rgba(245,245,240,0.4)', border: `1px solid ${selectedSizes.includes(s) ? '#22c55e' : 'rgba(245,245,240,0.08)'}`, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Montserrat' }}>
                    {s}
                  </button>
                  ))}
              </div>
            )}
            
            </div>

        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Flags */}
          <div style={section('#22c55e')}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0', marginBottom: 20 }}>Flags</h2>
            {[
              { key: 'inStock',  label: 'In Stock',    sub: 'Show as available' },
              { key: 'featured', label: 'Featured',    sub: 'Homepage spotlight' },
              { key: 'isNew',    label: 'New Arrival', sub: 'Show NEW badge' },
            ].map(({ key, label, sub }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.7)', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.25)', marginTop: 2 }}>{sub}</p>
                </div>
                <div style={{ width: 42, height: 22, borderRadius: 11, background: form[key as keyof typeof form] ? '#22c55e' : 'rgba(245,245,240,0.08)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, boxShadow: form[key as keyof typeof form] ? '0 0 10px rgba(34,197,94,0.3)' : 'none' }}>
                  <input type="checkbox" name={key} checked={!!form[key as keyof typeof form]} onChange={handle} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', margin: 0 }} />
                  <span style={{ position: 'absolute', top: 3, left: form[key as keyof typeof form] ? 23 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </label>
            ))}
          </div>

          <button onClick={save} disabled={saving}
            style={{ width: '100%', padding: 14, background: saved ? 'rgba(34,197,94,0.15)' : saving ? '#222' : '#22c55e', color: saved ? '#22c55e' : saving ? 'rgba(245,245,240,0.3)' : '#050505', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', transition: 'all 0.3s' }}>
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Product'}
          </button>

        </div>
      </div>
    </div>
  )
}