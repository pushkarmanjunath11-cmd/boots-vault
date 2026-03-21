'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { placeOrder } from '@/lib/orderService'
import { useAuth } from '@/lib/authContext'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronRight, ShoppingBag, Lock, ArrowLeft } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Step = 'contact' | 'shipping' | 'payment' | 'done'

const inp = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
  padding: '13px 16px', fontSize: 14, color: 'var(--white)', outline: 'none',
  boxSizing: 'border-box' as const, fontFamily: 'Montserrat, sans-serif',
  transition: 'border-color 0.2s',
}
const lbl = { display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(245,245,240,0.35)', marginBottom: 8, fontWeight: 700 }

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('contact')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: 'Maharashtra', pincode: '' })
  const cartTotal = total()

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'rgba(34,197,94,0.5)')
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = 'var(--border)')

  const handleStripeCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      // Create Stripe checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            name: `${i.product.brand} ${i.product.name} (UK ${i.selectedSize})`,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images[0],
          })),
          customerInfo: form,
          total: cartTotal,
        }),
      })
      const { sessionId, error: apiError } = await res.json()
      if (apiError) throw new Error(apiError)

      // Save order to Firebase before redirect
      await placeOrder({
        customer: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        pincode: form.pincode,
        items,
        total: cartTotal,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        paymentId: sessionId,
        paymentStatus: 'pending',
        userId: user?.uid,
      })

      // Redirect to Stripe
      const stripe = await stripePromise
      if (stripe && sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`
      }
    } catch (e: any) {
      setError(e?.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0 && step !== 'done') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}>
        <div style={{ textAlign: 'center' }}>
          <ShoppingBag size={60} strokeWidth={1} color="rgba(245,245,240,0.08)" style={{ margin: '0 auto 20px' }} />
          <h1 className="font-display" style={{ fontSize: 40, color: 'var(--white)', marginBottom: 16 }}>BAG IS EMPTY</h1>
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <div className="btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}>
              Shop Boots <ChevronRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 72, height: 72, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(34,197,94,0.5)' }}>
            <Check size={32} color="#050505" strokeWidth={3} />
          </div>
          <h1 className="font-display" style={{ fontSize: 72, color: 'var(--white)', lineHeight: 0.9, marginBottom: 20 }}>ORDER<br />PLACED!</h1>
          <p style={{ color: 'rgba(245,245,240,0.4)', lineHeight: 1.8, marginBottom: 32 }}>
            Your order <strong style={{ color: 'var(--green)', fontFamily: 'Space Mono' }}>{orderId.slice(0, 14)}</strong> is confirmed. We'll ship it within 24–48 hours.
          </p>
          <Link href="/shop" style={{ textDecoration: 'none' }}>
            <div className="btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}>
              Continue Shopping <ChevronRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    )
  }

  const steps: Step[] = ['contact', 'shipping', 'payment']

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 68 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: 28, color: 'var(--white)' }}>BOOTS <span style={{ color: 'var(--green)' }}>VAULT</span></span>
          </Link>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 48 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: step === s ? 'var(--green)' : steps.indexOf(step) > i ? 'rgba(34,197,94,0.2)' : 'var(--bg4)', border: `1px solid ${step === s ? 'var(--green)' : steps.indexOf(step) > i ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: step === s ? '#050505' : steps.indexOf(step) > i ? 'var(--green)' : 'rgba(245,245,240,0.3)' }}>
                  {steps.indexOf(step) > i ? <Check size={12} /> : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: step === s ? 'var(--white)' : 'rgba(245,245,240,0.3)' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 48, height: 1, background: 'var(--border)', margin: '0 16px' }} />}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#f87171' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 36, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--green), transparent)' }} />

            {step === 'contact' && (
              <>
                <h2 className="font-display" style={{ fontSize: 28, color: 'var(--white)', marginBottom: 28 }}>CONTACT</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><label style={lbl}>Full Name *</label><input name="name" value={form.name} onChange={handle} onFocus={focusStyle} onBlur={blurStyle} placeholder="Pushkar M" style={inp} /></div>
                  <div><label style={lbl}>Phone *</label><input name="phone" value={form.phone} onChange={handle} onFocus={focusStyle} onBlur={blurStyle} placeholder="+91 7996097779" style={inp} /></div>
                  <div><label style={lbl}>Email *</label><input name="email" type="email" value={form.email} onChange={handle} onFocus={focusStyle} onBlur={blurStyle} placeholder="bootsvault.in@gmail.com" style={inp} /></div>
                </div>
                <button onClick={() => form.name && form.phone && form.email && setStep('shipping')}
                  style={{ marginTop: 28, width: '100%', padding: '15px', fontFamily: 'Montserrat', cursor: 'pointer', opacity: form.name && form.phone && form.email ? 1 : 0.4 }}
                  className="btn-green">
                  Continue to Shipping →
                </button>
              </>
            )}

            {step === 'shipping' && (
              <>
                <h2 className="font-display" style={{ fontSize: 28, color: 'var(--white)', marginBottom: 28 }}>SHIPPING</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><label style={lbl}>Street Address *</label><input name="address" value={form.address} onChange={handle} onFocus={focusStyle} onBlur={blurStyle} placeholder="Flat / Building / Street" style={inp} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={lbl}>City *</label><input name="city" value={form.city} onChange={handle} onFocus={focusStyle} onBlur={blurStyle} placeholder="City" style={inp} /></div>
                    <div><label style={lbl}>PIN Code *</label><input name="pincode" value={form.pincode} onChange={handle} onFocus={focusStyle} onBlur={blurStyle} placeholder="400001" style={inp} /></div>
                  </div>
                  <div><label style={lbl}>State</label>
                    <select name="state" value={form.state} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
                      {['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Other'].map(s => <option key={s} value={s} style={{ background: 'var(--bg3)' }}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStep('contact')} style={{ padding: '15px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'rgba(245,245,240,0.4)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={() => form.address && form.city && form.pincode && setStep('payment')}
                    style={{ flex: 1, padding: '15px', fontFamily: 'Montserrat', cursor: 'pointer', opacity: form.address && form.city && form.pincode ? 1 : 0.4 }}
                    className="btn-green">
                    Continue to Payment →
                  </button>
                </div>
              </>
            )}

            {step === 'payment' && (
              <>
                <h2 className="font-display" style={{ fontSize: 28, color: 'var(--white)', marginBottom: 8 }}>PAYMENT</h2>
                <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.4)', marginBottom: 28 }}>You'll be redirected to Stripe's secure checkout to complete your payment.</p>

                {/* Order summary before payment */}
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 20, marginBottom: 24 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 16, fontWeight: 700 }}>Order Summary</p>
                  {[['Name', form.name], ['Phone', form.phone], ['Address', `${form.address}, ${form.city} - ${form.pincode}`]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                      <span style={{ color: 'rgba(245,245,240,0.35)' }}>{k}</span>
                      <span style={{ color: 'var(--white)', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Stripe badge */}
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <Lock size={14} color="var(--green)" />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>Secure Payment via Stripe</p>
                    <p style={{ fontSize: 11, color: 'rgba(245,245,240,0.35)' }}>256-bit SSL encryption. Your card details are never stored.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep('shipping')} style={{ padding: '15px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'rgba(245,245,240,0.4)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button onClick={handleStripeCheckout} disabled={loading}
                    style={{ flex: 1, padding: '15px', fontFamily: 'Montserrat', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#333' : 'var(--green)', color: loading ? 'rgba(245,245,240,0.4)' : '#050505', border: 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: loading ? 'none' : '0 0 30px rgba(34,197,94,0.3)' }}>
                    <Lock size={14} /> {loading ? 'Redirecting to Stripe...' : `Pay ₹${cartTotal.toLocaleString()}`}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 28, position: 'sticky', top: 88 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--green), transparent)' }} />
            <h3 className="font-display" style={{ fontSize: 20, color: 'var(--white)', letterSpacing: '0.08em', marginBottom: 24 }}>YOUR BAG</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}`} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 56, height: 56, background: 'var(--bg4)', position: 'relative', flexShrink: 0, border: '1px solid var(--border)' }}>
                    <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: 'var(--green)', borderRadius: '50%', fontSize: 9, fontWeight: 800, color: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--white)', lineHeight: 1.3 }}>{item.product.brand} {item.product.name}</p>
                    <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.3)', marginTop: 2 }}>UK {item.selectedSize}</p>
                  </div>
                  <span className="font-display" style={{ fontSize: 18, color: 'var(--white)', flexShrink: 0 }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,240,0.4)' }}>Subtotal</span>
                <span style={{ color: 'var(--white)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13 }}>
                <span style={{ color: 'rgba(245,245,240,0.4)' }}>Shipping</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="font-display" style={{ fontSize: 20, color: 'var(--white)' }}>TOTAL</span>
                <span className="font-display" style={{ fontSize: 28, color: 'var(--white)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
