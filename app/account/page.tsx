'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import { subscribeOrdersByUser, Order } from '@/lib/orderService'
import { useCartStore } from '@/lib/store'
import { subscribeProducts } from '@/lib/productService'
import { products as staticProducts } from '@/lib/data'
import { Product } from '@/types'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { LogOut, Package, ShoppingBag, ChevronDown, ChevronUp, RotateCcw, Loader2 } from 'lucide-react'

const statusSteps = ['pending', 'processing', 'shipped', 'delivered']

const statusColors: Record<string, string> = {
  pending:    '#eab308',
  processing: '#60a5fa',
  shipped:    '#c084fc',
  delivered:  '#22c55e',
  cancelled:  '#f87171',
}

const statusLabels: Record<string, string> = {
  pending:    'Order Placed',
  processing: 'Being Prepared',
  shipped:    'Out for Delivery',
  delivered:  'Delivered!',
  cancelled:  'Cancelled',
}

function OrderTimeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '0.2em', textTransform: 'uppercase' }}>✕ Order Cancelled</span>
      </div>
    )
  }

  const currentIdx = statusSteps.indexOf(status)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 16 }}>
      {statusSteps.map((step, i) => {
        const done = i <= currentIdx
        const active = i === currentIdx
        const color = done ? statusColors[step] : 'rgba(245,245,240,0.1)'

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < statusSteps.length - 1 ? 1 : 0 }}>
            {/* Step dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{
                width: active ? 14 : 10, height: active ? 14 : 10,
                borderRadius: '50%',
                background: done ? color : 'rgba(245,245,240,0.08)',
                border: `2px solid ${done ? color : 'rgba(245,245,240,0.1)'}`,
                boxShadow: active ? `0 0 12px ${color}` : 'none',
                transition: 'all 0.3s',
              }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: done ? color : 'rgba(245,245,240,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', textAlign: 'center', maxWidth: 60 }}>
                {statusLabels[step]}
              </span>
            </div>
            {/* Connector line */}
            {i < statusSteps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < currentIdx ? statusColors[statusSteps[i + 1]] : 'rgba(245,245,240,0.06)', margin: '0 4px', marginBottom: 24, transition: 'background 0.5s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>(staticProducts)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading])

  useEffect(() => {
    if (!user) return
    const unsub = subscribeOrdersByUser(user.uid, data => {
      setOrders(data); setLoadingOrders(false)
    })
    const unsub2 = subscribeProducts(data => { if (data.length > 0) setProducts(data) })
    return () => { unsub(); unsub2() }
  }, [user])

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId)
      if (product) addItem(product, item.selectedSize, item.selectedColor)
    })
    openCart()
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={24} color="#22c55e" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (!user) return null

  const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: 68, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#22c55e', marginBottom: 10, fontWeight: 700 }}>My Account</p>
            <h1 className="font-display" style={{ fontSize: 56, color: '#f5f5f0', lineHeight: 0.9, marginBottom: 12 }}>
              HEY,<br />{firstName.toUpperCase()}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.3)' }}>{user.email || user.phoneNumber}</p>
          </div>
          <button onClick={() => signOut(auth)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'none', border: '1px solid rgba(248,113,113,0.2)', color: 'rgba(248,113,113,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget).style.borderColor = 'rgba(248,113,113,0.4)'; (e.currentTarget).style.color = '#f87171' }}
            onMouseLeave={e => { (e.currentTarget).style.borderColor = 'rgba(248,113,113,0.2)'; (e.currentTarget).style.color = 'rgba(248,113,113,0.5)' }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 48 }}>
          {[
            { label: 'Total Orders', value: String(orders.length), color: '#22c55e' },
            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, color: '#d4af37' },
            { label: 'Delivered', value: String(orders.filter(o => o.status === 'delivered').length), color: '#60a5fa' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)', padding: '20px 24px', borderTop: `3px solid ${color}` }}>
              <p className="font-display" style={{ fontSize: 32, color: '#f5f5f0', marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-display" style={{ fontSize: 28, color: '#f5f5f0', letterSpacing: '0.05em', marginBottom: 20 }}>ORDER HISTORY</h2>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(245,245,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} color="#22c55e" /> Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)', padding: '60px 40px', textAlign: 'center' }}>
              <Package size={48} strokeWidth={1} color="rgba(245,245,240,0.08)" style={{ margin: '0 auto 16px' }} />
              <p className="font-display" style={{ fontSize: 28, color: 'rgba(245,245,240,0.1)', marginBottom: 12 }}>NO ORDERS YET</p>
              <p style={{ fontSize: 13, color: 'rgba(245,245,240,0.2)', marginBottom: 24 }}>Your order history will appear here.</p>
              <Link href="/shop" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#22c55e', color: '#050505', fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                  <ShoppingBag size={13} /> Shop Now
                </div>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map(order => {
                const isExpanded = expanded === order.id
                const statusColor = statusColors[order.status] || '#f5f5f0'
                const isCancelled = order.status === 'cancelled'

                return (
                  <div key={order.id} style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)', overflow: 'hidden' }}>

                    {/* Order header row */}
                    <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpanded(isExpanded ? null : order.id)}>
                      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        {/* Status dot */}
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor, boxShadow: `0 0 10px ${statusColor}`, flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#f5f5f0', marginBottom: 3 }}>
                            Order <span style={{ fontFamily: 'Space Mono', color: 'rgba(245,245,240,0.4)', fontSize: 11 }}>#{order.id.slice(0, 12)}</span>
                          </p>
                          <p style={{ fontSize: 11, color: 'rgba(245,245,240,0.25)' }}>{order.date} · {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: statusColor }}>{statusLabels[order.status]}</span>
                          <p className="font-display" style={{ fontSize: 22, color: '#f5f5f0', lineHeight: 1 }}>₹{order.total.toLocaleString()}</p>
                        </div>
                        {isExpanded ? <ChevronUp size={16} color="rgba(245,245,240,0.3)" /> : <ChevronDown size={16} color="rgba(245,245,240,0.3)" />}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(245,245,240,0.04)' }}>

                        {/* Timeline */}
                        <div style={{ paddingTop: 20, marginBottom: 24 }}>
                          <OrderTimeline status={order.status} />
                        </div>

                        {/* Items */}
                        <div style={{ background: '#111', border: '1px solid rgba(245,245,240,0.05)', padding: 16, marginBottom: 16 }}>
                          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.2)', marginBottom: 14, fontWeight: 700 }}>Items</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {order.items.map((item, i) => (
                              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                {item.productImage && (
                                  <img src={item.productImage} alt="" style={{ width: 44, height: 44, objectFit: 'cover', border: '1px solid rgba(245,245,240,0.06)', flexShrink: 0 }} />
                                )}
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: '#f5f5f0' }}>{item.productBrand} {item.productName}</p>
                                  <p style={{ fontSize: 11, color: 'rgba(245,245,240,0.3)', marginTop: 2 }}>UK {item.selectedSize} · Qty {item.quantity}</p>
                                </div>
                                <span className="font-display" style={{ fontSize: 18, color: '#f5f5f0' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery address */}
                        <div style={{ background: '#111', border: '1px solid rgba(245,245,240,0.05)', padding: 16, marginBottom: 16, fontSize: 12 }}>
                          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.2)', marginBottom: 10, fontWeight: 700 }}>Delivery Address</p>
                          <p style={{ color: 'rgba(245,245,240,0.6)', lineHeight: 1.8 }}>{order.address}</p>
                        </div>

                        {/* Reorder button */}
                        {!isCancelled && (
                          <button onClick={() => handleReorder(order)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s' }}
                            onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(34,197,94,0.15)' }}
                            onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(34,197,94,0.08)' }}>
                            <RotateCcw size={12} /> Reorder
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
