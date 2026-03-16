'use client'

export default function ShippingPage() {
  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'clamp(32px,5vw,60px) clamp(20px,4vw,40px)' }}>
        <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:12, fontWeight:700 }}>Delivery</p>
        <h1 className="font-display" style={{ fontSize:'clamp(48px,8vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:40 }}>SHIPPING<br />POLICY</h1>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {[
            { title:'Processing Time', content:'All orders are processed within 24–48 hours of payment confirmation. Orders placed on weekends or public holidays are processed the next working day. You will receive a confirmation once your order is dispatched.' },
            { title:'Delivery Time', content:'Standard delivery across India takes 4–7 business days. Metro cities typically receive orders within 3–4 days. Remote areas may take up to 10 days.' },
            { title:'Shipping Charges', content:'We offer FREE shipping on all orders across India. No minimum order value. The price you see is the price you pay.' },
            { title:'Order Tracking', content:'Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can also check your order status by logging into your Boots Vault account.' },
            { title:'Damaged or Lost Orders', content:'If your order arrives damaged or is lost in transit, contact us immediately on WhatsApp. We will arrange a replacement or full refund within 48 hours of reporting.' },
            { title:'Cash on Delivery', content:'COD is available for select pin codes. An additional ₹50 handling charge applies. Contact us on WhatsApp to check if COD is available for your area.' },
          ].map(({ title, content }, i) => (
            <div key={title} style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:'clamp(20px,3vw,28px) clamp(16px,3vw,32px)', borderTop: i===0 ? '3px solid var(--green)' : '1px solid var(--border)' }}>
              <h2 style={{ fontSize:15, fontWeight:800, color:'var(--white)', marginBottom:10 }}>{title}</h2>
              <p style={{ fontSize:13, color:'rgba(242,242,237,0.5)', lineHeight:1.9 }}>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}