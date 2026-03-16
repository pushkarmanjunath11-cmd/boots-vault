'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup, AuthError } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useAuth } from '@/lib/authContext'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (user) router.push('/account') }, [user])

  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/account')
    } catch (e) {
      const err = e as AuthError
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Sign in failed. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', paddingTop:88, fontFamily:'Montserrat,sans-serif' }}>

      <div style={{ position:'fixed', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:500, background:'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:10 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:'#f2f2ed', letterSpacing:'0.08em' }}>
              BOOTS <span style={{ color:'#22c55e' }}>VAULT</span>
            </span>
          </Link>
        </div>

        <div style={{ background:'#0d0d0d', border:'1px solid rgba(34,197,94,0.12)', padding:'32px 28px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, #22c55e, rgba(212,175,55,0.4), transparent)' }} />

          <h2 style={{ fontSize:22, fontWeight:800, color:'#f2f2ed', marginBottom:6 }}>Welcome back</h2>
          <p style={{ fontSize:13, color:'rgba(242,242,237,0.35)', marginBottom:28, lineHeight:1.6 }}>
            Sign in to track your orders and manage your account.
          </p>

          {error && (
            <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', padding:'12px 14px', marginBottom:20, fontSize:13, color:'#f87171', lineHeight:1.5 }}>
              {error}
            </div>
          )}

          <button onClick={handleGoogle} disabled={loading}
            style={{ width:'100%', padding:'16px', background: loading ? 'rgba(242,242,237,0.04)' : 'rgba(242,242,237,0.06)', border:'1px solid rgba(242,242,237,0.14)', color:'#f2f2ed', fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:14, fontFamily:'Montserrat', transition:'all 0.2s', opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.borderColor='rgba(242,242,237,0.3)' }}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(242,242,237,0.14)'}>
            {loading ? (
              <>
                <div style={{ width:20, height:20, border:'2px solid rgba(242,242,237,0.2)', borderTopColor:'#22c55e', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p style={{ textAlign:'center', fontSize:11, color:'rgba(242,242,237,0.18)', marginTop:24, lineHeight:1.7 }}>
            By continuing you agree to our{' '}
            <Link href="/terms-of-service" style={{ color:'rgba(34,197,94,0.6)', textDecoration:'none' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy-policy" style={{ color:'rgba(34,197,94,0.6)', textDecoration:'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}