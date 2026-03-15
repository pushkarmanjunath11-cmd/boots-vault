'use client'

import { useEffect, useState } from 'react'
import { subscribeOrders, updateOrderStatus, deleteOrder, Order, OrderStatus } from '@/lib/orderService'
import { Search, ChevronDown, ChevronUp, Trash2, Loader2 } from 'lucide-react'
import Image from 'next/image'

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  pending:    { bg: 'rgba(234,179,8,0.08)',   color: '#eab308', border: 'rgba(234,179,8,0.2)' },
  processing: { bg: 'rgba(96,165,250,0.08)',  color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
  shipped:    { bg: 'rgba(168,85,247,0.08)',  color: '#c084fc', border: 'rgba(168,85,247,0.2)' },
  delivered:  { bg: 'rgba(34,197,94,0.08)',   color: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  cancelled:  { bg: 'rgba(248,113,113,0.08)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
}

const tabs: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const unsub = subscribeOrders(data => { setOrders(data); setLoading(false) })
    return () => unsub()
  }, [])

  const filtered = orders.filter(o => {
    if (tab !== 'all' && o.status !== tab) return false
    if (search) {
      const q = search.toLowerCase()
      return o.customer.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.city?.toLowerCase().includes(q)
    }
    return true
  })

  const handleStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id)
    await updateOrderStatus(id, status)
    setUpdating(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return
    await deleteOrder(id)
    if (expanded === id) setExpanded(null)
  }

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <div style={{ color: '#f5f5f0', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, color: '#f5f5f0', letterSpacing: '0.05em' }}>ORDERS</h1>
          <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.3)', marginTop: 4 }}>
            {orders.length} total · ₹{revenue.toLocaleString()} revenue
            <span style={{ marginLeft: 10, color: '#22c55e', fontSize: 10 }}>● live</span>
          </p>
        </div>
        {loading && <Loader2 size={18} color="#22c55e" style={{ animation: 'spin 1s linear infinite' }} />}
      </div>

      {/* Tabs + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16 }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tabs.map(t => {
            const count = t.key === 'all' ? orders.length : orders.filter(o => o.status === t.key).length
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ padding: '7px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', background: active ? '#22c55e' : 'transparent', color: active ? '#050505' : 'rgba(245,245,240,0.35)', border: `1px solid ${active ? '#22c55e' : 'rgba(245,245,240,0.08)'}`, cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s' }}>
                {t.label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
              </button>
            )
          })}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="rgba(245,245,240,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, city..." style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.07)', padding: '9px 16px 9px 36px', fontSize: 12, color: '#f5f5f0', outline: 'none', width: 240, fontFamily: 'Montserrat' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 140px 36px 36px', gap: 12, padding: '10px 20px', borderBottom: '1px solid rgba(245,245,240,0.05)' }}>
          {['Customer', 'Date', 'Total', 'Status', '', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.2)', fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(245,245,240,0.3)', fontSize: 13 }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <p className="font-display" style={{ fontSize: 28, color: 'rgba(245,245,240,0.08)', marginBottom: 8 }}>NO ORDERS</p>
            <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.2)' }}>{search ? 'Try a different search' : 'No orders in this category yet'}</p>
          </div>
        ) : filtered.map((order, i) => {
          const s = statusColors[order.status]
          const isExpanded = expanded === order.id
          const isUpdating = updating === order.id

          return (
            <div key={order.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(245,245,240,0.04)' : 'none' }}>
              {/* Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 140px auto 36px 36px', gap: 12, padding: '14px 20px', alignItems: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,245,240,0.015)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                {/* Customer */}
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f5f5f0', marginBottom: 2 }}>{order.customer}</p>
                  <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.25)', fontFamily: 'Space Mono' }}>{order.id.slice(0, 14)}…</p>
                  <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.2)', marginTop: 2 }}>{order.city} · {order.itemCount} pair{order.itemCount !== 1 ? 's' : ''}</p>
                </div>

                {/* Date */}
                <span style={{ fontSize: 12, color: 'rgba(245,245,240,0.35)' }}>{order.date}</span>

                {/* Total */}
                <span className="font-display" style={{ fontSize: 20, color: '#f5f5f0' }}>₹{order.total.toLocaleString()}</span>

                {/* Status dropdown */}
                <div style={{ position: 'relative' }}>
                  <select value={order.status} onChange={e => handleStatus(order.id, e.target.value as OrderStatus)} disabled={isUpdating}
                    style={{ width: '100%', appearance: 'none', background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '6px 28px 6px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', outline: 'none', fontFamily: 'Montserrat', borderRadius: 0, opacity: isUpdating ? 0.5 : 1 }}>
                    {statuses.map(st => <option key={st} value={st} style={{ background: '#0d0d0d', color: '#f5f5f0', textTransform: 'capitalize' }}>{st}</option>)}
                  </select>
                  <ChevronDown size={10} color={s.color} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>

                {/* Quick Approve / Dismiss — only show for pending */}
                {order.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleStatus(order.id, 'processing')} disabled={isUpdating}
                      style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.2)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.12)'}>
                      ✓ Approve
                    </button>
                    <button onClick={() => handleStatus(order.id, 'cancelled')} disabled={isUpdating}
                      style={{ padding: '6px 12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', fontSize: 9, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.15)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)'}>
                      ✕ Dismiss
                    </button>
                  </div>
                )}

                {/* Expand */}
                <button onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{ width: 32, height: 32, background: isExpanded ? 'rgba(34,197,94,0.1)' : 'rgba(245,245,240,0.04)', border: `1px solid ${isExpanded ? 'rgba(34,197,94,0.2)' : 'rgba(245,245,240,0.06)'}`, cursor: 'pointer', color: isExpanded ? '#22c55e' : 'rgba(245,245,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {/* Delete */}
                <button onClick={() => handleDelete(order.id)}
                  style={{ width: 32, height: 32, background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.1)', cursor: 'pointer', color: 'rgba(248,113,113,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.1)'; (e.currentTarget as HTMLElement).style.color = '#f87171' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.4)' }}>
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(245,245,240,0.04)', background: 'rgba(245,245,240,0.01)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, paddingTop: 20 }}>

                    {/* Contact & Address */}
                    <div style={{ background: '#111', border: '1px solid rgba(245,245,240,0.05)', padding: 20 }}>
                      <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.25)', marginBottom: 14, fontWeight: 700 }}>Contact & Delivery</p>
                      {[
                        ['Name', order.customer],
                        ['Email', order.email],
                        ['Phone', order.phone],
                        ['Address', order.address],
                        ['City', order.city],
                      ].map(([k, v]) => v && (
                        <div key={k} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(245,245,240,0.04)', fontSize: 12 }}>
                          <span style={{ color: 'rgba(245,245,240,0.25)', minWidth: 60 }}>{k}</span>
                          <span style={{ color: '#f5f5f0', fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                      {order.paymentStatus && (
                        <div style={{ display: 'flex', gap: 12, padding: '6px 0', fontSize: 12, marginTop: 8 }}>
                          <span style={{ color: 'rgba(245,245,240,0.25)', minWidth: 60 }}>Payment</span>
                          <span style={{ color: order.paymentStatus === 'paid' ? '#22c55e' : '#eab308', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.1em' }}>{order.paymentStatus}</span>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div style={{ background: '#111', border: '1px solid rgba(245,245,240,0.05)', padding: 20 }}>
                      <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.25)', marginBottom: 14, fontWeight: 700 }}>Items Ordered</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            {item.productImage && (
                              <div style={{ width: 40, height: 40, background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.06)', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                                <img src={item.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: '#f5f5f0', lineHeight: 1.3 }}>{item.productBrand} {item.productName}</p>
                              <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.3)', marginTop: 2 }}>UK {item.selectedSize} · Qty {item.quantity}</p>
                            </div>
                            <span className="font-display" style={{ fontSize: 18, color: '#f5f5f0', flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '1px solid rgba(245,245,240,0.06)', marginTop: 14, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'rgba(245,245,240,0.35)' }}>Order Total</span>
                        <span className="font-display" style={{ fontSize: 24, color: '#22c55e' }}>₹{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
