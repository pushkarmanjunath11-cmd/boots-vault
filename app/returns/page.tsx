'use client'

export default function ReturnsPage() {
  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'clamp(32px,5vw,60px) clamp(20px,4vw,40px)' }}>
        <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:12, fontWeight:700 }}>Policy</p>
        <h1 className="font-display" style={{ fontSize:'clamp(40px,8vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:16 }}>RETURNS &<br />EXCHANGES</h1>
        <p style={{ fontSize:14, color:'rgba(242,242,237,0.4)', marginBottom:40, lineHeight:1.8 }}>We want you to love your boots. If something isn't right, we'll make it right.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:32 }}>
          {[
            { title:'7-Day Return Window', content:'You can return any unworn, unwashed product within 7 days of delivery. The boots must be in their original condition with all tags attached and in the original box.' },
            { title:'Size Exchange', content:'Wrong size? We offer free size exchanges within 7 days of delivery. WhatsApp us with your order number and the size you need — we\'ll arrange a pickup and send the correct size.' },
            { title:'Defective or Wrong Item', content:'If you received a defective product or the wrong item, contact us within 48 hours of delivery with photos. We will arrange an immediate replacement or full refund at no cost.' },
            { title:'Refund Process', content:'Approved refunds are processed within 5–7 business days. The amount will be credited back to your original payment method.' },
            { title:'Non-Returnable Items', content:'Boots that have been worn on the pitch, washed, or show signs of use cannot be returned. Custom or personalised products are also non-returnable unless defective.' },
          ].map(({ title, content }, i) => (
            <div key={title} style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:'clamp(20px,3vw,28px) clamp(16px,3vw,32px)', borderTop: i===0 ? '3px solid var(--green)' : '1px solid var(--border)' }}>
              <h2 style={{ fontSize:15, fontWeight:800, color:'var(--white)', marginBottom:10 }}>{title}</h2>
              <p style={{ fontSize:13, color:'rgba(242,242,237,0.5)', lineHeight:1.9 }}>{content}</p>
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)', padding:'clamp(16px,3vw,24px) clamp(16px,3vw,32px)' }}>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--green)', marginBottom:6 }}>How to initiate a return</p>
          <p style={{ fontSize:13, color:'rgba(242,242,237,0.5)', lineHeight:1.8 }}>WhatsApp us with your order ID and reason for return. Our team will respond within 2 hours during business hours (10am–8pm IST, Mon–Sat).</p>
        </div>
      </div>
    </div>
  )
}