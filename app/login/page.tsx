'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, AuthError } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useAuth } from '@/lib/authContext'
import { Phone, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Mode = 'options' | 'phone' | 'phone-otp'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>('options')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmResult, setConfirmResult] = useState<any>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => { if (user) router.push('/account') }, [user])

  const friendlyError = (e: AuthError) => {
    const map: Record<string, string> = {
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/invalid-verification-code': 'Invalid OTP. Please try again.',
      'auth/invalid-phone-number': 'Enter a valid phone number with country code (+91...).',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/popup-blocked': 'Popup blocked. Please allow popups for this site.',
    }
    return map[(e as AuthError).code] || 'Something went wrong. Please try again.'
  }

  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/account')
    } catch (e) { setError(friendlyError(e as AuthError)) }
    setLoading(false)
  }

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

  const handleVerifyOtp = async () => {
    setError(''); setLoading(true)
    try {
      await confirmResult.confirm(otp)
      router.push('/account')
    } catch (e) { setError(friendlyError(e as AuthError)) }
    setLoading(false)
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#0f0f0f', border: '1px solid rgba(242,242,237,0.1)',
    padding: '16px', fontSize: 16, color: '#f2f2ed', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'Montserrat, sans-serif', transition: 'border-color 0.2s',
    borderRadius: 0,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', paddingTop: 88, fontFamily: 'Montserrat, sans-serif' }}>

      {/* Glow */}
      <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '80vw', height: '80vw', maxWidth: 500, maxHeight: 500, background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div id="recaptcha-container" style={{ position: 'absolute' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 10 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f2f2ed', letterSpacing: '0.08em' }}>
              BOOTS <span style={{ color: '#22c55e' }}>VAULT</span>
            </span>
          </Link>
        </div>

        <div style={{ background: '#0d0d0d', border: '1px solid rgba(34,197,94,0.12)', padding: '28px 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #22c55e, rgba(212,175,55,0.4), transparent)' }} />

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#f87171', lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          {/* OPTIONS */}
          {mode === 'options' && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f2f2ed', marginBottom: 6 }}>Welcome back</h2>
              <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.35)', marginBottom: 28, lineHeight: 1.6 }}>Sign in to track your orders and manage your account.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Google */}
                <button onClick={handleGoogle} disabled={loading}
                  style={{ width: '100%', padding: '16px', background: 'rgba(242,242,237,0.04)', border: '1px solid rgba(242,242,237,0.12)', color: '#f2f2ed', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: 'Montserrat', transition: 'all 0.2s', opacity: loading ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.3)' }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.12)'}>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(242,242,237,0.07)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(242,242,237,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>or</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(242,242,237,0.07)' }} />
                </div>

                {/* Phone */}
                <button onClick={() => { setMode('phone'); setError('') }} disabled={loading}
                  style={{ width: '100%', padding: '16px', background: 'rgba(242,242,237,0.04)', border: '1px solid rgba(242,242,237,0.12)', color: '#f2f2ed', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.12)'}>
                  <Phone size={18} color="rgba(242,242,237,0.55)" />
                  Continue with Phone OTP
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(242,242,237,0.18)', marginTop: 24, lineHeight: 1.7 }}>
                By continuing, you agree to our{' '}
                <Link href="/terms-of-service" style={{ color: 'rgba(34,197,94,0.6)', textDecoration: 'none' }}>Terms</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" style={{ color: 'rgba(34,197,94,0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
              </p>
            </>
          )}

          {/* PHONE */}
          {mode === 'phone' && (
            <>
              <button onClick={() => { setMode('options'); setError('') }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(242,242,237,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontFamily: 'Montserrat', fontWeight: 700, letterSpacing: '0.12em', padding: 0, textTransform: 'uppercase' }}>
                <ArrowLeft size={13} /> Back
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f2f2ed', marginBottom: 8 }}>Phone Sign In</h2>
              <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.35)', marginBottom: 24, lineHeight: 1.6 }}>Enter your number and we'll send a one-time code.</p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(242,242,237,0.3)', marginBottom: 8, fontWeight: 700 }}>Phone Number</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  type="tel"
                  inputMode="tel"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(242,242,237,0.1)')}
                  onKeyDown={e => e.key === 'Enter' && phone && handleSendOtp()}
                />
                <p style={{ fontSize: 11, color: 'rgba(242,242,237,0.2)', marginTop: 6 }}>Include country code — e.g. +91 for India</p>
              </div>

              <button onClick={handleSendOtp} disabled={loading || !phone}
                style={{ width: '100%', padding: '16px', background: loading ? '#1a1a1a' : '#22c55e', color: loading ? 'rgba(242,242,237,0.3)' : '#050505', border: 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading || !phone ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: !phone ? 0.5 : 1, transition: 'all 0.2s', boxShadow: !loading && phone ? '0 0 24px rgba(34,197,94,0.25)' : 'none' }}>
                {loading ? 'Sending...' : 'Send OTP'} {!loading && phone && <ArrowRight size={14} />}
              </button>
            </>
          )}

          {/* PHONE OTP */}
          {mode === 'phone-otp' && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f2f2ed', marginBottom: 8 }}>Enter OTP</h2>
              <p style={{ fontSize: 13, color: 'rgba(242,242,237,0.35)', marginBottom: 24, lineHeight: 1.6 }}>
                Code sent to <strong style={{ color: '#f2f2ed' }}>{phone}</strong>
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(242,242,237,0.3)', marginBottom: 8, fontWeight: 700 }}>6-digit OTP</label>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  style={{ ...inp, fontSize: 28, letterSpacing: '0.6em', textAlign: 'center' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(242,242,237,0.1)')}
                  onKeyDown={e => e.key === 'Enter' && otp.length === 6 && handleVerifyOtp()}
                  autoFocus
                />
              </div>

              <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6}
                style={{ width: '100%', padding: '16px', background: loading ? '#1a1a1a' : '#22c55e', color: loading ? 'rgba(242,242,237,0.3)' : '#050505', border: 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading || otp.length < 6 ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: otp.length < 6 ? 0.5 : 1, transition: 'all 0.2s', boxShadow: !loading && otp.length === 6 ? '0 0 24px rgba(34,197,94,0.25)' : 'none', marginBottom: 12 }}>
                {loading ? 'Verifying...' : 'Verify & Sign In'} {!loading && otp.length === 6 && <ArrowRight size={14} />}
              </button>

              <button onClick={() => { setMode('phone'); setOtp(''); setError('') }}
                style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid rgba(242,242,237,0.08)', fontSize: 12, color: 'rgba(242,242,237,0.35)', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,237,0.08)'}>
                ← Change number / Resend OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
