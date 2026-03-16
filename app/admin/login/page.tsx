'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true); setError('')
    setTimeout(() => {
      // 🔴 Change these credentials
      if (form.email.trim() === 'ADMIN_GMAIL' && form.password.trim() === 'ADMIN_PASSWORD') {
        localStorage.setItem('bv_admin', 'true')
        router.push('/admin')
      } else {
        setError('Invalid email or password.')
        setLoading(false)
      }
    }, 700)
  }

  const inp = { width: '100%', background: '#0a0a0a', border: '1px solid rgba(245,245,240,0.08)', padding: '14px 16px', fontSize: 14, color: '#f5f5f0', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Montserrat, sans-serif', transition: 'border-color 0.2s' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="font-display" style={{ fontSize: 32, color: '#f5f5f0', letterSpacing: '0.08em', marginBottom: 4 }}>BOOTS <span style={{ color: '#22c55e' }}>VAULT</span></p>
          <p style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.25)' }}>Admin Portal</p>
        </div>

        <div style={{ background: '#0d0d0d', border: '1px solid rgba(34,197,94,0.12)', padding: 36, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--green), transparent)' }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f5f5f0', marginBottom: 28, letterSpacing: '0.05em' }}>Sign In</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.3)', marginBottom: 8, fontWeight: 700 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@bootsvault.com" style={inp}
                onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.08)')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.3)', marginBottom: 8, fontWeight: 700 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="••••••••" style={{ ...inp, paddingRight: 48 }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(245,245,240,0.08)')} />
                <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,240,0.3)' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 14px', fontSize: 13, color: '#f87171' }}>{error}</div>}

            <button onClick={submit} disabled={loading} style={{ width: '100%', background: loading ? '#222' : '#22c55e', color: loading ? 'rgba(245,245,240,0.3)' : '#050505', padding: '15px 24px', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 0 24px rgba(34,197,94,0.3)', transition: 'all 0.3s' }}>
              <Zap size={14} fill={loading ? 'none' : 'currentColor'} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
