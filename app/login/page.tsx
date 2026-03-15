'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signInWithPhoneNumber,
  RecaptchaVerifier, updateProfile, AuthError
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useAuth } from '@/lib/authContext'
import { Eye, EyeOff, Phone, Mail, Chrome, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Mode = 'options' | 'email' | 'phone' | 'phone-otp'
type EmailMode = 'login' | 'signup'

const inp = {
  width: '100%', background: '#0a0a0a', border: '1px solid rgba(245,245,240,0.08)',
  padding: '14px 16px', fontSize: 14, color: '#f5f5f0', outline: 'none',
  boxSizing: 'border-box' as const, fontFamily: 'Montserrat, sans-serif', transition: 'border-color 0.2s',
}
const lbl = { display: 'block' as const, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(245,245,240,0.3)', marginBottom: 8, fontWeight: 700 }

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>('options')
  const [emailMode, setEmailMode] = useState<EmailMode>('login')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Email form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Phone form
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmResult, setConfirmResult] = useState<any>(null)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  // Redirect if already logged in
  useEffect(() => { if (user) router.push('/account') }, [user])

  const friendlyError = (e: AuthError) => {
    const map: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
      'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
    }
    return map[e.code] || e.message
  }

  // ── Email / Password ──
  const handleEmail = async () => {
    setError(''); setLoading(true)
    try {
      if (emailMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) await updateProfile(cred.user, { displayName: name })
      }
      router.push('/account')
    } catch (e) { setError(friendlyError(e as AuthError)) }
    setLoading(false)
  }

  // ── Google ──
  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/account')
    } catch (e) { setError(friendlyError(e as AuthError)) }
    setLoading(false)
  }

  // ── Phone — send OTP ──
  const handleSendOtp = async () => {
    setError(''); setLoading(true)
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
      }
      const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifierRef.current)
      setConfirmResult(result)
      setMode('phone-otp')
    } catch (e) { setError(friendlyError(e as AuthError)) }
    setLoading(false)
  }

  // ── Phone — verify OTP ──
  const handleVerifyOtp = async () => {
    setError(''); setLoading(true)
    try {
      await confirmResult.confirm(otp)
      router.push('/account')
    } catch (e) { setError(friendlyError(e as AuthError)) }
    setLoading(false)
  }

  const focusOn = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')
  const focusOff = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(245,245,240,0.08)')

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', fontFamily: 'Montserrat, sans-serif', paddingTop: 108 }}>

      {/* Glow */}
      <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Invisible recaptcha */}
      <div id="recaptcha-container" ref={recaptchaRef} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: 28, color: '#f5f5f0' }}>
              BOOTS <span style={{ color: '#22c55e' }}>VAULT</span>
            </span>
          </Link>
        </div>

        <div style={{ background: '#0d0d0d', border: '1px solid rgba(34,197,94,0.1)', padding: 36, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #22c55e, transparent)' }} />

          {error && (
            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#f87171', borderRadius: 0 }}>
              {error}
            </div>
          )}

          {/* ── OPTIONS ── */}
          {mode === 'options' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f5f5f0', marginBottom: 6 }}>Welcome back</h2>
              <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.35)', marginBottom: 28 }}>Sign in to track your orders</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Google */}
                <button onClick={handleGoogle} disabled={loading} style={{ width: '100%', padding: '14px 16px', background: 'rgba(245,245,240,0.04)', border: '1px solid rgba(245,245,240,0.1)', color: '#f5f5f0', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,245,240,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,245,240,0.1)')}>
                  <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                  Continue with Google
                </button>

                {/* Email */}
                <button onClick={() => { setMode('email'); setError('') }} style={{ width: '100%', padding: '14px 16px', background: 'rgba(245,245,240,0.04)', border: '1px solid rgba(245,245,240,0.1)', color: '#f5f5f0', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,245,240,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,245,240,0.1)')}>
                  <Mail size={18} color="rgba(245,245,240,0.5)" /> Continue with Email
                </button>

                {/* Phone */}
                <button onClick={() => { setMode('phone'); setError('') }} style={{ width: '100%', padding: '14px 16px', background: 'rgba(245,245,240,0.04)', border: '1px solid rgba(245,245,240,0.1)', color: '#f5f5f0', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,245,240,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,245,240,0.1)')}>
                  <Phone size={18} color="rgba(245,245,240,0.5)" /> Continue with Phone OTP
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(245,245,240,0.2)', marginTop: 24, lineHeight: 1.7 }}>
                By continuing, you agree to our terms of service and privacy policy.
              </p>
            </>
          )}

          {/* ── EMAIL ── */}
          {mode === 'email' && (
            <>
              <button onClick={() => { setMode('options'); setError('') }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(245,245,240,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontFamily: 'Montserrat', fontWeight: 700, letterSpacing: '0.1em', padding: 0 }}>
                <ArrowLeft size={13} /> Back
              </button>

              {/* Login / Signup toggle */}
              <div style={{ display: 'flex', marginBottom: 24, border: '1px solid rgba(245,245,240,0.08)' }}>
                {(['login', 'signup'] as EmailMode[]).map(m => (
                  <button key={m} onClick={() => { setEmailMode(m); setError('') }}
                    style={{ flex: 1, padding: '10px', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', background: emailMode === m ? '#22c55e' : 'transparent', color: emailMode === m ? '#050505' : 'rgba(245,245,240,0.35)', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s' }}>
                    {m === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {emailMode === 'signup' && (
                  <div>
                    <label style={lbl}>Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                )}
                <div>
                  <label style={lbl}>Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inp} onFocus={focusOn} onBlur={focusOff} />
                </div>
                <div>
                  <label style={lbl}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()} placeholder="••••••••" style={{ ...inp, paddingRight: 48 }} onFocus={focusOn} onBlur={focusOff} />
                    <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,240,0.3)' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={handleEmail} disabled={loading || !email || !password}
                style={{ marginTop: 24, width: '100%', padding: '15px', background: loading ? '#222' : '#22c55e', color: loading ? 'rgba(245,245,240,0.3)' : '#050505', border: 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : '0 0 24px rgba(34,197,94,0.25)', transition: 'all 0.3s', opacity: !email || !password ? 0.5 : 1 }}>
                {loading ? 'Please wait...' : emailMode === 'login' ? 'Sign In' : 'Create Account'} {!loading && <ArrowRight size={14} />}
              </button>
            </>
          )}

          {/* ── PHONE ── */}
          {mode === 'phone' && (
            <>
              <button onClick={() => { setMode('options'); setError('') }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(245,245,240,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontFamily: 'Montserrat', fontWeight: 700, letterSpacing: '0.1em', padding: 0 }}>
                <ArrowLeft size={13} /> Back
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f5f5f0', marginBottom: 6 }}>Phone Sign In</h2>
              <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.35)', marginBottom: 24 }}>We'll send a one-time code to your number.</p>
              <div>
                <label style={lbl}>Phone Number (with country code)</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" style={inp} onFocus={focusOn} onBlur={focusOff} onKeyDown={e => e.key === 'Enter' && handleSendOtp()} />
                <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.2)', marginTop: 6 }}>Include country code e.g. +91 for India</p>
              </div>
              <button onClick={handleSendOtp} disabled={loading || !phone}
                style={{ marginTop: 20, width: '100%', padding: '15px', background: loading ? '#222' : '#22c55e', color: loading ? 'rgba(245,245,240,0.3)' : '#050505', border: 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: !phone ? 0.5 : 1 }}>
                {loading ? 'Sending OTP...' : 'Send OTP'} {!loading && <ArrowRight size={14} />}
              </button>
            </>
          )}

          {/* ── PHONE OTP ── */}
          {mode === 'phone-otp' && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f5f5f0', marginBottom: 6 }}>Enter OTP</h2>
              <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.35)', marginBottom: 24 }}>
                Code sent to <strong style={{ color: '#f5f5f0' }}>{phone}</strong>
              </p>
              <div>
                <label style={lbl}>6-digit OTP</label>
                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} style={{ ...inp, fontSize: 24, letterSpacing: '0.5em', textAlign: 'center' }} onFocus={focusOn} onBlur={focusOff} onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()} />
              </div>
              <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6}
                style={{ marginTop: 20, width: '100%', padding: '15px', background: loading ? '#222' : '#22c55e', color: loading ? 'rgba(245,245,240,0.3)' : '#050505', border: 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: otp.length < 6 ? 0.5 : 1 }}>
                {loading ? 'Verifying...' : 'Verify & Sign In'} {!loading && <ArrowRight size={14} />}
              </button>
              <button onClick={() => { setMode('phone'); setOtp(''); setError('') }} style={{ width: '100%', marginTop: 10, padding: '10px', background: 'none', border: 'none', fontSize: 12, color: 'rgba(245,245,240,0.3)', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                Resend OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
