'use client'

import { useEffect, useState } from 'react'
import { subscribeOrders, Order } from '@/lib/orderService'
import { subscribeProducts } from '@/lib/productService'
import { TrendingUp, ShoppingBag, Package, IndianRupee, ArrowUpRight, Loader2 } from 'lucide-react'

const statusColors: Record<string, { bg: string; color: string }> = {
  pending:    { bg: 'rgba(234,179,8,0.1)',  color: '#eab308' },
  processing: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa' },
  shipped:    { bg: 'rgba(168,85,247,0.1)', color: '#c084fc' },
  delivered:  { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e' },
  cancelled:  { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u1 = subscribeOrders(data => { setOrders(data); setLoading(false) })
    const u2 = subscribeProducts(data => setProductCount(data.length))
    return () => { u1(); u2() }
  }, [])

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const delivered = orders.filter(o => o.status === 'delivered').length
  const pending = orders.filter(o => o.status === 'pending').length

  const stats = [
    { label: 'Revenue', value: revenue >= 100000 ? `₹${(revenue / 100000).toFixed(1)}L` : `₹${revenue.toLocaleString()}`, icon: IndianRupee, color: '#22c55e', sub: 'All time' },
    { label: 'Orders', value: String(orders.length), icon: ShoppingBag, color: '#60a5fa', sub: `${pending} pending` },
    { label: 'Products', value: String(productCount), icon: Package, color: '#d4af37', sub: 'In store' },
    { label: 'Delivered', value: String(delivered), icon: TrendingUp, color: '#c084fc', sub: 'Completed' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, color: '#f5f5f0', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 36, color: '#f5f5f0', letterSpacing: '0.05em' }}>DASHBOARD</h1>
          <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.3)', marginTop: 4 }}>Boots Vault — Live Overview</p>
        </div>
        {loading && <Loader2 size={18} color="#22c55e" style={{ animation: 'spin 1s linear infinite' }} />}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)', padding: 24, position: 'relative', overflow: 'hidden', borderTop: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
              <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 700, letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpRight size={10} /> LIVE
              </span>
            </div>
            <p className="font-display" style={{ fontSize: 32, color: '#f5f5f0', lineHeight: 1 }}>{loading ? '—' : value}</p>
            <p style={{ fontSize: 9, color: 'rgba(245,245,240,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>{label}</p>
            <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.2)', marginTop: 2 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {['pending','processing','shipped','delivered','cancelled'].map(s => {
          const count = orders.filter(o => o.status === s).length
          const st = statusColors[s]
          return (
            <div key={s} style={{ background: st.bg, border: `1px solid ${st.color}25`, padding: '14px 16px' }}>
              <p className="font-display" style={{ fontSize: 28, color: st.color }}>{count}</p>
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: st.color, opacity: 0.7, marginTop: 4 }}>{s}</p>
            </div>
          )
        })}
      </div>

      {/* Recent orders */}
      <div style={{ background: '#0d0d0d', border: '1px solid rgba(245,245,240,0.05)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(245,245,240,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f5f5f0' }}>
            Recent Orders <span style={{ color: '#22c55e', fontSize: 10, fontWeight: 400 }}>● live</span>
          </h2>
          <a href="/admin/orders" style={{ fontSize: 10, color: '#22c55e', textDecoration: 'none', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>View All →</a>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(245,245,240,0.3)', fontSize: 13 }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <p className="font-display" style={{ fontSize: 24, color: 'rgba(245,245,240,0.08)', marginBottom: 8 }}>NO ORDERS YET</p>
            <p style={{ fontSize: 12, color: 'rgba(245,245,240,0.2)' }}>Orders from the store will appear here in real-time</p>
          </div>
        ) : orders.slice(0, 8).map((o, i, arr) => {
          const s = statusColors[o.status]
          return (
            <div key={o.id} style={{ padding: '14px 24px', borderBottom: i < arr.length - 1 ? '1px solid rgba(245,245,240,0.04)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#f5f5f0' }}>{o.customer}</p>
                <p style={{ fontSize: 10, color: 'rgba(245,245,240,0.2)', marginTop: 2, fontFamily: 'Space Mono' }}>{o.id.slice(0, 16)} · {o.date} · {o.itemCount} pairs</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ background: s.bg, color: s.color, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700, border: `1px solid ${s.color}33` }}>{o.status}</span>
                <span className="font-display" style={{ fontSize: 22, color: '#f5f5f0' }}>₹{o.total.toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
